import { Module } from '@nestjs/common';
import { User } from '../user/entities';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    SharedModule, 
    JwtModule.register({
      global: true,
      secret: "FbP@Dzr!LL7TP5zknrx&P5&xhcf3o8xNCzYoGCdLco6yQFKa7NPfP@fRNQ!X6eypD?mknfdBgAPq",
      signOptions: { expiresIn: '4h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
