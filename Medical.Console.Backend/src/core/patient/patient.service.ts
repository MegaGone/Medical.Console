import { Repository } from "typeorm";
import { User } from "../user/entities";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ROLE_ENUM } from "../auth/enums";

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
  ) {}

  public async create(record: Partial<User>): Promise<boolean> {
    try {
      const { identifiers } = await this._repository.insert({ ...record, role: ROLE_ENUM.PATIENT });
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
          role: ROLE_ENUM.PATIENT,
        },
      });

      if (!record) throw new Error("Patient not found");

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
          role: ROLE_ENUM.PATIENT,
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
          role: ROLE_ENUM.PATIENT,
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
        where: {
          role: ROLE_ENUM.PATIENT,
        },
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
