import { Age } from "../utils/age";

export interface ProjectSummary {
    readonly name: string;
    readonly id: string;
    readonly repo: string;
}

export interface BuildSummary {
    readonly id: string;
    readonly status: string;
    readonly age: Age;
}
