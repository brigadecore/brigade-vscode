import { ProjectExplorerNodeBase, ProjectExplorerNode } from "./node";
import { ProviderResult, TreeItem, TreeItemCollapsibleState } from "vscode";

export interface ProjectExplorerMessageNode extends ProjectExplorerNodeBase {
    readonly nodeType: 'message';
    readonly text: string;
    readonly diagnostic?: string;
}

export class MessageNode implements ProjectExplorerMessageNode {
    readonly nodeType = "message";
    constructor(readonly text: string, readonly diagnostic?: string) {}
    getChildren(): ProviderResult<ProjectExplorerNode[]> {
        return [];
    }
    getTreeItem(): TreeItem | Thenable<TreeItem> {
        const treeItem = new TreeItem(this.text, TreeItemCollapsibleState.None);
        treeItem.tooltip = this.diagnostic;
        return treeItem;
    }
}