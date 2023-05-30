import { IsEnum, IsInt, IsPositive, IsString, Max } from 'class-validator';
import { Day } from '../entities';
import { PartialType } from '@nestjs/mapped-types';

const MAX_MINUTES = 23 * 60 + 59; // 23:59 -> 23 hrs * 60 mins + 59 mins
export class CreateTimeSlotDto {
    @IsInt()
    @IsPositive()
    @Max(MAX_MINUTES, {
        message: `Start time must be less than 23:59 (${MAX_MINUTES})`,
    })
    startTime!: number;

    @IsInt()
    @IsPositive()
    @Max(MAX_MINUTES, {
        message: `End time must be less than 23:59 (${MAX_MINUTES})`,
    })
    endTime!: number;

    @IsString()
    @IsEnum(Day)
    day!: Day;
}

const PartialDto = PartialType(CreateTimeSlotDto);

export class UpdateTimeSlotDto extends PartialDto {}
