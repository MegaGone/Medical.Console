import { ROLE_ENUM } from "../auth/enums";
import { Roles } from "../auth/decorators";
import { RoleGuard } from "../auth/guards";
import { MedicineService } from "./medicine.service";
import {
  FindMedicineDto,
  CreateMedicineDto,
  DeleteMedicineDto,
  UpdateMedicineDto,
  SearchMedicineAsyncDto,
  FindMedicinesPaginatedDto,
} from "./dto";
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

@Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.DOCTOR)
@UseGuards(RoleGuard)
@Controller("medicine")
export class MedicineController {
  constructor(private readonly _service: MedicineService) {}

  @Post("/create")
  public async create(@Body() createMedicineDto: CreateMedicineDto) {
    const existMedicine = await this._service.findOne({ name: createMedicineDto.name });
    if (existMedicine) throw new BadRequestException("Medicine already exists.");

    const stored = await this._service.create({ ...createMedicineDto });
    return { stored };
  }

  @Get("/findPaginated")
  public async findPaginated(@Query() findMedicinesPaginatedDto: FindMedicinesPaginatedDto) {
    const { page, pageSize } = findMedicinesPaginatedDto;
    return await this._service.findPaginated(page, pageSize);
  }

  @Get("/findById/:id")
  public async findOne(@Param() findMedicineDto: FindMedicineDto) {
    const { id } = findMedicineDto;
    return await this._service.findOne({ id: id });
  }

  @Put("/update")
  public async update(@Body() updateMedicineDto: UpdateMedicineDto) {
    const { id, ...body } = updateMedicineDto;
    const updated = await this._service.update(id, body);

    return { updated };
  }

  @Delete("/delete/:id")
  public async disable(@Param() deleteMedicineDto: DeleteMedicineDto) {
    const { id } = deleteMedicineDto;
    const disabled = await this._service.disable(id);
    return { disabled };
  }

  @Get("/search")
  public async searchAsync(@Query() searchMedicineAsyncDto: SearchMedicineAsyncDto) {
    const { input } = searchMedicineAsyncDto;
    return this._service.search(input);
  }
}
