import { DepartmentId, RoomTypeId } from '../entities';
import {
    IsInt,
    IsNotEmpty,
    IsPositive,
    IsString,
    MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code!: string;

    @IsInt()
    @IsPositive()
    capacity!: number;

    @IsInt()
    @IsPositive()
    typeId!: RoomTypeId;

    @IsInt()
    @IsPositive()
    departmentId!: DepartmentId;
}

const PartialDto = PartialType(CreateRoomDto);

export class UpdateRoomDto extends PartialDto {}
