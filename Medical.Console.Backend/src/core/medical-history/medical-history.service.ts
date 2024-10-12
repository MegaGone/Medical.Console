import { FindOptionsWhere, Repository } from "typeorm";
import { MedicalHistory, UserMedicineData, UserVaccineData } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ROLE_ENUM } from "../auth/enums";

@Injectable()
export class MedicalHistoryService {
  private readonly _logger: Logger;

  constructor(
    @InjectRepository(MedicalHistory)
    private readonly _repository: Repository<MedicalHistory>,
    @InjectRepository(UserVaccineData)
    private readonly _vaccine: Repository<UserVaccineData>,
    @InjectRepository(UserMedicineData)
    private readonly _medicine: Repository<UserMedicineData>,
  ) {}

  public async create(
    record: Partial<MedicalHistory>,
    vaccineIds: Array<number>,
    medicineIds: Array<number>,
  ): Promise<boolean> {
    try {
      const { identifiers } = await this._repository.insert(record);
      const { id } = identifiers[0];

      if (!id && id < 1) return false;

      const vaccines = await this._insertVaccines(vaccineIds, id);
      const medicines = await this._insertMedicines(medicineIds, id);

      return vaccines && medicines;
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][CREATE]", error);
      return false;
    }
  }

  public async findOne(
    options: FindOptionsWhere<MedicalHistory>,
  ): Promise<{ data: MedicalHistory }> {
    try {
      const record = await this._repository.findOne({
        where: options,
        order: {
          createdAt: "DESC",
        },
        relations: {
          doctor: true,
          vaccines: {
            vaccine: true,
          },
          medicines: {
            medicine: true,
          },
        },
        select: {
          doctor: {
            id: true,
            email: true,
            displayName: true,
          },
          vaccines: {
            id: true,
            vaccine: {
              id: true,
              name: true,
              description: true,
            },
          },
          medicines: {
            id: true,
            medicine: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      if (!record) throw new NotFoundException("MedicalHistory not founded.");

      return { data: record };
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
          isEnabled: role !== ROLE_ENUM.PATIENT ? undefined : 1,
        },
        relations: {
          doctor: true,
        },
        select: {
          doctor: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      });

      return { count, data };
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][FIND PAGINATED]", error);
      return { data: [], count: -1 };
    }
  }

  private async _insertVaccines(vaccineIds: Array<number>, historyId: number): Promise<boolean> {
    try {
      if (!vaccineIds || !vaccineIds?.length) return true;

      const vaccines: Array<Partial<UserVaccineData>> = vaccineIds?.map((v: number) => {
        return {
          vaccineId: v,
          medicalHistoryId: historyId,
        };
      });

      const { identifiers } = await this._vaccine.insert(vaccines);
      return identifiers && identifiers?.length >= 1;
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][INSERT VACCINES]", error);
      return false;
    }
  }

  private async _insertMedicines(medicineIds: Array<number>, historyId: number): Promise<boolean> {
    try {
      if (!medicineIds || !medicineIds?.length) return true;

      const medicines: Array<Partial<UserMedicineData>> = medicineIds?.map((m: number) => {
        return {
          medicineId: m,
          medicalHistoryId: historyId,
        };
      });

      const { identifiers } = await this._medicine.insert(medicines);
      return identifiers && identifiers?.length >= 1;
    } catch (error) {
      this._logger.error("[ERROR][MEDICAL HISTORY][INSERT MEDICINES]", error);
      return false;
    }
  }
}
