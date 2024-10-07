import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FindVaccineDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  readonly id: number;
}
