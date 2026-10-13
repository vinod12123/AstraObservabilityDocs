// Customer-facing credential flows. Use deployment-specific trust values shown in ASTRA;
// never publish a customer ID, credential, or generated issuer value here.
const section = (id, title, blocks) => ({ id, title, blocks });
const text = (value) => ({ type: 'text', value });
const table = (headers, rows) => ({ type: 'table', headers, rows });
const note = (title, value) => ({ type: 'note', title, value });
const steps = (...items) => ({ type: 'steps', items });
const links = (...ids) => ({ type: 'links', ids });
const problems = (...items) => ({ type: 'accordion', items });
const resources = (...items) => ({ type: 'resources', items });

export const CLOUD_CREDENTIAL_GUIDES = {
  'collect-data/azure': {
    type: 'Start here', time: '5 min', sections: [
      section('outcome', 'What an Azure connection gives you', [text('ASTRA can discover supported resources in one Azure subscription and collect selected Azure Monitor metrics, Activity Logs, existing Log Analytics data, and Cost Management data when the app has each source’s required access. A connected app does not automatically enable diagnostics, create logs, or instrument applications.'), note('Three setup choices, two credential types', 'Azure portal and Azure CLI both create an Entra app with a client secret. Workload Identity Federation uses short-lived ASTRA identity assertions instead; it does not need an Azure client secret.')]),
      section('choose', 'Choose one procedure', [links('azure-portal', 'azure-cli', 'azure-federation'), table(['Your situation', 'Use'], [['You can work in the Azure portal or an administrator will do it for you', 'Azure portal'], ['You have Azure CLI, PowerShell, and permission to create apps, roles, and secrets', 'Azure CLI'], ['Your team avoids client secrets and can configure an external OIDC trust', 'Workload Identity Federation']]), note('Different administrators may be needed', 'Your ASTRA user needs permission to manage integrations. Separately, an Entra app owner or administrator must create the app, and a subscription owner or equivalent must assign Reader. If you lack either Azure permission, ask the corresponding administrator; ASTRA cannot grant it.')]),
      section('after', 'Verify the result', [steps(['Test access', 'In the chosen ASTRA method, use Verify credentials/federation & load regions. This checks authentication and lists Azure locations.'], ['Choose collection', 'Select at least one region and only the sources you intend to collect, then Save subscription.'], ['Inspect collection history', 'Check jobs and a known resource. Inventory, metrics, logs, and cost should be checked separately. Logs and cost may need additional permissions and pre-existing data.'])]),
    ],
  },
  'collect-data/gcp': {
    type: 'Start here', time: '5 min', sections: [
      section('outcome', 'What a Google Cloud connection gives you', [text('ASTRA connects to one Google Cloud project and can discover supported resources and collect selected Monitoring metrics, Logging warnings and errors, Admin Activity logs, and costs from an existing detailed BigQuery billing export. Each selected source needs its API, read permissions, and available data. Connecting does not create exports, enable APIs, or instrument applications.'), note('Two credential choices', 'The JSON-key method stores an encrypted long-lived service-account key. Workload Identity Federation exchanges short-lived ASTRA OIDC assertions and stores no Google private key. The console, gcloud, and Terraform are ways to provision the same JSON-key identity, not separate ASTRA authentication methods.')]),
      section('choose', 'Choose one procedure', [links('gcp-key', 'gcp-federation'), table(['Your situation', 'Use'], [['Your organization permits service-account JSON keys and you need a simpler first setup', 'Service-account JSON key'], ['Your organization prohibits keys or requires short-lived credentials, and you can configure an OIDC provider', 'Workload Identity Federation']]), note('Permissions are separate', 'Your ASTRA user needs permission to manage integrations. A Google Cloud IAM administrator must create or approve the service account, read roles, and either a key or federation trust. If you lack these permissions, hand the relevant guide to that administrator.')]),
      section('after', 'Verify the result', [steps(['Test access', 'In ASTRA use Verify & load regions or Verify federation & load regions. A successful test authenticates and lists regions, but does not prove every data source works.'], ['Choose collection', 'Select at least one region, intended sources, and an interval. Cost requires the existing detailed billing export table. Save connection.'], ['Inspect collection history', 'Check a known resource and each selected signal independently. A source-specific failure often means missing API, role, or data.'])]),
    ],
  },
  'collect-data/gcp-key': {
    type: 'Connection guide', time: '8 min', sections: [
      section('outcome', 'What this connection does', [
        text('This method connects one Google Cloud project using a dedicated service-account JSON key. After verification, ASTRA can discover supported project resources and collect the data sources you select: Cloud Monitoring metrics, Cloud Logging warnings and errors, Admin Activity audit logs, and costs from an existing BigQuery billing export. Each source still needs its own Google Cloud API, access grant, and available data.'),
        note('What it does not do', 'Connecting does not create a billing export, enable Google Cloud APIs, turn on missing logs, or collect application traces. Instrument the application or install the appropriate host collector for inside-the-VM telemetry. If your organization prohibits JSON keys, choose the separate Workload Identity Federation method.'),
      ]),
      section('prerequisites', 'Check access before creating a key', [
        table(['You need', 'If you have it', 'If you do not'], [
          ['ASTRA permission to manage Google Cloud integrations', 'Open Integrations → Google Cloud in the intended ASTRA organization.', 'Ask your ASTRA organization administrator for integration-management access.'],
          ['A Google Cloud project ID and an IAM administrator', 'Confirm the project ID in the Google Cloud console and ask the administrator to approve a dedicated service account.', 'Do not guess a project ID or borrow a personal account key. Ask the project owner.'],
          ['Permission to create a service account, grant scoped read roles, and create a JSON key', 'Create the identity for this connection and review its access with the project owner.', 'An IAM administrator must perform those steps. If organization policy blocks key creation, do not bypass it; choose the federation guide instead.'],
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
          ['Key cannot be created', 'Your organization may prohibit service-account keys. Do not weaken that policy. Ask the project administrator to use ASTRA’s Workload Identity Federation method instead.'],
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
  'collect-data/azure-cli': {
    type: 'Azure CLI procedure', time: '10 min', sections: [
      section('outcome', 'What the command creates', [text('The Azure CLI option generates a PowerShell command block in ASTRA. After you review and run it in your own terminal, it creates an Entra app, service principal, subscription Reader assignment, and client secret. ASTRA does not run the command or receive your CLI login. The resulting connection still uses a client secret; use the federation method if you need a genuinely keyless path.'), note('Do not run it repeatedly', 'The block creates a new app. If ASTRA verification fails, troubleshoot the existing app and output values instead of rerunning the block.')]),
      section('permissions', 'Check before running', [table(['You need', 'If missing'], [['ASTRA integration-management access', 'Ask your ASTRA organization administrator.'], ['Azure CLI and PowerShell with az login to the correct tenant and subscription', 'Install/sign in or use the portal method with an administrator.'], ['Entra permission to register apps and create a service principal', 'Ask an Entra administrator to run or approve the app-creation part.'], ['Permission to assign Reader at subscription scope', 'Ask a subscription Owner or User Access Administrator. The app creator may not have this permission.']]), note('Optional data', 'Log Analytics and Cost Management require existing sources and additional access; the command grants baseline Reader only.')]),
      section('run', 'Run the generated block once', [steps(['Choose Azure CLI in ASTRA', 'Open Integrations → Azure → Connect Azure subscription. Enter the target 36-character Subscription ID and select Azure CLI. Confirm you are in the intended ASTRA organization.'], ['Sign in and review', 'On a machine you control, run az login and check the selected tenant/subscription. Read the entire generated PowerShell block before copying; it creates Azure identities and a role assignment.'], ['Run once', 'Copy the block from ASTRA and paste it into PowerShell. Stop on a permission error; do not use a different subscription or bypass an organization policy.'], ['Keep the output private', 'The block prints Subscription ID, Directory (tenant) ID, Application (client) ID, and client secret Value. The secret Value is sensitive; do not paste the output into a ticket or screenshot.'] )]),
      section('connect', 'Verify in ASTRA', [steps(['Enter the printed values', 'Paste the exact IDs and client secret Value into ASTRA. Give the connection a recognizable Name. The secret ID is not the secret Value.'], ['Verify credentials & load regions', 'If authentication succeeds, select at least one discovery region and only approved metrics, logs, events, and cost sources.'], ['Save subscription', 'ASTRA encrypts the secret on save. Check collection history and a known Azure resource after the next collection interval.']), note('If you need to rotate', 'Have the Entra app owner add a new secret to the existing app and update the saved connection; do not create another app just to rotate.')]),
      section('recovery', 'If it fails', [problems(['App or role assignment denied', 'Check the Azure CLI tenant and subscription. Ask the Entra administrator for app creation or the subscription owner for Reader assignment.'], ['Verification fails', 'Check the printed tenant/client IDs, secret Value and expiry, app service principal, and Reader scope. Do not rerun the creation block.'], ['Locations load but data is missing', 'Check selected regions, completed jobs, and source-specific workspace/cost access and data availability.']), resources(['Microsoft: Azure CLI app registration', 'https://learn.microsoft.com/en-us/cli/azure/ad/app'], ['Microsoft: Azure role assignments', 'https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-cli'])]),
    ],
  },
  'collect-data/azure-federation': {
    type: 'Azure keyless procedure', time: '12 min', sections: [
      section('outcome', 'What this method does', [text('Microsoft Entra trusts short-lived ASTRA identity assertions when the issuer, subject, and audience match the app’s federated credential. ASTRA stores the app and subscription identifiers, not an Azure client secret.'), note('Not automatic cloud setup', 'An administrator still creates the Entra app, federated credential, and subscription Reader assignment. ASTRA cannot create those without your Azure authority.')]),
      section('permissions', 'Check readiness and access', [table(['You need', 'If missing'], [['ASTRA integration-management access', 'Ask your ASTRA organization administrator.'], ['Federation values displayed in ASTRA', 'If ASTRA says federation is unavailable, contact ASTRA support. You should not have to configure an identity endpoint.'], ['Entra app owner or administrator', 'Ask that person to create the app and its federated credential.'], ['Subscription Owner or equivalent role-assignment permission', 'Ask that person to assign Reader to the app service principal.']]), note('Use exact trust values', 'Copy the issuer, subject, and audience from the live ASTRA form. These are public trust identifiers used by Azure, not your private credentials. Do not substitute values from another organization or setup.')]),
      section('azure-setup', 'Create the trust in Azure', [steps(['Prepare the ASTRA form', 'Open Integrations → Azure → Connect Azure subscription. Enter the exact Subscription ID and choose Workload Identity Federation. Wait for ASTRA to display Issuer, Subject, and Audience.'], ['Register an app', 'In Microsoft Entra ID → App registrations, create a dedicated app and note Directory (tenant) ID and Application (client) ID. Create its service principal if needed.'], ['Add federated credential', 'Open Certificates & secrets → Federated credentials → Add credential → Other issuer. Copy the exact Issuer, Subject, and Audience from ASTRA; all three must match. Do not create a client secret.'], ['Grant subscription access', 'In the target subscription → Access control (IAM), have an authorized person assign Reader to that app’s service principal. Approve additional workspace/cost access separately if required.'])]),
      section('astra', 'Verify and save', [steps(['Enter the app IDs', 'In ASTRA enter a connection Name, Directory (tenant) ID, and Application (client) ID. There is no client-secret field for this method.'], ['Verify federation & load regions', 'ASTRA checks the Azure trust and lists locations. If it fails, compare the three trust values and the app’s Reader assignment. If ASTRA reports its federation service unavailable, contact ASTRA support.'], ['Choose collection and save', 'Select at least one region and approved sources, then Save subscription. Check collection jobs and a known resource afterward. Existing logs/cost data may need separate access.'])]),
      section('recovery', 'If federation fails', [problems(['Trust values do not match', 'Compare Issuer including URL punctuation, Subject, and Audience against the ASTRA form. Microsoft matches them exactly.'], ['ASTRA says federation is unavailable', 'Contact ASTRA support with the error message. Do not change your Azure app or create a client secret to work around an ASTRA service issue.'], ['Azure token works but no resources appear', 'Check the service principal’s subscription Reader assignment, target subscription, chosen regions, and collection history.']), resources(['Microsoft: workload identity federation', 'https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation'], ['Microsoft: create a federated trust', 'https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation-create-trust'])]),
    ],
  },
  'collect-data/gcp-federation': {
    type: 'Google Cloud keyless procedure', time: '12 min', sections: [
      section('outcome', 'What this method does', [text('Google Cloud accepts short-lived ASTRA identity assertions through a workload identity pool provider, then ASTRA impersonates a dedicated read-only service account. ASTRA stores pool/provider/service-account identifiers and no Google private key.'), note('No automatic Google Cloud changes', 'The Google Cloud pool, OIDC provider, service account, read roles, and impersonation binding must be created or approved in your Google Cloud organization.')]),
      section('permissions', 'Check readiness and access', [table(['You need', 'If missing'], [['ASTRA integration-management access and target Project ID', 'Ask the ASTRA organization administrator and Google Cloud project owner.'], ['Federation values displayed in ASTRA', 'If ASTRA says federation is unavailable, contact ASTRA support. You should not have to configure an identity endpoint.'], ['IAM permission to create a workload identity pool/provider and service account', 'Ask a Google Cloud IAM administrator; do not bypass organization policy.'], ['Permission to grant project read roles and service-account Workload Identity User', 'Ask the project/service-account IAM owners to approve only the needed sources and exact ASTRA subject.']]), note('Two project identifiers', 'The target Project ID is the project whose resources ASTRA observes. Pool project number is the numeric identifier of the project containing the identity pool. They may refer to the same project, but the values are not interchangeable.')]),
      section('google-setup', 'Create the Google Cloud trust', [steps(['Get ASTRA trust values', 'In Integrations → Google Cloud → Connect Google Cloud, enter the target Project ID and choose Workload Identity Federation. Wait for Issuer and Subject. Copy those values exactly into the provider setup.'], ['Enable required APIs', 'In the pool project, enable IAM, Security Token Service, and IAM Service Account Credentials APIs. The target project also needs APIs for resource/region verification and your selected data sources.'], ['Create a pool and OIDC provider', 'Have an IAM administrator create a workload identity pool and OIDC provider using the exact ASTRA Issuer. Map google.subject=assertion.sub and restrict accepted assertions to the exact ASTRA Subject.'], ['Configure audience', 'Copy the pool project number, pool ID, and provider ID into ASTRA. It displays the OIDC token audience //iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID. Configure the provider to accept that exact audience.'], ['Create the observation service account', 'Create a dedicated service account and grant only approved project read roles for inventory and selected telemetry. Grant roles/iam.workloadIdentityUser on that service account to the exact subject principal ASTRA displays. Do not grant an entire pool if only this subject needs access.'])]),
      section('astra', 'Verify and save', [steps(['Enter identifiers', 'In ASTRA enter a connection Name, target Project ID, numeric pool project number, pool ID, provider ID, and service-account email. Do not paste a JSON key.'], ['Verify federation & load regions', 'ASTRA checks the Google Cloud trust and lists regions. If Google rejects it, compare issuer, subject mapping/condition, audience, pool/provider IDs, and the Workload Identity User binding. If ASTRA reports its federation service unavailable, contact ASTRA support.'], ['Choose sources and save', 'Select at least one region and intended metrics, logs, events, and cost sources. Cost needs an existing detailed BigQuery billing export table and read/query access. Save and inspect collection history and a known resource.'])]),
      section('recovery', 'If federation fails', [problems(['ASTRA says federation is unavailable', 'Contact ASTRA support with the error message. Do not weaken Google Cloud IAM policy or create a JSON key to work around an ASTRA service issue.'], ['Token exchange or impersonation denied', 'Compare the exact subject, audience, pool project number, provider ID, attribute mapping/condition, and service-account Workload Identity User binding.'], ['Regions load but selected data is absent', 'Check source API, service-account read roles, log/billing export availability, collection job results, and region selection.']), resources(['Google Cloud: federation with other OIDC providers', 'https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-other-providers'], ['Google Cloud: federation overview', 'https://docs.cloud.google.com/iam/docs/workload-identity-federation'])]),
    ],
  },
  'collect-data/azure-portal': {
    type: 'Connection guide', time: '8 min', sections: [
      section('outcome', 'What this connection does', [
        text('This portal method connects an Azure subscription using a Microsoft Entra application and its client secret. ASTRA can discover supported resources and collect selected Azure Monitor metrics, existing Log Analytics workspace logs, Activity Logs, and Cost Management data when the application has the relevant access. Discovery, each telemetry source, and resource diagnostic routing are separate checks.'),
        note('What it does not do', 'Saving a subscription does not automatically enable resource diagnostics, create application traces, or grant the app access to every workspace or cost view. For a connection without an Azure client secret, choose the separate Workload Identity Federation method. Managed identity and certificate-based onboarding are not choices in this form.'),
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
