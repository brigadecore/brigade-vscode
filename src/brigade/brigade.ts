import * as vscode from 'vscode';

import * as config from '../config/config';
import { Errorable } from '../utils/errorable';
import * as shell from '../utils/shell';
import { ProjectSummary, BuildSummary } from './brigade.objectmodel';
import { parseTable } from './parsers';
import { Age } from '../utils/age';

const logChannel = vscode.window.createOutputChannel("Brigade");

async function invokeObj<T>(sh: shell.Shell, command: string, args: string, opts: shell.ExecOpts, fn: (stdout: string) => T): Promise<Errorable<T>> {
    const bin = config.brigPath() || 'brig';
    const brigadeNamespace = config.getConfiguredNamespace() || 'default';
    const nsarg = `--namespace ${brigadeNamespace}`;
    const cmd = `${bin} ${command} ${args} ${nsarg}`;
    logChannel.appendLine(`$ ${cmd}`);
    return await sh.execObj<T>(
        cmd,
        `brig ${command}`,
        opts,
        andLog(fn)
    );
}

function andLog<T>(fn: (s: string) => T): (s: string) => T {
    return (s: string) => {
        logChannel.appendLine(s);
        return fn(s);
    };
}

export function listProjects(sh: shell.Shell): Promise<Errorable<ProjectSummary[]>> {
    function parse(stdout: string): ProjectSummary[] {
        return parseTable(stdout).map((d) => ({
            name: d.name,
            id: d.id,
            repo: d.repo
        }));
    }
    return invokeObj(sh, 'project list', '', {}, parse);
}

export function getProject(sh: shell.Shell, projectId: string): Promise<Errorable<string>> {
    return invokeObj(sh, 'project get', projectId, {}, (s) => s);
}

export function listBuilds(sh: shell.Shell, projectId: string): Promise<Errorable<BuildSummary[]>> {
    function parse(stdout: string): BuildSummary[] {
        return parseTable(stdout).map((d) => ({
            id: d.id,
            status: d.status,
            age: Age.fromKubernetesShort(d.age)
        }));
    }
    return invokeObj(sh, 'build list', projectId, {}, parse);
}

export function getBuild(sh: shell.Shell, buildId: string): Promise<Errorable<string>> {
    return invokeObj(sh, 'build get', buildId, {}, (s) => s);
}
