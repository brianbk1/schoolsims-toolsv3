// Password gate for every page and API on tools.schoolsims.com.
// Set TOOLS_PASSWORD in Vercel > Settings > Environment Variables (any username works).
// If TOOLS_PASSWORD is not set, the site is open.
export const config = { matcher: "/:path*" };

export default function middleware(request) {
  const password = process.env.TOOLS_PASSWORD;
  if (!password) return;
  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const given = decoded.slice(decoded.indexOf(":") + 1);
      if (given === password) return;
    } catch {}
  }
  return new Response("Password required for SchoolSims tools.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="SchoolSims tools", charset="UTF-8"' },
  });
}
