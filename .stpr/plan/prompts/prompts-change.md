# Guided Plan Workflow For Incremental Changes

Use these prompts when the project already exists conceptually and you want to obtain a compact `Plan` for a change through the guided `plan` route.

**Template path:** In this repository, "template/" means **`.stpr/template/`**. Always use that path when reading or copying reference files.

**Source of truth:** The reference for structure and conventions is **`.stpr/template/`**. Read **`.stpr/template/README.md`** before choosing a reference module. The mandatory technical contract is **`.stpr/template/STPR_INVARIANTS.md`**.

**Expected answer style:** Final answers should be explicit enough to avoid hidden assumptions, but they do not need to restate the same decision in multiple sections when one section already makes it implementation-safe.

## Shared Conventions

- **Template:** `.stpr/template/` contains `src/`, `seed/`, and `tests/`. If the change introduces transactional flows, define the transactional module explicitly in the plan and follow `.stpr/template/STPR_INVARIANTS.md`.
- **Canonical references:** Use `.stpr/template/README.md` to map each affected module to the canonical template reference before implementation.
- **Repositories:** In the use cases use always the abstraction.
- **Skeleton conventions:** If the skeleton already defines runtime or test environment conventions preserve them by default. Only change them when the plan explicitly overrides them.
- **Unit test paths:** Place unit tests under `./__tests__/`.

## Prompt 1: Change Discovery To Plan

```text
I want to propose a change for an existing project built from this Clean Architecture skeleton.

Ask me only the questions needed to define the change.

You must ask about:
- Change name
- Change objective
- Scope of the change:
   - new modules introduced
   - existing modules affected
- Main concepts introduced or changed
- New or modified capabilities, including the exact operations affected when the change touches API behavior
- Business rules introduced or changed
- Canonical template reference for each affected capability or module
   - state whether each reference is template-backed or skeleton-backed when relevant
- Out-of-scope items

Do not ask again about project-wide decisions such as database, authentication, or global architecture unless this change modifies them.

After I answer, generate two artifacts in English:

1. `.stpr/work/changes/<change-slug>/plan.md`
2. `.stpr/work/changes/<change-slug>/tasks.md`

`.stpr/work/changes/<change-slug>/plan.md` must be compact and functional-first.
Keep technical detail only when it changes architecture, persistence semantics, mutation rules, or test strategy.

`.stpr/work/changes/<change-slug>/plan.md` must use these sections, in this order:
1. Change Summary
2. Scope
3. Main Concepts
4. Module Classification
5. Canonical Template Mapping
6. State And Mutability
7. Endpoints And Visibility
8. Business Rules
9. Technical Decisions
10. Seed And Test Bootstrap
11. Implementation Constraints
12. Minimum Test Coverage
13. Review Checkpoints

If the change explicitly modifies environment conventions, auth contract, credential strategy, or local execution prerequisites, include those details inside `Technical Decisions` or `Implementation Constraints` only when they are materially changed by this change.

`.stpr/work/changes/<change-slug>/tasks.md` must:
- be ordered
- be implementation-oriented
- include test tasks
- include seed/bootstrap tasks when applicable
- include a review task per capability
- keep operational detail out of `.stpr/work/changes/<change-slug>/plan.md`

Important rules:
- Use `.stpr/template/README.md`, `.stpr/template/STPR_INVARIANTS.md`, and `AGENTS.md` as the source of truth.
- Do not restate or redefine architecture already fixed by those files.
- Ask for clarification if the answers conflict with the template, invariants, or module classification rules.
- Ask for clarification if the answers conflict with existing skeleton environment conventions and do not explicitly authorize an override.
- Produce `.stpr/work/changes/<change-slug>/plan.md` and `.stpr/work/changes/<change-slug>/tasks.md` with no hidden assumptions.
- Keep `.stpr/work/changes/<change-slug>/plan.md` compact and move execution detail to `.stpr/work/changes/<change-slug>/tasks.md`.
- Do not create these work artifacts in `src/` or in the repository root.
```

## Prompt 2: Change Plan To Implementation

```text
Based on `.stpr/work/changes/<change-slug>/plan.md` and `.stpr/work/changes/<change-slug>/tasks.md`, implement the approved change in the existing NestJS project using the current project structure and the STPR template as reference.

Before writing code:
1. Read `.stpr/work/changes/<change-slug>/plan.md` first and treat it as the source of execution decisions.
2. Read `.stpr/work/changes/<change-slug>/tasks.md` second and implement in task order.

Mandatory implementation rules:
- Follow `.stpr/template/` and `.stpr/template/STPR_INVARIANTS.md`.
- Use `.stpr/template/README.md` to select the canonical reference module for each affected module before modifying code.
- Treat the declared template mapping in `.stpr/work/changes/<change-slug>/plan.md` as mandatory unless the plan explicitly documents an allowed deviation.
- Respect the architecture and modeling invariants from `.stpr/template/STPR_INVARIANTS.md`.
- Repositories live in domain interfaces plus infra implementations.
- Add tests required by `.stpr/work/changes/<change-slug>/plan.md`.
- Keep string column lengths aligned with value object limits.
- Use the shared `Id` value object for affected business identifiers and externally visible codes unless `.stpr/work/changes/<change-slug>/plan.md` explicitly documents an allowed exception.
- If an affected business identifier is system-generated, generate it through `IdGenerator` or another plan-approved domain abstraction, never with ad hoc `randomUUID()` calls or string assembly inside a use case.
- If a unique business identifier is mutable, define and implement exact persistence semantics before coding so updates preserve single-row identity and do not create duplicate business entities.
- Call out new tests required before or while implementing, and then add them in code.
- Call out any design conflicts or invariant risks before coding.
- Use `.stpr/work/changes/<change-slug>/tasks.md` for execution order and review checkpoints, not for inventing new architecture.
- Run the required verification for the affected change before considering the implementation complete.

Do not invent patterns if the template already provides a valid reference.
```

## Prompt 3: Change Finalization

Use this prompt after implementation.

```text
Finalize the implemented change for the existing NestJS project.

Review the change against:
1. `.stpr/work/changes/<change-slug>/plan.md`
2. `.stpr/work/changes/<change-slug>/tasks.md`
3. `.stpr/template/`
4. `.stpr/template/STPR_INVARIANTS.md`

Tasks:
- Complete missing tests required by the change
- Fix deviations from template structure in the affected modules
- Fix domain validation, persistence, and repository issues introduced or exposed by the change
- Ensure domain-significant primitives introduced by the change are not left as ad hoc checks in use cases
- Ensure canonical template mappings were actually followed module by module for every affected module
- Ensure all new or changed unique business identifiers are validated before persistence
- Ensure any auth response modified by the change matches the approved plan exactly
- Ensure any credential or password storage behavior modified by the change matches the approved plan exactly, or report the mismatch as a gap explicitly
- Ensure `.stpr/work/changes/<change-slug>/tasks.md` is fully covered or mark any remaining gaps explicitly
- Prepare the affected verification flow for local execution and test runs

Important boundaries:
- Focus on the implemented change and the affected modules, not on redesigning the whole project or the STPR method itself.
- If the change exposed pre-existing project issues outside scope, mention them briefly as residual notes only when they materially affect the implemented change.
- Do not turn this step into a meta-review of prompts, checklist files, or template governance.

Return:
- The fixes made
- The remaining gaps, if any
- The residual risks
```

## Note

This guided `plan` workflow is one way to create the Plan layer of STPR.

If the change is already clear and you want more direct control, use `.stpr/openspec/` instead.
