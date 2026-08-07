# Changelog

## [4.0.0] - 2026-08-07

A 23-issue bug sweep across `lib/` (2 P1, 9 P2, 12 P3 — full per-issue history in
`issues/bug-sweep.md`). No API signatures or exports changed; every breaking
change below is behavioral. The spec suite grew from 321 to 359 specs.

### Breaking Changes

- **Html output is now HTML-escaped.** All head interpolations (`title`,
  `description`, `favIcon`, `css` hrefs, `themeColor`, `webAppTitle`,
  `appleTouchIcons`, `canonicalUrl`, `metaTags` name/property/content) and
  script `src` attributes escape `&` `<` `>` `"` `'`. Values containing
  pre-escaped entities will double-escape (e.g. `&copy;` in a title now renders
  literally as `&copy;` text, not ©) — pass raw characters instead. `body`,
  `headBottom`, and `bodyBottom` remain raw HTML by design.
- **DynamoDBStream failures now reject the invocation.** A rejected record
  handler logs the error and rejects, so Lambda retries the batch (and can
  dead-letter it). Previously handler failures resolved as success and the
  records were silently dropped. Deployments with long-failing handlers will
  see retries begin on upgrade.
- **`Request.body` JSON parsing matches the media type.** Content types with
  parameters or different casing (`application/json; charset=utf-8`,
  `Application/JSON`) now parse to objects — remove any workaround that
  re-parses the raw string. Malformed JSON throws a `ValidationError` that
  `Page` maps to a 400 (previously an uncaught `SyntaxError` crashed the
  invocation).
- **Route dot-stripping consults the extension allowlist.** `GET
  /page.badextension` now routes to `apigateway/page.badextension` (previously
  `apigateway/page`). Only trailing segments in `acceptableFileExtensions` are
  stripped.
- **Path parameters strip only the final extension segment.**
  `archive.tar.gz` → `archive.tar` (was `archive`); `my.file.json` → `my.file`
  (was untouched).
- **Setting a 13th cookie throws.** A clear `Error` replaces the previous
  silent corruption (cookies stored under a header literally named
  `undefined`).
- **`Validation.validateNumber(NaN)` throws a ValidationError.** NaN previously
  passed the type check and every range check.
- **Auto-generated csrf tokens are UUID v4** via `crypto.randomUUID()`
  (previously `Math.random().toString(36)`), and the inline
  `localStorage.setItem('csrf', ...)` script now emits a JSON (double-quoted)
  string.
- **Async page handler errors resolve responses instead of crashing.** Thrown
  framework errors resolve with their `$metadata.httpStatusCode` and message
  (e.g. `ValidationError` → 400); all other errors — including AWS SDK service
  exceptions, which carry the same `$metadata` shape — resolve as a generic 500
  with `Internal Server Error`, and the real error goes to `console.error`.
  Previously any async handler error was an unhandled rejection: the Node 18+
  runtime crashed and API Gateway returned a 502.

### Fixed

- Cookie `Domain` attribute is emitted as `Domain=<value>` so browsers honor
  it; bare-domain tokens were discarded per RFC 6265 and cross-subdomain
  cookies silently failed.
- `Page` 404 fallback returns a string JSON body; the previous object body was
  a malformed Lambda proxy response that API Gateway surfaced as a 500.
- `Request.cookies` preserves values containing `=` (JWTs, base64 padding) by
  splitting on the first `=` only.
- `App` returns 404 only when the routed file itself is missing; a route file
  whose own import is missing is logged and returns 500 instead of
  masquerading as "not found".
- `rawPathNoStage` returns `/` for the stage root (`/dev`) and strips only a
  leading `/{stage}` prefix, leaving stage-named segments later in the path
  untouched.
- `$default` routeKeys no longer throw from `apiGatewayRouteKey` /
  `apiGatewayRouteKeyNoMethod`.
- SNS-shaped records (capitalized `EventSource`) report their real type, empty
  `Records` arrays classify as `aws:unknown`, and routing such events throws a
  clear "Unsupported event type" error instead of a TypeError from the API
  Gateway path.
- `AuthenticationError`, `NotFoundError`, `PermissionError`, and
  `BadgatewayError` honor the documented `options.$metadata`;
  `NotFoundError` captures its own stack frame.
- `Collection.modelIds` includes falsy-but-valid ids (`0`, `""`).
- `Validation.validateInstanceOf` derives error messages from
  `constructor.name` without instantiating the constructor (no more side
  effects during error handling).
- `Response.endTimer` without a prior `startTimer` is a no-op instead of a
  TypeError.
- The static response cache stores body bytes (`ArrayBuffer`) so binary GET
  responses round-trip uncorrupted; response-like objects that only implement
  `text()` remain cacheable via a fallback.
- `_pruneCache` clamps `maxEntries <= 0` to a single-entry cache instead of
  looping forever.
- `_fetchWithAbort` honors a caller-supplied `AbortSignal` alongside
  `abortTimeoutMs` (previously the caller's signal was overwritten), and
  caller-initiated aborts rethrow the original `AbortError`.
- `Html` renders empty strings instead of the literal text `undefined` for
  unset members (`title`, `description`, `favIcon`, `body`).

### Security

- XSS hardening in `Html`: head/attribute interpolations are HTML-escaped and
  the csrf inline script is JS-string-escaped with `</script>` breakout
  prevention.
- CSRF tokens come from a CSPRNG with a fixed 122-bit shape.
- Error responses no longer leak internal error messages (AWS SDK ARNs,
  resource names) to clients.
