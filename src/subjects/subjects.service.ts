import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities';
import { Repository } from 'typeorm';
import { ProjectId } from '../projects/entities';
import { UserId } from '../users/entities';
import { SubjectId } from './entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';
import { RoomTypesService } from '../projects/services';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectsRepo: Repository<Subject>,
        private readonly roomTypesService: RoomTypesService,
    ) {}

    async ensureExists(
        userId: UserId,
        projectId: ProjectId,
        subjectId: SubjectId,
    ) {
        const subject = await this.subjectsRepo.findOne({
            where: {
                subjectId,
                project: { projectId, owner: { userId } },
            },
        });
        if (!subject) {
            const msg = `Subject-${subjectId} doesn't exist or is not accessible.`;
            throw new NotFoundException(msg);
        }
        return subject;
    }

    async ensureNotExistsWithName(
        userId: UserId,
        projectId: ProjectId,
        name: string,
    ) {
        const exists = await this.subjectsRepo.exist({
            where: { name, project: { projectId, owner: { userId } } },
        });
        if (exists) {
            throw new ConflictException(
                `Subject[name=${name}] already exists.`,
            );
        }
    }

    async ensureNotExistsWithCode(
        userId: UserId,
        projectId: ProjectId,
        code: string,
    ) {
        const exists = await this.subjectsRepo.exist({
            where: { code, project: { projectId, owner: { userId } } },
        });
        if (exists) {
            throw new ConflictException(
                `Subject[code=${code}] already exists.`,
            );
        }
    }

    async findWithCount(
        userId: UserId,
        projectId: ProjectId,
        page: number,
        limit: number,
    ) {
        return this.subjectsRepo.findAndCount({
            where: { project: { projectId, owner: { userId } } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(userId: UserId, projectId: ProjectId, subjectId: SubjectId) {
        return this.ensureExists(userId, projectId, subjectId);
    }

    async create(userId: UserId, projectId: ProjectId, dto: CreateSubjectDto) {
        await this.ensureNotExistsWithName(userId, projectId, dto.name);
        await this.ensureNotExistsWithCode(userId, projectId, dto.code);
        const roomType = await this.roomTypesService.findOne(
            userId,
            projectId,
            dto.roomTypeId,
        );

        const subject = this.subjectsRepo.create({
            name: dto.name,
            code: dto.code,
            roomType,
            project: { projectId, owner: { userId } },
        });
        return this.subjectsRepo.save(subject);
    }

    async update(
        userId: UserId,
        projectId: ProjectId,
        subjectId: SubjectId,
        dto: UpdateSubjectDto,
    ) {
        const subject = await this.ensureExists(userId, projectId, subjectId);
        const { name, code, roomTypeId } = dto;

        // check for changed name, and ensure availability
        name && (await this.ensureNotExistsWithName(userId, projectId, name));

        // check for changed code, and ensure availability
        code && (await this.ensureNotExistsWithCode(userId, projectId, code));

        // check for changed roomTypeId, and ensure existence
        roomTypeId &&
            (await this.roomTypesService.ensureExists(
                userId,
                projectId,
                roomTypeId,
            ));

        this.subjectsRepo.merge(subject, dto);
        return this.subjectsRepo.save(subject);
    }

    async delete(userId: UserId, projectId: ProjectId, subjectId: SubjectId) {
        await this.subjectsRepo.delete({
            subjectId,
            project: { projectId, owner: { userId } },
        });
    }
}
