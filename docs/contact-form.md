# Contact form

All contact buttons open a shared, accessible modal. Project pages include the
project name in the message context. Closing and reopening the modal preserves a
draft; successful submissions clear it after closing.

## Delivery configuration

Resend is the selected, default delivery provider. Without configuration, the modal clearly says direct
sending is unavailable and opens a composed message in the visitor's email app.
It never reports an email as sent without an acknowledgement from the provider.

To enable the included Resend adapter, copy `.env.example` to `.env.local` for
local development or set its variables in the hosting service:

- `CONTACT_EMAIL_PROVIDER=resend` (optional; Resend is the default)
- `RESEND_API_KEY`: server-side API key
- `CONTACT_FROM_EMAIL`: sender on a verified domain, optionally `Portfolio <address@domain>`
- `CONTACT_TO_EMAIL`: fixed inbox; defaults to `kwame@owusuboakye.com`

Restart the app after changing configuration. Secrets must stay out of Git and
must not use `NEXT_PUBLIC_` names. The HTTP provider code is isolated in
`src/lib/server/contact.ts`; the UI does not depend on provider credentials or
response shapes. See [Resend's sending documentation](https://resend.com/docs/api-reference/emails/send-email).

## Request behavior

`GET /api/contact` returns only `{ available: boolean }`. `POST /api/contact`
validates the origin, JSON body, required fields, honeypot, and maximum body size.
Only the configured inbox can receive messages; visitors supply a reply address,
not a delivery recipient or sender. Client retries reuse an idempotency key for
an unchanged message. Provider acceptance is confirmed before showing success;
it does not prove delivery to the inbox.

The basic rate limiter allows five attempts per apparent client IP in ten
minutes, per running server instance. The host must supply trustworthy forwarded
IP headers. Before opening a high-traffic public endpoint, configure durable
rate limiting or equivalent hosting-level protection across instances. The
limiter stores only hashed IP keys and counters in bounded process memory.

## Verification

Run `node --experimental-strip-types --test tests/contact.test.mjs` and
`npx tsc --noEmit`. Automated tests use fake delivery functions and mocked HTTP
responses, without sending real email.
