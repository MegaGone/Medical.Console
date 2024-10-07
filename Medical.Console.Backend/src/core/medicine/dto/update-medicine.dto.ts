import { PartialType } from "@nestjs/mapped-types";
import { CreateMedicineDto } from "./create-medicine.dto";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateMedicineDto extends PartialType(CreateMedicineDto) {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsNumber()
  @IsOptional()
  readonly isEnabled: number;
}
