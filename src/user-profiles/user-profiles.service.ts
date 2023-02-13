import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import CreateUserProfileDto from './dto/create-user-profile.dto';
import UpdateUserProfileDto from './dto/update-user-profile.dto';
import UserProfile from './entities/user-profile.entity';

export type UserProfileCreateOptions = {
    userId: User['id'];
    dto: CreateUserProfileDto;
};

export type UserProfileUpdateOptions = {
    userId: User['id'];
    dto: UpdateUserProfileDto;
};

@Injectable()
export class UserProfilesService extends BaseService<UserProfile> {
    constructor(
        @InjectRepository(UserProfile)
        protected readonly repo: Repository<UserProfile>,
        private readonly usersService: UsersService,
    ) {
        super({
            notFound() {
                const err = `user does not have a profile`;
                return new NotFoundException(err, {
                    description: 'UserProfileNotFoundException',
                });
            },
            exists() {
                const err = `user already has a user profile`;
                return new ConflictException(err, {
                    description: 'UserProfileExistsException',
                });
            },
        });
    }

    async create({ userId, dto }: UserProfileCreateOptions) {
        const user = await this.usersService.fetchOne({ id: userId });
        await this.ensureNotExists({ user: { id: userId } });

        const profile = this.repo.create(dto);
        await profile.user;
        profile.user = user;
        return this.repo.save(profile);
    }

    async update({ userId, dto }: UserProfileUpdateOptions) {
        const criteria = { user: { id: userId } };
        await this.ensureExists(criteria);
        await this.repo.update(criteria, dto);
        return this.fetchOne(criteria);
    }
}
