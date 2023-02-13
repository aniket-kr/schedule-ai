import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtUser } from '../common/decorators/user.decorator';
import { RequiredPipe } from '../common/pipes/required.pipe';
import CreateUserProfileDto from './dto/create-user-profile.dto';
import UpdateUserProfileDto from './dto/update-user-profile.dto';
import { UserProfilesService } from './user-profiles.service';

@Controller('/profile')
export class UserProfilesController {
    constructor(private readonly profilesService: UserProfilesService) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async fetch(@Query('email', new RequiredPipe()) email: string) {
        return await this.profilesService.fetchOne({ user: { email } });
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateUserProfileDto,
    ) {
        return await this.profilesService.create({ userId, dto });
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Body() dto: UpdateUserProfileDto,
    ) {
        return await this.profilesService.update({ userId, dto });
    }
}
