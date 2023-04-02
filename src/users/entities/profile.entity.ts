import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Nominal } from '../../common/utils';
import { User } from './user.entity';

export type ProfileId = Nominal<number, 'ProfileId'>;

@Entity('user_profiles')
export class Profile {
    @PrimaryGeneratedColumn()
    profileId!: ProfileId;

    @Column({ length: 50 })
    firstName!: string;

    @Column({ length: 100, nullable: true })
    lastName?: string;

    @Column({ length: 1000, nullable: true })
    bio?: string;

    @Column({ length: 320, nullable: true })
    avatarUrl?: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    user!: User;
}
