import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    firstName!: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName?: string;

    @IsOptional()
    @IsNotEmpty()
    @MaxLength(1000)
    bio?: string;

    avatar?: Express.Multer.File;
}
