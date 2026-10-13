// Customer guidance for the current ASTRA AI screens; reports and suggestions are not proof of a fix.
const section = (id, title, blocks) => ({ id, title, blocks });
const text = (value) => ({ type: 'text', value });
const list = (...items) => ({ type: 'list', items });
const table = (headers, rows) => ({ type: 'table', headers, rows });
const steps = (...items) => ({ type: 'steps', items });
const note = (title, value) => ({ type: 'note', title, value });
const links = (...ids) => ({ type: 'links', ids });

export const INTELLIGENCE_GUIDES = {
  'astra-intelligence/intelligence-overview': {
    type: 'Decision guide', sections: [
      section('choose', 'Which ASTRA AI tool should I open?', [
        text('The four tools answer different questions. Begin with the result you need, then check that the relevant data is being collected. AI can organize evidence and propose next steps; it cannot turn missing telemetry into a verified observation.'),
        table(['Your question', 'Open', 'What you get'], [
          ['What did the investigation agents do for this incident?', 'Agents', 'Run result, timeline, risks, and an audit view.'],
          ['What needs attention across my cloud environment?', 'Analyzer', 'A versioned assessment by area with findings, coverage, and priority actions.'],
          ['Could this application error need a code change?', 'Code', 'A repository-grounded proposal and diff that a developer can review before a draft PR.'],
          ['What can available data tell me about this workload or change?', 'Ask ASTRA', 'A scoped conversation with cited evidence, follow-up questions, and limitations.'],
        ]),
      ]),
      section('prepare', 'Check access and evidence first', [
        table(['Tool', 'Access to view', 'Access to start or change'], [
          ['Agents', 'incidents.read', 'incidents.manage for risk actions or agent settings; audit.read for Audit.'],
          ['Analyzer', 'ai.read', 'ai.manage for a new analysis, deeper investigation, or scheduling.'],
          ['Code', 'ai.read', 'ai.manage for proposing, revising, or approving a draft PR.'],
          ['Ask ASTRA', 'ai.manage', 'ai.manage for conversations and history.'],
        ]),
        note('An AI provider is a separate prerequisite', 'AI-backed work needs a working provider in Settings → AI / LLM Providers. Test it there if a request fails. Collection still needs its own integration, host agent, or instrumentation.'),
      ]),
      section('continue', 'Follow a focused walkthrough', [links('astra-agents', 'analyzer', 'code', 'ask-astra')]),
    ],
  },
  'astra-intelligence/astra-agents': {
    type: 'Investigation guide', sections: [
      section('what', 'What are ASTRA agents?', [
        text('ASTRA agents investigate incidents and organize findings from available evidence. They are not the Linux Host Agent installed on a machine: the host agent collects telemetry, while these agents analyze an incident. Their result can help a responder decide what to inspect next, but a proposed action is not permission to change a system.'),
        note('Before you begin', 'Use the correct organization, an incident you are authorized to see, incidents.read permission, and a configured AI provider and agent installation. If telemetry is absent, the agents cannot verify it.'),
      ]),
      section('run-list', 'Find the incident and its agent run', [
        steps(
          ['Open ASTRA AI → Agents', 'The Agents Result tab lists recent runs. Use the time range and scope controls before searching.'],
          ['Find the incident', 'Search by issue, workload, or incident number. Running and queued rows may update while the page is open.'],
          ['Read the row', 'Compare run status, how long it took, agent and tool counts, finding, confidence, and the current incident state.'],
          ['Open the run', 'Select its incident number to see the Flow, Timeline, and Result views. The Incident page remains the place to review or apply a fix.'],
        ),
        note('No run does not mean no incident', 'The investigation mode or installation may not have started ASTRA agents for that incident. Check Settings → Remediation policy and Settings → ASTRA agents before assuming the system is healthy.'),
      ]),
      section('demo-run', 'A real run in the demo environment', [
        text('In the deployed demo observed on 13 October 2026, INC-181 showed a completed investigation: eight agents made 12 checks in 45 seconds and proposed host memory pressure as the cause of scheduler allocation failures. The result showed 76% confidence, while the incident itself was closed. These are example values from one run, not expected results for every incident.'),
        text('The same list also showed a failed run for INC-180 with an HTTP 409 error and no completed checks. An incident can be resolved while its AI investigation failed. Open the run details and the incident separately before drawing a conclusion.'),
      ]),
      section('views', 'Read Flow, Timeline, and Result', [
        table(['View', 'Use it to answer'], [
          ['Flow', 'Which agent worked next, what it handed off, and where the investigation paused or failed?'],
          ['Timeline', 'What was each agent asked, what tools did it call, and what did those checks return? Expand Every step for details.'],
          ['Result', 'What went wrong, what root cause was proposed, how confident was it, what fix was suggested, and what is the incident outcome?'],
        ]),
        text('A confidence label is the model’s estimate, not an accuracy guarantee. Check the original metric, log, trace, incident, or provider record behind a claim. A tool error or missing source makes a conclusion less complete.'),
      ]),
      section('risks-audit', 'Use Risks and Audit responsibly', [
        text('Risks lists conditions noticed before they become incidents, such as a disk predicted to fill, recurring alerts, or agent-version drift. The page shows first seen, last checked, severity, and prevention context. A risk is a prompt to investigate, not proof of failure.'),
        steps(
          ['Open Risks', 'Confirm the affected workload and freshness of the observation.'],
          ['Choose an action if authorized', 'With incidents.manage, Investigate can promote an open critical risk to an incident. Warnings cannot be promoted with that button. Snooze 7 d hides an open risk temporarily.'],
          ['Open Audit if authorized', 'With audit.read, choose a 1-, 7-, 30-, or 90-day window and inspect who or what acted. Export CSV only to an approved location.'],
        ),
      ]),
      section('settings', 'How are agents enabled and controlled?', [
        text('Settings → ASTRA agents shows the specialist catalog, run statistics, and a preview of what may run without a person. A user with incidents.manage can turn specialist agents on or off. The lead and other always-on roles are not toggled there. Settings → Remediation policy controls investigation mode, approvals, execution, and the kill switch.'),
        note('Investigation is not execution', 'Enabling a specialist or reading its recommendation does not grant live remediation. Follow the incident approval flow and verify recovery independently after an authorized action.'),
        links('agent-settings', 'remediation-policy'),
      ]),
      section('trouble', 'If results are absent or unconvincing', [
        table(['Symptom', 'Check next'], [
          ['Agents not configured on this installation', 'Ask the platform operator to confirm the agent service is enabled. A catalog toggle cannot install it.'],
          ['Run failed or stopped early', 'Open Timeline, inspect the failed step, and check the AI provider test and available telemetry.'],
          ['No finding or low confidence', 'Check data freshness, scope, and whether the incident has the relevant metrics, logs, and traces.'],
          ['No automatic fix', 'This can be an appropriate outcome. Review the reason and take the plan to the incident owner.'],
        ]),
      ]),
    ],
  },
  'astra-intelligence/analyzer': {
    type: 'Report guide', sections: [
      section('purpose', 'What Analyzer produces', [
        text('ASTRA Analyzer creates a versioned cloud-environment assessment over a selected period and, when selected, cloud-account scope. It groups evidence by service health, performance, errors and logs, cost, security, reliability and change, and coverage. Use it to prioritize questions across an environment; open each finding’s source before deciding on an action.'),
        note('Access', 'ai.read lets you view reports. ai.manage is required to run a new analysis, investigate a finding, or change its schedule. A connected source and current telemetry are still needed for meaningful coverage.'),
      ]),
      section('run', 'Create your first report', [
        steps(
          ['Open ASTRA AI → Analyzer', 'Confirm the organization. Set the FilterPanel time window and cloud-account scope.'],
          ['Select Run new analysis', 'Available with ai.manage. The analysis may be queued or in progress; the page refreshes while it runs.'],
          ['Open the completed version', 'Each new run is saved as a version; earlier versions remain available in Report version and History.'],
          ['Check the period and generation time', 'A report summarizes the selected lookback period. It is not a continuously updating health signal.'],
        ),
        note('Time window', 'Manual runs use the selected window length, rounded to whole hours and capped at seven days. Choose a window that contains the event you want assessed.'),
      ]),
      section('read', 'Read the report without over-trusting the score', [
        table(['Part', 'What to inspect'], [
          ['Overview', 'Executive summary, priority actions, areas assessed, and the count of open issues.'],
          ['Assessment by area', 'The status and score for each lens. No data means it was not assessed; it is not a healthy score.'],
          ['Area detail', 'Issue severity, affected resource, evidence and recommended next action. Follow links to the source view.'],
          ['History', 'Previous versions and the new, ongoing, worse, or resolved differences between runs.'],
        ]),
        text('An overall score can hide incomplete coverage. First check Areas assessed and Coverage, then review the affected resource and timestamp of the evidence. Compare reports with the same scope and period before interpreting a score change.'),
      ]),
      section('investigate', 'Investigate one finding', [
        steps(
          ['Choose the relevant area', 'For example, select Errors & logs when an application failure is the question.'],
          ['Expand an issue or affected count', 'Read each resource’s details, severity, and change status.'],
          ['Follow the evidence link', 'Confirm the resource identity, observation time, and underlying metric or record.'],
          ['Use Investigate or Ask ASTRA if needed', 'With ai.manage, request a deeper explanation; review its evidence and limitations before acting.'],
          ['Assign a human next step', 'Decide who will validate and own an approved change. A priority action is a recommendation, not an executed fix.'],
        ),
      ]),
      section('schedule', 'Schedule and share reports', [
        text('With ai.manage, Settings on the Analyzer page lets you choose Off, Daily, or Weekly (Monday), set the UTC hour, select a default lookback period, request an ASTRA AI written summary, and choose whether to notify channels about new urgent issues. Save after checking the intended notification audience and AI-provider costs.'),
        text('Use Download PDF only for a completed report. It opens the browser print/PDF flow; check the version, scope, and sensitive content before sharing. A scheduled version may have been generated without a person requesting it.'),
      ]),
      section('trouble', 'If the report is empty or a lens is unavailable', [
        table(['Symptom', 'Check next'], [
          ['No analysis yet', 'Use Run new analysis if you have ai.manage, or ask someone with that permission.'],
          ['No data in one area', 'Check the source integration, collection health, scope, and time range. Do not treat missing data as a passing result.'],
          ['Analysis failed', 'Read the error shown on the page, verify the source services, and retry after correcting the cause.'],
          ['AI summary missing', 'The analysis may still have rule-generated content. Check whether AI summaries are enabled and the provider is verified.'],
        ]),
      ]),
    ],
  },
  'astra-intelligence/code': {
    type: 'Review guide', sections: [
      section('purpose', 'What ASTRA Code can and cannot do', [
        text('ASTRA Code starts from a collected application error, reads an enabled GitHub repository, and proposes file changes. Its draft is reviewable before anything is sent to the repository. Approve and open PR is a real external action: it creates a branch and draft pull request, so treat it like a code change rather than a chat suggestion.'),
        note('Access and ownership', 'ai.read allows viewing repositories and saved proposals; ai.manage is needed to generate, revise, approve, or delete proposals. Use a repository and error source your team owns, and follow your normal code-review and deployment process.'),
      ]),
      section('prepare', 'Prepare a trustworthy error-to-repository match', [
        list('Connect and enable the intended GitHub repository under Integrations → GitHub.', 'Link that repository to the correct log groups or service names when possible. Without source links, ASTRA Code may list errors from every application.', 'Confirm the error is from the code version you intend to change and that log collection is current.', 'Check the selected time window and repository before generating a proposal.'),
        note('Do not send secrets to the model', 'Review error text and repository content for credentials or unnecessary customer data. A model can only reason from the context it receives.'),
      ]),
      section('propose', 'Investigate an error and inspect the proposal', [
        steps(
          ['Open ASTRA AI → Code', 'Choose the repository and a time window. Check the source chips or the warning that its logs are not linked.'],
          ['Select a relevant code error', 'Read severity, source, occurrence count, and message. Infrastructure or network errors may be hidden from the code list.'],
          ['Select Analyze with ASTRA AI', 'ASTRA may reopen a saved proposal for the same error without a new model run; use Propose a fresh fix only when you need a new analysis.'],
          ['Review What ASTRA found', 'Check the root-cause hypothesis, confidence, risk, files read, repository exploration, and any error about repository access.'],
          ['Review every change', 'Inspect the diff, affected files, change plan and test plan. Disable or edit a proposed file only after a developer validates the outcome.'],
        ),
        note('No safe patch is a valid outcome', 'If the provider fails, the repository cannot be read, or no safe fix can be determined, do not approve an empty or irrelevant proposal merely to get a PR. Resolve the underlying issue first.'),
      ]),
      section('approve', 'Review feedback, then open a draft PR', [
        steps(
          ['Ask for a revision if needed', 'Use Review feedback to request a different approach, a missing test, or a smaller scope. The draft is revised before repository changes.'],
          ['Verify the reviewed file list', 'Only enabled file changes are sent. Review commit message and PR title.'],
          ['Select Approve and open PR', 'This creates a branch and draft PR in the connected repository; it does not merge or deploy the code.'],
          ['Review the PR in GitHub', 'Check the full diff, tests, ownership and security impact under your normal review rules.'],
        ),
        note('Approval is consequential', 'The proposal is not a verified fix. A human must decide whether the PR should be merged and deployed. Do not approve simply because the AI labeled confidence high.'),
      ]),
      section('after', 'Follow the PR, pipeline, and incident', [
        text('The proposal page can show pipeline checks and an associated ASTRA incident or external ticket. Sync PR status & update incident refreshes the current state. If a pipeline fails, Fix pipeline failure with ASTRA AI can read failure output and push another commit to the PR; use it only after reviewing that external change and its authorization.'),
        text('After a reviewed merge and deployment, verify the original error pattern, application behavior, and collection health. A quiet error page is not proof of recovery if logs stopped arriving. Follow the incident and ticket to their actual resolution state.'),
      ]),
      section('trouble', 'When a proposal or PR is missing', [
        table(['Symptom', 'Check next'], [
          ['No repository is listed', 'Check that the GitHub integration is enabled and your role can access it.'],
          ['Errors look unrelated', 'Link the repository to its actual log groups or services and confirm the time window.'],
          ['Repository could not be read', 'Check GitHub authorization, repository access, and the displayed grounding error.'],
          ['No file changes produced', 'Review the notes and error context; a safe code change may not be supported for this incident.'],
          ['PR creation or CI failed', 'Read the specific failure. Avoid repeated approval clicks; inspect the existing branch or PR first.'],
        ]),
      ]),
    ],
  },
  'astra-intelligence/ask-astra': {
    type: 'Conversation guide', sections: [
      section('purpose', 'Use Ask ASTRA for a question, not an unreviewed fix', [
        text('Ask ASTRA can discuss authorized workload, incident, repository, telemetry, and documentation context in natural language. It may ask a clarifying question, gather evidence through tools, and suggest what to inspect next. The chat does not itself apply a remediation or change a cloud resource.'),
        note('Access', 'The chat requires ai.manage. If the composer says AI access is disabled, ask an organization administrator to review your role. A configured and tested AI provider may also be needed for model-backed answers.'),
      ]),
      section('question', 'Ask a question ASTRA can check', [
        table(['Too broad', 'More useful'], [
          ['Why is production broken?', 'For checkout-service, what changed between 14:00 and 14:30 UTC, and which logs or traces support the top hypothesis?'],
          ['Fix this server.', 'What evidence explains the CPU increase on this workload, and what should its owner verify before acting?'],
          ['Are there no errors?', 'Is error-log collection current for this service, and what errors were recorded in the selected hour?'],
        ]),
        steps(
          ['Open Ask ASTRA', 'Start a new chat or choose a starter prompt.'],
          ['Name the scope', 'Specify organization context, workload or service, and time interval. If discussing a Code proposal or investigation, confirm the context chip and repository.'],
          ['State the desired output', 'Ask for observed facts, uncertainties, and the next evidence to check—not merely a confident-sounding conclusion.'],
          ['Answer follow-up questions', 'Choose a provided option or type the missing detail. Then check whether the answer used the intended scope.'],
        ),
      ]),
      section('evidence', 'Read an answer critically', [
        table(['Shown in the conversation', 'How to interpret it'], [
          ['Scope', 'Check that ASTRA examined the workload, source, and time you meant.'],
          ['Cited evidence', 'Model-supplied citations; verify record IDs, timestamps, and the original source before relying on them.'],
          ['Evidence gathered', 'Tool calls made during the answer. A failed call means some information may be missing.'],
          ['Model confidence', 'The model’s confidence label, not a measured accuracy score.'],
          ['Warnings and recommendations', 'Suggestions only. ASTRA has not changed your systems through chat.'],
        ]),
        note('General guidance versus observed data', 'A documentation-based explanation can tell you how a feature works, but it is not proof that your tenant has a healthy integration or that a workload has no errors. Ask for the specific observation and check it in the product.'),
      ]),
      section('history', 'Continue or remove a conversation', [
        text('Recent conversations appear beside the chat. All chats opens your searchable conversation history. Open a saved chat to continue the same thread. Delete removes a conversation; the history page can delete selected chats or all chats after confirmation. These deletions cannot be undone.'),
        note('Privacy', 'Do not paste API keys, passwords, private keys, or unreviewed customer payloads into prompts. Share only the operational context necessary for the question.'),
      ]),
      section('trouble', 'If the answer is missing or weak', [
        table(['Symptom', 'Check next'], [
          ['AI access is disabled', 'Confirm ai.manage with an organization administrator.'],
          ['Request fails or fallback answer appears', 'Test the selected provider in Settings → AI / LLM Providers; check the displayed error.'],
          ['No cited evidence', 'Check source connection, collection health, access, filters, and time window. Ask what data was actually available.'],
          ['Answer discusses the wrong repository or incident', 'Start from the intended Code or investigation context, or correct the scope in the next message.'],
        ]),
      ]),
    ],
  },
};
