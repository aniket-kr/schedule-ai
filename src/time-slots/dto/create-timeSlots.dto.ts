import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class CreateTimeSlotDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
}
