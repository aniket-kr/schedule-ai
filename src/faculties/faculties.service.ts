import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty, FacultyId } from './entities';
import { UsersService } from '../users/users.service';
import { ProjectId } from '../projects/entities';
import { UserId } from '../users/entities';
import { CreateFacultyDto, UpdateFacultyDto } from './dto';

@Injectable()
export class FacultiesService {
    constructor(
        @InjectRepository(Faculty)
        private readonly facultiesRepo: Repository<Faculty>,
        private readonly usersService: UsersService,
    ) {}

    async ensureExists(
        userId: UserId,
        projectId: ProjectId,
        facultyId: FacultyId,
    ) {
        const faculty = await this.facultiesRepo.findOne({
            where: {
                facultyId,
                project: { projectId, owner: { userId } },
            },
        });
        if (!faculty) {
            const msg = `Faculty-${facultyId} doesn't exist or is not accessible.`;
            throw new NotFoundException(msg);
        }
        return faculty;
    }

    async ensureNotExists(userId: UserId, projectId: ProjectId, code: string) {
        const exists = await this.facultiesRepo.exist({
            where: { code, project: { projectId, owner: { userId } } },
        });
        if (exists) {
            throw new ConflictException(`Faculty-${code} already exists.`);
        }
    }

    async findWithCount(
        userId: UserId,
        projectId: ProjectId,
        page: number,
        limit: number,
    ) {
        return this.facultiesRepo.findAndCount({
            where: { project: { projectId, owner: { userId } } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(userId: UserId, projectId: ProjectId, facultyId: FacultyId) {
        return this.ensureExists(userId, projectId, facultyId);
    }

    async subjectsTaughtAll(
        userId: UserId,
        projectId: ProjectId,
        facultyId: FacultyId,
    ) {
        const faculty = await this.ensureExists(userId, projectId, facultyId);
        return await faculty.subjects;
    }

    async create(userId: UserId, projectId: ProjectId, dto: CreateFacultyDto) {
        await this.ensureNotExists(userId, projectId, dto.code);
        const facultyUser = await this.usersService.ensureExists(dto.userEmail);

        const faculty = this.facultiesRepo.create({
            code: dto.code,
            user: facultyUser,
            project: { projectId, owner: { userId } },
        });
        return this.facultiesRepo.save(faculty);
    }

    async update(
        userId: UserId,
        projectId: ProjectId,
        facultyId: FacultyId,
        dto: UpdateFacultyDto,
    ) {
        const faculty = await this.ensureExists(userId, projectId, facultyId);

        // check that new code is not taken
        dto.code && (await this.ensureNotExists(userId, projectId, dto.code));

        // if userEmail is provided, it will only be changed if it is different
        if (dto.userEmail && dto.userEmail !== (await faculty.user)?.email) {
            const user = await this.usersService.ensureExists(dto.userEmail);
            this.facultiesRepo.merge(faculty, { user });
        }

        this.facultiesRepo.merge(faculty, { code: dto.code });
        return this.facultiesRepo.save(faculty);
    }

    async delete(userId: UserId, projectId: ProjectId, facultyId: FacultyId) {
        await this.facultiesRepo.delete({
            facultyId,
            project: { projectId, owner: { userId } },
        });
    }
}
