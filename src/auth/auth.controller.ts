import {
    BadRequestException,
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthUser, JwtUser } from '../common/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { User, UserId } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard, LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async fetchLoggedInUser(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Query('withProfile', new DefaultValuePipe('false'), ParseBoolPipe)
        loadProfile: boolean,
    ) {
        const user = await this.usersService.findOne(userId, { loadProfile });
        return user;
    }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        dto.password = await this.authService.generateHash(dto.password);
        return await this.usersService.create(dto);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@AuthUser() user: User) {
        return { accessToken: this.authService.getSignedJwt(user) };
    }

    @Patch('password')
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Body() dto: UpdatePasswordDto,
    ) {
        const user = await this.usersService.ensureExists(userId);
        const { oldPassword: oldPass, newPassword: newPass } = dto;
        if (!(await this.authService.isValidPassword(oldPass, user.password))) {
            throw new BadRequestException('Incorrect original password');
        }
        return await this.usersService.updatePassword(userId, newPass);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteAccount(@JwtUser('userId', ParseIntPipe) userId: UserId) {
        await this.usersService.delete(userId);
    }
}
