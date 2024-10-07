import { User } from "../entities";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user.service";
import { ROLE_ENUM } from "src/core/auth/enums";
import { BcryptService } from "src/core/shared/services";

@Injectable()
export class SeedService {
  constructor(private readonly _service: UserService) {}

  public async onSeed(password: string): Promise<void> {
    try {
      if (!password) {
        return console.log("[ERROR][SEED] PASSWORD NOT PROVIDED.");
      }

      const { count } = await this._service.findPaginated(1, 10);
      if (count || count >= 1) {
        return console.log("[ERROR][SEED] DB ALREADY SEEDED.");
      }

      const user = await this._getUserToSeed(password);
      this._service.create(user);
      console.log("[SUCCESS][SEED] DB SEEDED.");
    } catch (error) {
      console.log("[ERROR][SEED] ", error);
    }
  }

  private async _getUserToSeed(password: string): Promise<Partial<User>> {
    return {
      lastName: "01",
      role: ROLE_ENUM.ADMIN,
      email: "admin@gmail.com",
      firstName: "Administrador",
      displayName: "Administrador 01",
      password: await BcryptService.hash(password),
    };
  }
}
