import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoomTypeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name!: string;
}

const PartialDto = PartialType(CreateRoomTypeDto);

export class UpdateRoomTypeDto extends PartialDto {}
