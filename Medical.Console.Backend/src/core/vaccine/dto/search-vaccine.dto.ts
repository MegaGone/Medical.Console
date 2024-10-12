import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchVaccineAsyncDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly input: string;
}
