# Testing Patterns

**Analysis Date:** 2026-06-10

## Test Framework

**Runner:**
- JavaScript/TypeScript: `Jest` or `Vitest` (suggested by naming conventions and skill docs).
- Python: `pytest` (referenced in `07-tech-stack.md`).
- E2E: `Playwright` (explicitly used in `verify-work.md`).

**Assertion Library:**
- Built-in with runners (e.g., `expect()` for Jest, `assert` for Python).

**Run Commands:**
```bash
# General test commands (project dependent)
npm test                # Run all tests
pytest                  # Run python tests
$gsd-verify-work 4      # Run manual UAT for a phase
$gsd-add-tests 4        # Generate and run tests for a phase
```

## Test File Organization

**Location:**
- Co-located with source or in separate `tests/`, `__tests__` or `spec/` directories.
- Verified by `$gsd-add-tests` discovery step.

**Naming:**
- `.test.ts`, `.spec.ts`, `*Tests.fs`, `*Test.fs`, `*.test.js`.

## Test Structure

**Suite Organization:**
```typescript
// Example pattern for TDD/Unit tests
describe('feature name', () => {
  it('should behave correctly in case X', () => {
    // Arrange
    const input = ...;
    const expected = ...;
    
    // Act
    const actual = fn(input);
    
    // Assert
    expect(actual).toBe(expected);
  });
});
```

**Patterns:**
- **Arrange/Act/Assert**: Clear separation of setup, execution, and verification.
- **RED-GREEN-REFACTOR**: Encouraged by `$gsd-add-tests` workflow.
- **UAT (Manual)**: Guided conversational tests with status tracking in `{phase}-UAT.md`.

## Mocking

**Framework:**
- Standard runner utilities (e.g., `jest.mock`, `mcp__playwright`).

**Patterns:**
- **External Services**: Mocked via framework-specific tools to ensure test isolation.
- **UI Interaction**: Simulated using Playwright tools.

**What to Mock:**
- External APIs, third-party libraries, complex dependencies that are slow or non-deterministic.

**What NOT to Mock:**
- Pure functions and core business logic (these should be tested directly).

## Fixtures and Factories

**Test Data:**
- Stored in separate files or generated inline for simple cases.
- Database seeds and migrations are mentioned as needing "Smoke Tests" upon startup.

**Location:**
- Often in `fixtures/` or `data/` subdirectories within test folders.

## Coverage

**Requirements:**
- Encouraged for all new logic.
- Gaps are identified during UAT and documented in `SUMMARY.md` or `UAT.md`.

## Test Types

**Unit Tests (TDD):**
- Scope: Pure functions, business logic, parsers, validators.
- Approach: Fast, isolated, high coverage.

**Integration Tests:**
- Scope: Interaction between modules, database operations.

**E2E Tests:**
- Scope: Full user flows, navigation, forms, modals.
- Framework: Playwright.

**UAT (Manual):**
- Scope: High-level feature verification from a user perspective.
- Tracking: `UAT.md` files in `.planning/phases/`.

## Common Patterns

**Async Testing:**
- Use `async/await` in test blocks.

**Error Testing:**
- Verify that functions throw expected errors for invalid inputs.

**Smoke Tests:**
- Cold Start Smoke Test: Verifies the application starts correctly from a fresh state (cleared DB, caches, etc.).

---

*Testing analysis: 2026-06-10*
