import Department from '../../departments/entities/department.entity';
import Lecture from '../../lectures/entities/lecture.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import RoomType from '../../room-types/entities/room-type.entity';

@Entity('rooms')
export default class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    code: string;

    @Column()
    capacity: number;

    @ManyToOne(() => Department, (department) => department.rooms, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    department: Department;

    @OneToMany(() => Lecture, (lecture) => lecture.room)
    lectures: Lecture[];

    @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    type: RoomType;
}
