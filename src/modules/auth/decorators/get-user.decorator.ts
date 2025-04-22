import { createParamDecorator, InternalServerErrorException, SetMetadata } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string[], context) => {
        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if (!user) throw new InternalServerErrorException('User not found (request).');
        if (Array.isArray(data) && data.length) {
            return data.map(item => {
                if (user.hasOwnProperty(item)) {
                    return user[item];
                } else {
                    return `Not found: ${item}`;
                }
            })
        }
        return user;
    }
)
