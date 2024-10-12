import {
  Get,
  Put,
  Body,
  Post,
  Query,
  Param,
  Delete,
  UseGuards,
  Controller,
  BadRequestException,
} from "@nestjs/common";
import { ROLE_ENUM } from "../auth/enums";
import { Roles } from "../auth/decorators";
import { RoleGuard } from "../auth/guards";
import { VaccineService } from "./vaccine.service";
import {
  FindVaccineDto,
  CreateVaccineDto,
  DeleteVaccineDto,
  UpdateVaccineDto,
  SearchVaccineAsyncDto,
  FindVaccinesPaginatedDto,
} from "./dto";

@Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.DOCTOR)
@UseGuards(RoleGuard)
@Controller("vaccine")
export class VaccineController {
  constructor(private readonly _service: VaccineService) {}

  @Post("/create")
  public async create(@Body() createMedicineDto: CreateVaccineDto) {
    const existMedicine = await this._service.findOne({ name: createMedicineDto.name });
    if (existMedicine) throw new BadRequestException("Medicine already exists.");

    const stored = await this._service.create({ ...createMedicineDto });
    return { stored };
  }

  @Get("/findPaginated")
  public async findPaginated(@Query() findMedicinesPaginatedDto: FindVaccinesPaginatedDto) {
    const { page, pageSize } = findMedicinesPaginatedDto;
    return await this._service.findPaginated(page, pageSize);
  }

  @Get("/findById/:id")
  public async findOne(@Param() findMedicineDto: FindVaccineDto) {
    const { id } = findMedicineDto;
    return await this._service.findOne({ id: id });
  }

  @Put("/update")
  public async update(@Body() updateMedicineDto: UpdateVaccineDto) {
    const { id, ...body } = updateMedicineDto;
    const updated = await this._service.update(id, body);

    return { updated };
  }

  @Delete("/delete/:id")
  public async disable(@Param() deleteMedicineDto: DeleteVaccineDto) {
    const { id } = deleteMedicineDto;
    const disabled = await this._service.disable(id);
    return { disabled };
  }

  @Get("/search")
  public async searchAsync(@Query() searchVaccineAsyncDto: SearchVaccineAsyncDto) {
    const { input } = searchVaccineAsyncDto;
    return this._service.search(input);
  }
}
