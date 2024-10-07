import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateVaccineDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly manufacturer: string;

  @IsString()
  @IsOptional()
  readonly doseSchedule: string;
}
