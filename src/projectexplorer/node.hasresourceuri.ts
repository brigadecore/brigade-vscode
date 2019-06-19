import { Uri } from "vscode";
import { ProjectExplorerNode } from "./node";

export interface HasResourceURI {
    resourceURI(): Uri;
}

export function hasResourceURI(node: ProjectExplorerNode): node is ProjectExplorerNode & HasResourceURI {
    return !!((node as any).resourceURI);
}
