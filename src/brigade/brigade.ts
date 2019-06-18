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
        // TODO: replace with a table parser
        const lines = stdout.split('\n');
        const body = lines.slice(1);
        return body.map((l) => l.trim())
            .filter((l) => l.length > 0)
            .map((l) => l.split('\t'))
            .map((bits) => ({ name: bits[0].trim(), id: bits[1].trim(), repo: bits[2].trim() }));
    }
    return invokeObj(sh, 'project list', '', {}, parse);
}
