import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { UserId } from '../../users/entities/user.entity';
import { UserToken } from '../contracts/user-token.contract';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.auth.jwtSecretKey,
        });
    }

    validate(payload: { email: string; sub: UserId }): UserToken {
        const { sub: userId, email } = payload;
        return { userId, email };
    }
}
