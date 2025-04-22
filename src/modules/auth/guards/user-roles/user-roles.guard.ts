import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '@auth/decorators';
import { User } from '@user/entities/user.entity';

@Injectable()
export class UserRolesGuard implements CanActivate {

  private readonly logger = new Logger(UserRolesGuard.name);
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()) ||
    this.reflector.get<string[]>(META_ROLES, context.getClass());

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found.');

    for ( const role of user.roles ) {
      if (validRoles.includes(role.toString())) return true;
    }

    this.logger.error(`User ${user.fullName} need a valid role: [ ${ validRoles } ]`);
    throw new ForbiddenException(`User ${user.fullName} need a valid role`);

  }
}
