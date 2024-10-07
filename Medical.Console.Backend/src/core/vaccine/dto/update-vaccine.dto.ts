import { PartialType } from "@nestjs/mapped-types";
import { CreateVaccineDto } from "./create-vaccine.dto";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateVaccineDto extends PartialType(CreateVaccineDto) {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsNumber()
  @IsOptional()
  readonly isEnabled: number;
}
