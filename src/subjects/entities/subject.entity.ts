import { Project } from 'src/projects/entities/project.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subjects')
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: number;

    @Column({ length: 100 })
    name: string;

    @ManyToOne(() => Project, (project) => project.subjects)
    @JoinColumn()
    project: Project;
}
