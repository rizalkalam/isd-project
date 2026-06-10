<!-- GSD:project-start source:PROJECT.md -->

## Project

**Sistem Epidemiologi (Prediksi Tren Penyakit)**

Sistem Epidemiologi Klinik adalah aplikasi berbasis web yang membantu klinik memprediksi tren penyakit pasien berdasarkan data pemeriksaan dan riwayat kasus. Aplikasi ini menganalisis lonjakan penyakit endemis musiman sehingga manajemen klinik dapat melakukan penanganan, persiapan logistik, dan pengaturan SDM lebih cepat dan proaktif.

**Core Value:** Mengubah data rekam medis mentah menjadi sistem kewaspadaan dini yang akurat untuk mencegah keterlambatan respon terhadap lonjakan kasus penyakit.

### Constraints

- **Data Privacy**: Data yang ditampilkan di Dasbor MIS Manajer harus anonim (tidak menampilkan identitas pribadi seperti Nama atau NIK).
- **Access Control**: Sistem MIS hanya bersifat read-only terhadap tabel operasional; tidak boleh mengubah data rekam medis asli.
- **Platform**: Desktop-First Dashboard untuk optimalisasi visualisasi grafik yang padat.
- **Data Source**: Diasumsikan staf disiplin memasukkan data secara real-time ke sistem basis data utama (TPS).

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- JavaScript (Node.js) - Core logic of `gsd-core` and lifecycle hooks. Uses CommonJS (`.cjs`) and ESM.
- Python - Automation scripts located in `scripts/`.
- Markdown - Agent definitions (`.claude/agents/*.md`), documentation, and planning artifacts.
- Shell (Bash/PowerShell) - Integration hooks and orchestration scripts.

## Runtime

- Node.js >= 20.0.0 (Required for `gsd-core` and agent CLIs)
- Python 3.x (For utility scripts)
- npm (Used for installing agent CLIs)
- Lockfile: `package-lock.json` (Not present in root, but Node.js environment is required)

## Frameworks

- GSD Core v1.4.3 - The primary framework for agentic workflow orchestration.
- Claude Code (Anthropic) - AI agent framework for the Claude path.
- Codex (OpenAI) - AI agent framework for the Codex path.
- Not explicitly detected in root, but `gsd-core` includes `verify` and `uat` (User Acceptance Testing) workflows that leverage internal verification patterns.
- `gsd-tools.cjs` - Internal CLI tools for GSD management.

## Key Dependencies

- `gh` (GitHub CLI) >= 2.40 - Used for repository management, pull requests, and issues.
- `git` >= 2.40 - Core version control system for tracking all changes.
- Brave Search API - Integrated for web search capabilities.
- NPM/PyPI/Crates.io registries - Referenced for package legitimacy checks.

## Configuration

- Configured via environment variables and project-specific JSON/TOML files.
- Key configs required: `BRAVE_API_KEY` (optional, for web search), LLM API keys (handled by respective agent CLIs).
- `.claude/gsd-file-manifest.json` - Tracks framework file integrity and versions.
- `.codex/config.toml` - Orchestration configuration for Codex agents.

## Platform Requirements

- Cross-platform: Works on Ubuntu/WSL, macOS, and Windows.
- GitHub account and authenticated `gh` CLI required.
- Not applicable (This is a developer toolkit/framework).

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Kebab-case: `gsd-check-update.js`, `verify-doc-links.py`, `07-tech-stack.md`
- JavaScript: camelCase (e.g., `parseCodeReviewFlags`, `gsd_run`)
- Python: snake_case (standard Python PEP 8)
- JavaScript: camelCase (e.g., `stdinTimeout`, `filePath`)
- Python: snake_case (e.g., `errors`, `target`)
- TypeScript: PascalCase (inferred from standard TS practices and `gsd-code-fixer` mentions)

## Code Style

- Indentation: 2 spaces for JavaScript/JSON, 4 spaces for Python (inferred from `scripts/verify_doc_links.py`).
- Semicolons: Used in JavaScript files.
- String Literals: Both single and double quotes observed in JS; single quotes preferred in some shell context.
- Not explicitly configured in root, but mentioned in `gsd-code-reviewer` logic.
- Standard language-specific checks (e.g., `npx tsc --noEmit` for TS, `node -c` for JS).

## Import Organization

- Not extensively detected, but relative paths are common.

## Error Handling

- `try-catch` blocks in JavaScript for parsing and file operations.
- Silent fails (`process.exit(0)`) for non-critical hooks to avoid blocking the user session.
- Informative error messages for the user when parsing fails.
- Exit codes (`sys.exit(1)` in Python, `exit 1` in Shell) to signal failures in scripts and workflows.

## Logging

- `process.stdout.write` and `console.log` for Node.js.
- `print` for Python.
- `echo` for Shell scripts.
- Diagnostic logs often include a banner or specific prefix (e.g., `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`).
- Detailed descriptions of operations in progress (e.g., `◆ Spawning code reviewer...`).

## Comments

- Top of file: Purpose, version, inputs/outputs, and usage instructions.
- Logic-level: Explaining complex conditionals, guard clauses, and non-obvious implementation details.
- Minimal usage in existing hook files, but recommended for exported functions.

## Function Design

- Small to medium-sized functions preferred. Hooks are often organized as one main logic block in simple scripts.
- Often passed as structured objects (e.g., input JSON to hooks).
- Structured JSON objects for hooks and tools (e.g., `{ hookSpecificOutput: { ... } }`).

## Module Design

- CommonJS (`module.exports` or `require`) for Node.js scripts.
- Usage mentioned in `gsd-code-reviewer` but not found in root.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **Command Interface** | Provides user entry points for lifecycle phases. | `.claude/commands/` |
| **Workflow Engine** | Orchestrates tasks using Markdown-defined logic. | `.claude/gsd-core/workflows/` |
| **Specialized Agents** | Perform specific roles (Planner, Executor, Verifier). | `.claude/agents/` |
| **Skill Adapters** | Maps generic workflow commands to platform-specific tools. | `.codex/skills/` |
| **State Management** | Tracks project progress, requirements, and plans. | `.planning/` |

## Pattern Overview

- **Spec-First:** Workflows mandate discussion and planning before execution.
- **Persona-Based:** Tasks are delegated to specialized agents with distinct system prompts.
- **Markdown-Driven:** Logic and instructions are defined in human-readable Markdown files.

## Layers

- Purpose: Entry point for user interaction.
- Location: `.claude/commands/`
- Contains: Slash command definitions.
- Depends on: Workflow Layer.
- Used by: User.
- Purpose: Defines the sequence of steps for a GSD phase.
- Location: `.claude/gsd-core/workflows/`
- Contains: Markdown-based instruction sets and tool call patterns.
- Depends on: Agent Layer.
- Used by: Command Layer.
- Purpose: Defines the specialized behavior and knowledge of AI agents.
- Location: `.claude/agents/`
- Contains: Markdown system prompts.
- Depends on: Infrastructure (LLM runtime).
- Used by: Workflow Layer.

## Data Flow

### Primary Request Path (Phase Execution)

### State Management:

- **Project State:** Managed in `.planning/PROJECT.md` and `.planning/ROADMAP.md`.
- **Phase State:** Each phase has its own directory in `.planning/phases/`.

## Key Abstractions

- Purpose: Encapsulates a high-level capability (e.g., "Add Tests").
- Examples: `.codex/skills/gsd-add-tests/`
- Pattern: Adapter pattern (translating workflow commands to tool calls).
- Purpose: A scripted sequence of agent interactions and tool uses.
- Examples: `.claude/gsd-core/workflows/execute-phase.md`
- Pattern: Scripting/Orchestration.

## Entry Points

- Location: `.claude/commands/gsd/`
- Triggers: User input in the agent terminal.
- Responsibilities: Initialize the appropriate workflow with user arguments.

## Architectural Constraints

- **Platform Dependency:** Agent configurations and command formats are platform-specific (`.claude` vs `.codex`).
- **Markdown Logic:** Workflows rely on the LLM's ability to follow complex instructions embedded in Markdown.
- **Git Integration:** Workflows often assume a Git repository structure and use Git hooks (`.claude/hooks/`).

## Anti-Patterns

### Inline Execution without Planning

## Error Handling

- **Verification Loops:** Workflows (like `plan-phase`) include a verification step where a different agent checks the output.
- **Checkpoints:** State is saved at key steps to allow for recovery or manual correction.

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
