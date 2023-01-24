import Project from 'src/projects/entities/project.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('divisions')
export default class Divison {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column()
    strength: number;

    @ManyToOne(() => Project, (project) => project.divisions)
    @JoinColumn()
    project: Project;
}
