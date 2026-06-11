# Codebase Concerns

**Analysis Date:** 2026-06-11

## Tech Debt

**Core Logic Duplication:**
- Issue: The entire `gsd-core` logic is duplicated across three directories: `.claude/gsd-core/`, `.codex/gsd-core/`, and `.gemini/gsd-core/`.
- Files: `.claude/gsd-core/bin/lib/*.cjs`, `.codex/gsd-core/bin/lib/*.cjs`, `.gemini/gsd-core/bin/lib/*.cjs`
- Impact: Extreme maintenance burden. Bug fixes or feature updates must be manually synchronized across all three copies, leading to high risk of divergence and "it works in Claude but not in Codex" bugs.
- Fix approach: Move common logic to a shared root directory (e.g., `gsd-core/`) and use symbolic links or a proper package management system to reference it from the respective agent directories.

**Monolithic Files:**
- Issue: Several core files are excessively large and handle multiple responsibilities.
- Files: `.claude/gsd-core/bin/lib/state.cjs` (~100KB), `.claude/gsd-core/bin/lib/core.cjs` (~94KB), `.claude/gsd-core/bin/gsd-tools.cjs` (~83KB).
- Impact: Increased cognitive load for maintainers, higher risk of merge conflicts, and difficulty in implementing unit tests for isolated components.
- Fix approach: Refactor these large files into smaller, focused modules with clear responsibilities.

**Lack of Automated Testing:**
- Issue: No automated test suite (unit, integration, or E2E) was detected for the complex core logic.
- Files: `.claude/gsd-core/bin/lib/` (entire directory)
- Impact: Critical regressions can go unnoticed. The complexity of state management and git integration makes manual verification error-prone.
- Fix approach: Introduce a testing framework (e.g., Vitest or Jest) and implement unit tests for core utilities, especially path validation, state patching, and command routing.

**Legacy Migration Baggage:**
- Issue: Presence of multiple installer migrations indicating a history of renaming and restructuring that still needs to be supported.
- Files: `.claude/gsd-core/bin/lib/installer-migrations/`
- Impact: Complexity in the installation/update process.
- Fix approach: Baseline the migrations once a stable version is reached to prune old legacy logic.

## Security Considerations

**Shell Command Execution:**
- Risk: Workflows and agents frequently execute shell commands, which is a potential vector for command injection if inputs are not strictly sanitized.
- Files: `.claude/gsd-core/bin/lib/shell-command-projection.cjs`, `.claude/agents/*.md`
- Current mitigation: Centralized `shell-command-projection.cjs` and `security.cjs` with `validateShellArg` helpers.
- Recommendations: Implement a strict allowlist of allowed shell commands and arguments where possible.

**Prompt Injection:**
- Risk: Since agents generate markdown that is then read by other agents, there is a risk of indirect prompt injection.
- Files: `.claude/agents/`, `.claude/gsd-core/bin/lib/security.cjs`
- Current mitigation: `security.cjs` includes `scanForInjection` and `sanitizeForPrompt` functions.
- Recommendations: Continuously update injection patterns as new attack vectors are discovered.

## Performance Bottlenecks

**Synchronous File I/O:**
- Problem: Extensive use of synchronous file operations (`readFileSync`, `writeFileSync`, `readdirSync`) which can block the event loop, especially in a framework designed to handle large codebases.
- Files: `.claude/gsd-core/bin/lib/core.cjs`, `.claude/gsd-core/bin/lib/state.cjs`, `.claude/gsd-core/bin/lib/planning-workspace.cjs`
- Cause: Legacy design for CLI-first tool where blocking I/O was deemed acceptable.
- Improvement path: Transition to asynchronous `fs/promises` for file operations to improve responsiveness.

## Fragile Areas

**GSD Tools Dispatcher:**
- Files: `.claude/gsd-core/bin/gsd-tools.cjs`
- Why fragile: This single file handles dozens of disparate commands (state, phase, roadmap, requirements, milestone, validation, etc.). Any syntax error here breaks the entire CLI framework.
- Safe modification: Use the `gsd-tools` command itself to verify logic before committing changes.
- Test coverage: Zero detected.

**State Management Logic:**
- Files: `.claude/gsd-core/bin/lib/state.cjs`
- Why fragile: Complex regex-based patching of Markdown files (STATE.md) is inherently fragile compared to structured data formats.
- Safe modification: Always verify `STATE.md` manually after programmatic updates.
- Test coverage: Gaps in edge case handling for malformed Markdown.

## Scaling Limits

**Framework Maintenance:**
- Current capacity: Managed by manual duplication.
- Limit: Becomes unsustainable as more agent platforms (e.g., Gemini, ChatGPT, Llama) or specialized skills are added.
- Scaling path: Move to a monorepo structure with a single source of truth for the core logic and build/publish steps for platform-specific configurations.

## Test Coverage Gaps

**Core Utility Logic:**
- What's not tested: Path validation, shell argument sanitization, Markdown parsing, and state transitions.
- Files: `.claude/gsd-core/bin/lib/`
- Risk: Critical security or data integrity bugs could be introduced during refactoring.
- Priority: High

---

*Concerns audit: 2026-06-11*
