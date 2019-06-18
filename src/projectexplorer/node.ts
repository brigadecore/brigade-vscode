import { ProjectExplorerProjectNode } from "./projectnode";
import { ProjectExplorerMessageNode } from "./messagenode";
import { ProviderResult, TreeItem } from "vscode";

export interface ProjectExplorerNodeBase {
    getChildren(): ProviderResult<ProjectExplorerNode[]>;
    getTreeItem(): TreeItem | Thenable<TreeItem>;
}

export type ProjectExplorerNode =
    ProjectExplorerProjectNode |
    ProjectExplorerMessageNode;
