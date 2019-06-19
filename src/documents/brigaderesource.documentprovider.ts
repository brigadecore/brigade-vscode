import * as vscode from 'vscode';

import * as brigade from '../brigade/brigade';
import { shell } from '../utils/shell';
import { succeeded } from '../utils/errorable';
import { longRunning } from '../utils/host';

const BRIGADE_RESOURCE_SCHEME = "brig";

export function projectUri(id: string): vscode.Uri {
    return vscode.Uri.parse(`${BRIGADE_RESOURCE_SCHEME}://project/${id}`);
}

export function buildUri(id: string): vscode.Uri {
    return vscode.Uri.parse(`${BRIGADE_RESOURCE_SCHEME}://build/${id}`);
}

export class BrigadeResourceDocumentProvider implements vscode.TextDocumentContentProvider {

    public static scheme() {
        return BRIGADE_RESOURCE_SCHEME;
    }

    onDidChange?: vscode.Event<vscode.Uri> | undefined;

    provideTextDocumentContent(uri: vscode.Uri, _token: vscode.CancellationToken): vscode.ProviderResult<string> {
        if (uri.scheme !== BRIGADE_RESOURCE_SCHEME) {
            return null;
        }

        const bits = uri.path.substring(1).split('/');

        switch (uri.authority) {
            case 'project':
                return projectContent(bits[0]);
            case 'build':
                return buildContent(bits[0]);
            default:
                return null;
        }
    }
}

async function projectContent(projectId: string): Promise<string | null> {
    const json = await longRunning(`Getting project ${projectId}`, brigade.getProject(shell, projectId));
    if (succeeded(json)) {
        return json.result;
    }
    return null;
}

async function buildContent(buildId: string): Promise<string | null> {
    const json = await longRunning(`Getting build ${buildId}`, brigade.getBuild(shell, buildId));
    if (succeeded(json)) {
        return json.result;
    }
    return null;
}
