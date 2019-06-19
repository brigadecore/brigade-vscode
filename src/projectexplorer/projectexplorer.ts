import * as vscode from 'vscode';
import { ProjectExplorerNode } from './node';
import { ProjectNode } from './projectnode';

export class ProjectExplorer implements vscode.TreeDataProvider<ProjectExplorerNode> {
    private onDidChangeTreeDataEmitter: vscode.EventEmitter<ProjectExplorerNode | undefined> = new vscode.EventEmitter<ProjectExplorerNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<ProjectExplorerNode | undefined> = this.onDidChangeTreeDataEmitter.event;

    getChildren(element?: ProjectExplorerNode): vscode.ProviderResult<ProjectExplorerNode[]> {
        if (element) {
            return element.getChildren();
        }
        return ProjectNode.all();
    }

    getTreeItem(element: ProjectExplorerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element.getTreeItem();
    }

    refresh(): void {
        this.onDidChangeTreeDataEmitter.fire();
    }
}
