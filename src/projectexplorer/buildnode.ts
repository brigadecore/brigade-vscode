import { ProjectExplorerNodeBase, ProjectExplorerNode } from "./node";
import { ProviderResult, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { HasResourceURI } from './node.hasresourceuri';
import { buildUri } from "../documents/brigaderesource.documentprovider";
import { Age } from "../utils/age";
import { BuildStatus } from "../brigade/brigade.objectmodel";
import { extensionContext } from "../extension";
import { cantHappen } from "../utils/never";
import { contextOf } from "./contextutil";

export interface ProjectExplorerBuildNode extends ProjectExplorerNodeBase, HasResourceURI {
    readonly nodeType: 'build';
    readonly id: string;
    readonly status: string;
    readonly age: Age;
}

export class BuildNode implements ProjectExplorerBuildNode {
    readonly nodeType = 'build';
    constructor(readonly id: string, readonly status: BuildStatus, readonly age: Age) {}
    getChildren(): ProviderResult<ProjectExplorerNode[]> {
        return [];
    }
    getTreeItem(): TreeItem | Thenable<TreeItem> {
        const label = `${Age.asAgo(this.age)} (${this.id})`;
        const treeItem = new TreeItem(label, TreeItemCollapsibleState.None);
        treeItem.iconPath = iconPathForStatus(this.status);
        treeItem.contextValue = contextOf('brigade.build', 'gettable', this.rerunnableContext());
        return treeItem;
    }

    resourceURI(): Uri {
        return buildUri(this.id);
    }

    private rerunnableContext(): string | undefined {
        if (this.status === 'Pending' || this.status === 'Running') {
            return undefined;
        }
        return 'rerunnable';
    }
}

function iconPathForStatus(status: BuildStatus): Uri {
    switch (status) {
        case 'Failed':
        case 'Unknown':
            return Uri.file(extensionContext().asAbsolutePath("images/build_problem.svg"));
        case 'Pending':
        case 'Running':
            return Uri.file(extensionContext().asAbsolutePath("images/build_in_progress.svg"));
        case 'Succeeded':
            return Uri.file(extensionContext().asAbsolutePath("images/build_succeeded.svg"));
    }
    return cantHappen(status);
}
