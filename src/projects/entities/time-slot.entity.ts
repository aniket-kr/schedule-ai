import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project } from './project.entity';

export enum Day {
    MONDAY = 0,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,
}

export type TimeSlotId = Nominal<number, 'TimeSlotId'>;

@Entity('time_slots')
export class TimeSlot {
    @PrimaryGeneratedColumn('increment')
    timeSlotId!: TimeSlotId;

    @Column('tinyint')
    startTime!: number;

    @Column('tinyint')
    endTime!: number;

    @Column({ type: 'enum', enum: Day })
    day!: Day;

    @JoinColumn()
    @ManyToOne(() => Project, (project) => project.timeSlots, {
        onDelete: 'CASCADE',
    })
    project!: Project;
}
