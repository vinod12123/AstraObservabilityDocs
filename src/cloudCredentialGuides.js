// Current customer-facing credential flows. Do not imply that ASTRA supports
// GCP federation or Azure managed/federated identity until those paths exist.
const section = (id, title, blocks) => ({ id, title, blocks });
const text = (value) => ({ type: 'text', value });
const table = (headers, rows) => ({ type: 'table', headers, rows });
const note = (title, value) => ({ type: 'note', title, value });
const steps = (...items) => ({ type: 'steps', items });
const problems = (...items) => ({ type: 'accordion', items });
const resources = (...items) => ({ type: 'resources', items });

export const CLOUD_CREDENTIAL_GUIDES = {
  'collect-data/gcp': {
    type: 'Connection guide', time: '8 min', sections: [
      section('outcome', 'What this connection does', [
        text('ASTRA currently connects to one Google Cloud project using a dedicated service-account JSON key. After verification, it can discover supported project resources and collect the data sources you select: Cloud Monitoring metrics, Cloud Logging warnings and errors, Admin Activity audit logs, and costs from an existing BigQuery billing export. Each source still needs its own Google Cloud API, access grant, and available data.'),
        note('What it does not do', 'Connecting does not create a billing export, enable Google Cloud APIs, turn on missing logs, or collect application traces. Instrument the application or install the appropriate host collector for inside-the-VM telemetry. Workload Identity Federation is not yet an ASTRA onboarding option.'),
      ]),
      section('prerequisites', 'Check access before creating a key', [
        table(['You need', 'If you have it', 'If you do not'], [
          ['ASTRA permission to manage Google Cloud integrations', 'Open Integrations → Google Cloud in the intended ASTRA organization.', 'Ask your ASTRA organization administrator for integration-management access.'],
          ['A Google Cloud project ID and an IAM administrator', 'Confirm the project ID in the Google Cloud console and ask the administrator to approve a dedicated service account.', 'Do not guess a project ID or borrow a personal account key. Ask the project owner.'],
          ['Permission to create a service account, grant scoped read roles, and create a JSON key', 'Create the identity for this connection and review its access with the project owner.', 'An IAM administrator must perform those steps. If organization policy blocks key creation, do not bypass it; this ASTRA flow cannot connect that project yet.'],
          ['Required APIs and optional data sources', 'Enable the APIs for the selected inventory, Monitoring, Logging, audit, and BigQuery data.', 'Ask the project owner to enable and approve them. A valid key alone cannot produce unavailable data.'],
        ]),
        note('Keep key access narrow', 'A service-account key acts like a password for that identity. Grant only the read permissions needed for selected sources, store the downloaded JSON securely, and plan rotation. Never put it in a repository, ticket, or screenshot.'),
      ]),
      section('google-setup', 'Prepare the service account in Google Cloud', [
        steps(
          ['Choose the target project', 'Sign in to the Google Cloud console, select the project you want ASTRA to observe, and copy its Project ID. A project name or numeric project number is not the Project ID field ASTRA requests.'],
          ['Create a dedicated service account', 'Open IAM & Admin → Service Accounts and create an identity for ASTRA observation. Give it a recognizable name; do not use a personal user account.'],
          ['Grant approved read access', 'ASTRA’s form lists Cloud Asset Viewer, Compute Viewer, Monitoring Viewer and Logs Viewer for observation. Have the project IAM owner review and grant the roles needed for your selected sources. Cost additionally needs BigQuery Data Viewer on the export dataset and BigQuery Job User.'],
          ['Enable data APIs and sources', 'Cloud Resource Manager and Compute Engine APIs are needed for ASTRA’s initial verification and region list. Discovery and selected signals also need Cloud Asset Inventory, Cloud Monitoring, Cloud Logging and/or BigQuery APIs and data. For cost, set up the detailed resource-level billing export first.'],
          ['Create one JSON key', 'On the service account, create a new JSON key only if your organization permits it. Download it to a protected location and open it locally when ready to enter the key in ASTRA.'],
        ),
      ]),
      section('astra-form', 'Connect and verify in ASTRA', [
        steps(
          ['Open the form', 'Select Integrations → Google Cloud → Connect Google Cloud. Confirm the ASTRA organization.'],
          ['Enter connection identity', 'Give the connection a recognizable name. Enter the exact Google Cloud Project ID, then paste the entire service-account JSON key into the key field. ASTRA encrypts the key when saved and does not return it in the connection response.'],
          ['Select Verify & load regions', 'ASTRA tests the key against the project and retrieves the available regions. If this fails, check that the JSON belongs to the intended project, the key is active, the required APIs are enabled, and the service account has the requested read permissions.'],
          ['Choose regions and sources', 'Select at least one region. Keep only the Metrics, Logs, Events, and Cost options you intend to collect. Costs require the existing BigQuery billing-export table in project.dataset.table form.'],
          ['Save connection', 'Choose Save connection. ASTRA starts collection on its next interval; verification and save are not proof that every selected signal already has data.'],
        ),
      ]),
      section('verify', 'Confirm data is arriving', [
        steps(
          ['Check the saved project', 'Confirm the project ID, chosen regions, and connection state in Integrations → Google Cloud.'],
          ['Check collection history', 'Open the connection’s job history. A successful verification followed by a failing Monitoring, Logging, or cost job points to that source’s permissions or configuration.'],
          ['Inspect a known resource', 'Open Clouds → Workloads or the relevant Google Cloud view. Find a resource known to exist in the project, then check the timestamp of its newest observation. Check metrics, logs, events, and costs separately.'],
        ),
      ]),
      section('problems', 'If connection or collection fails', [
        problems(
          ['Key cannot be created', 'Your organization may prohibit service-account keys. Do not weaken that policy. Ask the project administrator; ASTRA does not yet offer a keyless GCP connection.'],
          ['Verify & load regions fails', 'Check project ID, key status, service-account project, Cloud Resource Manager and Compute Engine APIs, and projects.get / regions.list access. Do not publish the JSON key while troubleshooting.'],
          ['Inventory appears but logs or metrics do not', 'Verify the corresponding source is selected, its API and permissions are available, data exists, and collection history shows a completed run. Project discovery does not itself create log entries.'],
          ['No cost data', 'Confirm the detailed BigQuery billing export exists, the table name is exact, the service account may read it and run queries, and the export has produced completed billing days.'],
        ),
        resources(
          ['Google Cloud: manage service-account keys', 'https://docs.cloud.google.com/iam/docs/keys-create-delete'],
          ['Google Cloud: service-account key security', 'https://docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys'],
        ),
      ]),
    ],
  },
  'collect-data/azure': {
    type: 'Connection guide', time: '8 min', sections: [
      section('outcome', 'What this connection does', [
        text('ASTRA currently connects to an Azure subscription using a Microsoft Entra application and its client secret. It can discover supported resources and collect the selected Azure Monitor metrics, existing Log Analytics workspace logs, Activity Logs, and Cost Management data when the application has the relevant access. Discovery, each telemetry source, and resource diagnostic routing are separate checks.'),
        note('What it does not do', 'Saving a subscription does not automatically enable resource diagnostics, create application traces, or grant the app access to every workspace or cost view. Federated identity, managed identity, and certificate-based onboarding are not yet choices in this ASTRA form.'),
      ]),
      section('prerequisites', 'Check access and subscription scope', [
        table(['You need', 'If you have it', 'If you do not'], [
          ['ASTRA permission to manage Azure integrations', 'Open Integrations → Azure in the intended ASTRA organization.', 'Ask your ASTRA organization administrator to grant integration-management access.'],
          ['An approved Entra application and client secret', 'Use a dedicated app registration in the tenant that can access the subscription.', 'Ask an Entra administrator to register it and provide the secret Value through an approved secure channel.'],
          ['Subscription read access for the app service principal', 'Have the Azure administrator assign appropriate read access at the target subscription scope.', 'Ask the subscription owner. An app registration alone cannot read subscription resources.'],
          ['Optional workspace, diagnostic, and cost access', 'Confirm the additional access and configuration for each source you select.', 'Leave those sources off until the owner approves and configures them.'],
        ]),
        note('Keep two administrators distinct', 'The Entra app owner can create the application and secret; the Azure subscription owner must authorize access to the subscription. In some organizations these are different people.'),
      ]),
      section('azure-setup', 'Prepare the identity in Azure', [
        steps(
          ['Find the target tenant and subscription', 'In the Azure portal, note the Directory (tenant) ID and Subscription ID. Confirm they belong to the environment you intend to observe.'],
          ['Register an application', 'In Microsoft Entra ID → App registrations, create or select a dedicated application for ASTRA observation. Copy its Application (client) ID.'],
          ['Grant subscription access', 'In the target subscription’s Access control (IAM), have an authorized owner assign the app’s service principal the read role needed for resource discovery and metrics. Review additional Log Analytics and Cost Management access for those selected sources.'],
          ['Create a client secret', 'In the app registration → Certificates & secrets, create a secret with an approved lifetime. Copy the secret Value immediately; its Secret ID is not the credential ASTRA asks for. Protect and rotate the value.'],
          ['Prepare optional logs', 'If you want resource logs, confirm that a Log Analytics workspace and the appropriate diagnostic settings exist. ASTRA’s Service coverage view can explicitly configure supported diagnostics later with separate approval.'],
        ),
      ]),
      section('astra-form', 'Connect and verify in ASTRA', [
        steps(
          ['Open the form', 'Select Integrations → Azure → Connect Azure. Confirm your ASTRA organization.'],
          ['Enter identity fields', 'Enter a recognizable Name, Directory (tenant) ID, Subscription ID, Application (client) ID, and Client secret value. Do not paste the secret ID. ASTRA encrypts the secret when saved.'],
          ['Select Verify credentials & load regions', 'ASTRA requests an application token and loads Azure locations. If this fails, check all IDs, the secret Value and expiry, and the app’s subscription role assignment.'],
          ['Choose regions and sources', 'Select at least one discovery region. Enable only the Metrics, Logs, Activity Logs, and Cost options your administrators have approved. The collection interval controls future polling.'],
          ['Save subscription', 'ASTRA stores the connection and schedules discovery and collection. A successful credential test does not prove every selected log or cost source is available.'],
        ),
      ]),
      section('verify', 'Confirm coverage after saving', [
        steps(
          ['Check the subscription', 'Confirm the saved tenant/subscription identity and connection state in Integrations → Azure.'],
          ['Inspect jobs and Service coverage', 'Review collection history for source-specific errors. Use Service coverage to see discovered resources, available diagnostic categories, and workspaces before enabling any ASTRA-managed diagnostic setting.'],
          ['Inspect real observations', 'Find a resource known to exist in the subscription and compare its latest inventory, metric, log, activity, and cost timestamps separately. Application traces require separate instrumentation.'],
        ),
      ]),
      section('problems', 'If connection or collection fails', [
        problems(
          ['Credential verification fails', 'Confirm tenant ID, app client ID, secret Value rather than Secret ID, expiration, and whether the app is allowed in the target tenant. Ask the Entra owner to rotate an invalid secret.'],
          ['Locations load but resources are missing', 'Confirm the app’s service principal has subscription-scoped read access, the selected regions include the resources, and discovery has completed.'],
          ['No Log Analytics logs', 'Check that a workspace exists, the app can query it, the source has diagnostic routing configured, the Logs option is selected, and new records are being produced. Saving the integration alone does not enable routing.'],
          ['No cost data', 'Check Cost Management access, the Cost option, collection history, and whether the relevant billing period has data.'],
        ),
        resources(
          ['Microsoft: register an app and service principal', 'https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal'],
          ['Microsoft: choose and manage app credentials', 'https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials'],
        ),
      ]),
    ],
  },
};
