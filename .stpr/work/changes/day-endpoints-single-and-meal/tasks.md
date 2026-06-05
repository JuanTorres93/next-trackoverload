1. Update port: add method signatures

- Edit `/home/juan/hdd/webapps/next-trackoverload/apps/mobile/src/application-layer/services/BackendService.port.ts` to add the following method signatures:
  - `setCaloriesGoalForDayAndUser(dayId: string, userId: string, newCaloriesGoal: number): Promise<JSENDResponse<DayDTO>>`
  - `updateUserWeightForDay(dayId: string, userId: string, newWeightInKg: number): Promise<JSENDResponse<DayDTO>>`
  - `addMultipleMealsToDay(dayId: string, recipeIds: string[], userId: string): Promise<JSENDResponse<DayDTO>>`
  - `removeMealFromDay(dayId: string, mealId: string, userId: string): Promise<JSENDResponse<DayDTO>>`
  - `addFakeMealToDay(dayId: string, userId: string, name: string, calories: number, protein: number): Promise<JSENDResponse<DayDTO>>`
  - `removeFakeMealFromDay(dayId: string, fakeMealId: string, userId: string): Promise<JSENDResponse<DayDTO>>`
  - `getAssembledDayById(dayId: string): Promise<JSENDResponse<AssembledDayDTO | null>>`

2. Implement `DayModule` methods

- Edit `/home/juan/hdd/webapps/next-trackoverload/apps/mobile/src/infra/services/BackendService/modules/DayModule.ts` to add implementations for the above methods using `fetch`:
  - `setCaloriesGoalForDayAndUser` -> PUT `${baseUrl}/day/${dayId}` with body `{ newCaloriesGoal, targetUserId: userId }`.
  - `updateUserWeightForDay` -> PUT `${baseUrl}/day/${dayId}` with body `{ newWeightInKg, targetUserId: userId }`.
  - `addMultipleMealsToDay` -> POST `${baseUrl}/day/${dayId}/meal` with body `{ recipeIds }`.
  - `removeMealFromDay` -> DELETE `${baseUrl}/day/${dayId}/meal/${mealId}`.
  - `addFakeMealToDay` -> POST `${baseUrl}/day/${dayId}/fakemeal` with body `{ name, calories, protein }`.
  - `removeFakeMealFromDay` -> DELETE `${baseUrl}/day/${dayId}/fakemeal/${fakeMealId}`.
  - `getAssembledDayById` -> GET `${baseUrl}/day/assembled/${dayId}`.

3. Wire through `ApplicationBackendService`

- Edit `/home/juan/hdd/webapps/next-trackoverload/apps/mobile/src/infra/services/BackendService/ApplicationBackendService.ts` to add methods that delegate to `this.dayModule` for each new port method.

4. Add unit/integration tests for `DayModule`

- Create `/home/juan/hdd/webapps/next-trackoverload/apps/mobile/src/infra/services/BackendService/modules/__tests__/DayModule.test.ts`.
- Tests to include (ordered):
  - Login/setup: create test user and login using existing helpers (reuse `createUserInTestBackend` and `TestApplicationBackendService`).
  - `setCaloriesGoalForDayAndUser` happy path (assert JSEND success and returned `DayDTO` shape).
  - `updateUserWeightForDay` happy path.
  - `addMultipleMealsToDay` happy path (create recipe(s) via test helper then add).
  - `removeMealFromDay` happy path (add then remove, assert day updated).
  - `addFakeMealToDay` happy path.
  - `removeFakeMealFromDay` happy path.
  - `getAssembledDayById` happy path (assert assembled payload contains `meals`).

5. Test fixtures and mocks

- Reuse `tests/mocks/fetchWithCookies` to route requests to local test server.
- Add small helper fixtures under `apps/mobile/src/infra/services/BackendService/modules/__tests__/helpers` if needed (e.g., `createDayInTestBackend`, `createMealInTestBackend`) — prefer reusing existing `create*InTestBackend` helpers in `apps/mobile/tests/mocks`.

6. CI / Local run

- Run the `mobile` test suite for the backend service modules to verify changes.

7. Reviews and completion

- After tests pass locally, create a PR with:
  - Files changed: port, module, application service, tests.
  - Review checklist: interface signatures, fetch endpoints, test coverage per capability.
