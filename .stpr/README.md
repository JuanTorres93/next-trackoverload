# STPR In This Repository

This folder contains the repository-owned artifacts for the STPR method.

STPR means:

- `Skeleton`
- `Template`
- `Plan`
- `Review`

It is not a prompt.
It is not a specific tool.
It is not OpenSpec.

It is a way to control AI-assisted development without delegating architecture, planning, or validation.

## Goal

Use AI to replicate validated patterns, not to invent architecture from scratch.

Core principle:

- human decides
- AI executes
- tests and review validate

## Structure

`template/`

- working code reference
- canonical examples of catalog, CRUD, public-read-only mutable, and transactional modules
- canonical examples of entity creation, use cases, adapters, infrastructure implementations, applicacion services, dependency injection, custom errors, dtos, transactions.
- reference tests
- technical invariants

`plan/prompts/`

- prompts for obtaining a plan with AI assistance
- the AI asks using a constrained structure
- the answers generate STPR work artifacts under `.stpr/work/`

`plan/openspec/`

- templates for defining the plan more directly
- less discovery, more manual control

## Skeleton

The `skeleton` is the reusable project base:

- folder structure
- dependencies
- scripts
- testing setup
- base adapter configuration

In a new project, this repo acts as the skeleton.
In an existing project, the project itself becomes the operating skeleton.

Default rule:

- Existing skeleton conventions for runtime and test environments should be preserved unless the project plan explicitly overrides them.
- This includes practical defaults such as DB ports, DB names, credentials, helper behavior, and local execution assumptions.

## Template

The `template` is the highest-value context for the AI because it contains real code the model can replicate.

What matters most here:

- working examples
- naming
- layer structure
- tests

Less important:

- long theoretical explanations

Main path:

- [.stpr/template/](/.stpr/template)
- [.stpr/template/README.md](/.stpr/template/README.md)

Technical contract:

- [.stpr/template/STPR_INVARIANTS.md](/.stpr/template/STPR_INVARIANTS.md)

Note:
the file keeps the name `STPR_INVARIANTS.md` for historical continuity, even though the current method is STPR.

Canonical module map inside the template:

- `domain` -> entity creation, repositories interface definitions, value objects, domain errors
- `application-layer` -> DTO definition and conversion, application service interface definitions, use cases, application errors.
- `infra` -> implementation details using third-party libraries.
- `interface-adapters` -> dependency injection with dummy implementations for tests and real implementations for production and development
- `common` -> helper for error handling

Important distinction:

- Module classification can be defined in template artifacts even when the implementation reference for that capability lives in the skeleton.
- In this repository, some capabilities are skeleton-backed rather than template-backed.
- Use `.stpr/template/README.md` to determine whether a capability should be copied from `.stpr/template/` or from the repository `src/` skeleton.

Practical split in this repo:

- template-backed examples: `domain`, `application-layer`, `interface-adapters`, `infra`
<!-- TODO IMPORTANT: Change according project -->
- skeleton-backed capabilities:

## Plan

The `plan` is required before generating non-trivial changes.

There are currently two ways to produce it.

### Prompts route

Use:

- [.stpr/plan/prompts/prompts-project.md](/.stpr/plan/prompts/prompts-project.md)
- [.stpr/plan/prompts/prompts-change.md](/.stpr/plan/prompts/prompts-change.md)

When to use it:

- when starting new projects
- when ambiguity still exists
- when you want AI to help discover requirements

Expected result:

- a guided plan precise enough to act as the execution plan
- for a new project, store it under `.stpr/work/project/`
- for an incremental change, store it under `.stpr/work/changes/<change-slug>/`

### openspec route

Use:

- [.stpr/plan/openspec/proposal-project-template.md](/.stpr/plan/openspec/proposal-project-template.md)
- [.stpr/plan/openspec/proposal-change-template.md](/.stpr/plan/openspec/proposal-change-template.md)

When to use it:

- when you already know the domain
- when you prefer manual control
- when you want to reduce model interpretation even further

Expected result:

- a plan written directly by you or refined with AI
- stored under `.stpr/work/project/` or `.stpr/work/changes/<change-slug>/`, not in `src/` or the repository root

## Review

`Review` is the final control layer.

It should verify:

- fidelity to the template
- respect for invariants
- relevant test coverage
- absence of unnecessary drift

Resources:

- [.stpr/review/CHECKLIST_REVISION.md](/.stpr/review/CHECKLIST_REVISION.md)
- [AGENTS.md](/AGENTS.md)

## OpenSpec

OpenSpec can be used as workflow support, but it does not define the method.

If used:

- it must point to the template and invariants
- it must not redefine architecture in parallel
- it must remain replaceable without breaking the system

Current configuration:

- [openspec/config.yaml](/openspec/config.yaml)

## Golden rule

If a tool changes, disappears, or becomes too expensive, your way of working should not break.

That is why the core of the method lives in your own files:

- skeleton
- template
- plan
- review
