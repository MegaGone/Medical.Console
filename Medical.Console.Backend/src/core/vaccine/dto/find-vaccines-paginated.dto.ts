import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FindVaccinesPaginatedDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  pageSize: number;
}
