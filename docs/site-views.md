# Portfolio visits

One shared total is displayed beside the copyright on the homepage and all project
pages. No analytics dashboard or separate backend service is required.

## Enable on Netlify

1. Create or use a Turso **libSQL** database, supported by `@libsql/client`.
2. Run `docs/site-views.sql` in that database. The first counted visit creates the
   single `portfolio` row; there is no per-person or per-page data.
3. Set these Netlify **production Functions** environment variables:
   - `SITE_VIEWS_ENABLED=true`
   - `TURSO_DATABASE_URL=libsql://your-database-host`
   - `TURSO_AUTH_TOKEN`: a database-scoped token with write access. Prefer a
     dedicated database for this counter.
4. Redeploy production so the running function receives the variables.

Do not use `NEXT_PUBLIC_` for these values. The database connector imports
`server-only`; browsers only receive the total. The counter is hidden if disabled,
misconfigured, timed out, rate-limited, or unavailable. There is no invented initial
number. It starts at zero and counts from activation onward.

## Counting behavior

- The root client provider makes one request across page navigation and React
  Strict Mode remounts. It does not count every individual page as a new visit.
- A browser session cookie prevents repeat increments on refresh and normal
  navigation, including when session storage is unavailable. Session storage also
  avoids repeat increment requests within a tab. Browsers may restore session
  cookies after restart; simultaneously opening new tabs can race before the first
  cookie arrives. These are approximate visits, not distinct people.
- The increment is an atomic SQL upsert, preventing lost updates from concurrent
  visitors. GET only reads. POST accepts no body or user-selected keys/counts, and
  checks the Origin header against the canonical public origin (`https://9naqua.me`)
  in production. This avoids relying on Netlify’s internal request URL. Development
  checks against the request origin.
- Obvious bot user agents are not counted. Each apparent IP is limited to ten
  requests per ten minutes per running function instance. Bounded process memory
  stores only hashed IP keys and counters; no IPs are stored in Turso.
- Netlify supplies the client-IP header. Its trust boundary and per-instance
  limits mean this is basic protection, not durable distributed abuse prevention.
  An automated client can forge its origin/user agent or clear cookies to inflate
  the counter. A signed session, CAPTCHA, or additional persistence would add
  complexity without making a public counter perfectly reliable.
- Keep the enable flag unset locally. Netlify preview contexts are disabled even
  if credentials are accidentally shared with them. No third-party tracking
  scripts or external browser calls are added.

## Verify without touching production data

`node --experimental-strip-types --test tests/views.test.mjs` uses an isolated
in-memory SQLite database to check real SQL, concurrent increments, session
deduplication, origin and payload rejection, rate limiting, and failures.

For local UI testing, run the schema against a disposable local database and start
Next.js with `SITE_VIEWS_ENABLED=true TURSO_DATABASE_URL=file:/private/tmp/views-test.db`.
Local file URLs are accepted only outside production. Never enable tests against
the live database. Visit two pages and refresh: the total should stay unchanged
within the session. Clear the session cookie and session storage to simulate a new
visit. Disabling the flag should remove the counter without affecting the footer.
