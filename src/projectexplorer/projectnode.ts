import * as brigade from '../brigade/brigade';
import { shell } from '../utils/shell';
import { ProjectExplorerNodeBase, ProjectExplorerNode } from "./node";
import { ProviderResult, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { succeeded } from '../utils/errorable';
import { MessageNode } from './messagenode';
import { HasResourceURI } from './node.hasresourceuri';
import { projectUri } from '../documents/brigaderesource.documentprovider';

export interface ProjectExplorerProjectNode extends ProjectExplorerNodeBase, HasResourceURI {
    readonly nodeType: 'project';
    readonly name: string;
    readonly id: string;
    readonly repo: string;
}

export class ProjectNode implements ProjectExplorerProjectNode {

    public static async all(): Promise<ProjectExplorerNode[]> {
        const projects = await brigade.listProjects(shell);
        if (succeeded(projects)) {
            return projects.result.map((p) => new ProjectNode(p.name, p.id, p.repo));
        } else {
            return [new MessageNode('Error listing projects', projects.error[0])];
        }
    }

    readonly nodeType = 'project';
    constructor(readonly name: string, readonly id: string, readonly repo: string) {}
    getChildren(): ProviderResult<ProjectExplorerNode[]> {
        return [];
    }
    getTreeItem(): TreeItem | Thenable<TreeItem> {
        const treeItem = new TreeItem(this.name, TreeItemCollapsibleState.None);
        treeItem.contextValue = 'gettable';
        return treeItem;
    }

    resourceURI(): Uri {
        return projectUri(this.id);
    }

}
