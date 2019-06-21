import * as vscode from 'vscode';

import * as brigade from '../brigade/brigade';
import { ProjectExplorerNode } from "../projectexplorer/node";
import { shell } from '../utils/shell';
import { failed } from '../utils/errorable';
import { showBrigadeResult, refreshProjectExplorer, longRunning } from '../utils/host';
import { promptForBuild } from '../utils/prompt';

export async function onCommandRerunBuild(target?: ProjectExplorerNode): Promise<void> {
    if (!target) {
        const buildId = await promptForBuild("Project containing build to rerun", "Build to rerun");
        if (!buildId.cancelled) {
            rerunBuild(buildId.value.id);
        }
    } else if (target.nodeType !== 'build') {
        vscode.window.showErrorMessage('This command applies only to Brigade builds.');
        return;
    } else {
        await rerunBuild(target.id);
    }
}

async function rerunBuild(existingBuildId: string): Promise<void> {
    const result = await longRunning(`Rerunning build ${existingBuildId}`, brigade.rerun(shell, existingBuildId));

    if (failed(result)) {
        await showBrigadeResult('rerun', existingBuildId, result);
        return;
    }

    refreshProjectExplorer();

    const { buildId, workerId } = result.result || { buildId: 'unknown', workerId: 'unknown' };
    await vscode.window.showInformationMessage(`Rerun of ${existingBuildId} started. Build: ${buildId}, worker: ${workerId}`);
    // TODO: buttons to monitor it etc.
}
