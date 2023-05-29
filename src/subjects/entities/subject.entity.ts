import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project, RoomType } from '../../projects/entities';
import { Faculty } from '../../faculties/entities';

export type SubjectId = Nominal<number, 'SubjectId'>;

@Entity('subjects')
@Unique(['project', 'code'])
@Unique(['project', 'name'])
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

    @ManyToMany(() => Faculty, (faculty) => faculty.subjects)
    faculties!: Faculty[];

    @JoinColumn()
    @ManyToOne(() => Project, (project) => project.subjects, {
        onDelete: 'CASCADE',
    })
    project!: Project;
}
