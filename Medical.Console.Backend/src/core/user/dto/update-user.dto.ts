import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsOptional()
    isEnabled!: number
}
