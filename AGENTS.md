# Palate PWA — Agent Guidelines & Repository Rules

## Mandatory Continuous GitHub Synchronization
- **Always update the GitHub repository**: After completing any task, bugfix, feature, or refactor in this project, you must proactively:
  1. Verify the production build passes with `npm run build`.
  2. Stage all modifications (`git add .`).
  3. Create a clear, descriptive commit message following conventional commits format (e.g. `feat: ...`, `fix: ...`, `refactor: ...`).
  4. Push directly to the remote repository (`git push origin main`).
  5. Confirm working tree cleanliness before concluding the turn.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
