import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/enums';


export const META_ROLES = "roles";

export const RoleProtected = (...args: string[]) => {
    return SetMetadata(META_ROLES, args);
}
