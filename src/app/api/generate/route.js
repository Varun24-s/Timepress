import { NextResponse } from "next/server";

const WIKI_HEADERS = {
    'User-Agent': 'TimePressArchive/1.0 (contact: your-email@example.com)'
};

async function fetchWikiPage(title) {
    console.log(`[WIKI] Attempting fetch: ${title}`);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    try {
        const res = await fetch(url, { headers: WIKI_HEADERS });
        if (!res.ok) {
            console.warn(`[WIKI] No page found for: ${title} (Status: ${res.status})`);
            return "";
        }
        const data = await res.json();
        console.log(`[WIKI] Successfully fetched context for: ${title}`);
        return data.extract || "";
    } catch (e) {
        console.error(`[WIKI] Error fetching ${title}:`, e.message);
        return "";
    }
}

export async function POST(req) {
    console.log("--- 🚀 NEW DISPATCH REQUEST RECEIVED ---");
    try {
        const body = await req.json();
        const { date: dateString, region } = body;
        console.log(`[INPUT] Date: ${dateString} | Region: ${region}`);

        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const monthName = date.toLocaleString('en-US', { month: 'long' });

        // 1. SAFELY FETCH DATA
        console.log("[WIKI] Gathering historical intelligence...");
        const [onThisDayData, monthContext, yearContext] = await Promise.all([
            fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${month}/${day}`, { headers: WIKI_HEADERS })
                .then(res => {
                    console.log(`[WIKI] OnThisDay status: ${res.status}`);
                    return res.ok ? res.json() : { events: [] };
                })
                .catch((err) => {
                    console.error("[WIKI] OnThisDay Fetch Error:", err);
                    return { events: [] };
                }),
            fetchWikiPage(`${monthName}_${year}`),
            fetchWikiPage(`${year}`)
        ]);

        const specificEvents = (onThisDayData.events || [])
            .filter(e => e.year <= year)
            .slice(0, 5)
            .map(e => `[Year ${e.year}]: ${e.text}`)
            .join("\n") || "General era updates.";

        console.log("[WIKI] Data gathering complete.");

        // 2. OPENROUTER CALL
        console.log(`[AI] Contacting OpenRouter via Nemotron... (Key: ${process.env.OPENROUTER_API_KEY ? "Present" : "MISSING"})`);
        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-OpenRouter-Title": "TimePress",
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-nano-30b-a3b:free",
                messages: [
                    {
                        role: "system",
                        content: `You are the Lead Editor of 'The TimePress' in ${year}. 
      Style: Victorian, formal, dramatic. You MUST output ONLY valid JSON.`
                    },
                    {
                        role: "user",
                        content: `Generate a full, unique newspaper edition for ${region} on ${dateString}. 
  Historical Context: ${specificEvents}. ${monthContext}.

  ### GENERATION RULES ###
  1. TITLES: Every 'headline' (including Sports) must be a unique, dramatic Victorian title. NO placeholders.
  2. CLASSIFIEDS: Generate 6 distinct, localized ads (Employment, Luxury, Personal, Shipping, Industrial, Domestic).
  3. DENSITY: Main story 300+ words. Foreign and Sports stories 100+ words each.
  4. SPORTS AS NEWS: Treat Sports matches as individual news reports with their own headlines.

  ### MANDATORY JSON STRUCTURE ###
  {
    "mainStory": {
      "headline": "UNIQUE ALL-CAPS LEAD HEADLINE",
      "content": "300+ word immersive report."
    },
    "sideStories": [
      { "headline": "International Despatch 1", "content": "..." },
      { "headline": "International Despatch 2", "content": "..." },
      { "headline": "International Despatch 3", "content": "..." },
      { "headline": "Regional Intelligence", "content": "..." }
    ],
    "sportsStories": [
      { "headline": "CRICKET: THE ASHES SERIES", "content": "Detailed match report..." },
      { "headline": "TURF: THE DERBY STAKES", "content": "Detailed racing report..." },
      { "headline": "FOOTBALL: CUP FINALS", "content": "Detailed match report..." }
    ],
    "classifieds": ["Ad 1", "Ad 2", "Ad 3", "Ad 4", "Ad 5", "Ad 6", "Ad 7", "Ad 8"]
  }`
                    }
                ],
                response_format: { type: "json_object" }
            }),
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error("[AI] OpenRouter Error Details:", errorText);
            return NextResponse.json({ error: "AI Dispatch Failed" }, { status: aiResponse.status });
        }

        const aiData = await aiResponse.json();
        console.log("[AI] Response received from OpenRouter.");

        // 1. ADD THIS SAFETY CHECK
        const message = aiData.choices?.[0]?.message;
        let rawContent = message?.content;

        if (!rawContent) {
            console.error("❌ [AI] The Editor sent a blank telegram! (Empty content)");
            // Look at the full aiData to see if OpenRouter sent a refusal or error
            console.log("Full AI Response Object:", JSON.stringify(aiData));
            return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
        }

        console.log("[AI] Raw content length:", rawContent.length);

        // 2. CONTINUE WITH PARSING
        rawContent = rawContent.replace(/```json|```/g, "").trim();

        try {
            const newspaperJSON = JSON.parse(rawContent);
            console.log("[PARSE] Success! Valid JSON reconstructed.");
            return NextResponse.json({
                ...newspaperJSON,
                date: date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                region: region || "London"
            });
        } catch (parseError) {
            console.error("[PARSE] FAILED. Problematic content snippet:", rawContent.substring(0, 200));
            return NextResponse.json({ error: "The Editor's handwriting is illegible (JSON Error)." }, { status: 500 });
        }

    } catch (error) {
        console.error("🚨 SERVER CRASH:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}