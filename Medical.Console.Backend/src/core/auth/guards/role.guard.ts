import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLE_ENUM } from "../enums";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.getAllAndOverride<Array<ROLE_ENUM>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || !requiredRoles?.length) return true;

    const { role } = context.switchToHttp().getRequest();
    return requiredRoles.includes(role);
  }
}
