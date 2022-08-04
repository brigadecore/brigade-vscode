import * as vscode from 'vscode';

const EXTENSION_CONFIG_KEY = "brigade";

export function affectsExtensionConfiguration(change: vscode.ConfigurationChangeEvent) {
    return change.affectsConfiguration(EXTENSION_CONFIG_KEY);
}

export function brigPath(): string | undefined {
    return toolPath('brig');
}

export function toolPath(tool: string): string | undefined {
    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_KEY)[`${tool}-path`];
}

export function getConfiguredNamespace(): string | undefined {
    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_KEY)['namespace'];
}

export function getConfiguredPort(): number | undefined {
    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_KEY)['port'];
}

export function openDashboard(): boolean {
    const cfg: boolean = vscode.workspace.getConfiguration(EXTENSION_CONFIG_KEY)['open-dashboard'];
    if (cfg == undefined) {
        return true;
    }

    return cfg;
}
