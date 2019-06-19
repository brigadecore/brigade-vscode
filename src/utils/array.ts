interface Array<T> {
    orderBy<U>(keySelector: (t: T) => U): T[];
}

if (!Array.prototype.orderBy) {
    Array.prototype.orderBy = function<T, U>(this: T[], keySelector: (t: T) => U): T[] {
        const arr = Array.of<T>(...this);
        function compareFn(x: T, y: T) {
            const kx = keySelector(x);
            const ky = keySelector(y);
            if (kx < ky) {
                return -1;
            } else if (kx > ky) {
                return 1;
            } else {
                return 0;
            }
        }
        arr.sort(compareFn);
        return arr;
    };
}
