'use strict';

import * as vscode from 'vscode';
import { ProjectExplorer } from './projectexplorer/projectexplorer';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        vscode.window.showInformationMessage('Hello World!');
    });

    const projectExplorer = new ProjectExplorer();
    const projectExplorerDisposable = vscode.window.registerTreeDataProvider("brigade.projects", projectExplorer);

    context.subscriptions.push(disposable, projectExplorerDisposable);
}
