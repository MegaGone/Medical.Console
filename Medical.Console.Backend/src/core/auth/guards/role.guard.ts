import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles)
      return true;

    const { role } = context.switchToHttp().getRequest();
    return role === requiredRoles;
  }
}
