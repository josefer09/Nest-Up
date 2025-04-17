import { createParamDecorator, SetMetadata } from '@nestjs/common';

export const RawHeader = createParamDecorator(
    ( data, context ) => {
        const req = context.switchToHttp().getRequest();
        return req.rawHeaders;
    }
)
