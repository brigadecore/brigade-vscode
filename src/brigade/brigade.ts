import * as vscode from 'vscode';

import * as config from '../config/config';
import { Errorable } from '../utils/errorable';
import * as shell from '../utils/shell';
import { ProjectSummary, BuildSummary, BuildStatus, ProjectRunResult } from './brigade.objectmodel';
import { parseTable } from './parsers';
import { Age } from '../utils/age';

const logChannel = vscode.window.createOutputChannel("Brigade");
const terminalName = "Brigade";

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
            status: d.status as BuildStatus,
            age: Age.fromKubernetesShort(d.age)
        }));
    }
    return invokeObj(sh, 'build list', projectId, {}, parse);
}

export function getBuild(sh: shell.Shell, buildId: string): Promise<Errorable<string>> {
    return invokeObj(sh, 'build get', buildId, {}, (s) => s);
}

export function getBuildLogs(sh: shell.Shell, buildId: string): Promise<Errorable<string>> {
    const args = `${buildId} --jobs`;
    return invokeObj(sh, 'build logs', args, {}, (s) => s);
}

export function run(sh: shell.Shell, projectId: string): Promise<Errorable<ProjectRunResult | undefined>> {
    function parse(stdout: string): ProjectRunResult | undefined {
        const regexp = /Build: ([a-zA-Z0-9]+), Worker: ([-a-zA-Z0-9]+)/;
        const match = regexp.exec(stdout);
        if (!match || !match[1] || !match[2]) {
            return undefined;
        }
        return { buildId: match[1], workerId: match[2] };
    }
    return invokeObj(sh, 'run', `${projectId} --no-color --no-progress -b`, {}, parse);
}

export function rerun(sh: shell.Shell, buildId: string): Promise<Errorable<ProjectRunResult | undefined>> {
    function parse(stdout: string): ProjectRunResult | undefined {
        const regexp = /Build: ([a-zA-Z0-9]+), Worker: ([-a-zA-Z0-9]+)/;
        const match = regexp.exec(stdout);
        if (!match || !match[1] || !match[2]) {
            return undefined;
        }
        return { buildId: match[1], workerId: match[2] };
    }
    return invokeObj(sh, 'rerun', `${buildId}`, {}, parse);
}

export async function openWebDashboard(): Promise<void> {
    const bin = config.brigPath() || 'brig';
    const brigadeNamespace = config.getConfiguredNamespace() || 'default';
    const port = config.getConfiguredPort() || 8081;
    const open = config.openDashboard();
    const args = `--namespace ${brigadeNamespace} --port ${port} --open-dashboard=${open}`;
    const cmd = `${bin} dashboard ${args}`;

    const terminal = ensureTerminal();
    terminal.sendText(cmd);
    terminal.show();
}

function ensureTerminal(): vscode.Terminal {
    const terminals = vscode.window.terminals;
    for (const term of terminals) {
        if (term.name === terminalName) {
            return term;
        }
    }

    return vscode.window.createTerminal(terminalName);
}