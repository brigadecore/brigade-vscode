import * as vscode from 'vscode';
import { ProjectExplorerNode } from './node';
import { ProjectNode } from './projectnode';

export class ProjectExplorer implements vscode.TreeDataProvider<ProjectExplorerNode> {
    onDidChangeTreeData?: vscode.Event<ProjectExplorerNode | null | undefined> | undefined;

    getChildren(element?: ProjectExplorerNode): vscode.ProviderResult<ProjectExplorerNode[]> {
        if (element) {
            return element.getChildren();
        }
        return ProjectNode.all();
    }

    getTreeItem(element: ProjectExplorerNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element.getTreeItem();
    }
}
