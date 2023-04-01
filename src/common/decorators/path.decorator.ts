import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UrlPath = createParamDecorator(
    (_: never, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return new URL(request.url).pathname;
    },
);
