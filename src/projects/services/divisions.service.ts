import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Division, DivisionId, ProjectId } from '../entities';
import { type Repository } from 'typeorm';
import { UserId } from '../../users/entities';
import { CreateDivisionDto, UpdateDivisionDto } from '../dto';

@Injectable()
export class DivisionsService {
    constructor(
        @InjectRepository(Division)
        private readonly divisionsRepo: Repository<Division>,
    ) {}

    async ensureExists(
        userId: UserId,
        projectId: ProjectId,
        divisionId: DivisionId,
    ) {
        const division = await this.divisionsRepo.findOne({
            where: { divisionId, project: { projectId, owner: { userId } } },
        });
        if (!division) {
            const msg = `Division-${divisionId} doesn't exist or is not accessible.`;
            throw new NotFoundException(msg);
        }
        return division;
    }

    async ensureNotExists(userId: UserId, projectId: ProjectId, name: string) {
        const exists = await this.divisionsRepo.exist({
            where: { name, project: { projectId, owner: { userId } } },
        });
        if (exists) {
            throw new ConflictException(`Division-${name} already exists.`);
        }
    }

    async findWithCount(
        userId: UserId,
        projectId: ProjectId,
        page: number,
        limit: number,
    ) {
        return this.divisionsRepo.findAndCount({
            where: { project: { projectId, owner: { userId } } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(
        userId: UserId,
        projectId: ProjectId,
        divisionId: DivisionId,
    ) {
        const division = await this.ensureExists(userId, projectId, divisionId);
        return division;
    }

    async create(userId: UserId, projectId: ProjectId, dto: CreateDivisionDto) {
        await this.ensureNotExists(userId, projectId, dto.name);
        const division = this.divisionsRepo.create({
            ...dto,
            project: { projectId },
        });
        return this.divisionsRepo.save(division);
    }

    async update(
        userId: UserId,
        projectId: ProjectId,
        divisionId: DivisionId,
        dto: UpdateDivisionDto,
    ) {
        const division = await this.ensureExists(userId, projectId, divisionId);

        // check for name change, and ensure new name doesn't exist
        dto.name && (await this.ensureNotExists(userId, projectId, dto.name));

        this.divisionsRepo.merge(division, dto);
        return this.divisionsRepo.save(division);
    }

    async delete(userId: UserId, projectId: ProjectId, divisionId: DivisionId) {
        await this.divisionsRepo.delete({
            divisionId,
            project: { projectId, owner: { userId } },
        });
    }
}
