import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteMedicalHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => +value)
  id: number;
}
