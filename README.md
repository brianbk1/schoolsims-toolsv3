# SchoolSims Sales Tools (tools.schoolsims.com)

Pages: / (landing), /outbound, /client-outreach, /emails. AI functions: api/mine.js (contact research) and api/write.js (email writer).

## Set up in the browser (no GitHub Desktop)
1. New repo on github.com (private). Click "uploading an existing file" and drag in every file at the top level: index.html, outbound.html, client-outreach.html, emails.html, middleware.js, vercel.json, package.json, README.md. Commit.
2. Add file > Create new file > name it api/mine.js > paste mine.js > Commit. Repeat for api/write.js.
3. Only now, vercel.com/new > import the repo > Framework: Other > Environment Variables: ANTHROPIC_API_KEY, TOOLS_PASSWORD > Deploy.
4. Settings > Domains > add tools.schoolsims.com and create the CNAME record Vercel shows.

## Updating
Open the repo on github.com > Add file > Upload files > drop the new file (e.g. emails.html) > Commit. Vercel redeploys automatically.
