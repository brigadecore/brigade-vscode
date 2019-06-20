import * as vscode from 'vscode';

import * as brigade from '../brigade/brigade';
import { ProjectExplorerNode } from "../projectexplorer/node";
import { shell } from '../utils/shell';
import { failed } from '../utils/errorable';
import { showBrigadeResult, refreshProjectExplorer, longRunning } from '../utils/host';
import { promptForProject } from '../utils/prompt';

export async function onCommandRunProject(target?: ProjectExplorerNode): Promise<void> {
    if (!target) {
        const projectPick = await promptForProject("Project to run");
        if (!projectPick.cancelled) {
            runProject(projectPick.value.name, projectPick.value.id);
        }
    } else if (target.nodeType !== 'project') {
        vscode.window.showErrorMessage('This command applies only to Brigade projects.');
        return;
    } else {
        await runProject(target.name, target.id);
    }
}

async function runProject(projectName: string, projectId: string): Promise<void> {
    const result = await longRunning(`Running project ${projectName}`, brigade.run(shell, projectId));

    if (failed(result)) {
        await showBrigadeResult('run', projectId, result);
        return;
    }

    refreshProjectExplorer();

    const { buildId, workerId } = result.result || { buildId: 'unknown', workerId: 'unknown' };
    await vscode.window.showInformationMessage(`Project ${projectName} started. Build: ${buildId}, worker: ${workerId}`);
    // TODO: buttons to monitor it etc.
}
