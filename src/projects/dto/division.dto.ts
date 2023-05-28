import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateDivisionDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsPositive()
    @IsInt()
    strength!: number;
}

const PartialDto = PartialType(CreateDivisionDto);

export class UpdateDivisionDto extends PartialDto {}
