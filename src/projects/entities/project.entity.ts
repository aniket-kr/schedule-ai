import Department from 'src/departments/entities/department.entity';
import Divison from 'src/divisions/entities/division.entity';
import Faculty from 'src/faculties/entities/faculty.entity';
import RoomType from 'src/rooms/entities/room-type.entity';
import Schedule from 'src/schedules/entities/schedule.entity';
import Subject from 'src/subjects/entities/subject.entity';
import TimeSlot from 'src/time-slots/entities/time-slot.entity';
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

    @OneToMany(() => Schedule, (schedule) => schedule.project, {
        onDelete: 'CASCADE',
    })
    schedules: Schedule[];

    @OneToMany(() => Faculty, (faculty) => faculty.project, {
        onDelete: 'CASCADE',
    })
    faculties: Faculty[];

    @OneToMany(() => RoomType, (roomType) => roomType.project, {
        onDelete: 'CASCADE',
    })
    room_types: RoomType[];

    @OneToMany(() => Divison, (division) => division.project, {
        onDelete: 'CASCADE',
    })
    divisions: Divison[];

    @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.project, {
        onDelete: 'CASCADE',
    })
    time_slots: TimeSlot[];
}
