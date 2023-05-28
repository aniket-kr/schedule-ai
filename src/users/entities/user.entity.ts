import { Expose } from 'class-transformer';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import type { Nominal } from '../../common/utils';
import { Faculty } from '../../faculties/entities';
import { Project } from '../../projects/entities';
import { Profile } from './profile.entity';

export type UserId = Nominal<number, 'UserId'>;

@Entity('users')
export class User {
    @Expose()
    @PrimaryGeneratedColumn('increment')
    userId!: UserId;

    @Expose()
    @Column({ length: 254, unique: true })
    email!: string;

    @Column({ length: 60 })
    password!: string;

    @OneToOne(() => Profile, (profile) => profile.user)
    @JoinColumn()
    profile?: Profile;

    @OneToMany(() => Project, (project) => project.owner)
    projects!: Project[];

    @OneToMany(() => Faculty, (faculty) => faculty.user)
    facultyRoles!: Faculty[];
}
