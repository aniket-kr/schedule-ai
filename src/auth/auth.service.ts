import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '../config/config.service';
import CreateUserDto from '../users/dto/create-user.dto';
import UpdateUserDto from '../users/dto/update-user.dto';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async generateHash(password: string) {
        return bcrypt.hash(password, this.config.auth.saltRounds);
    }

    async isValidPassword(password: string, encrpyted: string) {
        return bcrypt.compare(password, encrpyted);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.fetchOne({ email });
        return (await this.isValidPassword(password, user.passwordHash))
            ? user
            : null;
    }

    getSignedJwt(user: User) {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    getUser(userId: number) {
        return this.usersService.fetchOne({ id: userId });
    }

    createUser(userDto: CreateUserDto) {
        return this.usersService.create({ dto: userDto });
    }

    updateUser(userId: number, @Body() userDto: UpdateUserDto) {
        return this.usersService.update({ id: userId, dto: userDto });
    }

    deleteUser(userId: number) {
        return this.usersService.delete({ id: userId });
    }
}
