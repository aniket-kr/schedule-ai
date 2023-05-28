import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project } from './project.entity';
import { RoomType } from './room-type.entity';

export type SubjectId = Nominal<number, 'SubjectId'>;

@Entity('subjects')
@Unique(['project', 'code'])
export class Subject {
    @PrimaryGeneratedColumn('increment')
    subjectId!: SubjectId;

    @Column({ length: 50 })
    name!: string;

    @Column({ length: 15 })
    code!: string;

    @JoinColumn()
    @ManyToOne(() => RoomType, (roomType) => roomType.subjects, {
        onDelete: 'CASCADE',
    })
    roomType!: RoomType;

    @JoinColumn()
    @ManyToOne(() => Project, (project) => project.subjects, {
        onDelete: 'CASCADE',
    })
    project!: Project;
}
