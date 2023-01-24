import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity('user_profiles')
export default class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 100, nullable: true })
    lastName: string;

    @Column({ length: 1000 })
    bio: string;

    @Column({ length: 320 })
    picPath: string;

    @OneToOne(() => User, (user) => user.profile)
    user: User;
}
