import { ROLE_ENUM } from "../auth/enums";
import { RoleGuard } from "../auth/guards";
import { Roles } from "../auth/decorators";
import { PatientService } from "./patient.service";
import { BcryptService } from "../shared/services";
import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  BadRequestException,
} from "@nestjs/common";
import {
  CreatePatientDto,
  DeletePatientDto,
  UpdatePatientDto,
  FindPatientByIDto,
  FindPatientsPaginatedDto,
} from "./dto";

@Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.DOCTOR)
@UseGuards(RoleGuard)
@Controller("patient")
export class PatientController {
  constructor(private readonly _service: PatientService) {}

  @Post("/create")
  public async create(@Body() createPatientDto: CreatePatientDto) {
    const existEmail = await this._service.emailIsAlreadyUsed(createPatientDto.email);
    if (existEmail) throw new BadRequestException("Email already in use.");

    const stored = await this._service.create({
      ...createPatientDto,
      password: await BcryptService.hash(createPatientDto.password),
    });

    return { stored };
  }

  @Get("/findPaginated")
  findAll(@Query() findPatientsPaginatedDto: FindPatientsPaginatedDto) {
    return this._service.findPaginated(
      findPatientsPaginatedDto.page,
      findPatientsPaginatedDto.pageSize,
    );
  }

  @Get("/findById/:id")
  findOne(@Param() findPatientByIDto: FindPatientByIDto) {
    const { id } = findPatientByIDto;
    return this._service.findOneById(id);
  }

  @Put("/update")
  public async update(@Body() updatePatientDto: UpdatePatientDto) {
    const { id, password, ...body } = updatePatientDto;

    const updated = await this._service.update(id, {
      ...body,
      password: password ? await BcryptService.hash(password) : undefined,
    });
    return { updated };
  }

  @Delete("/delete/:id")
  public async remove(@Param() deletePatientDto: DeletePatientDto) {
    const { id } = deletePatientDto;
    const deleted = await this._service.disable(id);
    return { deleted };
  }
}
