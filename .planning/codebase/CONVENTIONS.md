# Coding Conventions

**Analysis Date:** 2026-06-10

## Naming Patterns

**Files:**
- Kebab-case: `gsd-check-update.js`, `verify-doc-links.py`, `07-tech-stack.md`

**Functions:**
- JavaScript: camelCase (e.g., `parseCodeReviewFlags`, `gsd_run`)
- Python: snake_case (standard Python PEP 8)

**Variables:**
- JavaScript: camelCase (e.g., `stdinTimeout`, `filePath`)
- Python: snake_case (e.g., `errors`, `target`)

**Types:**
- TypeScript: PascalCase (inferred from standard TS practices and `gsd-code-fixer` mentions)

## Code Style

**Formatting:**
- Indentation: 2 spaces for JavaScript/JSON, 4 spaces for Python (inferred from `scripts/verify_doc_links.py`).
- Semicolons: Used in JavaScript files.
- String Literals: Both single and double quotes observed in JS; single quotes preferred in some shell context.

**Linting:**
- Not explicitly configured in root, but mentioned in `gsd-code-reviewer` logic.
- Standard language-specific checks (e.g., `npx tsc --noEmit` for TS, `node -c` for JS).

## Import Organization

**Order:**
1. Built-in modules (e.g., `const fs = require('fs');`)
2. Third-party modules
3. Local modules/utilities

**Path Aliases:**
- Not extensively detected, but relative paths are common.

## Error Handling

**Patterns:**
- `try-catch` blocks in JavaScript for parsing and file operations.
- Silent fails (`process.exit(0)`) for non-critical hooks to avoid blocking the user session.
- Informative error messages for the user when parsing fails.
- Exit codes (`sys.exit(1)` in Python, `exit 1` in Shell) to signal failures in scripts and workflows.

## Logging

**Framework:**
- `process.stdout.write` and `console.log` for Node.js.
- `print` for Python.
- `echo` for Shell scripts.

**Patterns:**
- Diagnostic logs often include a banner or specific prefix (e.g., `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`).
- Detailed descriptions of operations in progress (e.g., `◆ Spawning code reviewer...`).

## Comments

**When to Comment:**
- Top of file: Purpose, version, inputs/outputs, and usage instructions.
- Logic-level: Explaining complex conditionals, guard clauses, and non-obvious implementation details.

**JSDoc/TSDoc:**
- Minimal usage in existing hook files, but recommended for exported functions.

## Function Design

**Size:**
- Small to medium-sized functions preferred. Hooks are often organized as one main logic block in simple scripts.

**Parameters:**
- Often passed as structured objects (e.g., input JSON to hooks).

**Return Values:**
- Structured JSON objects for hooks and tools (e.g., `{ hookSpecificOutput: { ... } }`).

## Module Design

**Exports:**
- CommonJS (`module.exports` or `require`) for Node.js scripts.

**Barrel Files:**
- Usage mentioned in `gsd-code-reviewer` but not found in root.

---

*Convention analysis: 2026-06-10*
