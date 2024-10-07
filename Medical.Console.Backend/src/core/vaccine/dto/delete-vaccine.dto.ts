import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteVaccineDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  readonly id: number;
}
