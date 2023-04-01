import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserId } from './entities/user.entity';

export type UserFindOptions = { loadProfile: boolean };
const defaultUserFindOptions: UserFindOptions = { loadProfile: false };
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepo: Repository<User>,
    ) {}

    async findOne(userId: UserId, opts?: Partial<UserFindOptions>) {
        opts = { ...defaultUserFindOptions, ...opts };
        return this.usersRepo.findOne({
            where: { userId },
            relations: opts.loadProfile ? ['profile'] : [],
        });
    }

    async findOneByEmail(email: string, opts?: Partial<UserFindOptions>) {
        opts = { ...defaultUserFindOptions, ...opts };
        return this.usersRepo.findOne({
            where: { email },
            relations: opts.loadProfile ? ['profile'] : [],
        });
    }

    async ensureNotExists(userId: UserId): Promise<void>;
    async ensureNotExists(email: string): Promise<void>;
    async ensureNotExists(idOrEmail: UserId | string): Promise<void>;
    async ensureNotExists(idOrEmail: UserId | string) {
        const key = typeof idOrEmail === 'string' ? 'email' : 'userId';
        const exists = await this.usersRepo.exist({
            where: { [key]: idOrEmail },
        });
        if (exists) {
            throw new ConflictException(`user ${idOrEmail} already exists`);
        }
    }

    async ensureExists(userId: UserId): Promise<User>;
    async ensureExists(email: string): Promise<User>;
    async ensureExists(idOrEmail: UserId | string): Promise<User>;
    async ensureExists(idOrEmail: UserId | string) {
        const key = typeof idOrEmail === 'string' ? 'email' : 'userId';
        const user = await this.usersRepo.findOneBy({ [key]: idOrEmail });

        if (!user) {
            throw new NotFoundException(`user ${idOrEmail} does not exist`);
        }
        return user;
    }

    /** DTO passed to create must have HASHED PASSWORD */
    async create(dto: CreateUserDto) {
        await this.ensureNotExists(dto.email);
        const user = this.usersRepo.create(dto);
        return this.usersRepo.save(user);
    }

    /** `newHashedPassword` must be HASHED PASSWORD */
    async updatePassword(userId: UserId, newHashedPassword: string) {
        const user = await this.ensureExists(userId);
        user.password = newHashedPassword;
        return this.usersRepo.save(user);
    }

    async delete(userId: UserId): Promise<void>;
    async delete(email: string): Promise<void>;
    async delete(idOrEmail: UserId | string): Promise<void>;
    async delete(idOrEmail: UserId | string) {
        const key = typeof idOrEmail === 'string' ? 'email' : 'userId';
        this.usersRepo.delete({ [key]: idOrEmail });
    }
}
