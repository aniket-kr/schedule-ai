import Department from 'src/departments/entities/department.entity';
import Subject from 'src/subjects/entities/subject.entity';
import User from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Unique(['owner', 'name'])
@Entity('projects')
export default class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @ManyToOne(() => User, (user) => user.projects)
    @JoinColumn()
    owner: User;

    @OneToMany(() => Subject, (subject) => subject.project, {
        onDelete: 'CASCADE',
    })
    subjects: Subject[];

    @OneToMany(() => Department, (department) => department.project, {
        onDelete: 'CASCADE',
    })
    departments: Department[];
}
