import { FindOptionsWhere, Repository } from "typeorm";
import { MedicalHistory } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ROLE_ENUM } from "../auth/enums";

@Injectable()
export class MedicalHistoryService {
  private readonly _logger: Logger;

  constructor(
    @InjectRepository(MedicalHistory)
    private readonly _repository: Repository<MedicalHistory>,
  ) {}

  public async create(record: Partial<MedicalHistory>): Promise<boolean> {
    try {
      const { identifiers } = await this._repository.insert(record);
      const { id } = identifiers[0];

      return id && id >= 1;
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][CREATE]", error);
      return false;
    }
  }

  public async findOne(options: FindOptionsWhere<MedicalHistory>): Promise<MedicalHistory> {
    try {
      const record = await this._repository.findOne({
        where: options,
      });

      if (!record) throw new NotFoundException("MedicalHistory not founded.");

      return record;
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][FIND BY ID]", error);
      return null;
    }
  }

  public async update(id: number, record: Partial<MedicalHistory>): Promise<boolean> {
    try {
      const { affected } = await this._repository.update(
        {
          id,
        },
        record,
      );

      return affected >= 1;
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][UPDATE]", error);
      return false;
    }
  }

  public async disable(identificator: string): Promise<boolean> {
    try {
      const { affected } = await this._repository.update(
        {
          identificator,
        },
        {
          isEnabled: 0,
        },
      );

      return affected >= 1;
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][DISABLE]", error);
      return false;
    }
  }

  public async findPaginated(
    page: number,
    size: number,
    patientId: number,
    role: ROLE_ENUM = ROLE_ENUM.PATIENT,
  ): Promise<{ data: Array<MedicalHistory>; count: number }> {
    try {
      const take = size;
      const skip = (page - 1) * size;

      const [data, count] = await this._repository.findAndCount({
        take,
        skip,
        order: {
          createdAt: "DESC",
        },
        where: {
          userId: patientId,
          isEnabled: role === ROLE_ENUM.ADMIN ? undefined : 1,
        },
        relations: {
          doctor: true,
          patient: true,
          // vaccines: true,
          // medicines: true,
        },
      });

      return { data, count };
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][FIND PAGINATED]", error);
      return { data: [], count: -1 };
    }
  }
}
