import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project } from '../../projects/entities';
import { User } from '../../users/entities';
import { Subject } from '../../subjects/entities';

export type FacultyId = Nominal<number, 'FacultyId'>;

@Entity('faculties')
@Unique(['project', 'code'])
export class Faculty {
    @PrimaryGeneratedColumn('increment')
    facultyId!: FacultyId;

    @Column({ length: 15 })
    code!: string;

    @ManyToMany(() => Subject, (subject) => subject.faculties)
    @JoinTable()
    subjects!: Subject[];

    @ManyToOne(() => User, (user) => user.facultyRoles, {
        onDelete: 'SET NULL',
    })
    user?: User;

    @ManyToOne(() => Project, (project) => project.faculties, {
        onDelete: 'CASCADE',
    })
    project!: Project;
}
