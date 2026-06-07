# Template Reference Map

This file is the entrypoint for using `.stpr/template/` with minimal context.

Use it together with:

- `STPR_INVARIANTS.md`
- the specific reference files listed below
- the reference tests only when the task changes behavior or coverage

## Goal

Use this file to choose the right reference quickly. The goal is not to load the whole template, but to open the smallest useful set of files for the task.

Default reading order:

1. classify the module
2. pick the canonical reference
3. open tests last, not first

When selecting a reference, first decide whether it is:

- `template-backed`: the implementation reference exists inside `.stpr/template/`
- `skeleton-backed`: the implementation reference lives in the repository skeleton under `src/`

## Canonical Module Classification

- `src`
  - `domain`
    - `entities`: core business logic
      - `user`: minimal entity
      - `usermatches`: entity with behaviour and invariant protection
    - `repos`: repo interface definitions. Use when data needs to be accessed/mutated from a use case and that behaviour is no provided yet.
    - `value-objects`: use for data validation at domain level.
    - `common`: domain errors for better error handling in outer layers

  - `application-layer`
    - `dtos`: DTOs definition and methos to convert them back and forth from entities
    - `services`: interface for application services. This is encapsulated functionality that will need implementation in the infra layer.
    - `use-cases`: definition and implementation (using abstractions) of the core orchestration of domain entities, application servicies and repos.
      - `CreateUserUsecase`: simple use case with repo and application services.
      - `MatchUserUsecase`: use case with transactions.
    - `common`: application errors for better error handling in outer layers

  - `infra`
    - `repos`: repository implementations
    - `__tests__`: general repository contract for all implementations of a given repo type to fulfill
    - `services`: implementation of the services interfaces defined in lower layers.
    - `react`: implementation and general styling and use of react components, reusable patterns, DRY, tests, etc.

  - `interface-adapters`
    - `common`:
      - adapters errors for better error handling in outer layers
      - helper for injecting real implementations in production/development and mock ones in tests
    - `repo`: dependency injection of repositories
    - `services`: dependency injection of services
    - `use-cases`: dependency injection of use cases

  - `common`: helper to discern between custom errors for better error handling in outer layers

- `tests`
  - `createEntitiesTests`: properties to easily create in a DRY way entities in test environment. Prefer using createEntityName method.
  - `dtoProperties`: DTO properties to ensure DTOs are sync with their domain entities.

## Reference Origin

Use this split to decide where the canonical implementation reference actually lives.

### Template-backed references

These have implementation references inside `.stpr/template/`:

- `domain`
- `application-layer`
- `interface-adapters`
- `infra`

### Skeleton-backed references

These are provided by the base project skeleton and should be read from the repository `src/` tree:

Rule:

- Do not describe a skeleton-backed capability as if its canonical files existed inside `.stpr/template/`.
- When a capability is skeleton-backed, use the skeleton as the implementation reference and use `.stpr/template/STPR_INVARIANTS.md` as the architectural contract.
- When a capability is skeleton-backed, preserve the local structural and typing patterns already used by that skeleton reference unless the plan explicitly approves a deviation.

## Quick Selection Rules

## Minimal Context Loading

Do not start by reading all files of a reference module.

Open the smallest useful set first:

- `STPR_INVARIANTS.md`
- one reference module from this file
- one test file only if behavior must be copied exactly

Use these defaults:

<!-- TODO IMPORTANT: Write -->

## Reference By Module Type

### Read-Only Catalog

### Mutable Aggregate With CRUD API

### Mutable Aggregate With Public Read-Only API

### Transactional Module

### Auth / Authorization Support

## Shared Files

Open these only when the task actually touches them:

- `domain/value-objects/`
  for reusable primitives such as `Id` or `Text`

## Test Loading Rules

## Shortest Path Cheat Sheet
