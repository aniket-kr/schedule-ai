import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project } from './project.entity';
import { Room } from './room.entity';

export type DepartmentId = Nominal<number, 'DepartmentId'>;

@Entity('departments')
@Unique(['project', 'name'])
export class Department {
    @PrimaryGeneratedColumn('increment')
    departmentId!: DepartmentId;

    @Column({ length: 50 })
    name!: string;

    @JoinColumn()
    @ManyToOne(() => Project, (project) => project.departments, {
        onDelete: 'CASCADE',
    })
    project!: Project;

    @OneToMany(() => Room, (room) => room.department)
    rooms!: Room[];
}
