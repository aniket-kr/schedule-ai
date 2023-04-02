import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserId } from '../users/entities';
import { UsersService } from '../users/users.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { Project, ProjectId } from './entities';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepo: Repository<Project>,
        private readonly usersService: UsersService,
    ) {}

    async ensureExists(userId: UserId, projectId: ProjectId) {
        const project = await this.projectsRepo.findOne({
            where: { projectId, owner: { userId } },
        });
        if (!project) {
            const msg = `Project-${projectId} doesn't exist or doesn't belong to user-${userId}.`;
            throw new NotFoundException(msg);
        }
        return project;
    }

    async ensureNotExists(userId: UserId, name: string): Promise<void>;
    async ensureNotExists(userId: UserId, projectId: ProjectId): Promise<void>;
    async ensureNotExists(
        userId: UserId,
        nameOrId: string | ProjectId,
    ): Promise<void>;
    async ensureNotExists(userId: UserId, nameOrId: string | ProjectId) {
        const key = typeof nameOrId === 'string' ? 'name' : 'projectId';
        const exists = await this.projectsRepo.exist({
            where: { [key]: nameOrId, owner: { userId } },
        });
        if (exists) {
            throw new ConflictException(`Project-${nameOrId} already exists.`);
        }
    }

    async findWithCount(userId: UserId, page: number, limit: number) {
        return this.projectsRepo.findAndCount({
            where: { owner: { userId } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(userId: UserId, projectId: ProjectId) {
        return this.ensureExists(userId, projectId);
    }

    async create(userId: UserId, dto: CreateProjectDto) {
        await this.ensureNotExists(userId, dto.name);
        const project = this.projectsRepo.create({ ...dto, owner: { userId } });
        return this.projectsRepo.save(project);
    }

    async update(userId: UserId, projectId: ProjectId, dto: UpdateProjectDto) {
        const project = await this.ensureExists(userId, projectId);

        // name change
        dto.name && (await this.ensureNotExists(userId, dto.name));
        project.name = dto.name || project.name;

        // owner change
        if (dto.owner) {
            const owner = await this.usersService.ensureExists(dto.owner);
            project.owner = owner;
        }

        return this.projectsRepo.save(project);
    }

    async delete(userId: UserId, projectId: ProjectId) {
        this.projectsRepo.delete({ projectId, owner: { userId } });
    }
}
