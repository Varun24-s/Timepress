import { NextResponse } from "next/server";

const WIKI_HEADERS = {
    'User-Agent': 'TimePressArchive/1.0 (contact: your-email@example.com)'
};

const cache = new Map();

async function fetchWikiPage(title) {
    if (cache.has(title)) return cache.get(title);
    try {
        const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
            { headers: WIKI_HEADERS, signal: AbortSignal.timeout(3000) }
        );
        if (!res.ok) return "";
        const data = await res.json();
        const extract = (data.extract || "").slice(0, 400);
        cache.set(title, extract);
        return extract;
    } catch { return ""; }
}

async function fetchOnThisDay(month, day, year) {
    const key = `otd-${month}-${day}-${year}`;
    if (cache.has(key)) return cache.get(key);
    try {
        const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${month}/${day}`,
            { headers: WIKI_HEADERS, signal: AbortSignal.timeout(3000) }
        );
        const data = res.ok ? await res.json() : { events: [] };
        cache.set(key, data);
        return data;
    } catch { return { events: [] }; }
}

export async function POST(req) {
    const body = await req.json();
    const { date: dateString, region } = body;

    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const monthName = date.toLocaleString('en-US', { month: 'long' });

    // Wikipedia with 4s race
    const [monthContext, , onThisDayData] = await Promise.race([
        Promise.all([
            fetchWikiPage(`${monthName}_${year}`),
            fetchWikiPage(`${year}`),
            fetchOnThisDay(month, day, year)
        ]),
        new Promise(r => setTimeout(() => r(["", "", { events: [] }]), 4000))
    ]);

    const specificEvents = (onThisDayData.events || [])
        .filter(e => e.year <= year)
        .slice(0, 5)
        .map(e => `[${e.year}]: ${e.text}`)
        .join("\n") || "General era updates.";

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
            stream: true, 
            messages: [
                {
                    role: "system",
                    content: `You are the Lead Editor of 'The TimePress' in ${year}. Output ONLY valid JSON.`
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

---

## CONTENT REQUIREMENTS

### MAIN STORY (400+ words)
- The single biggest news event affecting ${region} on this date
- Dateline format: "CITY, Month Date (Region Chronicle) —"
- Must include: WHO, WHAT, WHEN, WHERE, WHY, HOW
- Include at least 2 named sources or official quotes
- End with: public reaction OR what happens next

### SIDE STORIES (4 articles, 150+ words each)
1. INTERNATIONAL — A major world event with impact on ${region}
2. POLITICS & GOVERNMENT — A policy, election, or legislative development
3. BUSINESS & ECONOMY — Markets, trade, industry, or economic data
4. LOCAL & REGIONAL — A community, crime, infrastructure, or human interest story
Each headline must name real people, places, or events.

### SPORTS (3 match reports, 120+ words each)
Pick 3 relevant sports for ${region}. Each must include:
- Teams/athletes, venue, score or outcome
- A key moment or turning point
- A quote from a player, coach, or official

### CLASSIFIEDS (8 advertisements)
1. JOBS 2. REAL ESTATE 3. AUTOMOTIVE 4. PERSONAL
5. TRAVEL 6. RETAIL 7. SERVICES 8. TENDERS

---

Return ONLY valid JSON:
{
  "mainStory": { "headline": "...", "dateline": "...", "content": "..." },
  "sideStories": [
    { "headline": "...", "dateline": "...", "content": "..." },
    { "headline": "...", "dateline": "...", "content": "..." },
    { "headline": "...", "dateline": "...", "content": "..." },
    { "headline": "...", "dateline": "...", "content": "..." }
  ],
  "sportsStories": [
    { "headline": "...", "content": "..." },
    { "headline": "...", "content": "..." },
    { "headline": "...", "content": "..." }
  ],
  "classifieds": ["...","...","...","...","...","...","...","..."]
}`
                }
            ],
            response_format: { type: "json_object" }
        }),
    });

    if (!aiResponse.ok) {
        const err = await aiResponse.text();
        return NextResponse.json({ error: "AI Dispatch Failed", detail: err }, { status: 500 });
    }

    
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            const reader = aiResponse.body.getReader();
            let fullText = "";

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

                    for (const line of lines) {
                        const jsonStr = line.replace("data: ", "").trim();
                        if (jsonStr === "[DONE]") continue;
                        try {
                            const parsed = JSON.parse(jsonStr);
                            const token = parsed.choices?.[0]?.delta?.content || "";
                            fullText += token;

                            
                            controller.enqueue(encoder.encode(token));
                        } catch {  }
                    }
                }

               
                const clean = fullText.replace(/```json|```/g, "").trim();
                const newspaperJSON = JSON.parse(clean);

                const finalPayload = JSON.stringify({
                    __final: true,
                    ...newspaperJSON,
                    date: date.toLocaleDateString('en-GB', {
                        weekday: 'long', year: 'numeric',
                        month: 'long', day: 'numeric'
                    }),
                    region: region || "London"
                });

                
                controller.enqueue(encoder.encode(`\n__END__${finalPayload}`));
            } catch (e) {
                controller.enqueue(encoder.encode(`\n__ERROR__${e.message}`));
            } finally {
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "no-cache",
        },
    });
}