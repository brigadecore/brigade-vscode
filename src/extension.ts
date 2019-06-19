'use strict';

import * as vscode from 'vscode';
import { ProjectExplorer } from './projectexplorer/projectexplorer';
import { ProjectExplorerNode } from './projectexplorer/node';
import { BrigadeResourceDocumentProvider } from './documents/brigaderesource.documentprovider';
import { hasResourceURI } from './projectexplorer/node.hasresourceuri';

const projectExplorer = new ProjectExplorer();

export function activate(context: vscode.ExtensionContext) {
    const disposables = [
        // Commands
        vscode.commands.registerCommand("brigade.get", onCommandGet),
        vscode.commands.registerCommand("brigade.refreshProjectExplorer", onCommandRefreshProjectExplorer),

        // Documents
        vscode.workspace.registerTextDocumentContentProvider(BrigadeResourceDocumentProvider.scheme(), new BrigadeResourceDocumentProvider()),

        // Views
        vscode.window.registerTreeDataProvider("brigade.projects", projectExplorer),
    ];

    context.subscriptions.push(...disposables);
}

async function onCommandGet(target?: ProjectExplorerNode): Promise<void> {
    if (!target || !target.nodeType || !hasResourceURI(target)) {
        return;
    }

    await vscode.window.showTextDocument(target.resourceURI());
}

function onCommandRefreshProjectExplorer() {
    projectExplorer.refresh();
}
