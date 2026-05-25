# satohash-orchestrator — quick runbook

Prerequisites:
- Node.js installed
- `npm install @octokit/rest` (for the PR script)

Environment variables required to run the PR script:
- `GITHUB_TOKEN` — a PAT or installation token with repo scope
- `GITHUB_OWNER` — the repo owner/org
- `GITHUB_REPO` — the repo name
- Optional: `SUGGESTED_REVIEWERS` (comma-separated), `PR_LABELS`

Create a PR from a task spec:

```bash
npm install @octokit/rest
node scripts/orchestrator/create_pr.js tasks/satohash-orchestrator/contrast-cta-lazy.json
```

The script creates a dedicated branch and opens a PR. If you want to name the branch explicitly, pass it as a second argument:

```bash
node scripts/orchestrator/create_pr.js tasks/satohash-orchestrator/design-priority.json orchestrator/design-priority-v1
```

Replication:
- To replicate to another org/repo, set `GITHUB_OWNER` and `GITHUB_REPO` to the target and run the script again. The script will create a branch, add the spec file under `orchestrator/tasks/`, and open a PR.

Versioning / rollback strategy:
- Keep each fix/task in its own branch so changes are small and revertable.
- Use GitHub's `Revert` button on a merged PR to undo a change cleanly.
- If you need to rollback before merge, delete the branch and close the PR.
- For local recovery, use `git checkout main && git pull` and then `git revert <commit>` or `git restore --source=<commit> -- <path>`.
- Maintain a short changelog in the PR description for each design iteration.

Notes:
- CI gating uses the `staging` environment for a manual approval step; configure environment protection and reviewers in GitHub settings to enforce human approval.
