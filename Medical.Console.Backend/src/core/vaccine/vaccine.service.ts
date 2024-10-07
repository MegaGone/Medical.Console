import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vaccine } from "./entities";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class VaccineService {
  private readonly _logger: Logger;

  constructor(
    @InjectRepository(Vaccine)
    private readonly _repository: Repository<Vaccine>,
  ) {
    this._logger = new Logger(VaccineService.name);
  }

  public async create(record: Partial<Vaccine>): Promise<boolean> {
    try {
      const { identifiers } = await this._repository.insert(record);
      const { id } = identifiers[0];

      return id && id >= 1;
    } catch (error) {
      this._logger.error("[ERROR][VACCINE][CREATE]", error);
      return false;
    }
  }

  public async findOne(options: FindOptionsWhere<Vaccine>): Promise<Vaccine> {
    try {
      const record = await this._repository.findOne({
        where: options,
      });

      if (!record) throw new NotFoundException("Vaccine not founded.");

      return record;
    } catch (error) {
      this._logger.error("[ERROR][VACCINE][FIND BY ID]", error);
      return null;
    }
  }

  public async update(id: number, record: Partial<Vaccine>): Promise<boolean> {
    try {
      const { affected } = await this._repository.update(
        {
          id,
        },
        record,
      );

      return affected >= 1;
    } catch (error) {
      this._logger.error("[ERROR][VACCINE][UPDATE]", error);
      return false;
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
      this._logger.error("[ERROR][VACCINE][DISABLE]", error);
      return false;
    }
  }

  public async findPaginated(
    page: number,
    size: number,
  ): Promise<{ data: Array<Vaccine>; count: number }> {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const [data, count] = await this._repository.findAndCount({
        take,
        skip,
      });

      return { data, count };
    } catch (error) {
      this._logger.error("[ERROR][VACCINE][FIND PAGINATED]", error);
      return { data: [], count: -1 };
    }
  }
}
