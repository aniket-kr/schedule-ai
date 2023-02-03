import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
}
