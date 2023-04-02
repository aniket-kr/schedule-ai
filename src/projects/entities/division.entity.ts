import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Nominal } from '../../common/utils';
import { Project } from './project.entity';

export type DivisionId = Nominal<number, 'DivisionId'>;

@Entity('divisions')
export class Division {
    @PrimaryGeneratedColumn('increment')
    divisionId!: DivisionId;

    @Column({ length: 100, unique: true })
    name!: string;

    @Column()
    strength!: number;

    @JoinColumn()
    @ManyToOne(() => Project, (project) => project.divisions, {
        onDelete: 'CASCADE',
    })
    project!: Project;
}
