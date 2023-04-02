import { Exclude, Type } from 'class-transformer';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import type { Nominal } from '../../common/utils';
import { Project } from '../../projects/entities/project.entity';
import { Profile } from './profile.entity';

export type UserId = Nominal<number, 'UserId'>;

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    userId!: UserId;

    @Column({ length: 254, unique: true })
    email!: string;

    @Column({ length: 60 })
    @Exclude()
    password!: string;

    @OneToOne(() => Profile, (profile) => profile.user)
    @Type(() => Profile)
    @JoinColumn()
    profile?: Profile;

    @OneToMany(() => Project, (project) => project.owner)
    projects!: Project[];
}
