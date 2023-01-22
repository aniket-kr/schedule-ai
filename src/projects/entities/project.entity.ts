import { Department } from 'src/departments/entities/department.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @OneToMany(() => Department, (department) => department.project, {
        onDelete: 'CASCADE',
    })
    departments: Department[];
}
