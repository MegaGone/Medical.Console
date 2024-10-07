import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly dosage: string;

  @IsString()
  @IsOptional()
  readonly sideEffects: string;
}
