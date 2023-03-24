import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '../config/config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import JwtStrategy from './strategies/jwt.strategy';
import LocalStrategy from './strategies/local.strategy';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.auth.jwtSecretKey;
                const expirySecs = config.auth.jwtExpiryMs / 60;
                return { secret, signOptions: { expiresIn: expirySecs } };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
