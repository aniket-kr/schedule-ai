import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project } from '../../projects/entities';
import { User } from '../../users/entities';

export type FacultyId = Nominal<number, 'FacultyId'>;

@Entity('faculties')
export class Faculty {
    @PrimaryGeneratedColumn('increment')
    facultyId!: FacultyId;

    @Column({ length: 15 })
    code!: string;

    @ManyToOne(() => User, (user) => user.facultyRoles, {
        onDelete: 'SET NULL',
    })
    user?: User;

    @ManyToOne(() => Project, (project) => project.faculties, {
        onDelete: 'CASCADE',
    })
    project!: Project;
}
