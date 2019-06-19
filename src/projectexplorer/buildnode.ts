import { ProjectExplorerNodeBase, ProjectExplorerNode } from "./node";
import { ProviderResult, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { HasResourceURI } from './node.hasresourceuri';
import { buildUri } from "../documents/brigaderesource.documentprovider";

export interface ProjectExplorerBuildNode extends ProjectExplorerNodeBase, HasResourceURI {
    readonly nodeType: 'build';
    readonly id: string;
    readonly status: string;
}

export class BuildNode implements ProjectExplorerBuildNode {
    readonly nodeType = 'build';
    constructor(readonly id: string, readonly status: string) {}
    getChildren(): ProviderResult<ProjectExplorerNode[]> {
        return [];
    }
    getTreeItem(): TreeItem | Thenable<TreeItem> {
        const treeItem = new TreeItem(this.id, TreeItemCollapsibleState.None);
        treeItem.contextValue = 'gettable';
        return treeItem;
    }

    resourceURI(): Uri {
        return buildUri(this.id);
    }

}
