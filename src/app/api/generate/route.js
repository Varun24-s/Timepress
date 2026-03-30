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
  content: `You are a senior editor at a major newspaper serving ${region}. 
Today's edition: ${dateString}.

## BACKGROUND BRIEFING
${specificEvents}
${monthContext}

## WRITING STYLE
- Clear, factual, modern journalistic prose (AP/Reuters style)
- Inverted pyramid structure: most important facts first
- Include named sources, quotes, and specific figures/statistics where possible
- No dramatic Victorian language — write like a professional journalist in ${dateString}

---

## CONTENT REQUIREMENTS

### MAIN STORY (400+ words)
- The single biggest news event affecting ${region} on this date
- Dateline format: "CITY, Month Date (Region Chronicle) —"
- Must include: WHO, WHAT, WHEN, WHERE, WHY, HOW
- Include at least 2 named sources or official quotes
- End with: public reaction OR what happens next (follow-up angle)

### SIDE STORIES (4 articles, 150+ words each)
Exactly 4 stories covering different beats:
1. INTERNATIONAL — A major world event with direct or indirect impact on ${region}
2. POLITICS & GOVERNMENT — A policy, election, or legislative development
3. BUSINESS & ECONOMY — Markets, trade, industry, or economic data
4. LOCAL & REGIONAL — A community, crime, infrastructure, or human interest story

Each headline must be specific — name real people, places, or events. No vague headlines.

### SPORTS (3 match reports, 120+ words each)
Write as proper sports journalism, not bullet points.
Pick the 3 most relevant sports being played in ${region} on this date.
Each report must include:
- Teams/athletes, venue, score or outcome
- A key moment or turning point
- A quote from a player, coach, or official
- Standings or context (league table, tournament stage)

### CLASSIFIEDS (8 advertisements)
One ad per category, in this order:
1. JOBS — A real-sounding employer hiring for a specific role
2. REAL ESTATE — A property listing with address, specs, and price
3. AUTOMOTIVE — A vehicle for sale or dealership promotion
4. PERSONAL — A personal announcement (birthday, thanks, in memoriam)
5. TRAVEL — An airline, rail, or travel agency promotion with a destination
6. RETAIL — A store sale or product launch
7. SERVICES — A local professional (lawyer, doctor, plumber, tutor)
8. TENDERS & NOTICES — A government or corporate procurement notice

Each ad must include: a bold heading, a business/person name, 
contact info or address relevant to ${region}, and a price or call-to-action.

---

## STRICT JSON OUTPUT FORMAT
Return ONLY valid JSON. No markdown fences, no extra text, no commentary outside the JSON.

{
  "mainStory": {
    "headline": "SPECIFIC, FACTUAL HEADLINE IN TITLE CASE",
    "dateline": "CITY, Month Date (Source) —",
    "content": "400+ word news report in AP style..."
  },
  "sideStories": [
    { "headline": "International: Specific Headline", "dateline": "CITY, Date (Agency) —", "content": "150+ words..." },
    { "headline": "Politics: Specific Headline", "dateline": "CITY, Date —", "content": "150+ words..." },
    { "headline": "Business: Specific Headline", "dateline": "CITY, Date —", "content": "150+ words..." },
    { "headline": "Local: Specific Headline", "dateline": "CITY, Date —", "content": "150+ words..." }
  ],
  "sportsStories": [
    { "headline": "SPORT NAME: Team A vs Team B — Venue", "content": "120+ words match report..." },
    { "headline": "SPORT NAME: Event or Race Name", "content": "120+ words report..." },
    { "headline": "SPORT NAME: Match or Tournament", "content": "120+ words report..." }
  ],
  "classifieds": [
    "JOBS | [Employer Name] | [Role] | [Location] | [Contact]",
    "REAL ESTATE | [Address] | [Specs] | [Price] | [Agent Contact]",
    "AUTOMOTIVE | [Make/Model/Year] | [Condition] | [Price] | [Seller Contact]",
    "PERSONAL | [Name] | [Announcement] | [Date]",
    "TRAVEL | [Operator] | [Route/Destination] | [Price] | [Booking Info]",
    "RETAIL | [Store Name] | [Offer] | [Location] | [Dates]",
    "SERVICES | [Provider] | [Service] | [Area Covered] | [Contact]",
    "TENDERS | [Issuing Body] | [Notice Type] | [Deadline] | [Reference No.]"
  ]
}`,
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