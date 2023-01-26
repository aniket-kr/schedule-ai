import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export default class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;
}
