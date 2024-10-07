import { User } from "./entities";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedService } from "./seed/seed.service";
import { BcryptService } from "../shared/services";
import { UserController } from "./user.controller";
import { Module, OnModuleInit } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  providers: [UserService, BcryptService, SeedService, ConfigService],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly _seed: SeedService,
    private readonly _config: ConfigService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const seed = await this._config.get<boolean>("global.seed");
    const password = await this._config.get<string>("global.password_base");

    if (!seed) return;
    this._seed.onSeed(password);
  }
}
