import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { BcryptService } from '../shared/services';
import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _jwt: JwtService,
    private readonly _auth: AuthService, 
  ) {}

  @Post("/login")
  public async signIn(@Body() loginDto: LoginDto) {
    const user = await this._auth.findByEmail(loginDto.email);
    if (!user)
      throw new NotFoundException("User not found.")

    if (!user.isEnabled || user.isEnabled == 0)
      throw new ForbiddenException("User is blocked. Talk with the admin.")

    const isValidPassword = await BcryptService.compare(user.password, loginDto.password);
    if (!isValidPassword)
      throw new BadRequestException("Email/Password incorrect.")

    const payload = {
      uid: user.id,
      role: user.role
    };

    return {
      token: await this._jwt.signAsync(payload)
    }
  }
}
