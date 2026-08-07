# Issue Tracker: `bug-sweep`

Generated At: `2026-08-06T21:44:13Z` (UTC)
Last Updated At: `2026-08-07T12:44:29Z` (UTC)

Status values: `OPEN`, `IN_PROGRESS`, `BLOCKED`, `DONE`

Update process:
1. Change `Status`.
2. Update `Updated At`.
3. Append one row in `Status History`.

## ISSUE-001: DynamoDBStream resolves errors as success, dropping stream records without retry

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T22:15:57Z`
- Priority: `P1`
- Source: `bug-sweep`

Summary:
When any record handler rejects, the catch block calls `res.resolve(error)`, which resolves the Lambda invocation successfully. The stream shard iterator advances, the batch is marked processed, and the failed records are lost with no Lambda retry. The error is also never logged. Additionally, `res.resolve(null, results)` resolves with `null` (Promise resolve takes one argument), discarding `results` and making `batchItemFailures` partial-batch responses impossible.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/dynamodb-stream.js:29` - `.catch((error) => { res.resolve(error); })` resolves (success) on handler failure.
- `/Users/dankantor/Repos/deeserverless/lib/dynamodb-stream.js:27` - `res.resolve(null, results)` resolves the invocation with `null`; second argument is ignored.
- `/Users/dankantor/Repos/deeserverless/spec/dynamodb-stream.js:101` - specs cover the success path only; no error-path assertion exists.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/dynamodb-stream.js`

Acceptance Criteria:
- [x] A rejected record handler causes the invocation to fail (reject/throw) so Lambda retries the batch, or returns `batchItemFailures` for partial batch handling.
- [x] Handler errors are logged.
- [x] Spec added covering a rejecting handler.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-06T22:14:47Z | OPEN | IN_PROGRESS | Starting implementation (P1 scope) |
| 2026-08-06T22:15:57Z | IN_PROGRESS | DONE | lib/dynamodb-stream.js now logs and rejects via res.reject on handler failure (Lambda retries batch); resolves with handler results on success. Specs added for rejecting handler and resolved results. Full suite: 325 specs, 0 failures. |

## ISSUE-002: Errors thrown in async page handlers are never caught or mapped to HTTP responses

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T23:03:04Z`
- Priority: `P1`
- Source: `bug-sweep`

Summary:
`Page` invokes the route method without awaiting or catching its returned promise, and `App.#route`'s try/catch only covers synchronous constructor execution. Any error thrown in an async `get()`/`post()` — including the framework's own `ValidationError`/`AuthenticationError` etc. — becomes an unhandled promise rejection: the response promise never resolves, the Node 18+ Lambda runtime crashes with `Runtime.UnhandledPromiseRejection`, and the client gets a 502 instead of the intended status. Nothing in `lib/` ever reads `$metadata.httpStatusCode` from the error classes, so throwing them can never produce their documented status codes.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/page.js:16` - `this[this.req.method.toLowerCase()]()` return value (a promise for async handlers) is discarded.
- `/Users/dankantor/Repos/deeserverless/lib/app.js:37` - try/catch wraps only the synchronous part of `new File.default(req, res)`.
- `/Users/dankantor/Repos/deeserverless/lib/error.js:23` - error classes carry `$metadata.httpStatusCode`, but `grep` shows no consumer anywhere in `lib/`.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/page.js`
- `/Users/dankantor/Repos/deeserverless/lib/app.js`

Acceptance Criteria:
- [x] A rejecting async handler resolves the response (e.g., mapping `$metadata.httpStatusCode` to the status code, defaulting to 500) instead of hanging the invocation.
- [x] Spec added: async handler throwing `ValidationError` yields a 400 response.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-06T22:14:47Z | OPEN | IN_PROGRESS | Starting implementation (P1 scope) |
| 2026-08-06T22:15:57Z | IN_PROGRESS | DONE | lib/page.js wraps handler invocation in Promise.resolve().then().catch(): logs error, maps $metadata.httpStatusCode (default 500, generic body for unknown errors), resolves response. lib/app.js sync-throw catch also maps $metadata.httpStatusCode. Specs added: ValidationError -> 400 with message; unknown Error -> 500 with generic body. Full suite: 325 specs, 0 failures. |
| 2026-08-06T23:03:04Z | DONE | DONE | PR feedback: $metadata.httpStatusCode alone treated AWS SDK service exceptions as safe, leaking their raw messages. Added isFrameworkError() to lib/error.js; page.js/app.js now expose status/message only for framework error classes (and subclasses), all others -> generic 500. Specs added for AWS-shaped error and framework-error subclass. Full suite: 327 specs, 0 failures. |

## ISSUE-003: Cookie Domain attribute emitted without `Domain=` prefix, so browsers silently ignore it

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T12:13:15Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
The cookie setter emits the domain as a bare token (`foo=bar;Secure;foo.com;...`) instead of `Domain=foo.com`. Per RFC 6265 parsing, `foo.com` is an unknown attribute and is discarded, so the cookie is always scoped to the serving host and cross-subdomain cookies silently fail. The existing spec asserts the malformed string, enshrining the bug.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/response.js:156` - `domain = `${obj.domain};`` lacks the `Domain=` prefix.
- `/Users/dankantor/Repos/deeserverless/spec/response.js:131` - spec expects `'foo=bar;Secure;foo.com;HttpOnly;...'`, codifying the malformed attribute.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/response.js`
- `/Users/dankantor/Repos/deeserverless/spec/response.js`

Acceptance Criteria:
- [x] Cookie string contains `Domain=<value>;` when `obj.domain` is set.
- [x] Spec updated to assert the corrected attribute.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T12:10:48Z | OPEN | IN_PROGRESS | Starting implementation (response/routing batch: 003/004/009) |
| 2026-08-07T12:13:15Z | IN_PROGRESS | DONE | response.js cookie setter emits Domain=<value>; spec updated from the malformed assertion. Suite: 334 specs, 0 failures. |

## ISSUE-004: Page 404 fallback sets response body to an object, producing a malformed Lambda proxy response

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T12:13:15Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
When no handler matches the HTTP method, `Page` assigns a plain object to `res.body`. The Lambda proxy contract requires `body` to be a string; API Gateway treats a non-string body as a malformed integration response and returns an Internal Server Error instead of the intended 404. The framework's own `json` setter exists for this purpose and is bypassed.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/page.js:19` - `this.res.body = { 'status': 'Page not found' }` sets a non-string body.
- `/Users/dankantor/Repos/deeserverless/lib/response.js:364` - `#toJSON` passes `this.body` through verbatim to the resolved payload.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/page.js`

Acceptance Criteria:
- [x] The 404 fallback produces a string body (e.g., via `res.json = {...}`).
- [x] Spec asserts `typeof body === 'string'` for the method-not-found path.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T12:10:48Z | OPEN | IN_PROGRESS | Starting implementation (response/routing batch: 003/004/009) |
| 2026-08-07T12:13:15Z | IN_PROGRESS | DONE | page.js 404 fallback uses res.json setter; spec asserts string body and parsed content. Suite: 334 specs, 0 failures. |

## ISSUE-005: Request.body only JSON-parses on exact `application/json` match; charset suffix returns raw string

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T11:22:32Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
The content-type check uses strict equality, so common headers like `application/json; charset=utf-8` (sent by many HTTP clients by default) skip parsing and handlers receive a raw string where they expect an object. Separately, `JSON.parse` of a malformed body throws an uncaught exception at property access time, which flows into the unhandled-rejection gap (ISSUE-002) instead of a 400.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/request.js:346` - `this?.headers?.['content-type'] === 'application/json'` fails for any parameterized content type.
- `/Users/dankantor/Repos/deeserverless/lib/request.js:347` - `JSON.parse(this.event.body)` has no error handling for malformed client input.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/request.js`

Acceptance Criteria:
- [x] Content type is matched on the media type (e.g., `startsWith('application/json')` or parsed), ignoring parameters.
- [x] Malformed JSON in the body produces a defined outcome (e.g., ValidationError/400) rather than an uncaught exception.
- [x] Specs cover `application/json; charset=utf-8` and malformed JSON.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T11:21:23Z | OPEN | IN_PROGRESS | Starting implementation (request-parsing batch: 005/006/007) |
| 2026-08-07T11:22:32Z | IN_PROGRESS | DONE | body getter matches media type (split on ';', trim, lowercase) so charset params and casing are ignored; malformed JSON throws ValidationError('Malformed JSON body') which Page maps to 400. Specs: charset param, uppercase casing, malformed JSON. Suite: 333 specs, 0 failures. |

## ISSUE-006: Request.cookies truncates cookie values containing `=`

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T11:22:32Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
Cookies are split with `cookie.split('=')` and only `splits[1]` is kept, so any value containing `=` — base64 padding, JWTs, signed session tokens — is silently truncated at the second `=`. This corrupts session/auth cookies and can break `isValidCsrf` comparisons.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/request.js:298` - `let splits = cookie.split('=');` followed by `cookies[splits[0]] = splits[1];` discards everything after the second `=`.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/request.js`

Acceptance Criteria:
- [x] Values with embedded `=` are preserved (split on the first `=` only).
- [x] Spec added for a cookie value like `abc==` or a JWT-shaped value.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T11:21:23Z | OPEN | IN_PROGRESS | Starting implementation (request-parsing batch: 005/006/007) |
| 2026-08-07T11:22:32Z | IN_PROGRESS | DONE | cookies getter splits on first '=' via indexOf/substring, preserving embedded '=' in values; no-'=' cookie behavior unchanged (undefined value). Spec: base64-padded and JWT-shaped values. Suite: 333 specs, 0 failures. |

## ISSUE-007: Request.pathParameters extension-stripping checks the second dot-segment instead of the last

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T11:22:32Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
When stripping a file extension from a path parameter, the code tests `valueSplits[1]` (the second segment) against `acceptableFileExtensions` rather than the final segment, and then keeps only `splits[0]`. A value like `my.file.json` is left untouched (extension not stripped, inconsistent with `fileExtension`), while `archive.tar.gz` collapses to `archive` (over-stripped). The sibling `fileExtension` getter correctly uses the last segment, so the two disagree.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/request.js:277` - `this.acceptableFileExtensions.includes(valueSplits[1])` tests the second segment, not the last.
- `/Users/dankantor/Repos/deeserverless/lib/request.js:278` - `value = value.split('.')[0]` drops all segments after the first, not just the extension.
- `/Users/dankantor/Repos/deeserverless/lib/request.js:189` - `fileExtension` uses `splits[splits.length - 1]`, the correct convention.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/request.js`

Acceptance Criteria:
- [x] Extension detection uses the final dot-segment; only that segment is removed.
- [x] Specs cover multi-dot parameter values (`my.file.json`, `archive.tar.gz`).

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T11:21:23Z | OPEN | IN_PROGRESS | Starting implementation (request-parsing batch: 005/006/007) |
| 2026-08-07T11:22:32Z | IN_PROGRESS | DONE | pathParameters now tests the final dot-segment against acceptableFileExtensions and removes only that segment (my.file.json -> my.file, archive.tar.gz -> archive.tar), matching fileExtension's convention. Specs added for both multi-dot cases. Suite: 333 specs, 0 failures. |

## ISSUE-008: Validation.validateNumber accepts NaN

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T12:44:29Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
`typeof NaN === 'number'` passes the type check, and NaN fails every `<`/`>` comparison, so `NaN` sails through `validateNumber` even with `minValue`/`maxValue` set. A common source is `Number(queryStringParameter)` on bad input; the validator then approves an unusable value that propagates into models and storage.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/validation.js:115` - `typeof number !== "number"` does not exclude NaN.
- `/Users/dankantor/Repos/deeserverless/lib/validation.js:127` - `number < opts.minValue` and `number > opts.maxValue` are both false for NaN, so no range check fires.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/validation.js`

Acceptance Criteria:
- [x] `validateNumber(NaN)` throws a ValidationError (e.g., via `Number.isFinite` check).
- [x] Spec added for NaN (and ideally Infinity with explicit maxValue).

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T12:42:23Z | OPEN | IN_PROGRESS | Starting implementation (security batch: 008/010/011) |
| 2026-08-07T12:44:29Z | IN_PROGRESS | DONE | Both validateNumber type checks now also reject Number.isNaN with the "must be a number" message; Infinity already rejected by default MIN/MAX_SAFE_INTEGER range checks (spec codifies it). Specs: NaN, NaN with min/max, Infinity. Suite: 340 specs, 0 failures. |

## ISSUE-009: App maps every ERR_MODULE_NOT_FOUND to 404, masking missing dependencies of existing route files

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T12:13:15Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
`import()` throws `ERR_MODULE_NOT_FOUND` both when the route file itself is missing (a genuine 404) and when the route file exists but one of its own imports is missing (a deployment/packaging bug). The router treats both as 404 without logging, so broken deployments surface as "not found" to clients with no error trail.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/app.js:41` - `if (err.code === 'ERR_MODULE_NOT_FOUND')` does not distinguish which module was not found; the error is not logged in this branch.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/app.js`

Acceptance Criteria:
- [x] 404 is returned only when the missing module is the routed file itself (e.g., check `err.message`/`err.url` against the resolved route path); other module-resolution failures return 500 and are logged.
- [x] Spec added for a route file whose own import is missing.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T12:10:48Z | OPEN | IN_PROGRESS | Starting implementation (response/routing batch: 003/004/009) |
| 2026-08-07T12:13:15Z | IN_PROGRESS | DONE | app.js 404 only when the quoted missing-module path in err.message (or err.url) is the routed file; transitive ERR_MODULE_NOT_FOUND logs and returns 500. Fixture apigateway/brokenimport.js + spec added. Note: transitive errors name the route file after "imported from", so bare includes() would misclassify — quoted-path match required. Suite: 334 specs, 0 failures. |

## ISSUE-010: Html interpolates unescaped values into markup and inline script (XSS risk)

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T12:44:29Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
`head` and `document` interpolate `title`, `description`, `favIcon`, `metaTags` content, and `csrf` directly into HTML attribute/element context with no escaping. Any value derived from request input (a title echoing a query param, a user-supplied csrf string) can break out of the attribute or the single-quoted `localStorage.setItem('csrf', '...')` inline script and inject markup/script.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/html.js:26` - `content="${this.description}"` unescaped attribute interpolation (same for title at line 29, metaTags at lines 51-56).
- `/Users/dankantor/Repos/deeserverless/lib/html.js:316` - `localStorage.setItem('csrf', '${this.csrf}')` — a `'` in the value escapes the JS string context.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/html.js`

Acceptance Criteria:
- [x] Interpolated values are HTML-escaped (attribute and element context) and the csrf value is JS-string-escaped or restricted to a safe charset.
- [x] Specs assert escaping of `"` `<` `>` `'` in title/description/metaTag content and csrf.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T12:42:23Z | OPEN | IN_PROGRESS | Starting implementation (security batch: 008/010/011) |
| 2026-08-07T12:44:29Z | IN_PROGRESS | DONE | html.js #escapeHtml() applied to all head interpolations (description, favIcon, title, css, themeColor, webAppTitle, appleTouchIcons, canonicalUrl, metaTags) and script srcs; csrf inline script uses JSON.stringify + < escaping. body/headBottom/bodyBottom stay raw by design. Side effect: escaped members render '' when unset (partial ISSUE-023 overlap). Specs: title/description/metaTag escaping, csrf script breakout. Suite: 340 specs, 0 failures. |

## ISSUE-011: Auto-generated CSRF token uses Math.random()

- Status: `DONE`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-07T12:44:29Z`
- Priority: `P2`
- Source: `bug-sweep`

Summary:
`html.csrf = true` generates the token with `Math.random().toString(36).slice(2)` — a non-cryptographic PRNG whose state can be recovered from observed outputs, and which yields a short, variable-length token. CSRF tokens are a security control and should come from a CSPRNG.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/html.js:242` - `data = Math.random().toString(36).slice(2);` generates the security token.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/html.js`

Acceptance Criteria:
- [x] Token generated via `crypto.randomUUID()` or `crypto.randomBytes` with fixed adequate length.
- [x] Spec asserts token shape/length.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
| 2026-08-07T12:42:23Z | OPEN | IN_PROGRESS | Starting implementation (security batch: 008/010/011) |
| 2026-08-07T12:44:29Z | IN_PROGRESS | DONE | csrf=true now generates via node:crypto randomUUID() (122 bits CSPRNG, fixed 36-char shape) instead of Math.random().toString(36). Spec asserts UUID v4 regex and matching Set-Cookie value. Suite: 340 specs, 0 failures. |

## ISSUE-012: Response.endTimer throws TypeError when no timer was ever started

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`endTimer` reads `this._timers[key]` without first checking that `this._timers` exists. If `endTimer` is set before any `startTimer` (e.g., a code path skips the start), it throws `TypeError: Cannot read properties of undefined` inside the response path.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/response.js:233` - `if (this._timers[key] && ...)` dereferences `this._timers` which is only initialized in `startTimer`/`timer`.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/response.js`

Acceptance Criteria:
- [ ] `endTimer` is a no-op when `this._timers` is undefined.
- [ ] Spec covers endTimer-without-startTimer.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-013: Setting more than 12 cookies produces a header named `undefined`

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
The multi-Set-Cookie casing hack supports at most 12 distinct header-name variants. On the 13th cookie, `names.find(...)` returns `undefined` and the cookie is stored under the literal key `undefined`, which is then merged into response headers as an invalid header name; later cookies also silently overwrite each other at that key.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/response.js:139` - `let foundName = names.find(...)` can return `undefined` with no guard.
- `/Users/dankantor/Repos/deeserverless/lib/response.js:161` - `this.#cookies[foundName] = value;` writes under key `undefined` when exhausted.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/response.js`

Acceptance Criteria:
- [ ] Exceeding the supported cookie count either throws a clear error or uses the HTTP API v2 `cookies` response array (unbounded).
- [ ] Spec covers setting 13 cookies.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-014: Error classes ignore documented `options.$metadata`; NotFoundError captures wrong stack frame

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
JSDoc for `AuthenticationError`, `NotFoundError`, `PermissionError`, and `BadgatewayError` documents a custom `$metadata` option, but each constructor hardcodes `$metadata`, silently discarding the caller's value (only `ValidationError` honors it). Separately, `NotFoundError` passes `AuthenticationError` to `Error.captureStackTrace` — a copy-paste error.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/error.js:47` - `this.$metadata = {httpStatusCode: 401}` ignores `options.$metadata` (same pattern at lines 71, 95, 119).
- `/Users/dankantor/Repos/deeserverless/lib/error.js:67` - `Error.captureStackTrace(this, AuthenticationError)` inside `NotFoundError`.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/error.js`

Acceptance Criteria:
- [ ] All error classes honor `options.$metadata` with their status code as default, matching docs.
- [ ] `NotFoundError` passes its own constructor to `captureStackTrace`.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-015: Collection.modelIds drops falsy ids (0, empty string)

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`modelIds` filters with a truthiness check (`if (model.id)`), so models with `id: 0` or `id: ""` are omitted from `modelIds` and therefore from `uniqueModelIds`, even though those are legitimate identifier values.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/collection.js:113` - `if (model.id)` excludes falsy but valid ids.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/collection.js`

Acceptance Criteria:
- [ ] Filter uses `!== undefined && !== null` (or equivalent) so 0/"" ids are included.
- [ ] Spec covers a model with `id: 0`.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-016: apiGatewayRouteKey strips after the last dot unconditionally and throws on `$default`

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`apiGatewayRouteKey` truncates at the last `.` without consulting `acceptableFileExtensions`, so any route segment containing a dot (e.g., a version segment `v1.2` or a proxy value with an unlisted extension) is silently mangled into the wrong file path — inconsistent with `fileExtension`, which validates against the allowlist. Additionally, calling the public `apiGatewayRouteKey`/`apiGatewayRouteKeyNoMethod` getters on a `$default` route throws (`#splitRoute` assumes a `"METHOD /path"` shape and dereferences `splits[1]`).

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/request.js:83` - `route.substr(0, route.lastIndexOf('.')) || route` strips regardless of extension allowlist.
- `/Users/dankantor/Repos/deeserverless/lib/request.js:88` - `splits[1].split('/')` throws TypeError when the routeKey has no space (e.g., `$default`).

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/request.js`

Acceptance Criteria:
- [ ] Dot-stripping only occurs when the trailing segment is in `acceptableFileExtensions`.
- [ ] `$default` routeKey does not throw from the public getters.
- [ ] Specs cover a dotted route segment and `$default`.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-017: rawPathNoStage fails to strip the stage for the root path and replaces the first match anywhere

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`rawPathNoStage` uses an unanchored `String.replace` of `/{stage}/`. For the stage root (`rawPath === "/dev"`, no trailing slash) nothing matches and the stage is returned as if it were the path. Because the search is not anchored to the start, a path whose later segment equals the stage name can also be rewritten in the wrong place.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/request.js:248` - `this.event.rawPath.replace(`/${this.stage}/`, "/")` is unanchored and requires a trailing slash.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/request.js`

Acceptance Criteria:
- [ ] `/dev` (stage root) returns `/`.
- [ ] Only a leading `/{stage}` prefix is removed.
- [ ] Specs cover stage root and a path containing the stage name mid-path.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-018: _pruneCache loops forever when maxEntries is 0

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`_pruneCache` evicts with `while (cache.size >= maxEntries)`. If a subclass sets `_cacheMaxEntries`/`_responseCacheMaxEntries` to 0 (the documented "override to tune" invites this), the loop condition `0 >= 0` never becomes false once the cache is empty — `cache.delete(undefined)` doesn't shrink an empty Map — and `setCache`/`fetch` hang the process.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/model-collection-base.js:337` - `while (cache.size >= maxEntries)` with `cache.delete(cache.keys().next().value)` never terminates for `maxEntries <= 0`.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/model-collection-base.js`

Acceptance Criteria:
- [ ] `maxEntries <= 0` either disables caching cleanly or is clamped; no infinite loop.
- [ ] Spec covers `_cacheMaxEntries = 0`.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-019: _fetchWithAbort overwrites a caller-supplied AbortSignal

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
When `abortTimeoutMs` is set, `_fetchWithAbort` assigns its own controller's signal to `options.signal`, silently discarding any `signal` the caller passed in `fetch` options. The caller's abort then has no effect on the request.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/model-collection-base.js:561` - `options.signal = controller.signal;` replaces any existing signal instead of combining (e.g., `AbortSignal.any`).

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/model-collection-base.js`

Acceptance Criteria:
- [ ] A caller-supplied signal still aborts the request when `abortTimeoutMs` is also set (e.g., via `AbortSignal.any`).
- [ ] Spec covers caller signal + timeout combination.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-020: Response cache buffers bodies as text, corrupting binary GET responses

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`_setResponseCache` stores the body via `response.text()`, which decodes bytes as UTF-8. Using `cacheMs` on a GET for binary content (images, archives, protobuf) returns a corrupted body on both cache fill and cache hit, since invalid byte sequences are lossily replaced during decoding.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/model-collection-base.js:350` - `const bodyText = await response.text();` is the only representation cached.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/model-collection-base.js`

Acceptance Criteria:
- [ ] Cached bodies round-trip binary content (e.g., store `arrayBuffer()`), or binary/caching combination is explicitly rejected and documented.
- [ ] Spec covers caching a response with non-UTF-8 bytes.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-021: validateInstanceOf instantiates the constructor just to build an error message

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
On validation failure, `validateInstanceOf` calls `new constructor()` solely to derive a class name for the message — executing arbitrary constructor side effects (network calls, registrations, state mutation) during error handling. The correct name is available side-effect-free as `constructor.name`; the current fallback `constructor.constructor.name` yields `"Function"`, which is why the workaround exists.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/validation.js:331` - `let test = new constructor();` executed for messaging only (repeated at line 343).
- `/Users/dankantor/Repos/deeserverless/lib/validation.js:329` - `constructor.constructor.name` should be `constructor.name`.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/validation.js`

Acceptance Criteria:
- [ ] Error message uses `constructor.name` with no instantiation.
- [ ] Spec asserts no constructor invocation on failure (e.g., constructor that throws/records calls).

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-022: Record-based events without lowercase `eventSource` (e.g., SNS) are misrouted as API Gateway and crash

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`type` only checks `Records[0].eventSource`, but SNS events use capitalized `EventSource` (and an empty `Records` array also falls through). Such events default to `aws:apigateway`, and the router then dereferences `event.requestContext.http.method`, producing an opaque TypeError and a 500 instead of a clear "unsupported event" failure.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/request.js:22` - only `eventSource` (lowercase) is consulted; SNS's `EventSource` misses.
- `/Users/dankantor/Repos/deeserverless/lib/request.js:228` - fallback path assumes `requestContext.http` exists, throwing for non-HTTP events.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/request.js`

Acceptance Criteria:
- [ ] Record-based events lacking a recognized source produce a defined type or explicit error, not an accidental API Gateway classification.
- [ ] Spec covers an SNS-shaped event and an empty `Records` array.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |

## ISSUE-023: Html renders the literal string "undefined" for unset members

- Status: `OPEN`
- Created At: `2026-08-06T21:44:13Z`
- Updated At: `2026-08-06T21:44:13Z`
- Priority: `P3`
- Source: `bug-sweep`

Summary:
`head`/`document` interpolate `description`, `title`, `favIcon`, and `body` without defaults. Members left unset render as the literal text `undefined` in the page (`content="undefined"`, `<title>undefined</title>`, `<body>undefined`), unlike siblings such as `themeColor`/`headBottom` which default to null and are conditionally included.

Evidence:
- `/Users/dankantor/Repos/deeserverless/lib/html.js:26` - `content="${this.description}"` with `description` getter returning `this._description` (undefined when unset); same for `favIcon` (line 28) and `title` (line 29).
- `/Users/dankantor/Repos/deeserverless/lib/html.js:310` - `${this.body}` renders `undefined` into the body when unset.

Scope:
- `/Users/dankantor/Repos/deeserverless/lib/html.js`

Acceptance Criteria:
- [ ] Unset members render as empty strings or their tags are omitted.
- [ ] Spec renders a bare `Html` page and asserts "undefined" does not appear.

Status History:

| Timestamp (UTC) | From | To | Note |
|---|---|---|---|
| 2026-08-06T21:44:13Z | N/A | OPEN | Created |
