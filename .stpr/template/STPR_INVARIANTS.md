# Invariants

This file is the project's technical contract under the STPR method.

Use this file only for non-negotiable rules.

## 1. STPR Method Invariants

These rules describe the portable part of STPR. They should remain stable even if the stack, tool, input channel, or concrete persistence mechanism changes.

### Skeleton

- The project must have a stable technical base before requesting non-trivial generation.
- The technical base must define a minimum structure, local environment, and verification strategy so that each iteration does not start from scratch.
- If the project already exists, the project itself acts as the operating skeleton.

### Template

- The template must contain real, functional, and sufficiently representative references to guide faithful generation.
- Generation must not invent structure, naming, or patterns when an applicable canonical reference already exists.

### Plan

- Work must start from an explicit plan captured in files in this project, not only in chat context.
- The plan must be sufficient to execute the work without hidden assumptions that materially affect scope, visibility, mutability, data semantics, integration contract, or test expectations.
- If the change introduces or modifies a system-relevant identifier and that decision materially affects the implementation, the plan must state whether it can change.
- If the plan artifacts conflict with the selected reference, these invariants, or the module classification rules, planning must stop and request clarification before code generation.

#### Modeling

- Before generating code, every planned module must be classified explicitly according to its responsibility and behavior, using the taxonomy applicable to the project or current stack.
- The chosen classification must be sufficient to determine mutability, dependencies, validation shape, and the implementation pattern that applies.
- Do not classify a piece as read-only, catalog, or equivalent only because its public interface does not expose writes. If its state changes because of system behavior, that mutability must be modeled explicitly.
- Every relevant identifier supplied by external input and used in business decisions must be validated before executing the operation that depends on it.
- If one part of the system uses multiple relevant identifiers in the same operation, the plan must make clear the role of each and which ones require explicit validation.
- Do not reinterpret relation identifiers, reference ids, foreign identifiers, or lookup keys as uniqueness pre-checks for the owning piece. Those inputs are validated through their reference or existence rules, not as duplicates of another entity.
- By default, reuse a shared abstraction for externally visible identifiers or codes when the semantics are the same.
- Do not create identifier-specific abstractions unless the plan explicitly requires specific behavior, format, or semantics.
- If the system generates an identifier, it must be generated through a plan-approved abstraction, not through ad hoc composition scattered through application logic.
- Do not add preflight collision checks for system-generated identifiers unless the plan explicitly requires retry behavior.
- If a primitive value carries domain meaning, reusable validation, or business constraints, it must be modeled as a value object or equivalent domain abstraction instead of repeating primitive validations in application logic.
- If the same value object semantics are used in two or more modules, they must be moved by default to a shared `common` location instead of being duplicated per module.
- Every created domain entity must have the method toCreateProps().

### Execution

- Execution must implement what was approved in the plan without expanding scope by its own criteria.
- Execution must respect the selected reference and the active invariants.
- Execution is considered complete when it implements what was approved in the plan, respects the selected reference, complies with these invariants, and passes the verification required by the change.

#### Execution Validation

- Tests validate behavior; AI does not replace final validation.
- The required verification must be executed at the correct layer for the type of change.
- If verification fails, the work is not complete.

### Review

- Final review must check architecture, domain semantics, relevant coverage, and alignment with the plan.
- Review does not validate only functionality; it also validates sustainability and fidelity to the correct pattern.
- If recurrent deviations appear, improving the skeleton, template, invariants, or prompts must be evaluated.

### Mandatory Stop Cases

- Implementation must stop and the plan must be clarified if the plan says a module should replicate a read-only or catalog reference, but another rule indicates that its state changes internally.
- Implementation must stop and the plan must be clarified if the public interface looks read-only, but other system behaviors change that module's state.
- Implementation must stop and the plan must be clarified if a module is being called a catalog, read-only, or equivalent only because users cannot edit it directly.
- Implementation must stop and the plan must be clarified if two value objects look structurally identical and the plan does not explain why the semantic separation matters.

## 2. Architecture Invariants

The reference architecture is Clean Architecture. These rules must remain in place while that philosophy continues to be the base of the project.

- The domain must not depend on infrastructure, framework, UI, transport, or concrete storage.
- Use cases coordinate flow and application decisions.
- Entities encapsulate business behavior and state.
- Value objects encapsulate semantics and intrinsic validation.
- Presentation adapts external context and delegates business decisions.
- Infrastructure implements ports and adapters without contaminating the domain.
- Contracts between layers must express business capabilities.
- Structural validation belongs to input/integration; intrinsic validation belongs to the domain.
- If a mutation depends on a significant input, it must be validated at domain level before mutating.
- Value Object validation and responsibility. If an entitity uses a ValueObject, the use case should no validate again the same value.
- When implementing in the infrastructure layer a new service or repository, two implementations must be included:
  - The real implementation.
  - A dummy implementation for testing (e.g: MemoryUsersRepo). These must be created in their own files and imported in tests

## 3. Testing Invariants

- The plan must specify the verification layers required for the change.
- Every relevant business rule must be covered by tests at the appropriate layer.
- Domain tests must not depend on infrastructure or the framework.
- Integration or E2E tests do not replace domain tests.
- If a change affects observable behavior, verification covering that behavior must be added or adjusted.
- Every new value object with `create()` must have a unit test unless the plan explicitly waives it.
- Missing tests required by the change invalidate completion of execution.

## 4. Stack Invariants: TypeScript + NextJS ...

- Keep names meaningfull and human readable. Use full names:
  - Bad: `const g = Garment.create(...)`
  - Good: `const garment = Garment.create(...)`
  - Bad: `const setCalResp = await ...`
  - Good: `const setCaloriesResponse = await ...`

- Use full DTOs in components.

<!-- TODO IMPORTANT: Write as revisions are made -->

## 5. Invariants of This Reference Template

The rules in this section do not define STPR in general or any project in the abstract. They define concrete decisions of this reference template.

### Base Module Taxonomy

- In this reference, the base taxonomy for business modules is: `domain`.

### Modeling Conventions

- In this reference, every unique business identifier supplied by the client for the entity being created or updated must be validated in the use case before persisting.
- If a module has more than one unique business identifier supplied by the client for the entity being created or updated, all of them must be validated in the use case before persisting.
- By default, use the shared `Id` value object for business identifiers and externally visible codes.
- If the system generates a business identifier, it must be generated through the `IdGenerator` domain service, never through ad hoc `randomUUID()` calls or manual string composition inside a use case.
- Use cases always return DTOs.

### TypeScript

- When the selected reference already composes input types or contracts from domain structures using `Pick<...>`, `Omit<...>`, or equivalent shape reuse, new work must follow that style unless the plan explicitly approves a deviation.
