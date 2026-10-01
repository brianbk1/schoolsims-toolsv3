# SchoolSims Sales Tools (tools.schoolsims.com)

One Vercel project with three tools:

- `/outbound/`  Outbound Planner (HubSpot contact list → weekly plan). Contact research uses `/api/mine`.
- `/renewals/`  Renewal & Outreach Planner (two Salesforce report exports → dashboard and daily plan). No server calls.
- `/emails/`    Email Writer (3 plain-text emails, voicemail, send plan). Uses `/api/write`.
- `/`           Landing page linking to all three.

Uploaded files are read in the browser and never sent to the server. Only the email writer and contact research send text to the Anthropic API.

## Deploy

1. Create a GitHub repo `schoolsims-tools` and upload everything in this folder, keeping the `api`, `emails`, `outbound` and `renewals` folders. If a browser upload drops folders, clone the repo with GitHub Desktop into `C:\Projects\schoolsims-tools`, copy the files in, commit and push.
2. vercel.com/new → import the repo → Framework preset: Other → Environment Variables:
   - `ANTHROPIC_API_KEY` (required for the email writer and contact research)
   - `TOOLS_PASSWORD` (a shared team password; the browser asks for it once. Any username works)
   - `ANTHROPIC_MODEL` (optional, defaults to `claude-sonnet-5-5`)
3. Deploy, then Settings → Domains → Add `tools.schoolsims.com`. Add the CNAME record Vercel shows (usually `tools` → `cname.vercel-dns.com`) at your DNS provider. On Cloudflare, set it to DNS only.

## Updating a tool

Replace the tool's `index.html` in its folder, commit and push. Vercel redeploys automatically.
