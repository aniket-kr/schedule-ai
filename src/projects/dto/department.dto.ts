import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}

const PartialDto = PartialType(CreateDepartmentDto);
export class UpdateDepartmentDto extends PartialDto {}
