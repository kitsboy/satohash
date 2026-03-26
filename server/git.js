import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import logger from './logger.js';

/**
 * Retrieves git metadata for a given repository path.
 * @param {string} repoPath 
 */
export const getGitMetadata = (repoPath) => {
    try {
        if (!fs.existsSync(path.join(repoPath, '.git'))) {
            throw new Error('Not a git repository.');
        }

        const commitHash = execSync('git rev-parse HEAD', { cwd: repoPath }).toString().trim();
        const treeHash = execSync('git rev-parse HEAD^{tree}', { cwd: repoPath }).toString().trim();
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoPath }).toString().trim();
        const author = execSync('git log -1 --format="%an <%ae>"', { cwd: repoPath }).toString().trim();
        const message = execSync('git log -1 --format="%s"', { cwd: repoPath }).toString().trim();
        const repoName = path.basename(repoPath);

        return {
            commitHash,
            treeHash,
            branch,
            author,
            message,
            repoName,
            repoPath
        };
    } catch (error) {
        logger.error(`Error fetching git metadata: ${error.message}`);
        throw error;
    }
};
