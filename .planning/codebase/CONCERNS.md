# Codebase Concerns

**Analysis Date:** 2026-06-10

## Tech Debt

**Runtime Fragmentation:**
- Issue: Duplicate logic and configurations across `.claude/`, `.codex/`, and `.gemini/`.
- Files: All files within these directories.
- Impact: Increased maintenance burden; fixes must be replicated across all runtimes.
- Fix approach: Centralize common logic and templates, using symlinks or a unified build step.

## Known Issues

**Agent Skills Query Failure:**
- Symptoms: `gsd-tools query agent-skills` returns empty output for valid agents.
- Files: `.gemini/gsd-core/bin/lib/init.cjs`.
- Trigger: Running the query when `agent_skills` is not explicitly defined in `config.json`.
- Workaround: Manually provide skill content or configure `agent_skills` in project config.

## Security Considerations

**Prompt Injection / Leakage:**
- Risk: Agents might inadvertently read or output sensitive environment variables.
- Files: `.gemini/agents/*.md`.
- Current mitigation: `<forbidden_files>` blocks in agent instructions.
- Recommendations: Implement a hard-coded read guard in `core.cjs` to block access to sensitive patterns.

## Performance Bottlenecks

**Sequential Workflow Execution:**
- Problem: Complex workflows with many sequential tool calls can be slow.
- Files: `.gemini/gsd-core/workflows/*.md`.
- Cause: Synchronous nature of many orchestrator steps.
- Improvement path: Parallelize independent tool calls using runtime-specific background capabilities.

## Fragile Areas

**Cross-Platform Shell Commands:**
- Files: Workflow markdown files.
- Why fragile: Uses bash syntax (e.g., `&&`, `2>/dev/null`) which fails on Windows PowerShell.
- Safe modification: Use a cross-platform shim or move shell logic into `.cjs` modules.
- Test coverage: Gaps in cross-platform verification.

## Scaling Limits

**Context Window Usage:**
- Current capacity: High (Sonnet 3.5).
- Limit: Large codebases may exceed context limits during mapping or planning.
- Scaling path: Use recursive mapping and incremental re-mapping via `--paths` flag.

## Dependencies at Risk

**None detected:**
- The project has almost no external npm dependencies, reducing supply chain risk.

---

*Concerns audit: 2026-06-10*
