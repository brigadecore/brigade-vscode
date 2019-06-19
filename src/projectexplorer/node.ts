import { ProjectExplorerProjectNode } from "./projectnode";
import { ProjectExplorerMessageNode } from "./messagenode";
import { ProviderResult, TreeItem } from "vscode";
import { ProjectExplorerBuildNode } from "./buildnode";

export interface ProjectExplorerNodeBase {
    getChildren(): ProviderResult<ProjectExplorerNode[]>;
    getTreeItem(): TreeItem | Thenable<TreeItem>;
}

export type ProjectExplorerNode =
    ProjectExplorerProjectNode |
    ProjectExplorerBuildNode |
    ProjectExplorerMessageNode;
