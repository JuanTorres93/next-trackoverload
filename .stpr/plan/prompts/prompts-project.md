# Guided Plan Workflow For New Projects

This document contains the prompts used to obtain a `Plan` for a brand new project.

This is the guided `plan` route of STPR:

- the AI asks strategically constrained questions
- the user answers
- the AI produces a compact project plan under `.stpr/work/project/plan.md`
- the AI also produces executable tasks under `.stpr/work/project/tasks.md`
- those artifacts become the Plan layer used for generation

**Template path:** In this repository, "template/" means **`.stpr/template/`**. Always use that path when reading or copying reference files.

**Source of truth:** The reference for structure and conventions is **`.stpr/template/`**. Read **`.stpr/template/README.md`** before choosing a reference module. The mandatory technical contract is **`.stpr/template/STPR_INVARIANTS.md`**.

**Expected answer style:** Final answers should be explicit enough to avoid hidden assumptions, but they do not need to repeat the same fact in multiple sections. If a decision is already unambiguous in one section, keep later sections focused on the remaining implementation-impacting facts.

## Shared Conventions

- **Template:** `.stpr/template/` contains `src/`, and `tests/`. Follow `.stpr/template/STPR_INVARIANTS.md`.
- **Canonical references:** Use `.stpr/template/README.md` to map each requested module to the canonical template reference before implementation.
- **Repositories:** In the use cases use always the abstraction.
- **Skeleton conventions:** If the skeleton already defines runtime or test environment conventions preserve them by default. Only change them when the plan explicitly overrides them.
- **Unit test paths:** Place unit tests under `./__tests__/`.

## Prompt 1: Project Discovery To Plan

Use this prompt to discover and define a brand new project.

```text
I want to create a project using this Clean Architecture skeleton.

Ask me only the questions required to fully define the project.

You must ask about:

- Project name
- Project description
- Scope of the project:
   - planned modules
   - main concepts
- Main entities and their main fields
- Relationships between entities.
- Business rules
- Required value objects
- Specific use cases beyond basic CRUD
- Environment configuration, including the final environment variables to use and whether runtime/E2E env conventions from the skeleton are preserved or overridden
- Canonical template reference for each planned capability or module
   - state whether each reference is template-backed or skeleton-backed when relevant

After I answer, generate two artifacts in English:

1. `.stpr/work/project/plan.md`
2. `.stpr/work/project/tasks.md`

`.stpr/work/project/plan.md` must be compact, functional-first, and easy to review quickly.
Keep technical detail only when it changes architecture, persistence semantics, validation responsibilities, or test strategy.

`.stpr/work/project/plan.md` must use these sections, in this order:
1. Project Summary
2. Scope
3. Main Concepts
5. Canonical Template Mapping
6. State And Mutability
8. Business Rules
9. Technical Decisions
11. Implementation Constraints
12. Minimum Test Coverage
13. Review Checkpoints

`.stpr/work/project/tasks.md` must:
- be ordered
- be implementation-oriented
- include test tasks
- include a review task per capability
- avoid restating architecture that already belongs in `.stpr/work/project/plan.md`
- hold the operational detail that would make `.stpr/work/project/plan.md` noisy

Important rules:
- Use `.stpr/template/README.md`, `.stpr/template/STPR_INVARIANTS.md`, and `AGENTS.md` as the source of truth.
- Do not restate or redefine architecture already fixed by those files.
- Ask for clarification if the answers conflict with the template, invariants, or module classification rules.
- Ask for clarification if the answers conflict with existing skeleton environment conventions and do not explicitly authorize an override.
- Produce `.stpr/work/project/plan.md` and `.stpr/work/project/tasks.md` with no hidden assumptions.
- Keep `.stpr/work/project/plan.md` compact and move execution detail to `.stpr/work/project/tasks.md`.
- Do not create these work artifacts in `src/` or in the repository root.
```

## Prompt 2: Plan And Tasks To Generation

Use this prompt after Prompt 1.

```text
Based on `.stpr/work/project/plan.md` and `.stpr/work/project/tasks.md`, generate a complete project following Clean Architecture.

Before writing code:
1. Read `.stpr/work/project/plan.md` first and treat it as the source of execution decisions.
2. Read `.stpr/work/project/tasks.md` second and implement in task order.

Mandatory implementation rules:
- Follow `.stpr/template/` and `.stpr/template/STPR_INVARIANTS.md`.
- Use `.stpr/template/README.md` to select the canonical reference before generating code.
- Treat the declared template mapping in `.stpr/work/project/plan.md` as mandatory unless the plan explicitly documents an allowed deviation.
- Respect the architecture and modeling invariants from `.stpr/template/STPR_INVARIANTS.md`.
- Repositories live in domain interfaces plus data implementations.
- Add unit, acceptance, and E2E coverage required by `.stpr/work/project/plan.md`.
- Keep string column lengths aligned with value object limits.
- Validate every unique business identifier declared in `.stpr/work/project/plan.md` before persistence.
- Use the shared `Id` value object for business identifiers and externally visible codes unless `.stpr/work/project/plan.md` explicitly documents an allowed exception.
- Match the auth response contract from `.stpr/work/project/plan.md` exactly when auth exists; do not inherit an older skeleton token field name implicitly.
- If a business identifier is system-generated, generate it through `IdGenerator` or another plan-approved domain abstraction, never with ad hoc `randomUUID()` calls or string assembly inside a use case.
- If a unique business identifier is mutable, preserve single-row identity and do not create a duplicate business entity during update flows.
- Use `.stpr/work/project/tasks.md` for execution order and review checkpoints, not for inventing new architecture.

Do not invent patterns if the template already provides a valid reference.
```

## Prompt 3: Project Finalization

Use this prompt after generation.

```text
Finalize the generated project.

Review the project against:
1. `.stpr/work/project/plan.md`
2. `.stpr/work/project/tasks.md`
3. `.stpr/template/`
4. `.stpr/template/STPR_INVARIANTS.md`

Tasks:
- Complete missing tests
- Fix deviations from template structure
- Fix domain validation and repository issues
- Ensure domain-significant primitives are not left as ad hoc checks in use cases
- Ensure canonical template mappings were actually followed module by module
- Ensure all declared unique business identifiers are validated before persistence
- Ensure password storage behavior matches the approved plan or report it as a gap explicitly
- Ensure `.stpr/work/project/tasks.md` is fully covered or mark any remaining gaps explicitly
- Prepare the project for local execution and test runs

Important boundaries:
- Focus on the current project output, not on redesigning the STPR method itself.
- If you detect a process weakness, mention it briefly as a residual note only if it directly affected the current result.
- Do not turn this step into a meta-review of prompts, checklist files, or template governance.

Return:
- The fixes made
- The remaining gaps, if any
- The residual risks
```

## Note

This guided `plan` workflow is one way to create the Plan layer of STPR.
