import { ProjectExplorerNodeBase } from "./node";

export interface ProjectExplorerProjectNode extends ProjectExplorerNodeBase {
    readonly nodeTyoe: 'project';
    readonly name: string;
    readonly id: string;
}
