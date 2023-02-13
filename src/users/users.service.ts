import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../common/services/base.service';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import User from './entities/user.entity';

export type UserCreateOptions = { dto: CreateUserDto };
export type UserUpdateOptions = { id: User['id']; dto: UpdateUserDto };

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        protected readonly repo: Repository<User>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {
        super({
            notFound({ id }) {
                const err = `user id ${id} does not exist`;
                return new NotFoundException(err, {
                    description: 'UserNotFoundException',
                });
            },
            exists({ email }) {
                const err = `user with email '${email}' already exists`;
                return new ConflictException(err, {
                    description: 'UserExistsException',
                });
            },
        });
    }

    async create({ dto }: UserCreateOptions) {
        await this.ensureNotExists({ email: dto.email });
        const user = this.repo.create(dto);
        user.passwordHash = await this.authService.generateHash(dto.password);
        return this.repo.save(user);
    }

    async update({ id, dto: { password } }: UserUpdateOptions) {
        const user = await this.fetchOne({ id });
        user.passwordHash = await this.authService.generateHash(password);
        return this.repo.save(user);
    }
}
