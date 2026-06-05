## Change Summary

This change adds client-side support for retrieving assembled day payloads by a list of ids and also ensures single-day retrieval support is covered. No server routes change — the goal is to provide compact, test-covered client APIs that call the existing `GET /api/day/assembled?ids=...` and `GET /api/day/assembled/[dayId]` endpoints and return typed `AssembledDayDTO` JSEND responses.

## Scope

- New modules: none.
- Existing modules affected:
  - `apps/mobile/src/infra/services/BackendService/modules/DayModule.ts` — add `getMultipleAssembledDaysByIds(dayIds: string[])` implementation.
  - `apps/mobile/src/infra/services/BackendService/modules/DayModule.ts` — add `getMultipleAssembledDaysByIds(dayIds: string[])` implementation and verify/ensure `getAssembledDayById(dayId: string)` is present and covered by tests.
  - `apps/mobile/src/application-layer/services/BackendService.port.ts` — add port signature for `getMultipleAssembledDaysByIds`.
  - `apps/mobile/src/infra/services/BackendService/ApplicationBackendService.ts` — delegate the new port method to `DayModule`.

## Main Concepts

- Capability: "get multiple assembled days" — client-side operation that queries the existing server endpoint and returns `AssembledDayDTO[]` wrapped in JSEND.
- Capability: "get multiple assembled days" — client-side operation that queries the existing server endpoint and returns `AssembledDayDTO[]` wrapped in JSEND.
- Capability: "get single assembled day" — client-side operation that queries `GET /api/day/assembled/[dayId]` and returns `AssembledDayDTO | null` wrapped in JSEND.

## Module Classification

- `DayModule`: infra / HTTP client module (implementation detail of BackendService). Changes are local to the mobile app client infra layer.
- `BackendService.port`: application-layer port. Surface API for other app code to consume.
- `ApplicationBackendService`: infrastructure-to-application wiring (delegation layer).

## Canonical Template Mapping

- Capability: `getMultipleAssembledDaysByIds` — skeleton-backed (client infra modules and ports live in the app skeleton). There is no template file under `.stpr/template/` in this repository; follow existing `DayModule` implementation patterns as canonical.

## State And Mutability

- This change is read-only with respect to server data (HTTP GET). No mutations on the server are performed by this operation.
- Client-side state: callers receive a JSEND-wrapped array and may cache or render; no local persistence changes introduced.

## Endpoints And Visibility

- Server endpoint (already present): `GET /api/day/assembled?ids=<comma-separated-ids>` — authenticated endpoint (server derives caller identity from session).
- Client API: `getMultipleAssembledDaysByIds(dayIds: string[]): Promise<JSENDResponse<AssembledDayDTO[]>>` exposed on `BackendService` port and implemented in `DayModule`.
- Client API: `getMultipleAssembledDaysByIds(dayIds: string[]): Promise<JSENDResponse<AssembledDayDTO[]>>` exposed on `BackendService` port and implemented in `DayModule`.
- Client API: `getAssembledDayById(dayId: string): Promise<JSENDResponse<AssembledDayDTO | null>>` already exists in the client; include verification and test coverage for this operation.

## Business Rules

- No new business rules. Client will forward the request as-is and surface server responses (success/failure) to callers.

## Technical Decisions

- Use `GET` with query parameter `ids` joined by commas to call the server endpoint (matching server implementation).
- Do not add or change authentication behavior; the client should rely on existing cookie/session transport used by other `DayModule` calls.

## Seed And Test Bootstrap

- No new seed data required. Tests should reuse existing test helpers that create users, days, and assembled payloads in the test backend harness.

## Implementation Constraints

- Follow existing `DayModule` request/response patterns (headers, JSON parsing, return JSEND typing).
- Keep changes limited to the mobile app; do not change server routes or use-cases.

## Minimum Test Coverage

- Add an integration test that:
  - boots the mobile test harness against the test server, creates any necessary days/recipes via existing helpers, calls `getMultipleAssembledDaysByIds` with two ids, and asserts a JSEND success with an array length >= 1 and that returned items conform to `AssembledDayDTO` shape (check presence of `meals` and `dayId`).
- Add integration tests that:
- boots the mobile test harness against the test server, creates any necessary days/recipes via existing helpers, calls `getMultipleAssembledDaysByIds` with two ids, and asserts a JSEND success with an array length >= 1 and that returned items conform to `AssembledDayDTO` shape (check presence of `meals` and `dayId`).
- verifies `getAssembledDayById(dayId)` returns the expected `AssembledDayDTO` or `null` when missing; assert JSEND success and presence of `meals` and matching `dayId` when present.

## Review Checkpoints

1. Code review: `BackendService.port.ts` signature, `DayModule` implementation, delegation in `ApplicationBackendService`.
2. Test review: ensure test is deterministic and reuses test harness helpers.
3. Parity check: confirm no changes to server routes or templates; document file diffs in the PR description.
