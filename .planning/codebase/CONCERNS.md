# Codebase Concerns

**Analysis Date:** 2026-06-10

## Tech Debt

**GSD Core Duplication:**
- Issue: GSD core components (binaries, hooks, workflows, and agent definitions) are duplicated across three top-level directories.
- Files: `.claude/`, `.codex/`, `.gemini/`
- Impact: Increased maintenance overhead; updates must be manually synced across three locations. High risk of version drift between agents.
- Fix approach: Centralize GSD core logic and have provider-specific directories only for configurations or overrides.

**Large File Complexity:**
- Issue: Core library files are excessively large and handle multiple responsibilities.
- Files: `.claude/gsd-core/bin/lib/state.cjs` (2050 lines), `.claude/gsd-core/bin/lib/core.cjs` (2052 lines)
- Impact: Difficult to navigate, maintain, and test. Higher risk of side effects when modifying logic.
- Fix approach: Refactor into smaller, focused modules based on functional boundaries (e.g., state persistence, roadmap parsing, phase management).

**Missing Root Dependency Management:**
- Issue: There is no `package.json` or equivalent manifest in the repository root.
- Files: `[project-root]`
- Impact: No centralized way to manage repository-wide dev dependencies, linting rules, or scripts.
- Fix approach: Initialize a root `package.json` and use workspaces (npm/pnpm/yarn) to manage shared and specific dependencies.

## Security Considerations

**Indirect Prompt Injection:**
- Risk: Malicious instructions embedded in source code, PRDs, or planning documents could be interpreted as system commands by the AI agents.
- Files: `.claude/agents/*.md`, `.claude/gsd-core/bin/lib/security.cjs`
- Current mitigation: `security.cjs` includes `scanForInjection` with regex patterns for common injection techniques.
- Recommendations: Implement more advanced semantic analysis for injection detection; ensure clear boundaries between system instructions and user-provided data in all agent prompts.

**External Dependency Fragility:**
- Risk: Python scripts rely on external libraries that are not enforced or checked during environment setup.
- Files: `scripts/render_term.py` (depends on `cairosvg`)
- Current mitigation: Basic `try-except` around import in `render_term.py`.
- Recommendations: Add these dependencies to a `requirements.txt` or the setup documentation/scripts.

## Performance Bottlenecks

**Full Repository Scans:**
- Problem: Tools like `grep_search` and internal GSD scanners often perform whole-repo scans.
- Files: `.claude/gsd-core/bin/lib/commands.cjs`, `.claude/agents/gsd-codebase-mapper.md`
- Cause: Lack of indexing or scoped scanning by default.
- Improvement path: Implement an indexing mechanism or more aggressive use of `.gitignore` / `.geminiignore` to skip irrelevant directories.

## Fragile Areas

**Git Worktree Operations:**
- Files: `.claude/agents/gsd-code-fixer.md`, `.claude/gsd-core/workflows/execute-phase.md`
- Why fragile: High reliance on complex `git worktree` sequences which can fail if the local git state is unexpected (e.g., existing branches, locked indexes, or directory collisions).
- Safe modification: Use more robust error handling and cleanup (e.g., trap/finally blocks) around worktree creation and removal.
- Test coverage: Gaps (no automated tests found for worktree-heavy flows).

**Cross-Platform Path Safety:**
- Files: `.claude/gsd-core/bin/lib/security.cjs`
- Why fragile: Handles subtle platform differences like Windows UNC shares, macOS APFS case-insensitivity, and symlink resolution.
- Safe modification: Changes should be verified on both Windows and Unix-like environments.
- Test coverage: Gaps.

## Scaling Limits

**Agent Context Windows:**
- Current capacity: Dependent on the LLM used (Claude, GPT-4, etc.).
- Limit: Large files (like `state.cjs`) and broad codebase re-maps can quickly consume the context window, leading to loss of context or truncated responses.
- Scaling path: Implement more aggressive context pruning and "summarize-on-read" patterns for large files.

## Test Coverage Gaps

**GSD Core Logic:**
- What's not tested: Core state management, roadmap parsing, and security validation logic.
- Files: `.claude/gsd-core/bin/lib/*.cjs`
- Risk: Regressions in core GSD functionality could break all agent workflows unnoticed.
- Priority: High

**Utility Scripts:**
- What's not tested: ANSI parsing in `render_term.py`, link verification logic in `verify_doc_links.py`.
- Files: `scripts/render_term.py`, `scripts/verify_doc_links.py`
- Risk: Visual errors in screenshots or undetected broken links in documentation.
- Priority: Medium

---

*Concerns audit: 2026-06-10*
