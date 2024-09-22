import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../decorators";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _jwt: JwtService,
    private readonly _reflector: Reflector,
    private readonly _config: ConfigService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this._extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this._jwt.verifyAsync(token, {
        secret: this._config.get<string>("global.secret"),
      });

      request["uid"] = payload?.uid;
      request["role"] = payload?.role;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
