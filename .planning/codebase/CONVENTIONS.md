# Coding Conventions

**Analysis Date:** 2026-06-10

## Naming Patterns

**Files:**
- Kebab-case for scripts and definitions: `gsd-tools.cjs`, `new-project.md`.

**Functions:**
- camelCase for logic functions: `cmdAgentSkills`, `buildAgentSkillsBlock`.

**Variables:**
- camelCase for local variables: `skillPath`, `validPaths`.
- UPPER_CASE for constants: `ERROR_REASON`, `TOP_LEVEL_USAGE`.

**Types:**
- JavaScript (Untyped) - No formal type system detected.

## Code Style

**Formatting:**
- Manual (Standard JS spacing observed).
- Single quotes preferred for strings.

**Linting:**
- None detected (no config files found).

## Import Organization

**Order:**
1. Built-in Node.js modules (`fs`, `path`).
2. Local project modules (`./lib/core.cjs`).

**Path Aliases:**
- None used.

## Error Handling

**Patterns:**
- Centralized error reporting via `core.error`.
- Use of `ERROR_REASON` codes for structured errors.

## Logging

**Framework:**
- Console output (stdout/stderr).
- Structured JSON output for queries.

## Comments

**When to Comment:**
- Header comments for files and complex functions.
- Inline comments for complex logic and bug references (e.g., `#3019`).

**JSDoc/TSDoc:**
- Basic JSDoc used for function headers.

## Function Design

**Size:**
- Modular; complex logic is broken into helper functions.

**Parameters:**
- Uses named objects for complex parameter lists in routers.

**Return Values:**
- Mixed; commands often output directly to stdout.

## Module Design

**Exports:**
- `module.exports` (CommonJS).

**Barrel Files:**
- None.

---

*Convention analysis: 2026-06-10*
