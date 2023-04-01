import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtUser } from '../common/decorators/user.decorator';
import { ensureMimetype } from '../common/file-filters';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

const AVATAR_FILE_SIZE_MAX_BYTES = 1e7; // 10MB

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    async get(@Query('email') email?: string) {
        if (!email) {
            throw new BadRequestException('email query param is required');
        }
        return await this.profileService.findOneByEmail(email);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: memoryStorage(),
            limits: { fileSize: AVATAR_FILE_SIZE_MAX_BYTES, files: 1 },
            fileFilter: ensureMimetype([
                'image/jpeg',
                'image/png',
                'image/webp',
            ]),
        }),
    )
    async create(
        @JwtUser('email') userEmail: string,
        @Body() dto: CreateProfileDto,
        @UploadedFile() avatar?: Express.Multer.File,
    ) {
        dto.avatar = avatar;
        return await this.profileService.create(userEmail, dto);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: memoryStorage(),
            limits: { fileSize: AVATAR_FILE_SIZE_MAX_BYTES, files: 1 },
            fileFilter: ensureMimetype([
                'image/jpeg',
                'image/png',
                'image/webp',
            ]),
        }),
    )
    async update(
        @JwtUser('email') userEmail: string,
        @Body() dto: UpdateProfileDto,
    ) {
        return await this.profileService.update(userEmail, dto);
    }
}
