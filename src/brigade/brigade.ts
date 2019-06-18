import * as vscode from 'vscode';

import * as config from '../config/config';
import { Errorable } from '../utils/errorable';
import * as shell from '../utils/shell';
import { ProjectSummary } from './brigade.objectmodel';

const logChannel = vscode.window.createOutputChannel("Duffle");

async function invokeObj<T>(sh: shell.Shell, command: string, args: string, opts: shell.ExecOpts, fn: (stdout: string) => T): Promise<Errorable<T>> {
    const bin = config.brigPath() || 'brig';
    const cmd = `${bin} ${command} ${args}`;
    logChannel.appendLine(`$ ${cmd}`);
    return await sh.execObj<T>(
        cmd,
        `duffle ${command}`,
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
        return stdout.split('\n')
            .map((l) => l.trim())
            .filter((l) => l.length > 0)
            .map((l) => l.split(/\s\s+/))
            .map((bits) => ({ name: bits[0], id: bits[1] }));
    }
    return invokeObj(sh, 'project list', '', {}, parse);
}
