# Prototype Instructions

## Customer documentation preferences

Do not generate design images unless explicitly requested. Implement requested updates directly in the existing code. Explain what each feature is, why it helps a customer, and how to interpret results. Do not restore generic repeated "Follow the workflow / What to explore" article fallbacks, fabricated reading-progress indicators, or unverified release dates. Prefer task-specific explanations, examples, tables, and troubleshooting guidance over padding pages with repeated prose.

Use varied, task-oriented articles instead of repeating one card template. Preserve ASTRA icons and expandable sidebar navigation, support light/dark themes, and include concrete field-by-field workflows. Use actual product screenshots only after removing sensitive identifiers and credentials. Keep internal deployment and developer runbooks out of customer documentation. Dynatrace is a layout reference, not a source for ASTRA feature claims.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
