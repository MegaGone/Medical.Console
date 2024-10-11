import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMedicalHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly doctorId: number;

  @IsString()
  @IsNotEmpty()
  readonly notes: string;

  @IsString()
  @IsNotEmpty()
  readonly diagnosis: string;

  @IsString()
  @IsNotEmpty()
  readonly treatment: string;

  @IsArray()
  @IsOptional()
  readonly vaccineIds: Array<number>;

  @IsArray()
  @IsOptional()
  readonly medicineIds: Array<number>;
}
