# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Quality Gates

Run the normal quality gates after code changes:

```bash
npm run typecheck
npm run lint
npm run build
```

Use **Fallow** for advisory architecture and dead-code scans:

```bash
npm run fallow
npm run fallow:json
npm run fallow:dead-code
npm run fallow:dupes
npm run fallow:health
```

Fallow is currently warning-first. Treat findings as architecture/debt review input before promoting any rule to a hard gate.

## Landing the Plane (Session Completion)

## QA Agent Workflow

- After implementing or changing a public Prism component, playground story, or behavior-heavy UI flow, run normal quality gates first, then launch a read-only QA agent review before calling the work complete.
- The QA agent should verify the user-facing goal, practical interaction coverage, and workflow wiring. Fix any blocking QA findings, re-run quality gates, and only then close the related bead.
- For visual/gameplay playground validation, QA must explicitly check that the relevant `src/playground/stories` entry matches the component being validated.

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
