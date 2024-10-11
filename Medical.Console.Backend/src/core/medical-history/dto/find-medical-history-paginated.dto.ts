import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class FindHistoryPaginatedDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  pageSize: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  patientId: number;
}
