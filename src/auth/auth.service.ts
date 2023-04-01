import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '../config/config.service';
import { User } from '../users/entities/user.entity';
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

    async isValidPassword(password: string, hashed: string) {
        return bcrypt.compare(password, hashed);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.ensureExists(email);
        return (await this.isValidPassword(password, user.password))
            ? user
            : null;
    }

    getSignedJwt(user: User) {
        const payload = { email: user.email, sub: user.userId };
        return this.jwtService.sign(payload);
    }
}
