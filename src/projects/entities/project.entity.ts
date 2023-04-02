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
import { User } from '../../users/entities/user.entity';
import { Department } from './department.entity';
import { Division } from './division.entity';
import { RoomType } from './room-type.entity';
import { Room } from './room.entity';
import { Subject } from './subject.entity';
import { TimeSlot } from './time-slot.entity';

export type ProjectId = Nominal<number, 'ProjectId'>;

@Entity('projects')
@Unique(['owner', 'name'])
export class Project {
    @PrimaryGeneratedColumn('increment')
    projectId!: ProjectId;

    @Column({ length: 100 })
    name!: string;

    @JoinColumn()
    @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
    owner!: User;

    @OneToMany(() => Department, (department) => department.project)
    departments!: Department[];

    @OneToMany(() => RoomType, (roomType) => roomType.project)
    roomTypes!: RoomType[];

    @OneToMany(() => Subject, (subject) => subject.project)
    subjects!: Subject[];

    @OneToMany(() => Room, (room) => room.project)
    rooms!: Room[];

    @OneToMany(() => Division, (division) => division.project)
    divisions!: Division[];

    @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.project)
    timeSlots!: TimeSlot[];
}
