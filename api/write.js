// Vercel serverless function: writes the email sequence with Claude.
// Set ANTHROPIC_API_KEY in Vercel > Project > Settings > Environment Variables.
// Optional: ANTHROPIC_MODEL (defaults to claude-sonnet-5-5).

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

function extractJson(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fence ? fence[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  const configured = Boolean(process.env.ANTHROPIC_API_KEY);
  if (req.method === "GET") return res.status(200).json({ configured });
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!configured) return res.status(503).json({ error: "ANTHROPIC_API_KEY is not set on this deployment" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const prompt = String(body.prompt || "");
  if (!prompt || prompt.length > 40000) return res.status(400).json({ error: "Missing or oversized prompt" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 3000, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || "The writer couldn't respond" });
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const out = extractJson(text);
    if (!out || !Array.isArray(out.emails)) return res.status(502).json({ error: "The writer returned something unexpected. Try again." });
    return res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
