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
          isEnabled: 1,
        },
        select: ["id", "isEnabled", "password", "role"],
      });

      return record;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
