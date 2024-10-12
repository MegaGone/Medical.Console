import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchMedicineAsyncDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly input: string;
}
