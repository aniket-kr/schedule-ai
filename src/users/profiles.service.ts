import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { S3Service } from '../aws/s3.service';
import { ImagesService } from '../images/images.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { Profile, ProfileId } from './entities';
import { UsersService } from './users.service';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profile)
        private readonly profilesRepo: Repository<Profile>,
        private readonly usersService: UsersService,
        private readonly imagesService: ImagesService,
        private readonly s3Service: S3Service,
    ) {}

    async ensureNotExists(profileId: ProfileId): Promise<void>;
    async ensureNotExists(userEmail: string): Promise<void>;
    async ensureNotExists(idOrEmail: ProfileId | string) {
        const findCondition: FindOptionsWhere<Profile> =
            typeof idOrEmail === 'string'
                ? { user: { email: idOrEmail } }
                : { profileId: idOrEmail };

        const exists = await this.profilesRepo.exist({ where: findCondition });
        if (exists) {
            throw new ConflictException(`profile already exists`);
        }
    }

    async ensureExists(profileId: ProfileId): Promise<Profile>;
    async ensureExists(userEmail: string): Promise<Profile>;
    async ensureExists(idOrEmail: ProfileId | string) {
        const findCondition: FindOptionsWhere<Profile> =
            typeof idOrEmail === 'string'
                ? { user: { email: idOrEmail } }
                : { profileId: idOrEmail };

        const profile = await this.profilesRepo.findOneBy(findCondition);
        if (!profile) {
            throw new NotFoundException(`profile does not exist`);
        }
        return profile;
    }

    async findOneByEmail(userEmail: string) {
        const profile = await this.profilesRepo.findOneBy({
            user: { email: userEmail },
        });
        if (!profile) {
            throw new NotFoundException(
                `user ${userEmail} does not have a profile`,
            );
        }
        return profile;
    }

    private async uploadAvatar(userEmail: string, avatar: Buffer) {
        const processed = this.imagesService.toProfileImage(avatar);
        const key = `avatars/${userEmail}.webp`;
        return this.s3Service.uploadFile(await processed, key);
    }

    async create(userEmail: string, dto: CreateProfileDto) {
        const user = await this.usersService.ensureExists(userEmail);
        await this.ensureNotExists(userEmail);
        const profile = this.profilesRepo.create(dto);
        profile.avatarUrl =
            dto.avatar &&
            (await this.uploadAvatar(userEmail, dto.avatar.buffer));

        profile.user = user;
        return this.profilesRepo.save(profile);
    }

    async update(userEmail: string, dto: UpdateProfileDto) {
        const profile = await this.ensureExists(userEmail);
        const avatarUrl =
            dto.avatar &&
            (await this.uploadAvatar(userEmail, dto.avatar.buffer));

        const { avatar, ...rest } = dto;
        const updatedProfile = this.profilesRepo.merge(profile, rest, {
            avatarUrl,
        });
        return this.profilesRepo.save(updatedProfile);
    }
}
