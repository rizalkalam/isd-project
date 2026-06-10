# External Integrations

**Analysis Date:** 2026-06-10

## APIs & External Services

**AI Services:**
- Anthropic (Claude Code) - Supported runtime in `.claude/`.
- OpenAI (Codex) - Supported runtime in `.codex/`.
- Google (Gemini CLI) - Current active runtime in `.gemini/`.

## Data Storage

**Databases:**
- None (State is managed via filesystem in `.planning/` directory).

**File Storage:**
- Local filesystem only.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- Custom (Assumed via environment variables or CLI auth).

## Monitoring & Observability

**Error Tracking:**
- None.

**Logs:**
- Console output and local state files.

## CI/CD & Deployment

**Hosting:**
- Local execution.

**CI Pipeline:**
- None detected in this repo.

## Environment Configuration

**Required env vars:**
- AI service API keys (e.g., `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`).

**Secrets location:**
- Not committed; expected in environment.

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

---

*Integration audit: 2026-06-10*
