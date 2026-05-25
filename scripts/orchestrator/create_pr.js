#!/usr/bin/env node
const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

if (!token || !owner || !repo) {
  console.error('GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO environment variables are required');
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

const specPath = process.argv[2];
const branchName = process.argv[3] || `orchestrator/${path.basename(specPath, path.extname(specPath))}-${Date.now()}`;

if (!specPath || !fs.existsSync(specPath)) {
  console.error('Usage: node create_pr.js <path/to/spec.json> [branch-name]');
  process.exit(1);
}

async function run() {
  const { data: repoInfo } = await octokit.repos.get({ owner, repo });
  const defaultBranch = repoInfo.default_branch;

  const { data: ref } = await octokit.git.getRef({ owner, repo, ref: `heads/${defaultBranch}` });
  const sha = ref.object.sha;

  await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha });

  const spec = fs.readFileSync(specPath, 'utf8');
  const filePath = `orchestrator/tasks/${path.basename(specPath)}`;
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `chore: add orchestrator task spec ${path.basename(specPath)}`,
    content: Buffer.from(spec).toString('base64'),
    branch: branchName
  });

  const pr = await octokit.pulls.create({
    owner,
    repo,
    title: `Orchestrator: add task spec ${path.basename(specPath)}`,
    head: branchName,
    base: defaultBranch,
    body: `This PR adds the orchestrator task spec.\n\n\`\`\`json\n${spec}\n\`\`\`\n\nAutomated by satohash-orchestrator script.`
  });

  const reviewers = (process.env.SUGGESTED_REVIEWERS || '').split(',').filter(Boolean);
  if (reviewers.length) {
    await octokit.pulls.requestReviewers({ owner, repo, pull_number: pr.data.number, reviewers });
  }

  const labels = (process.env.PR_LABELS || 'orchestrator,task').split(',').filter(Boolean);
  await octokit.issues.addLabels({ owner, repo, issue_number: pr.data.number, labels });

  console.log(`PR created: ${pr.data.html_url}`);
}

run().catch(err => { console.error(err); process.exit(1); });
