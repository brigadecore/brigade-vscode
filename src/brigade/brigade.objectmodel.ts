import { Age } from "../utils/age";

export type BuildStatus =
    'Pending' |
    'Running' |
    'Succeeded' |
    'Failed' |
    'Unknown';

export interface ProjectSummary {
    readonly name: string;
    readonly id: string;
    readonly repo: string;
}

export interface BuildSummary {
    readonly id: string;
    readonly status: BuildStatus;
    readonly age: Age;
}

export interface ProjectRunResult {
    readonly buildId: string;
    readonly workerId: string;
}
