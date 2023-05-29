import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project } from './project.entity';
import { Room } from './room.entity';
import { Subject } from '../../subjects/entities/subject.entity';

export type RoomTypeId = Nominal<number, 'RoomTypeId'>;

@Entity('room_types')
export class RoomType {
    @PrimaryGeneratedColumn('increment')
    roomTypeId!: RoomTypeId;

    @Column({ length: 50 })
    name!: string;

    @JoinColumn()
    @ManyToOne(() => Project, (project) => project.roomTypes, {
        onDelete: 'CASCADE',
    })
    project!: Project;

    @OneToMany(() => Subject, (subject) => subject.roomType)
    subjects!: Subject[];

    @OneToMany(() => Room, (room) => room.roomType)
    rooms!: Room[];
}
