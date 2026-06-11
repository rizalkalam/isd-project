# Coding Conventions

**Analysis Date:** 2026-06-11

## Naming Patterns

**Files:**
- Kebab-case: `gsd-check-update.js`, `verify-doc-links.py`, `07-tech-stack.md`
- Markdown Docs: UPPERCASE for codebase docs (`STACK.md`, `ARCHITECTURE.md`), kebab-case for guides.

**Functions:**
- JavaScript: camelCase (e.g., `parseCodeReviewFlags`, `gsd_run`, `toPosixPath`)
- Python: snake_case (e.g., `verify_links`)

**Variables:**
- JavaScript: camelCase (e.g., `stdinTimeout`, `filePath`, `isFound`)
- Python: snake_case (e.g., `errors`, `target`, `md_file`)

**Types:**
- JavaScript (CommonJS): No explicit types, but PascalCase inferred for potential classes or constructors if used (rare in this codebase).

## Code Style

**Formatting:**
- Indentation: 2 spaces for JavaScript/JSON/Markdown, 4 spaces for Python.
- Semicolons: Required and used in JavaScript files.
- String Literals: Both single (`'`) and double (`"`) quotes observed in JS; double quotes common for JSON keys and strings. Single quotes preferred in some shell context.

**Linting:**
- Not explicitly configured in root (no `.eslintrc` or `biome.json` found).
- Standard language-specific checks recommended: `node -c {file}` for JS syntax check.

## Import Organization

**Order:**
1. Built-in modules (e.g., `fs`, `path`, `child_process`)
2. Local internal modules (e.g., `./lib/core.cjs`)

**Path Aliases:**
- Not detected; relative paths are used (e.g., `require('./lib/core.cjs')`).

## Error Handling

**Patterns:**
- `try-catch` blocks in JavaScript for parsing, file operations, and CLI command execution.
- Silent fails (`process.exit(0)`) for non-critical hooks to avoid blocking the user session.
- Exit codes (`sys.exit(1)` in Python, `exit 1` in Shell, `process.exit(1)` in Node) to signal failures in scripts and workflows.
- Informative error messages with specific prefixes (e.g., `ERROR:`, `⚠️`, `🛑`).

## Logging

**Framework:** `console` and `process.stdout/stderr`

**Patterns:**
- Use `process.stdout.write` for fine-grained control or banners.
- Use `console.log` for standard informational output.
- Diagnostic logs often include a banner or specific separator (e.g., `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`).
- Prefix symbols used for status: `◆` for progress, `✓` for success, `⚠️` for warning.

## Comments

**When to Comment:**
- Top of file: Purpose, usage instructions, and dependencies.
- Logic-level: Explaining complex conditionals, guard clauses, and non-obvious implementation details.
- Workflow files (`.md`): `<purpose>` and `<step>` tags used for organization.

**JSDoc/TSDoc:**
- Minimal usage in existing hook files, but present in some `gsd-core` files for function descriptions.

## Function Design

**Size:** Small to medium-sized functions preferred. Hooks are often organized as one main logic block in simple scripts.

**Parameters:** Often passed as structured objects or positional arguments in internal CLI tools.

**Return Values:** Structured JSON objects for hooks and tools (e.g., `{ success: true, data: { ... } }`).

## Module Design

**Exports:** CommonJS (`module.exports`) for Node.js scripts.

**Barrel Files:** Not explicitly used; direct imports from `lib/` are common.

---

*Convention analysis: 2026-06-11*
