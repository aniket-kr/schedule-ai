import {
    IsEmail,
    IsNotEmpty,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    email!: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    @IsNotEmpty()
    @MaxLength(60)
    password!: string;
}
