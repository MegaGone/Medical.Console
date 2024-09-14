import { Module } from '@nestjs/common';
import { User } from '../user/entities';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    SharedModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>("global.secret"),
        signOptions: { expiresIn: configService.get<string>("global.jwt_expiration") }
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}
