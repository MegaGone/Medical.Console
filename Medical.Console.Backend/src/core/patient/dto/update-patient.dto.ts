import { PartialType } from "@nestjs/mapped-types";
import { CreatePatientDto } from "./create-patient.dto";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsOptional()
  isEnabled!: number;
}
