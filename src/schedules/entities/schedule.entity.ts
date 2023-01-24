import Lecture from 'src/lectures/entities/lecture.entity';
import Project from 'src/projects/entities/project.entity';
import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('schedules')
export default class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (project) => project.schedules)
    @JoinColumn()
    project: Project;

    @OneToMany(() => Lecture, (lecture) => lecture.schedule, {
        onDelete: 'CASCADE',
    })
    lectures: Lecture[];
}
