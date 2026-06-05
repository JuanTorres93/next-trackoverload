Change Summary

- Name: add day/[dayId] and day/[dayId]/meals endpoints to backend service
- Goal: Add BackendService methods that call every HTTP verb implemented under the `apps/web-and-backend/src/app/api/day` routes (including nested `meal` and `fakemeal` routes). Success: all new methods compile, are wired through `ApplicationBackendService`, and have unit tests that run in the mobile test harness.

Scope

- New modules: none.
- Existing modules affected:
  - `apps/mobile/src/application-layer/services/BackendService.port.ts` (port/interface)
  - `apps/mobile/src/infra/services/BackendService/modules/DayModule.ts` (module implementation)
  - `apps/mobile/src/infra/services/BackendService/ApplicationBackendService.ts` (aggregator)

Main Concepts

- Client-side callers for server-side day-related routes: methods that map 1:1 to route verbs.
- DTOs unchanged: `DayDTO`, `AssembledDayDTO`, `MealDTO` from `shared`.

Module Classification

- Skeleton-backed changes to existing infra modules (BackendService port / module / aggregator). No domain or persistence modules changed.

Canonical Template Mapping

- `/home/juan/hdd/webapps/next-trackoverload/apps/mobile/src/application-layer/services/BackendService.port.ts` — skeleton-backed (port/interface template is followed).
- `/home/juan/hdd/webapps/next-trackoverload/apps/mobile/src/infra/services/BackendService/modules/DayModule.ts` — skeleton-backed (module implementation template).
- `/home/juan/hdd/webapps/next-trackoverload/apps/mobile/src/infra/services/BackendService/ApplicationBackendService.ts` — skeleton-backed (aggregator wiring template).
- Reference STPR invariants and templates: `.stpr/template/README.md`, `.stpr/template/STPR_INVARIANTS.md`, and `AGENTS.md` as source-of-truth.

State And Mutability

- All mutations are performed server-side; BackendService methods perform HTTP calls only. Local state/mutation is limited to test fixtures; no client-side persistence is changed.

Endpoints And Visibility

- Implement methods for each route verb under `apps/web-and-backend/src/app/api/day`:
  - PUT `/api/day/[dayId]` — body: SetCaloriesGoalBody | UpdateWeightBody — returns `DayDTO` (maps to `setCaloriesGoalForDayAndUser` / `updateUserWeightForDay`).
  - POST `/api/day/[dayId]/meal` — body: `{ recipeIds }` — returns `DayDTO` (maps to `addMultipleMealsToDay`).
  - DELETE `/api/day/[dayId]/meal/[mealId]` — returns `DayDTO` (maps to `removeMealFromDay`).
  - POST `/api/day/[dayId]/fakemeal` — body: `{ name, calories, protein }` — returns `DayDTO` (maps to `addFakeMealToDay`).
  - DELETE `/api/day/[dayId]/fakemeal/[fakeMealId]` — returns `DayDTO` (maps to `removeFakeMealFromDay`).
  - POST `/api/day/meal/batch` — body: `{ recipeIds, dayIds }` — returns `DayDTO[]` (already mapped by `addMultipleMealsToMultipleDays`, ensure unchanged).
  - GET `/api/day/assembled/[dayId]` — returns `AssembledDayDTO | null` (maps to `getAssembledDayById`).

Business Rules

- Client must be logged-in when calling protected endpoints; the server enforces this (`ensureLoggedInUser`).
- No new business rules, validations, or permissions are introduced.

Technical Decisions

- Use existing `fetch` patterns in `DayModule.ts` for all calls. Use `Content-Type: application/json` and `JSON.stringify` for bodies when required.
- Do not create new backend routes or types; map to the existing server routes only.

Seed And Test Bootstrap

- Add unit/integration tests mirroring `RecipeModule` tests using `TestApplicationBackendService` and `tests/mocks` helpers.
- Use `apps/mobile/src/infra/services/BackendService/modules/__tests__/` for `DayModule` tests and reuse `tests/mocks/fetchWithCookies` and existing `create*InTestBackend` helpers, adding small fixtures for day/meal creation where needed.

Implementation Constraints

- Do not add new DTOs or change `shared` types.
- Do not modify server routes; if a route is missing for a verb discovered in code, stop and ask for clarification.

Minimum Test Coverage

- Unit tests for each new method in `DayModule` (happy-path at minimum).
- One end-to-end style test that uses `TestApplicationBackendService` to exercise: create day (if needed), add meal(s), remove meal, add fake meal, remove fake meal, get assembled day.

Review Checkpoints

- Review 1: Interface — `BackendService.port.ts` signatures match `DayModule` and `ApplicationBackendService` wiring.
- Review 2: Implementation — `DayModule.ts` fetch paths and payloads follow the server route contract.
- Review 3: Tests — `DayModule` tests pass locally in mobile test harness and use existing mocks/fixtures.
