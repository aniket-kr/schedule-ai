import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}

export class UpdateProjectDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    owner?: string;
}
