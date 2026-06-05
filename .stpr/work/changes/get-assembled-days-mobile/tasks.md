1. Update port: add method signature

- Edit `apps/mobile/src/application-layer/services/BackendService.port.ts` and add:
  - `getMultipleAssembledDaysByIds(dayIds: string[]): Promise<JSENDResponse<AssembledDayDTO[]>>`

2. Implement `DayModule` method

- Edit `apps/mobile/src/infra/services/BackendService/modules/DayModule.ts`:
  - Add `async getMultipleAssembledDaysByIds(dayIds: string[]): Promise<JSENDResponse<AssembledDayDTO[]>>`.
  - Build query string: `?ids=${dayIds.join(',')}` and call `GET ${baseUrl}/day/assembled${query}`.
  - Return `response.json()`.

3. Wire through `ApplicationBackendService`

- Edit `apps/mobile/src/infra/services/BackendService/ApplicationBackendService.ts`:
  - Add the method to the class that delegates to `this.dayModule.getMultipleAssembledDaysByIds`.

4. Add integration test

- Create `apps/mobile/src/infra/services/BackendService/modules/__tests__/DayModule.getMultipleAssembledDays.test.ts` with an integration-style test that:
  - Uses existing test harness helpers to create a test user and sign in.
  - Creates or ensures two day ids exist (reuse existing helpers that bootstrap days/assembled payloads).
  - Calls the new port method via `ApplicationBackendService` or directly `DayModule` configured to target the test server.
  - Asserts the JSEND response `status === 'success'` and `data` is an array with expected structure (`meals` present and `dayId` matching requested ids when present).

4b. Verify or add single-day test

- Confirm `getAssembledDayById(dayId)` client method exists and add/verify integration test:
  - Test file: `apps/mobile/src/infra/services/BackendService/modules/__tests__/DayModule.getAssembledDay.test.ts`.
  - Test should create or ensure a day exists, call `getAssembledDayById(dayId)`, and assert JSEND success and that returned `data` has `dayId` and `meals` (or is `null` for non-existent ids).

5. Run tests locally and fix failures

- Run the mobile test suite and the new test:
  - ```bash
    cd apps/mobile
    npm test -- -t DayModule.getMultipleAssembledDays
    ```
  ```

  ```

6. Documentation & PR

- In the PR description include:
  - What changed: port + DayModule + ApplicationBackendService + test
  - Reference to server endpoint: `GET /api/day/assembled?ids=...` (no server change)
  - Parity note: template-backed vs skeleton-backed mapping (see plan)

7. Reviews

- Reviewer checklist per capability:
  - Port signature present and documented.
  - `DayModule` implementation follows existing fetch patterns and headers.
  - Test coverage as specified and deterministic.
