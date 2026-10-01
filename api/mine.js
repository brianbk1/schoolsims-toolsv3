// Vercel serverless function: researches additional high-value contacts for one account
// using Claude with web search. Set ANTHROPIC_API_KEY in Vercel > Project > Settings > Environment Variables.
// Optional: ANTHROPIC_MODEL (defaults to claude-sonnet-5-5).

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

function prompt({ company = {}, existing = [], targets = [] }) {
  const have = existing.length
    ? existing.map((p) => `${p.name} (${p.title || "no title"})`).join("; ")
    : "none";
  return `You are researching contacts for SchoolSims, which sells simulation-based professional learning with AI coaching: realistic decision-making simulations for new teachers, school leaders, school counselors, education-prep candidates and CTE students, aligned to PSEL, NELP, CAEP, InTASC and AAQEP.

Account: ${company.name}${company.domain ? ` (website: ${company.domain})` : ""}, ${[company.city, company.state].filter(Boolean).join(", ")}. Segment: ${company.segment}.
Already in our CRM: ${have}.
Priority roles: ${targets.join("; ")}.

Use web search. Look first at the organization's own website (leadership or cabinet page, staff directory, department pages, school board minutes), then recent news. Find up to 5 current people in priority roles, or other roles that own teacher induction, professional learning, leadership development, clinical practice or accreditation, who are NOT already in the CRM list.

Rules:
- Only include a person you found on a web page, and give that page's URL as source_url.
- Only include an email or phone if it appears on a page. Never guess an email format.
- Skip anyone whose page looks older than two years unless nothing newer exists; say so in "why".

Reply with only JSON, no other text:
{"contacts":[{"first_name":"","last_name":"","title":"","email":"","phone":"","source_url":"","confidence":"high|medium|low","why":"one short reason this person matters for SchoolSims"}]}`;
}

function extractJson(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fence ? fence[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) return { contacts: [] };
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return { contacts: [] };
  }
}

module.exports = async (req, res) => {
  const configured = Boolean(process.env.ANTHROPIC_API_KEY);
  if (req.method === "GET") return res.status(200).json({ configured });
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!configured) return res.status(503).json({ error: "ANTHROPIC_API_KEY is not set on this deployment" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (!body.company || !body.company.name) return res.status(400).json({ error: "company.name is required" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
        messages: [{ role: "user", content: prompt(body) }],
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || "Research request failed" });
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const out = extractJson(text);
    const contacts = Array.isArray(out.contacts) ? out.contacts.slice(0, 6) : [];
    return res.status(200).json({ contacts });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
