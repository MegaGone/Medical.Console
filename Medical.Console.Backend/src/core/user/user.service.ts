import { User } from "./entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
  ) {}

  public async create(record: Partial<User>): Promise<boolean> {
    try {
      const { identifiers } = await this._repository.insert(record);
      const { id } = identifiers[0];

      return id && id >= 1 ? true : false;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findOneById(id: number): Promise<User> {
    try {
      const record = await this._repository.findOne({
        where: {
          id,
        },
      });

      return record;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async update(id: number, record: Partial<User>): Promise<boolean> {
    try {
      const { affected } = await this._repository.update(
        {
          id,
        },
        record,
      );

      return affected >= 1;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async disable(id: number): Promise<boolean> {
    try {
      const { affected } = await this._repository.update(
        {
          id,
        },
        {
          isEnabled: 0,
        },
      );

      return affected >= 1;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findPaginated(page: number, size: number) {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const [data, count] = await this._repository.findAndCount({
        take,
        skip,
      });

      return { data, count };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async emailIsAlreadyUsed(email: string): Promise<boolean> {
    try {
      const user = await this._repository.findOne({
        where: {
          email,
        },
      });

      return !user ? false : true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
