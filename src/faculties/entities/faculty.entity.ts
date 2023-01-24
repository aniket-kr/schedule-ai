import Lecture from 'src/lectures/entities/lecture.entity';
import Project from 'src/projects/entities/project.entity';
import User from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('faculties')
export default class Faculty {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (project) => project.faculties)
    @JoinColumn()
    project: Project;

    @Column({ length: 10 })
    code: string;

    @ManyToOne(() => User, (user) => user.faculties)
    @JoinColumn()
    user: User;

    @OneToMany(() => Lecture, (lecutue) => lecutue.faculty, {
        onDelete: 'CASCADE',
    })
    lectures: Lecture[];
}
