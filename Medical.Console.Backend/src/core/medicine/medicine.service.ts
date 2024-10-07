import { FindOptionsWhere, Repository } from "typeorm";
import { Medicine } from "./entities";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MedicineService {
  private readonly _logger: Logger;

  constructor(
    @InjectRepository(Medicine)
    private readonly _repository: Repository<Medicine>,
  ) {
    this._logger = new Logger(MedicineService.name);
  }

  public async create(record: Partial<Medicine>): Promise<boolean> {
    try {
      const { identifiers } = await this._repository.insert(record);
      const { id } = identifiers[0];

      return id && id >= 1;
    } catch (error) {
      this._logger.error("[ERROR][MEDICINE][CREATE]", error);
      return false;
    }
  }

  public async findOne(options: FindOptionsWhere<Medicine>): Promise<Medicine> {
    try {
      const record = await this._repository.findOne({
        where: options,
      });

      if (!record) throw new NotFoundException("Medicine not founded.");

      return record;
    } catch (error) {
      this._logger.error("[ERROR][MEDICINE][FIND BY ID]", error);
      return null;
    }
  }

  public async update(id: number, record: Partial<Medicine>): Promise<boolean> {
    try {
      const { affected } = await this._repository.update(
        {
          id,
        },
        record,
      );

      return affected >= 1;
    } catch (error) {
      this._logger.error("[ERROR][MEDICINE][UPDATE]", error);
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
      this._logger.error("[ERROR][MEDICINE][DISABLE]", error);
      return false;
    }
  }

  public async findPaginated(
    page: number,
    size: number,
  ): Promise<{ data: Array<Medicine>; count: number }> {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const [data, count] = await this._repository.findAndCount({
        take,
        skip,
      });

      return { data, count };
    } catch (error) {
      this._logger.error("[ERROR][MEDICINE][FIND PAGINATED]", error);
      return { data: [], count: -1 };
    }
  }
}
