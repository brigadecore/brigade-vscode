import { Dictionary } from "../utils/dictionary";

export function parseTable(tableText: string): Dictionary<string>[] {
    const lines = tableText.split('\n');
    const header = lines.shift();
    if (!header) {
        return [];
    }
    const body = lines.filter((l) => l.length > 0);
    if (body.length === 0) {
        return [];
    }
    return parseTableLines(header, body);
}

const BRIGADE_COLUMN_SEPARATOR = '\t';

function parseTableLines(header: string, body: string[]): Dictionary<string>[] {
    if (header.length === 0 || body.length === 0) {
        return [];
    }
    const columnHeaders = header.toLowerCase().split(BRIGADE_COLUMN_SEPARATOR);
    return body.map((line) => parseLine(line, columnHeaders));
}

function parseLine(line: string, columnHeaders: string[]) {
    const lineInfoObject = Dictionary.of<string>();
    const bits = line.split(BRIGADE_COLUMN_SEPARATOR);
    bits.forEach((columnValue, index) => {
        lineInfoObject[columnHeaders[index].trim()] = columnValue.trim();
    });
    return lineInfoObject;
}
