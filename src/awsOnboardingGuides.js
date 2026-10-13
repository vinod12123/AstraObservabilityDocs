// Customer-facing AWS role guides. Use the setup-specific values displayed in ASTRA;
// never publish an account ID, principal ARN, External ID, or generated command here.
const section = (id, title, blocks) => ({ id, title, blocks });
const text = (value) => ({ type: 'text', value });
const list = (...items) => ({ type: 'list', items });
const table = (headers, rows) => ({ type: 'table', headers, rows });
const note = (title, value) => ({ type: 'note', title, value });
const steps = (...items) => ({ type: 'steps', items });
const links = (...ids) => ({ type: 'links', ids });
const problems = (...items) => ({ type: 'accordion', items });
const resources = (...items) => ({ type: 'resources', items });

const awsAccess = note('Two separate permissions', 'Your ASTRA user needs permission to manage AWS integrations in your ASTRA organization. Your AWS login also needs permission to create the role by the method you choose. Having one does not grant the other. ASTRA cannot inspect your current AWS console or terminal permissions before you try.');
const platformReady = note('If ASTRA says its source role is not ready', 'Stop before creating anything in the customer AWS account. This is a platform-side configuration issue, not proof that your AWS login is wrong. Ask the ASTRA platform operator to fix it, then select Check again. You do not need to give ASTRA your AWS access keys.');
const expiry = note('Keep this setup together', 'The generated External ID and role name belong to this setup and it expires after 24 hours. Do not reuse a file, command, or trust policy from an older setup. A new setup using CloudFormation (AWS Console), CLI, or Terraform expects a new generated role name as well as a new External ID. To reuse an existing role, choose Manual in the new setup and update that role’s trust policy to the new External ID with its AWS owner.');
const commonCoverage = text('After connecting, ASTRA can discover supported AWS resources, including EC2 instances in private subnets, and can probe its read permissions for CloudWatch metrics and logs, CloudTrail, network resources, and cost APIs. A successful role connection does not turn on every collector or create AWS telemetry. Existing log groups, log buckets, Cost Explorer data, and relevant collection controls must be available. Local application logs and request traces need a Host Agent or instrumentation; they do not appear simply because an EC2 instance is discovered.');

export const AWS_ONBOARDING_GUIDES = {
  'collect-data/aws': {
    type: 'Start here', time: '6 min', sections: [
      section('result', 'What this connection gives you', [
        text('An AWS IAM-role connection lets ASTRA read supported inventory and provider telemetry from an AWS account without storing that customer account’s access key and secret. In your AWS account you create a customer observation role with a read-only policy. ASTRA uses its own platform identity and a setup-specific External ID to request temporary access to that role through AWS STS.'),
        commonCoverage,
        note('Not an automatic AWS permission grant', 'Selecting a method in ASTRA only prepares instructions. AWS resources are created or changed after an authorized person approves the stack, runs the command, applies Terraform, or edits IAM in the customer account.'),
      ]),
      section('which-account', 'Choose the account before you begin', [
        table(['Your goal', 'Account to enter in ASTRA'], [
          ['See EC2, VPC, RDS and other resources', 'The AWS account that owns those resources. Connect each member account whose resources you want to observe.'],
          ['See organization-wide billing', 'The payer or management account that has the billing data. This may be different from the resource-owning account.'],
        ]),
        text('The AWS account ID is the 12-digit number in the AWS console account menu, not an access key ID. For a first connection, choose one account you control and one initial discovery region. You can select more discovery regions during verification.'),
      ]),
      section('who-does-what', 'Understand the three identities', [
        table(['Identity', 'Who controls it', 'Why it is involved'], [
          ['Your AWS sign-in / CLI or Terraform identity', 'You or your AWS administrator', 'Creates or updates the customer role. It needs AWS write permission for setup.'],
          ['Customer observation role', 'Your AWS account', 'Grants ASTRA the reviewed read-only observation actions. Its trust policy requires ASTRA’s principal and this setup’s External ID.'],
          ['ASTRA source role', 'ASTRA platform operator', 'Calls STS AssumeRole on the customer role. Customers should not need to configure this platform identity.'],
        ]),
        awsAccess,
        platformReady,
      ]),
      section('choose', 'Choose one method and follow its own guide', [
        text('All four methods configure the same kind of customer role. Do not run several methods for the same setup: that can create conflicting roles or stacks. Select the method that matches how your team manages IAM.'),
        links('aws-console', 'aws-cli', 'aws-terraform', 'aws-manual'),
        table(['If this describes you', 'Use'], [
          ['I can sign in to AWS and create a CloudFormation stack, but I do not use a terminal', 'CloudFormation (AWS Console)'],
          ['I already use AWS CLI with an authorized profile', 'AWS CLI'],
          ['Our team keeps IAM in a Terraform project and reviews plans', 'Terraform'],
          ['An administrator will create or update the role directly, or upload a JSON file', 'Manual'],
        ]),
      ]),
      section('after', 'What to check after connection', [
        steps(['Confirm the account and connection', 'In ASTRA, confirm the connected 12-digit account ID, connection name, and selected regions.'], ['Review capabilities', 'Check which AWS read capabilities are available or missing. A connected role can still lack a particular service permission.'], ['Enable intended collection', 'Review collection controls and any cost acknowledgements before enabling optional sources.'], ['Inspect evidence', 'Open Clouds → Workloads or the relevant AWS view and check the newest observation. Inventory, metrics, logs, and traces are separate checks.']),
      ]),
    ],
  },

  'collect-data/aws-console': {
    type: 'CloudFormation (AWS Console) procedure', time: '10 min', sections: [
      section('outcome', 'What this procedure does', [
        text('Use this method when you can work in the AWS web console. ASTRA creates a setup and opens a prefilled CloudFormation Quick Create page in a new tab. CloudFormation will create one named customer observation IAM role with the trust policy and read-only policy shown in ASTRA—but only after you review and select Create stack in AWS. ASTRA then looks for that role and verifies it.'),
        note('Who should use it?', 'You need an ASTRA user allowed to manage AWS integrations and an AWS login to the target account that can create a CloudFormation stack and the named IAM role and inline policy. If an administrator must approve IAM creation, they should perform the AWS-console part.'),
      ]),
      section('permission-check', 'Check access before you click', [
        table(['Question', 'If yes', 'If no'], [
          ['Can you sign in to the exact AWS account you want to connect?', 'Confirm its 12-digit ID in the AWS account menu.', 'Ask the account owner to sign in; do not use a different account and hope the role is shared.'],
          ['Can your AWS identity create CloudFormation stacks and named IAM roles with inline policies?', 'Continue, and review any permission boundary or organization rules.', 'Ask an AWS administrator to create the stack. IAM and organization policies may still deny it.'],
          ['Does ASTRA say it is ready?', 'Continue to account details.', 'Ask the ASTRA platform operator; customer IAM changes will not fix platform readiness.'],
        ]),
        text('Typical required AWS actions include CloudFormation stack creation and IAM role/policy creation. The exact grant depends on your organization and whether CloudFormation uses an execution role; that role may also require PassRole. Do not request administrator-level access just to bypass a denial.'),
        awsAccess,
      ]),
      section('prepare', 'Prepare this setup in ASTRA', [
        steps(['Open the connection', 'In ASTRA, open Integrations → AWS, choose IAM role, select CloudFormation (AWS Console), and confirm you are in the intended ASTRA organization.'], ['Enter the AWS account ID', 'Use the 12-digit account ID from the AWS account menu. Do not enter an AKIA access key ID.'], ['Choose Initial discovery region', 'Select the AWS region where you want to begin discovery. This also selects the CloudFormation console region for stack creation; IAM roles themselves are account-wide.'], ['Decide on optional log buckets', 'Leave Optional network log bucket ARNs empty unless you already have an S3 bucket containing VPC flow or load-balancer logs that ASTRA should read. Enter bucket ARNs, not object URLs. Encrypted objects may need a separate scoped KMS grant.'], ['Select Continue to role setup', 'ASTRA creates this setup’s role name, trust principal, External ID, and policy. Open View permissions ASTRA will request and inspect them before proceeding.']),
        expiry,
      ]),
      section('create-stack', 'Create the stack in the AWS Console', [
        steps(['Select Open prefilled stack in AWS', 'A new AWS CloudFormation tab opens. This link prepares a Quick Create form; clicking it does not create the stack. If the link is unavailable, use Manual → Upload JSON instead.'], ['Confirm the signed-in account and region', 'In the AWS tab, confirm the 12-digit account ID is the one entered in ASTRA and the region is the selected setup region. Stop if either differs.'], ['Review template and parameters', 'Check the template URL, stack name, ASTRA trusted principal, External ID, and optional log bucket ARNs. Compare with the current ASTRA setup; do not replace them with values from an old attempt.'], ['Review the IAM permissions', 'The template creates an IAM role and inline read-only observation policy. Read what it grants. The trust policy must restrict AssumeRole to ASTRA’s displayed principal and require this setup’s External ID.'], ['Acknowledge named IAM creation', 'AWS asks you to acknowledge that CloudFormation may create a named IAM resource. Check the acknowledgement only after reviewing the template and policies.'], ['Select Create stack', 'CloudFormation now starts creating the role. In the stack Events tab, wait for CREATE_COMPLETE. CREATE_IN_PROGRESS is not complete; CREATE_FAILED or ROLLBACK means you must inspect the event reason.']),
        resources(['AWS: how Quick Create links work', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stacks-quick-create-links.html'], ['AWS: why IAM acknowledgement is required', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html']),
      ]),
      section('verify', 'Return to ASTRA and verify', [
        steps(['Keep the ASTRA tab open', 'After you open the AWS link, ASTRA checks for the expected role about every 15 seconds while this page is open. AWS IAM propagation may take a short time after CREATE_COMPLETE.'], ['Watch the result', 'ASTRA attempts STS AssumeRole with the generated External ID, checks that the role belongs to the requested account, and scans available read capabilities before saving.'], ['If ASTRA keeps waiting', 'Inspect the CloudFormation Events and role trust policy first. ASTRA continues checking while the tab is open; if it reports a verification error and stops, use Verify and connect to retry the same setup. Do not create a second stack for a temporary delay.'], ['Confirm collection', 'Inspect the new connection and its capability/collection state. Then check AWS inventory in the selected region; a connected role alone is not proof that logs or metrics are flowing.']),
      ]),
      section('help', 'If a step fails', [
        problems(
          ['AWS says AccessDenied', 'Your AWS login may lack CloudFormation or IAM creation permission, or an organization policy or permission boundary may deny the action. Ask an AWS administrator to review the CloudFormation Events reason and the role-creation policy.'],
          ['CloudFormation says template cannot be loaded', 'The ASTRA operator’s published template may be unavailable to AWS. Do not upload an unrelated file; use the Manual JSON path generated by the current setup and report the hosted-template issue.'],
          ['Stack is CREATE_COMPLETE but ASTRA cannot assume the role', 'Confirm you returned to the same unexpired setup and that the role trust policy contains the displayed ASTRA principal and External ID. Ask the AWS administrator to review any explicit deny.'],
          ['Setup expired or the page was replaced', 'Prepare a fresh ASTRA setup. Its generated role name and External ID differ from the old stack. Ask the stack owner whether to clean up the old stack and create the new one, or choose Manual to reuse the old role after updating its trust policy. Do not create repeated stacks blindly.'],
        ),
      ]),
    ],
  },

  'collect-data/aws-cli': {
    type: 'AWS CLI procedure', time: '10 min', sections: [
      section('outcome', 'What the single command does', [
        text('ASTRA generates one AWS CLI cloudformation create-stack command for this setup. You run it on your own computer, using your own AWS CLI session. The command points CloudFormation to ASTRA’s published template and passes the generated role name, ASTRA principal, and External ID. It creates a stack containing the customer observation role and read-only policy. ASTRA never executes the command or receives your CLI credentials.'),
        note('One command does not mean instant completion', 'The create-stack command submits the stack and returns a stack ID. AWS may still be creating the role. ASTRA checks for the role while the tab remains open and connects only after verification succeeds.'),
      ]),
      section('requirements', 'Check your computer and AWS permissions', [
        table(['Requirement', 'How to check', 'If you do not have it'], [
          ['AWS CLI installed', 'Run aws --version in the same terminal where you will paste the command.', 'Install AWS CLI through your organization’s approved process or use CloudFormation (AWS Console) instead.'],
          ['Signed in to the target account', 'Run aws sts get-caller-identity, adding --profile YOUR_PROFILE if you will use a named profile. Compare Account with the 12-digit ID entered in ASTRA.', 'Sign in to the correct account or ask an AWS administrator. Do not run the command against another account.'],
          ['CloudFormation and IAM creation rights', 'Your identity must be allowed to create a stack and its named IAM role and inline policy.', 'Ask an AWS administrator to run the generated command or choose CloudFormation (AWS Console) with an authorized login.'],
          ['ASTRA source ready', 'The ASTRA form must show that it is ready before Continue to role setup is enabled.', 'Ask the ASTRA platform operator; changing your CLI profile will not repair an ASTRA source-role failure.'],
        ]),
        text('If a named AWS CLI profile is used, enter the same profile name in ASTRA’s optional AWS CLI profile field so the generated command includes --profile. Leave it blank only if your default CLI identity is the intended account. This profile is on your machine; it is not the ASTRA platform source role.'),
        {type:'code',language:'AWS CLI · default profile account check',value:'aws sts get-caller-identity --query Account --output text'},
        note('Using a named profile?', 'Append --profile YOUR_PROFILE to the account-check command, replacing YOUR_PROFILE with your actual profile name. The result must equal the account ID entered in ASTRA. This command checks identity only; it does not create anything.'),
        resources(['AWS CLI profile configuration', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html'], ['AWS CLI installation guide', 'https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html']),
        awsAccess,
      ]),
      section('prepare', 'Prepare and inspect the command in ASTRA', [
        steps(['Choose AWS CLI', 'Open Integrations → AWS → IAM role, select AWS CLI, and confirm the ASTRA organization.'], ['Enter account and region', 'Enter the 12-digit target account ID and Initial discovery region. Add optional existing network-log bucket ARNs only if you need them and understand their access requirements.'], ['Select Continue to role setup', 'ASTRA generates a setup-specific role name, principal, External ID and command. Review View permissions ASTRA will request and Setup details before copying.'], ['Choose the CLI profile', 'Enter a named profile if needed. On your computer, verify the same profile with aws sts get-caller-identity --profile YOUR_PROFILE; the Account field must match ASTRA.'], ['Select Copy command', 'Copy the generated command from this setup. It is one line; do not combine it with snippets from another setup or paste credentials into ASTRA.']),
        expiry,
      ]),
      section('run', 'Run it in your own terminal', [
        steps(['Use an authorized terminal', 'Open Command Prompt, PowerShell, or a terminal where the AWS CLI identity was verified. Paste the complete generated command as one line.'], ['Read before you press Enter', 'The command includes the stack name, template URL, setup parameters, selected region and CAPABILITY_NAMED_IAM. Make sure the account check was correct and that the role creation is approved by your organization.'], ['Run it once', 'A successful submission returns a StackId. Do not interpret that as CREATE_COMPLETE and do not immediately re-run the command.'], ['Watch CloudFormation', 'In the AWS console, open CloudFormation → Stacks in the selected region and find the generated stack. Wait for CREATE_COMPLETE; inspect Events if it fails.'], ['Return to ASTRA', 'Copying the command starts ASTRA’s connection check. If you had already run it, select Already ran it? Start checking connection. Keep the ASTRA tab open while AWS creates the role.']),
        resources(['AWS: named IAM capabilities for CloudFormation', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html']),
      ]),
      section('verify', 'Confirm the connection and collection', [
        text('ASTRA checks about every 15 seconds while checking is active. It verifies STS AssumeRole with the setup’s External ID, the account identity and supported read capabilities, then saves the connection. If you stopped the automatic check, return to the same setup and select Verify and connect after CloudFormation finishes.'),
        steps(['Check the ASTRA connection', 'The connected account should show the intended 12-digit account ID and selected regions.'], ['Inspect capabilities', 'Look for missing permissions or disabled collection controls; a connection can be valid while a particular source is unavailable.'], ['Inspect real data', 'Check a supported AWS resource in Clouds → Workloads. For logs, cost or traces, check their separate collection requirements.']),
      ]),
      section('help', 'CLI-specific problems', [
        problems(
          ['aws is not recognized', 'AWS CLI is missing from this terminal or its installation is not on PATH. Use your approved CLI installation or choose CloudFormation (AWS Console).'],
          ['The command runs in the wrong account', 'Stop. Verify your default or named profile with sts get-caller-identity and compare the Account field. A region change does not switch accounts. Prepare a fresh ASTRA setup if the wrong account was used.'],
          ['AccessDenied or InsufficientCapabilities', 'Have an AWS administrator review stack creation, named IAM role/policy permissions, and organization restrictions. Do not remove CAPABILITY_NAMED_IAM from the generated command.'],
          ['StackId returned but ASTRA still waits', 'A StackId means the request was accepted, not that the role exists. Check stack Events and wait for CREATE_COMPLETE. Then return to the same ASTRA setup.'],
          ['Single-command option is unavailable', 'The published template or validated setup parameters are missing. Use CloudFormation (AWS Console) if available, or the Manual JSON path; do not invent a command from an old setup.'],
        ),
      ]),
    ],
  },

  'collect-data/aws-terraform': {
    type: 'Terraform procedure', time: '10 min', sections: [
      section('outcome', 'What Terraform will manage', [
        text('Use this path when your team already manages IAM through Terraform. ASTRA produces a setup-specific .tf configuration containing an aws_iam_role, an inline aws_iam_role_policy, and a role ARN output. Your Terraform project and AWS provider apply and later manage those resources. ASTRA does not run Terraform, hold your provider credentials, or manage your Terraform state.'),
        note('Choose one owner for the role', 'Do not create the same role through CloudFormation and Terraform. If an observation role with this name already exists, resolve ownership or import it through your team’s approved Terraform process before applying. Do not let a plan replace an unrelated role.'),
      ]),
      section('requirements', 'Check project and permission prerequisites', [
        table(['Requirement', 'If yes', 'If no'], [
          ['You have an existing Terraform project, initialized with an AWS provider and state backend', 'Use that project and its normal review process.', 'Ask the team that owns AWS IAM; for a first connection without Terraform, CloudFormation (AWS Console) is simpler.'],
          ['The AWS provider is authenticated to the target 12-digit account', 'Confirm its configured account and workspace before planning.', 'Correct the provider/session; applying to another account cannot create the intended role.'],
          ['The provider identity may create and manage IAM roles and inline policies', 'Continue under your organization’s change approval process.', 'Ask an AWS administrator to grant scoped IAM management or apply the reviewed plan.'],
          ['ASTRA shows its source role ready', 'Continue to create a setup.', 'Ask the ASTRA platform operator; Terraform changes in the customer account cannot fix this.'],
        ]),
        text('The Terraform AWS provider needs permissions for the IAM resources it will create and for later updates/deletion under your project’s lifecycle. Permissions boundaries, service control policies, and project policy checks may add restrictions. The generated file does not configure your provider or state backend.'),
        awsAccess,
      ]),
      section('prepare', 'Generate the exact role definition', [
        steps(['Select Terraform in ASTRA', 'Open Integrations → AWS → IAM role and select Terraform for the intended ASTRA organization.'], ['Enter the target account and region', 'Use the 12-digit account ID. Select the initial discovery region and enter optional existing network-log bucket ARNs only when needed.'], ['Select Continue to role setup', 'ASTRA generates a unique role name, trust policy with External ID, observation permission policy, and .tf configuration.'], ['Review permissions', 'Open View permissions ASTRA will request and Setup details. The trusted principal must be ASTRA’s displayed source role; the External ID must match this setup.'], ['Copy HCL or download the .tf file', 'Add it to the correct Terraform project. Keep the file and state private because the trust policy includes the setup-specific External ID.']),
        expiry,
      ]),
      section('apply', 'Plan, review, and apply in your project', [
        steps(['Confirm project context', 'Use the workspace, backend, and AWS provider that your team uses for the target account. Confirm account identity through your normal provider checks; do not assume a shell profile controls a separately configured provider.'], ['Run terraform init', 'Initialize the working directory if it is new or provider/backend settings changed.'], ['Run terraform plan', 'Inspect the full plan. It should add the intended observation role and inline policy; review role name, assume-role trust policy, External ID, observation actions, account, and any unrelated changes before approving.'], ['Obtain normal approval', 'If your team reviews Terraform changes through a pull request or change request, complete that process. Do not apply a plan that shows unrelated deletion or replacement.'], ['Run terraform apply', 'Apply the reviewed configuration under an authorized AWS provider. Confirm Terraform reports success and exposes the role ARN output.']),
        resources(['Terraform: initialize a working directory', 'https://developer.hashicorp.com/terraform/cli/init'], ['Terraform: review and apply a plan', 'https://developer.hashicorp.com/terraform/tutorials/cli/apply']),
      ]),
      section('verify', 'Let ASTRA verify the Terraform role', [
        steps(['Return to the same ASTRA setup', 'Select I applied Terraform · check connection. ASTRA checks for the generated role while the tab stays open.'], ['Check the role', 'ASTRA must assume the role through STS using this setup’s External ID. It also checks account identity and available read capabilities.'], ['If needed, use Verify and connect', 'After apply succeeds, the button in the verification section can retry the same setup. Do not create another Terraform role for a temporary verification delay.'], ['Check collection', 'Confirm the connection appears and inspect selected regions, capabilities and first resource observations separately.']),
      ]),
      section('help', 'Terraform-specific problems', [
        problems(
          ['Plan targets another account or includes unrelated changes', 'Do not apply. Correct the AWS provider/workspace or isolate the generated resources in the appropriate project, then review a fresh plan.'],
          ['Role already exists', 'Do not overwrite it blindly. Ask the IAM/Terraform owner whether to use the Manual existing-role path or import the role into the appropriate Terraform state under an approved process.'],
          ['Apply is denied', 'The provider identity needs scoped IAM permissions and may be constrained by a permission boundary or organization policy. Ask an AWS administrator to review the actual denied action.'],
          ['Apply succeeds but ASTRA cannot connect', 'Compare the applied role trust policy with this setup’s ASTRA principal and External ID. Check the target account and role ARN; use the same unexpired setup.'],
          ['Setup expires during review', 'Create a new ASTRA setup and update the Terraform trust policy and generated role details before planning again. Do not apply a stale .tf file.'],
        ),
      ]),
    ],
  },

  'collect-data/aws-manual': {
    type: 'Manual procedure', time: '12 min', sections: [
      section('outcome', 'Two manual ways to create the same role', [
        text('Manual setup is for an AWS administrator who wants to create or update the role directly in IAM, or who prefers to upload this setup’s JSON CloudFormation template. Both paths produce a customer observation role that trusts ASTRA’s source principal only when the current External ID is supplied. After the AWS change, you enter the customer role ARN in ASTRA and verify it.'),
        table(['Manual choice in ASTRA', 'AWS action', 'Best when'], [
          ['Create in IAM', 'Paste the trust policy and attach the observation permission policy to a role.', 'You have an existing approved role or need direct IAM review.'],
          ['Upload JSON in CloudFormation', 'Download ASTRA’s setup-specific JSON and upload it in the AWS CloudFormation console.', 'You want AWS to create the role from a file without a public template URL.'],
        ]),
        note('No customer-side S3 bucket is needed for the upload path', 'Download the JSON from the current ASTRA setup onto your computer, then upload that file in the AWS CloudFormation console. It is not an application log file and does not need to be made public.'),
      ]),
      section('requirements', 'Check your access and decide who will do the AWS work', [
        table(['Question', 'If yes', 'If no'], [
          ['Can you sign in to the target 12-digit AWS account?', 'Confirm the account number in the AWS console.', 'Ask the account owner; do not create a role in another account.'],
          ['For direct IAM: can you create/update a role, edit its trust policy, and attach an inline policy?', 'Use Create in IAM.', 'Ask an AWS administrator, or choose the JSON path if you have CloudFormation/IAM creation rights instead.'],
          ['For JSON upload: can you create a stack and its named IAM role/policy?', 'Use Upload JSON in CloudFormation.', 'Ask an AWS administrator to create the stack.'],
          ['Is ASTRA source-role readiness green?', 'Continue.', 'Ask the ASTRA platform operator before changing the customer account.'],
        ]),
        text('Direct IAM commonly involves iam:CreateRole, iam:UpdateAssumeRolePolicy and iam:PutRolePolicy or equivalent approved policy attachment permissions. The JSON path needs CloudFormation stack creation plus the IAM actions used by the template; an execution role can add PassRole requirements. Your organization may restrict these through service control policies or permission boundaries.'),
        awsAccess,
      ]),
      section('prepare', 'Prepare the customer account and policies in ASTRA', [
        steps(['Choose Manual', 'Open Integrations → AWS → IAM role. Select Manual and confirm your ASTRA organization.'], ['Enter account details', 'Enter the 12-digit account ID and initial discovery region. Add optional existing network-log bucket ARNs only if you want those objects readable and have reviewed their sensitivity.'], ['Select Continue to role setup', 'ASTRA creates a role name, trusted principal, External ID, trust policy, permission policy and setup-specific JSON.'], ['Review the policies', 'Open Setup details and View permissions ASTRA will request. The trust policy controls who may assume the role; the permission policy controls what an assumed role may read. They are different documents.'], ['Choose one manual path below', 'Do either Create in IAM or Upload JSON in CloudFormation. Do not perform both against the same role.']),
        expiry,
      ]),
      section('iam', 'Path A: Create or update the role in IAM', [
        steps(['Open IAM in the target AWS account', 'For a new role, choose Roles → Create role → Custom trust policy. For an existing role, open that role and choose Trust relationships → Edit trust policy instead.'], ['Paste the trust policy from ASTRA', 'Open View trust policy in the Manual form and copy the whole JSON. Confirm Principal is ASTRA’s displayed source role ARN and the sts:ExternalId condition equals the current setup’s External ID. Save it.'], ['Finish creating a new role', 'For a new role, continue through the IAM wizard, give it a recognizable name (the ASTRA-generated role name is recommended), review, and select Create role. If the wizard asks for managed policies, do not replace ASTRA’s reviewed policy with broad AdministratorAccess.'], ['Attach the read-only permissions', 'Open the role’s Permissions tab → Add permissions → Create inline policy (labels may vary) → JSON. Paste the separate JSON from View permissions ASTRA will request, review the actions, give the inline policy a name, and save. Existing roles need this step too unless an equivalent reviewed policy already grants the needed actions.'], ['Review an existing role carefully', 'If reusing a role, confirm its account ID matches ASTRA, its CloudFormation/Terraform owner approves the change, and its trust policy denies AssumeRole when the External ID is missing or wrong.'], ['Copy the role ARN', 'On the IAM role Summary page, copy the full arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME value. A role name alone or an STS assumed-role ARN is not the customer role ARN.']),
        resources(['AWS: create a role with a custom trust policy', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-custom.html'], ['AWS: create an IAM policy in JSON', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html']),
      ]),
      section('json', 'Path B: Upload the generated JSON template', [
        steps(['Download from this ASTRA setup', 'Select Download setup-specific JSON. The file contains the current External ID and role name. Do not upload an older file.'], ['Open CloudFormation in the target AWS account', 'Choose the same region selected in ASTRA, then Create stack → With new resources → Upload a template file.'], ['Upload and review the JSON', 'Choose the downloaded file from your computer. Review the stack name, role trust, read-only policy and any optional S3 log-bucket grants.'], ['Acknowledge IAM creation and create the stack', 'Select the named-IAM acknowledgement after review, then Create stack. Wait for CREATE_COMPLETE in stack Events; inspect failures instead of repeatedly creating new stacks.'], ['Copy Outputs → RoleArn', 'From the completed stack, open Outputs and copy the full customer role ARN into ASTRA. No public S3 bucket or template URL is required for this path.']),
        resources(['AWS: named IAM acknowledgement', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html']),
      ]),
      section('verify', 'Paste the ARN and connect in ASTRA', [
        steps(['Enter a connection name', 'Use a name your team will recognize, such as Production AWS.'], ['Paste Customer role ARN', 'Use the IAM role Summary ARN from Path A or CloudFormation Outputs → RoleArn from Path B. The 12-digit account ID inside the ARN must match the account entered in ASTRA.'], ['Select discovery regions', 'Keep the original setup region selected and add only regions you intend to discover.'], ['Select Verify and connect', 'ASTRA requests STS AssumeRole using its source role and the setup’s External ID, checks account identity, rejects a trust policy that also allows missing or incorrect External IDs, and scans available read capabilities.'], ['Inspect the saved connection', 'Confirm the account and capability states. Then verify one real resource or telemetry source; a valid connection does not enable historical logs or application traces.']),
        commonCoverage,
      ]),
      section('help', 'Manual-specific problems', [
        problems(
          ['IAM says you cannot create or edit the role', 'Ask an AWS administrator for the specific IAM permission or approved change. Do not create a customer access key to work around the error.'],
          ['Policy JSON is rejected', 'Copy the exact trust or observation policy from this setup, not the other policy or an older setup. Check that you pasted into the matching AWS editor: trust relationship versus role permissions.'],
          ['CloudFormation stack fails', 'Inspect the first failure in stack Events. Account mismatch, permissions boundary, service control policy, role-name conflict or IAM denial are possible causes.'],
          ['ASTRA denies AssumeRole', 'Compare the role ARN, trusted ASTRA principal and External ID. The role must belong to the entered account, and a missing or wrong External ID must not be allowed.'],
          ['Role setup is unavailable or expired', 'Start a new ASTRA setup. For an existing role, update its trust policy to the new External ID before retrying. For a stack-managed role, ask the stack owner to update or replace it using the approved process.'],
        ),
      ]),
    ],
  },
};
