export function isPromise<T>(obj: Promise<T> | (() => Promise<T>)): obj is Promise<T> {
    return !!((obj as any).then);
}
