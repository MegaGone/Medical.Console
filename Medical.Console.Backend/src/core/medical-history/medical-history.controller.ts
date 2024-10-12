import { Request } from "express";
import { unixDate } from "src/helpers";
import {
  FindMedicalHistoryDto,
  CreateMedicalHistoryDto,
  DeleteMedicalHistoryDto,
  FindHistoryPaginatedDto,
} from "./dto";
import { ROLE_ENUM } from "../auth/enums";
import { RoleGuard } from "../auth/guards";
import { Roles } from "../auth/decorators";
import { MedicalHistoryService } from "./medical-history.service";
import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";

@Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.DOCTOR)
@UseGuards(RoleGuard)
@Controller("medical-history")
export class MedicalHistoryController {
  constructor(private readonly _service: MedicalHistoryService) {}

  @Post("/create")
  public async create(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
    const { vaccineIds, medicineIds } = await createMedicalHistoryDto;

    const stored = await this._service.create(
      {
        identificator: unixDate(),
        ...createMedicalHistoryDto,
      },
      vaccineIds,
      medicineIds,
    );
    return { stored };
  }

  @Get("/findPaginated")
  public async findPaginated(
    @Query() findHistoryPaginatedDto: FindHistoryPaginatedDto,
    @Req() request: Request,
  ) {
    const { page, pageSize, patientId } = findHistoryPaginatedDto;
    return await this._service.findPaginated(
      page,
      pageSize,
      patientId,
      request["role"] ?? ROLE_ENUM.PATIENT,
    );
  }

  @Get("/findById/:identificator")
  public async findOne(@Param() findMedicalHistoryDto: FindMedicalHistoryDto) {
    const { identificator } = findMedicalHistoryDto;
    return await this._service.findOne({ identificator: JSON.stringify(identificator) });
  }

  @Delete("/delete/:id")
  public async disable(@Param() deleteMedicalHistoryDto: DeleteMedicalHistoryDto) {
    const { id } = deleteMedicalHistoryDto;
    const disabled = await this._service.disable(JSON.stringify(id));
    return { disabled };
  }
}
