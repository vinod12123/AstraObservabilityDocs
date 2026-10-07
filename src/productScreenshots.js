// Real local-product captures. Redaction happens before capture; no synthetic telemetry.
const screen = (asset, title, caption, items) => ({
  id: 'product-screen', title,
  blocks: [
    { type: 'image', src: `/guides/product/${asset}.png`, title,
      caption: `Actual ASTRA interface. ${caption} Identifying details are obscured. Select the image to enlarge.` },
    { type: 'list', items },
  ],
});

export const PRODUCT_SCREENS = {
  'infrastructure/topology': screen('topology', 'Orient yourself in the topology view', 'This capture has no graph results in the selected scope; it is not a populated dependency example.', [
    'Start with scope and time before changing the graph layout. A layout change rearranges evidence; it does not discover missing resources.',
    'Use the map, view, and region controls to narrow the question. The filters panel and layout choices help make a populated map readable.',
  ]),
  'monitoring/triage': screen('monitoring', 'Read current state alongside recent changes', 'The local view contains monitored resources; application rows and the recent-change timeline are masked.', [
    'Critical, Warning, Passing, and No data describe different outcomes. Passing applies to the monitored population, not every system in your organization.',
    'Firing now helps prioritize the current response. By application and Recent state changes provide different context: current grouping versus transitions.',
  ]),
  'monitoring/synthetics': screen('synthetics', 'Find your HTTP, TCP, and DNS checks', 'No synthetic monitors are configured in this captured view.', [
    'Use the protocol categories to distinguish an HTTP response check from TCP connectivity or DNS resolution.',
    'Start from New monitor when you have an approved target and a clear expected result. An empty list is not evidence that an endpoint passed a check.',
  ]),
  'dashboards-reports/dashboards': screen('dashboards', 'Choose the question your dashboard should answer', 'The local dashboard has no cloud-account data in this scope.', [
    'Use the scope and time controls consistently when comparing cards. An empty overview is a collection or selection question before it is a health conclusion.',
    'Customize adjusts the view; New dashboard starts another dashboard. Choose a recurring operational question before adding more panels.',
  ]),
  'monitoring/incidents': screen('incidents', 'Locate the incident response list', 'No incidents are present in this captured selection.', [
    'Use the list and its status controls to find the response you intend to review, rather than treating a count alone as incident detail.',
    'Confirm the time and scope before concluding that no incident exists. A zero count here does not prove that every telemetry source is healthy.',
  ]),
  'applications/requests': screen('requests', 'Move from request overview to a specific question', 'No requests were observed in the selected window.', [
    'Overview summarizes the window; Operations, Map, Browser, Jobs & queues, and Coverage provide more specific entry points.',
    'The empty-state instructions point to instrumentation. A host reporting metrics alone does not populate request evidence.',
  ]),
  'telemetry/traces': screen('traces', 'Narrow a trace investigation', 'The selected scope and window contain no traces.', [
    'Service, operation, status, and duration filters narrow the trace set. Clear filters is useful when a narrow selection hides expected requests.',
    'An empty result is not a latency measurement. Check instrumentation, exporter delivery, sampling, and identity before interpreting the summary cards.',
  ]),
  'applications/errors': screen('errors', 'Use issue grouping to find repeated failures', 'No matching error issues appear in this window.', [
    'Issues groups records by message pattern. Total errors and Distinct issues answer different questions: volume versus grouped patterns.',
    'Use scope, workload, time, and Exceptions only deliberately. A restrictive selection can exclude an otherwise relevant record.',
  ]),
  'applications/services': screen('services', 'Recognize an uninstrumented APM view', 'No traces have been received for the displayed selection; configuration snippets are obscured.', [
    'APM summarizes services, requests, error rate, and latency for the selected window. It needs application evidence, not simply a discovered machine.',
    'Use the empty-state guidance to establish tracing, then confirm explicit service identity. Do not read a displayed zero error rate without any requests as a health guarantee.',
  ]),
  'infrastructure/databases': screen('databases', 'Separate discovered instances from engine telemetry', 'The local view has discovered instances but no engine-level database, table, or index data. Instance rows are masked.', [
    'Database instances can be discovered before engine collectors are connected. The instance count is not proof that internal database statistics are available.',
    'Engine collectors is the setup entry point. Inspect collection coverage before interpreting CPU, connections, memory, or storage columns.',
  ]),
  'infrastructure/network': screen('network', 'Read network coverage before traffic', 'No network resources are discovered in this captured selection.', [
    'The overview distinguishes networks, subnets, gateways, load balancers, firewalls, edge/DNS, and Agent hosts.',
    'Traffic & cost is a separate investigation from resource inventory. Flow-derived traffic and transfer estimates require the relevant source data.',
  ]),
  'costs/unit-economics': screen('unit-economics', 'Check reconciliation before using cost figures', 'Customer-attributed cost is unavailable in this local view; it is not a completed cost analysis.', [
    'Read the availability messages beside cost cards. Unavailable, a dash, and a measured zero are not interchangeable.',
    'Expand Daily cost and request reconciliation and Data quality and charging limitations before drawing conclusions. Dimension tabs are alternative views of spend, not amounts to add together.',
  ]),
  'administration/roles': screen('roles', 'Locate roles and their permission definitions', 'The built-in role view is shown; permission details and field values are obscured.', [
    'Roles & permissions lists built-in roles separately from the New role action. The selected built-in role is shown as fixed, not editable.',
    'Review a role’s intended responsibility before assigning access. A permission catalogue is not a reason to grant every role to every user.',
  ]),
  'collect-data/host-agent': screen('host-agents', 'Find installation and reporting status', 'No host Agents have reported in this captured organization view.', [
    'Install agent opens the organization’s setup flow. Use your own approved endpoint and key; nothing in this screenshot is an installation credential.',
    'Installed, Reporting, Stale, and Versions help distinguish presence from freshness. Verify the first accepted telemetry after installation.',
  ]),
  'collect-data/opentelemetry': screen('opentelemetry', 'Find endpoints and language-specific examples', 'The local integration has no received sources; endpoints and code samples are obscured.', [
    'Endpoint separates the base URL from signal-specific paths. Copy the values from your own organization, not from a documentation image.',
    'Instrument an application provides runtime tabs. Use the matching example and appropriate ingest scope, then verify each enabled signal independently.',
  ]),
  'collect-data/aws': screen('aws', 'Find the AWS connection flow', 'No active AWS connection is configured in this captured view.', [
    'Add connection starts onboarding. Active and Disabled / archived separate connection states; search narrows the account list.',
    'Select an existing connection to inspect its detail. Confirm its identity and supported collection capabilities before assuming every signal is available.',
  ]),
  'astra-intelligence/analyzer': screen('analyzer', 'Select the evidence window before analysis', 'No analysis has been run in this captured view.', [
    'Choose the intended scope and time range before Run new analysis. The result is only as useful as the evidence and coverage available for that selection.',
    'Download PDF is unavailable here because there is no report yet. This image demonstrates the starting state, not a completed diagnosis.',
  ]),
  'astra-intelligence/ask-astra': screen('ask-astra', 'Start an investigation with a focused question', 'This is the initial chat view, not an AI-generated answer or a completed investigation.', [
    'The suggested questions help frame platform investigations. Include the affected system and time window without pasting secrets.',
    'Use the response as a starting point and follow its evidence. Distinguish observed facts from general guidance or a hypothesis.',
  ]),
  'dashboards-reports/reports': screen('reports', 'Choose a report and check its data prerequisites', 'The selected cost report has no cost run available.', [
    'Report categories on the left help choose a question. Read the selected report’s description: some reports use current state rather than the displayed time range.',
    'CSV and Print are output actions, not proof the report contains data. Check the source prerequisites and scope before exporting or sharing.',
  ]),
  'administration/members': screen('administration', 'Find organization users and groups', 'The user row is obscured; no user or group was created or changed for this capture.', [
    'Users and Groups are separate tabs. Search helps locate an existing member before making an authorized change.',
    'The table keeps role, group, status, and action context together. Review the access consequence before creating a user or changing membership.',
  ]),
};
