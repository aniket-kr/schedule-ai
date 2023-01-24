import Lecture from 'src/lectures/entities/lecture.entity';
import Project from 'src/projects/entities/project.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('time_slots')
export default class TimeSlot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start_minutes: number;

    @Column()
    end_minutes: number;

    @Column()
    day: number;

    @ManyToOne(() => Project, (project) => project.time_slots)
    @JoinColumn()
    project: Project;

    @OneToMany(() => Lecture, (lecture) => lecture.timeSlot, {
        onDelete: 'CASCADE',
    })
    lectures: Lecture[];
}
