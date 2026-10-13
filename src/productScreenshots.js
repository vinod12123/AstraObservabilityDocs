// Product captures only; a live pair is used only after both themes and page content are verified.
const LIVE_CAPTURED = new Set([
  'topology', 'monitoring', 'synthetics', 'incidents', 'requests', 'traces',
  'errors', 'services', 'databases', 'network', 'roles', 'host-agents',
  'opentelemetry', 'agents', 'analyzer', 'code', 'ask-astra', 'reports', 'administration',
]);
const screen = (asset, title, caption, items, variants = {}) => ({
  id: 'product-screen', title,
  blocks: [
    { type: 'image',
      src: `/guides/product/${asset}${LIVE_CAPTURED.has(asset) ? '-dark' : ''}.png`,
      ...(LIVE_CAPTURED.has(asset) ? {
        appDarkSrc: `/guides/product/${asset}-dark.png`,
        appLightSrc: `/guides/product/${asset}-light.png`,
      } : {}),
      title, ...variants,
      caption: `${LIVE_CAPTURED.has(asset) ? 'ASTRA demo capture from 13 October 2026.' : 'Actual ASTRA interface.'} ${caption} Select the image to enlarge.` },
    { type: 'list', items },
  ],
});

export const PRODUCT_SCREENS = {
  'astra-intelligence/astra-agents': screen('agents', 'Review recent agent runs', 'This list contains populated demo investigations; incident IDs and findings are examples, not expected outcomes.', [
    'Set scope and time range first. Each row connects an incident to the agent checks, findings, run status, and current incident state.',
    'A completed agent run is not the same as a resolved incident. Inspect the linked incident and evidence before deciding what to do next.',
  ]),
  'infrastructure/topology': screen('topology', 'Orient yourself in the topology view', 'The demo graph shows discovered resources and relationships in the selected scope.', [
    'Start with scope and time before changing the graph layout. A layout change rearranges evidence; it does not discover missing resources.',
    'Use the map, view, and region controls to narrow the question. The filters panel and layout choices help make a populated map readable.',
  ]),
  'monitoring/triage': screen('monitoring', 'Read current state alongside recent changes', 'The demo shows active checks and their current severity.', [
    'Critical, Warning, Passing, and No data describe different outcomes. Passing applies to the monitored population, not every system in your organization.',
    'Firing now helps prioritize the current response. By application and Recent state changes provide different context: current grouping versus transitions.',
  ]),
  'monitoring/synthetics': screen('synthetics', 'Find your HTTP, TCP, and DNS checks', 'HTTP and TCP monitors are active in this demo; DNS has none configured.', [
    'Use the protocol categories to distinguish an HTTP response check from TCP connectivity or DNS resolution.',
    'Start from New monitor when you have an approved target and a clear expected result. An empty list is not evidence that an endpoint passed a check.',
  ]),
  'dashboards-reports/dashboards': screen('dashboards', 'Choose the question your dashboard should answer', 'The local dashboard has no cloud-account data in this scope.', [
    'Use the scope and time controls consistently when comparing cards. An empty overview is a collection or selection question before it is a health conclusion.',
    'Customize adjusts the view; New dashboard starts another dashboard. Choose a recurring operational question before adding more panels.',
  ]),
  'monitoring/incidents': screen('incidents', 'Locate the incident response list', 'The list contains incidents with different response states and investigation results.', [
    'Use the list and its status controls to find the response you intend to review, rather than treating a count alone as incident detail.',
    'Confirm the time and scope before concluding that no incident exists. A zero count here does not prove that every telemetry source is healthy.',
  ]),
  'applications/requests': screen('requests', 'Move from request overview to a specific question', 'The overview has request volume, error rate, latency, and operation rows for this demo window.', [
    'Overview summarizes the window; Operations, Map, Browser, Jobs & queues, and Coverage provide more specific entry points.',
    'Open an operation to follow its request evidence. A host reporting metrics alone does not populate this view; application tracing does.',
  ]),
  'telemetry/traces': screen('traces', 'Narrow a trace investigation', 'The selected demo window contains trace rows from several services.', [
    'Service, operation, status, and duration filters narrow the trace set. Clear filters is useful when a narrow selection hides expected requests.',
    'An empty result is not a latency measurement. Check instrumentation, exporter delivery, sampling, and identity before interpreting the summary cards.',
  ]),
  'applications/errors': screen('errors', 'Use issue grouping to find repeated failures', 'No matching error issues appear in this window.', [
    'Issues groups records by message pattern. Total errors and Distinct issues answer different questions: volume versus grouped patterns.',
    'Use scope, workload, time, and Exceptions only deliberately. A restrictive selection can exclude an otherwise relevant record.',
  ]),
  'applications/services': screen('services', 'Review instrumented services', 'The demo has instrumented services with request rate and latency values.', [
    'APM summarizes services, requests, error rate, and latency for the selected window. It needs application evidence, not simply a discovered machine.',
    'Compare request count with error rate and latency before declaring a service healthy. Open a service to inspect operations and traces.',
  ]),
  'infrastructure/databases': screen('databases', 'Separate discovered instances from engine telemetry', 'The demo combines discovered cloud resources and host-reported database processes.', [
    'A cloud-discovered instance and a host-reported process have different evidence. Check the source and populated columns before comparing them.',
    'Engine collectors is the setup entry point for deeper database signals. A dash means that metric is unavailable here, not zero.',
  ]),
  'infrastructure/network': screen('network', 'Read network coverage before traffic', 'The demo includes networks, subnets, gateways, and hosts; the flow-log warning explains a coverage limit.', [
    'The overview distinguishes networks, subnets, gateways, load balancers, firewalls, edge/DNS, and Agent hosts.',
    'Traffic & cost is a separate investigation from resource inventory. Flow-derived traffic and transfer estimates require the relevant source data.',
  ]),
  'costs/unit-economics': screen('unit-economics', 'Check reconciliation before using cost figures', 'Customer-attributed cost is unavailable in this local view; it is not a completed cost analysis.', [
    'Read the availability messages beside cost cards. Unavailable, a dash, and a measured zero are not interchangeable.',
    'Expand Daily cost and request reconciliation and Data quality and charging limitations before drawing conclusions. Dimension tabs are alternative views of spend, not amounts to add together.',
  ]),
  'administration/roles': screen('roles', 'Locate roles and their permission definitions', 'The built-in Organization Admin role and its permission groups are visible.', [
    'Roles & permissions lists built-in roles separately from the New role action. The selected built-in role is shown as fixed, not editable.',
    'Review a role’s intended responsibility before assigning access. A permission catalogue is not a reason to grant every role to every user.',
  ]),
  'collect-data/host-agent': screen('host-agents', 'Find installation and reporting status', 'The demo lists reporting host agents, versions, and signal freshness.', [
    'Install agent opens the organization’s setup flow. Use your own approved endpoint and key; nothing in this screenshot is an installation credential.',
    'Installed, Reporting, Stale, and Versions help distinguish presence from freshness. Verify the first accepted telemetry after installation.',
  ]),
  'collect-data/opentelemetry': screen('opentelemetry', 'Find endpoints and language-specific examples', 'The endpoint and example use placeholders for ingest keys; copy your own organization values.', [
    'Endpoint separates the base URL from signal-specific paths. Copy the values from your own organization, not from a documentation image.',
    'Instrument an application provides runtime tabs. Use the matching example and appropriate ingest scope, then verify each enabled signal independently.',
  ]),
  'collect-data/aws': screen('aws', 'Find the AWS connection flow', 'No active AWS connection is configured in this captured view.', [
    'Add connection starts onboarding. Active and Disabled / archived separate connection states; search narrows the account list.',
    'Select an existing connection to inspect its detail. Confirm its identity and supported collection capabilities before assuming every signal is available.',
  ]),
  'astra-intelligence/analyzer': screen('analyzer', 'Review an Analyzer report', 'The demo shows a generated report with an overall assessment and evidence areas.', [
    'Choose the intended scope and time range before Run new analysis. The result is only as useful as the evidence and coverage available for that selection.',
    'A generated report is not a guarantee that every source is covered. Open each assessment area and check its evidence before using its score.',
  ]),
  'astra-intelligence/code': screen('code', 'Inspect the repository analysis view', 'The selected repository has source filters but no completed analysis in this captured state.', [
    'Select a repository and time range before looking for error evidence. A listed source is not proof of an error in that window.',
    'Analyze with ASTRA AI needs a selected error; the proposal remains a suggestion to review, not an automatic code change.',
  ]),
  'astra-intelligence/ask-astra': screen('ask-astra', 'Start an investigation with a focused question', 'This is the initial chat view, not an AI-generated answer or a completed investigation.', [
    'The suggested questions help frame platform investigations. Include the affected system and time window without pasting secrets.',
    'Use the response as a starting point and follow its evidence. Distinguish observed facts from general guidance or a hypothesis.',
  ]),
  'dashboards-reports/reports': screen('reports', 'Choose a report and check its data prerequisites', 'A cost report is populated in this demo; verify its basis and reconciliation before relying on the figures.', [
    'Report categories on the left help choose a question. Read the selected report’s description: some reports use current state rather than the displayed time range.',
    'CSV and Print are output actions, not proof the report contains data. Check the source prerequisites and scope before exporting or sharing.',
  ]),
  'administration/members': screen('administration', 'Find organization users and groups', 'Names and email addresses are covered in this read-only capture; no user or group was changed.', [
    'Users and Groups are separate tabs. Search helps locate an existing member before making an authorized change.',
    'The table keeps role, group, status, and action context together. Review the access consequence before creating a user or changing membership.',
  ]),
};
