import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FindMedicinesPaginatedDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  pageSize: number;
}
