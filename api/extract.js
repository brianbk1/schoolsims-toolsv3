// Vercel serverless function: POST /api/extract
// Receives { text } (document text) and returns structured implementation-plan JSON
// extracted by Claude. The Anthropic API key is read from the server-side env var
// ANTHROPIC_API_KEY and is NEVER exposed to the browser.

const MODEL = "claude-opus-4-20250514"; // adjust to an available model id for your account

const SYSTEM_PROMPT = `You are the SchoolSims AI Guidebook Ingestion Engine.

You convert a district professional-learning / leadership / induction / accreditation document
into a STRUCTURED implementation plan. You never invent facts. Follow these rules exactly:

- Extract only what the document supports. If a field is absent, use null or an empty array —
  NEVER fabricate dates, owners, competencies, or evidence requirements.
- Mark each activity's "origin" as "district_source".
- Flag low-confidence or ambiguous extractions with "needs_review": true and a short "review_note".
- Generalize any "School Improvement Project" style item as a Project with milestones.
- Do NOT hard-code any single district's terminology.
- Distinguish extraction (district requirements) from recommendations (you may optionally
  suggest SchoolSims simulations under "ai_recommendations", clearly separate).

Return ONLY valid minified JSON (no markdown, no backticks, no commentary) with this exact shape:

{
  "program": { "name": string|null, "organization": string|null, "term": string|null,
               "audience": string|null, "participants": number|null },
  "pillars": [ { "name": string, "source": string|null } ],
  "competencies": [ string ],
  "activities": [ {
    "title": string, "category": string, "month": string|null, "due": string|null,
    "required": boolean|null, "recurrence": string|null,
    "evidence": string|null, "competency": string|null,
    "origin": "district_source", "source_reference": string|null,
    "needs_review": boolean, "review_note": string|null
  } ],
  "projects": [ { "title": string, "milestones": [ string ], "source_reference": string|null } ],
  "risks": [ string ],
  "ai_recommendations": [ { "title": string, "maps_to": string, "rationale": string } ],
  "narrative": string
}`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY. Add it in Vercel → Settings → Environment Variables." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const text = (body && body.text ? String(body.text) : "").trim();
  if (text.length < 40) {
    res.status(400).json({ error: "Document text is empty or too short to extract from." });
    return;
  }

  // Keep the payload within a sane bound.
  const docText = text.slice(0, 60000);

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: `Extract the implementation plan from this document:\n\n${docText}` },
        ],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      res.status(502).json({ error: "Upstream model error", detail: errText.slice(0, 500) });
      return;
    }

    const data = await r.json();
    const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    const clean = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      res.status(502).json({ error: "Model did not return valid JSON.", raw: clean.slice(0, 800) });
      return;
    }

    res.status(200).json({ ok: true, result: parsed });
  } catch (e) {
    res.status(500).json({ error: "Extraction failed", detail: String(e).slice(0, 300) });
  }
}
