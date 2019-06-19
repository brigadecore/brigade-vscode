import * as vscode from 'vscode';

import { Errorable, failed } from './errorable';
import { isPromise } from './promise';

export async function longRunning<T>(title: string, action: Promise<T> | (() => Promise<T>)): Promise<T> {
    const options = {
        location: vscode.ProgressLocation.Notification,
        title: title
    };
    if (isPromise(action)) {
        return await vscode.window.withProgress(options, async (_) => await action);
    } else {
        return await vscode.window.withProgress(options, (_) => action());
    }
}

export async function showBrigadeResult<T>(command: string, resource: string | ((r: T) => string), result: Errorable<T>): Promise<void> {
    if (failed(result)) {
        // The invocation infrastructure adds blurb about what command failed, and
        // Brigade's CLI parser adds 'Error:'. We don't need that here because we're
        // going to prepend our own blurb.
        const message = trimPrefix(result.error[0], `brig ${command} error: Error:`).trim();
        await vscode.window.showErrorMessage(`Brigade ${command} failed: ${message}`);
    } else {
        const resourceText = resource instanceof Function ? resource(result.result) : resource;
        await vscode.window.showInformationMessage(`Brigade ${command} complete for ${resourceText}`);
    }
}

function trimPrefix(text: string, prefix: string): string {
    if (text.startsWith(prefix)) {
        return text.substring(prefix.length);
    }
    return text;
}

export async function confirm(text: string, confirmLabel: string): Promise<boolean> {
    const choice = await vscode.window.showWarningMessage(text, confirmLabel, 'Cancel');
    return choice === confirmLabel;
}

export async function refreshProjectExplorer(): Promise<void> {
    await vscode.commands.executeCommand("brigade.refreshProjectExplorer");
}
