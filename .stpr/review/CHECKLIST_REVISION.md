# Manual review checklist

Use this checklist during the `Review` phase, after code generation and test execution, to manually verify that the generated project stays aligned with the template and conventions.

This checklist is a guide for human review. AI may help inspect the codebase, compare files, and summarize findings, but final validation remains manual.

**Reference:** Compare against **`.stpr/template/`** as the source of truth. Also review the examples available in `.stpr/brief/` and `.stpr/openspec/`.

---

## Structure

- [ ] Layered folders exist per module: `domain/`, `interface-adapters/`, `application-layer/`, `infra`.
- [ ] domain errors are present.

## Domain

- [ ] Value objects expose static `create()` and have unit tests.
- [ ] Repositories keep the contract: interface in `domain/`, implementation in `infra/repos`, using the pattern from the canonical template reference.
- [ ] Business-action inputs are validated before mutating aggregate state.
- [ ] Aggregate methods that model actions validate the action semantics, not only the resulting state.
- [ ] The implementation does not rely only on HTTP DTO validation for domain-significant action inputs.
- [ ] When the canonical template reference uses `Pick<...>`, `Omit<...>`, or equivalent prop-shape reuse for use case params, the generated module follows the same composition style unless the plan explicitly approved a deviation.
- [ ] Use cases return DTOs, never Entities.

## Tests

- [ ] Unit tests exist under `./__tests__/`.
- [ ] All relevant suites pass: `npm run test`.
- [ ] Run npm run test in the affected app(s) and attach results

## Code cleanliness

- [] Flag any single-character local identifiers; prefer full names:
  - Bad: `const g = Garment.create(...)`
  - Good: `const garment = Garment.create(...)`
- [] No unused imports skeleton runtime and test environment conventions were preserved unless the plan explicitly changed them.

## Reference parity

- [ ] Repository class naming and catalog conventions match the template.
- [ ] A diff or comparison against `.stpr/template/` has been reviewed; deviations were either corrected in the project or captured back into the template or planning assets for future runs.

---

**Resources:** `AGENTS.md`, `.stpr/README.md`, `.stpr/plan/prompts/`, `.stpr/plan/openspec/`.
