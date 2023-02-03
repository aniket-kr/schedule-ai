import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class CreateDivisionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
}
