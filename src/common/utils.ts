import { Request } from 'express';
import * as querystring from 'querystring';
import { URL } from 'url';

export function makeUrl(req: Request, queryParams: { [key: string]: any }) {
    const url = new URL(req.url, `${req.protocol}://${req.headers.host}`);
    url.search = querystring.stringify(queryParams);
    return url.href;
}

export type Nominal<T, Tag> = T & { __brand: Tag };
