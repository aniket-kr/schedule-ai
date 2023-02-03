import Project from '../../projects/entities/project.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Unique(['project', 'name'])
@Entity('divisions')
export default class Division {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column()
    strength: number;

    @ManyToOne(() => Project, (project) => project.divisions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    project: Project;
    division: import('/home/avish/timelog-ai-scheduler/src/users/entities/user.entity').default;
}
