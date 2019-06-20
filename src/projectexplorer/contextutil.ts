export function contextOf(...contexts: (string | undefined)[]): string {
    return contexts.filter((c) => !!c)
                   .join(' ');
}