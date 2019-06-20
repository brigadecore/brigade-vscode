import * as vscode from 'vscode';

import * as brigade from '../brigade/brigade';
import { Cancellable } from "./cancellable";
import { shell } from './shell';
import { failed } from './errorable';
import { Age } from './age';
import { ProjectSummary, BuildSummary } from '../brigade/brigade.objectmodel';

export async function promptForProject(prompt: string): Promise<Cancellable<ProjectSummary>> {
    const projects = await brigade.listProjects(shell);
    if (failed(projects)) {
        await vscode.window.showErrorMessage("Unable to display project list");
        return { cancelled: true };
    }

    const projectPicks = projects.result.map((p) => ({ label: p.name, project: p }));
    const pick = await vscode.window.showQuickPick(projectPicks, { placeHolder: prompt });

    if (!pick) {
        return { cancelled: true };
    }

    return { cancelled: false, value: pick.project };
}

export async function promptForBuild(projectPrompt: string, buildPrompt: string): Promise<Cancellable<BuildSummary>> {
    const projectId = await promptForProject(projectPrompt);
    if (projectId.cancelled) {
        return projectId;
    }

    const builds = await brigade.listBuilds(shell, projectId.value.id);
    if (failed(builds)) {
        await vscode.window.showErrorMessage("Unable to display build list for project");
        return { cancelled: true };
    }

    const buildPicks = builds.result.map((b) => ({ label: `Build from ${Age.asAgo(b.age)} (${b.id})`, build: b }));
    const pick = await vscode.window.showQuickPick(buildPicks, { placeHolder: buildPrompt });

    if (!pick) {
        return { cancelled: true };
    }

    return { cancelled: false, value: pick.build };
}
