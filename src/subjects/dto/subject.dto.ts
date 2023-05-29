import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';
import { RoomTypeId } from '../../projects/entities';

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    code!: string;

    @IsNotEmpty()
    @IsPositive()
    roomTypeId!: RoomTypeId;
}

const PartialDto = PartialType(CreateSubjectDto);

export class UpdateSubjectDto extends PartialDto {}
