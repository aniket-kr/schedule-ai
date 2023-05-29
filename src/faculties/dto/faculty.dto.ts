import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFacultyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    code!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    userEmail!: string;
}

const PartialDto = PartialType(CreateFacultyDto);

export class UpdateFacultyDto extends PartialDto {}
