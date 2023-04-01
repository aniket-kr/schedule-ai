import { UserId } from '../../users/entities/user.entity';

export type UserToken = {
    userId: UserId;
    email: string;
};
