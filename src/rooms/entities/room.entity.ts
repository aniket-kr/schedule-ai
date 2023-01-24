import { Department } from 'src/departments/entities/department.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    code: string;

    @Column()
    capacity: number;

    @ManyToOne(() => Department, (department) => department.rooms)
    @JoinColumn()
    department: Department;
}
