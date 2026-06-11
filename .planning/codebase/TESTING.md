# Testing Patterns

**Analysis Date:** 2026-06-11

## Test Framework

**Runner:**
- Vitest or Jest (Recommended for JS/TS logic)
- Playwright (Recommended for E2E/Browser testing)
- `node -c` (Used for basic syntax verification of JS files)

**Assertion Library:**
- Built-in `expect` (Jest/Vitest)
- Matchers: `toBe`, `toEqual`, `toThrow`, `toHaveBeenCalledWith`

**Run Commands:**
```bash
# General patterns (depending on project implementation)
npm test                              # Run all tests
npm run test:unit                     # Run unit tests only
npm run test:e2e                      # Run E2E tests only
npx playwright test                   # Run Playwright E2E tests
```

## Test File Organization

**Location:**
- Unit tests: Collocated with source files (e.g., `src/lib/utils.test.ts`) or in a parallel `tests/` directory.
- E2E tests: Separate `e2e/` or `tests/e2e/` directory.

**Naming:**
- Unit tests: `*.test.js` or `*.test.ts`
- Integration tests: `*.spec.js` or `*.spec.ts`
- E2E tests: `*.e2e.test.ts`

**Structure:**
```text
src/
  lib/
    core.cjs
    core.test.cjs (collocated unit test)
tests/
  unit/
    state.test.cjs (separate unit test)
  e2e/
    phase-flow.e2e.test.ts (browser test)
```

## Test Structure

**Suite Organization:**
```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle success case', () => {
      // arrange
      const input = { ... };
      const expected = { ... };

      // act
      const result = functionName(input);

      // assert
      expect(result).toEqual(expected);
    });

    it('should handle error case', () => {
      expect(() => functionName(null)).toThrow();
    });
  });
});
```

**Patterns:**
- **Arrange/Act/Assert**: Required structure for clarity.
- **RED-GREEN-REFACTOR**: Prescribed by the `gsd-add-tests` workflow.
- **Gate-based verification**: Tests should confirm failure (RED) if functionality is removed/broken before confirming success (GREEN).

## Mocking

**Framework:**
- Vitest `vi` or Jest `jest`

**Patterns:**
```typescript
// Mocking internal modules
vi.mock('./lib/state', () => ({
  loadState: vi.fn()
}));

// Mocking external dependencies (fs, child_process)
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn()
}));
```

**What to Mock:**
- File system operations (`fs`)
- Child process execution (`child_process.exec`)
- Network/API calls
- External CLI tools (e.g., `gh`)

**What NOT to Mock:**
- Pure logic functions
- Data transformation utilities

## Fixtures and Factories

**Test Data:**
- Factory functions preferred for creating complex state or roadmap objects.
- Shared fixtures located in `tests/fixtures/`.

**Location:**
- `.planning/phases/NN-{name}/` artifacts (SUMMARY.md, CONTEXT.md) used as specifications for test generation.

## Coverage

**Requirements:**
- High coverage expected for business logic in `gsd-core/bin/lib/`.
- UI-heavy components covered by E2E tests rather than unit tests.

**View Coverage:**
```bash
npm run test:coverage
```

## Test Types

**Unit Tests (TDD):**
- Scope: Business logic, calculations, data transformations, parsers, validators, state machines.
- Focus: Fast, isolated verification of single functions.

**Integration Tests:**
- Scope: Interaction between CLI tools and the filesystem.
- Focus: Verifying that `gsd-tools.cjs` correctly modifies `.planning/` files.

**E2E Tests:**
- Scope: Full user flows, navigation, forms, and browser-based interactions.
- Framework: Playwright.

## Common Patterns

**Async Testing:**
```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

**Error Testing:**
```typescript
it('should reject on invalid input', async () => {
  await expect(asyncCall()).rejects.toThrow('Error message');
});
```

---

*Testing analysis: 2026-06-11*
