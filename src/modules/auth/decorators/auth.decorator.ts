import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../enums';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../guards/user-roles/user-roles.guard';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards( AuthGuard(), UserRolesGuard)
    )
}
