import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchPatientAsyncDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly input: string;
}
