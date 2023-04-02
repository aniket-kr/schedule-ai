import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    owner?: string;
}
