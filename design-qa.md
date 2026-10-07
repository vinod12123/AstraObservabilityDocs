# ASTRA Docs editorial refresh QA

## Scope and sources

- Customer-facing standalone docs only; the Observability application was not modified.
- Design inspiration: Dynatrace documentation homepage (https://docs.dynatrace.com/docs/) and user-provided Fleet Management / QuickStart screenshots. ASTRA branding, icons, theme tokens and navigation remain our own. No generated mock images were incorporated into the site.
- Product facts: local ASTRA UI and channel configuration source. No Dynatrace product claims copied.
- Real product screenshots: `public/guides/` (10 PNGs). Account names and identifying data were redacted before capture; existing table rows blurred; secret fields empty. No connection was saved or notification sent.
- Empty telemetry screens are explicitly described as empty states, not successful collection evidence.

## Layout and behavior

- Four sidebar groups and expandable child guides; article headings live in the right-hand contents list or a collapsible mobile contents menu rather than being duplicated in the sidebar.
- Reading-first articles, field tables, steps, callouts, troubleshooting accordions, tabs and checklists replace the uniform card layout.
- All 68 published pages now resolve to authored content. The generic article fallback is removed. Depth varies by topic; this is not an exhaustive operational specification for every platform feature.
- Home now separates learning the product, choosing a collection/investigation/response path, filterable practical guides, and precise reference lookups.
- Removed hardcoded completion and update-date claims. Reading time is estimated from article content.
- Desktop 1440 × 1000 and mobile 390 × 844 reviewed in Edge.
- Theme switch, SMTP search, Quickstart tabs and image zoom verified.
- Section links preserve the page route and can be reloaded/shared. Page titles update per article.
- Search opens one focused result panel, supports arrow/Enter/Escape, closes after selection, and ranks direct/repeated topic matches above passing mentions.
- Mobile check found no horizontal overflow. Long section labels were changed to wrap.

## Evidence and validation

- Current QA captures: `D:/ob-1/handbook-home.png`, `handbook-concept.png`, `handbook-reference.png`, `handbook-troubleshooting.png`, `handbook-dark.png`, `handbook-mobile.png`.
- Production build passed.
- Existing packaging tests: 4 passed.
- Guide-content tests cover navigation, unique anchors, authored coverage, screenshot assets, supported block renderers, link targets, SMTP instructions and OTLP reference fields.
- Browser route sweep checked all 68 article titles, home filters, SMTP search selection/dismissal, section reloads and mobile horizontal overflow.
- `git diff --check` passed (Windows line-ending warning is informational).

## Limitations

## Real product screenshots — 7 October 2026

- Added 20 real screenshots from the authenticated local customer portal, mapped to the corresponding collection, infrastructure, application, trace, monitoring, dashboard, reporting, cost, AI, and administration guides.
- Existing SMTP and notification-channel screenshots remain. No generated images or fabricated telemetry were used.
- Names, email addresses, resource identifiers, record rows, endpoint/code fields, and the monitoring timeline were masked in the browser before capture. Each final capture was visually inspected before copying into `public/guides/product/`.
- Empty and unconfigured states are explicitly described in captions; they are not presented as successful live integrations or completed analyses.
- No integrations, users, monitors, or settings were created or modified for this screenshot update.
- Each new figure has an explanatory caption, task-specific reading pointers, and the existing enlargement dialog.
- All 20 screenshot routes loaded successfully in the local preview; enlargement opened correctly; 390px mobile layout had no horizontal overflow.
- QA evidence: `D:/ob-1/docs-product-desktop.png`, `docs-product-zoom.png`, and `docs-product-mobile.png`.
- Production build passed; all 12 content/packaging tests passed; `git diff --check` passed.

## Remaining limitations

- No live third-party SMTP/channel deliveries were attempted.
- Screenshots and route tests do not establish full accessibility compliance. Screen-reader behavior and end-to-end third-party workflows remain separate validation work.
- No telemetry was fabricated to populate screenshots.
- Vercel was not deployed; local edits must be reviewed and published separately.
- Internal deployment, EC2 and local developer setup instructions remain outside the customer guides.
