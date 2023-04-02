export class Page<T> {
    static nextFromCurrent<U>(
        items: U[],
        total: number,
        urlPath: string,
        newQueryParams: { page: number; limit: number; [key: string]: any },
    ) {
        const { page, limit } = newQueryParams;
        const hasNext = total > page * limit;
        const nextUrl = hasNext
            ? `${urlPath}?${new URLSearchParams(newQueryParams).toString()}`
            : undefined;
        return new Page(items, total, nextUrl);
    }

    constructor(
        public readonly items: T[],
        public readonly total: number,
        public readonly nextUrl?: string,
    ) {}
}
