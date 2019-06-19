import { ProjectExplorerNodeBase, ProjectExplorerNode } from "./node";
import { ProviderResult, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { HasResourceURI } from './node.hasresourceuri';
import { buildUri } from "../documents/brigaderesource.documentprovider";
import { Age } from "../utils/age";

export interface ProjectExplorerBuildNode extends ProjectExplorerNodeBase, HasResourceURI {
    readonly nodeType: 'build';
    readonly id: string;
    readonly status: string;
    readonly age: Age;
}

export class BuildNode implements ProjectExplorerBuildNode {
    readonly nodeType = 'build';
    constructor(readonly id: string, readonly status: string, readonly age: Age) {}
    getChildren(): ProviderResult<ProjectExplorerNode[]> {
        return [];
    }
    getTreeItem(): TreeItem | Thenable<TreeItem> {
        const label = `${Age.asAgo(this.age)} (${this.id})`;
        const treeItem = new TreeItem(label, TreeItemCollapsibleState.None);
        treeItem.contextValue = 'gettable';
        return treeItem;
    }

    resourceURI(): Uri {
        return buildUri(this.id);
    }

}
