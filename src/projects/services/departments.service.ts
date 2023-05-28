import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserId } from '../../users/entities';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../dto';
import { Department, DepartmentId, ProjectId } from '../entities';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Department)
        private readonly deptsRepo: Repository<Department>,
    ) {}

    async ensureExists(
        userId: UserId,
        projectId: ProjectId,
        departmentId: DepartmentId,
    ) {
        const dept = await this.deptsRepo.findOne({
            where: { departmentId, project: { projectId, owner: { userId } } },
        });
        if (!dept) {
            const msg = `Department-${departmentId} doesn't exist or is not accessible.`;
            throw new NotFoundException(msg);
        }
        return dept;
    }

    async ensureNotExists(userId: UserId, projectId: ProjectId, name: string) {
        const exists = await this.deptsRepo.exist({
            where: { name, project: { projectId, owner: { userId } } },
        });
        if (exists) {
            throw new ConflictException(`Department-${name} already exists.`);
        }
    }

    async findWithCount(
        userId: UserId,
        projectId: ProjectId,
        page: number,
        limit: number,
    ) {
        return this.deptsRepo.findAndCount({
            where: { project: { projectId, owner: { userId } } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(
        userId: UserId,
        projectId: ProjectId,
        departmentId: DepartmentId,
    ) {
        const dept = await this.ensureExists(userId, projectId, departmentId);
        return dept;
    }

    async create(
        userId: UserId,
        projectId: ProjectId,
        dto: CreateDepartmentDto,
    ) {
        await this.ensureNotExists(userId, projectId, dto.name);
        const dept = this.deptsRepo.create({
            ...dto,
            project: { projectId },
        });
        return this.deptsRepo.save(dept);
    }

    async update(
        userId: UserId,
        projectId: ProjectId,
        departmentId: DepartmentId,
        dto: UpdateDepartmentDto,
    ) {
        const dept = await this.ensureExists(userId, projectId, departmentId);

        // check for name change, and ensure new name doesn't exist
        dto.name && (await this.ensureNotExists(userId, projectId, dto.name));

        this.deptsRepo.merge(dept, dto);
        return this.deptsRepo.save(dept);
    }

    async delete(
        userId: UserId,
        projectId: ProjectId,
        departmentId: DepartmentId,
    ) {
        await this.deptsRepo.delete({
            departmentId,
            project: { projectId, owner: { userId } },
        });
    }
}
