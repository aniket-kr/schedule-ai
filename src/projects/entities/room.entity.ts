import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Department } from './department.entity';
import { Project } from './project.entity';
import { RoomType } from './room-type.entity';

export type RoomId = Nominal<number, 'RoomId'>;

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('increment')
    roomId!: RoomId;

    @Column({ length: 15, unique: true })
    code!: string;

    @Column()
    capacity!: number;

    @JoinColumn()
    @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
        onDelete: 'CASCADE',
    })
    roomType!: RoomType;

    @JoinColumn()
    @ManyToOne(() => Department, (department) => department.rooms, {
        onDelete: 'CASCADE',
    })
    department!: Department;

    @JoinColumn()
    @ManyToOne(() => Project, (project) => project.rooms, {
        onDelete: 'CASCADE',
    })
    project!: Project;
}
