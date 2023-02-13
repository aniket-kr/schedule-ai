import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import CreateProjectDto from './dto/create-project.dto';
import UpdateProjectDto from './dto/update-project.dto';
import Project from './entities/project.entity';

export type ProjectCreateOptions = {
    ownerId: User['id'];
    dto: CreateProjectDto;
};

export type ProjectUpdateOptions = {
    ownerId: User['id'];
    projectId: Project['id'];
    dto: UpdateProjectDto;
};

@Injectable()
export class ProjectsService extends BaseService<Project> {
    constructor(
        @InjectRepository(Project)
        protected readonly repo: Repository<Project>,
        private readonly usersService: UsersService,
    ) {
        super({
            notFound({ id }) {
                const err = `project with id ${id} does not exist`;
                return new NotFoundException(err, {
                    description: 'ProjectNotFoundException',
                });
            },
            exists({ name }) {
                const err = `project with name '${name}' already exists`;
                return new ConflictException(err, {
                    description: 'ProjectExistsException',
                });
            },
        });
    }

    async create({ ownerId, dto }: ProjectCreateOptions) {
        await this.ensureNotExists({ name: dto.name, owner: { id: ownerId } });
        const project = this.repo.create(dto);
        await project.owner;
        project.owner = await this.usersService.fetchOne({ id: ownerId });
        return this.repo.save(project);
    }

    async update({ ownerId, projectId, dto }: ProjectUpdateOptions) {
        await this.ensureExists({ id: projectId, owner: { id: ownerId } });
        if (dto.name) {
            this.ensureNotExists({ owner: { id: ownerId }, name: dto.name });
        }
        this.repo.update({ id: projectId, owner: { id: ownerId } }, dto);
        return this.fetchOne({ id: projectId });
    }
}
