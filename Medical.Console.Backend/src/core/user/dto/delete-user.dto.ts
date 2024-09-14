import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteUserDto {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    id: number
}