import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
  ) {}

  public async findByEmail(email: string): Promise<Partial<User>> {
    try {
      const record = await this._repository.findOne({
        where: {
          email,
        },
        select: ["id", "isEnabled", "password", "role"],
      });

      return record;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async restorePassword(email: string, password: string): Promise<boolean> {
    try {
      const { affected } = await this._repository.update(
        {
          email,
          isEnabled: 1,
        },
        {
          password,
        },
      );

      console.log("AFFECTED ---------->", affected);

      return affected >= 1;
    } catch (error) {
      console.log("ERROR ----------->", error);
      throw new InternalServerErrorException(error);
    }
  }
}
