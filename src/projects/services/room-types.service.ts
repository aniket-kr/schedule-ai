import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectId, RoomType, RoomTypeId } from '../entities';
import { Repository } from 'typeorm';
import { UserId } from '../../users/entities';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from '../dto';

@Injectable()
export class RoomTypesService {
    constructor(
        @InjectRepository(RoomType)
        private readonly roomTypesRepo: Repository<RoomType>,
    ) {}

    async ensureExists(
        userId: UserId,
        projectId: ProjectId,
        roomTypeId: RoomTypeId,
    ) {
        const roomType = await this.roomTypesRepo.findOne({
            where: { roomTypeId, project: { projectId, owner: { userId } } },
        });
        if (!roomType) {
            const msg = `RoomType-${roomTypeId} doesn't exist or is not accessible.`;
            throw new NotFoundException(msg);
        }
        return roomType;
    }

    async ensureNotExists(userId: UserId, projectId: ProjectId, name: string) {
        const exists = await this.roomTypesRepo.exist({
            where: { name, project: { projectId, owner: { userId } } },
        });
        if (exists) {
            throw new ConflictException(`RoomType-${name} already exists.`);
        }
    }

    async findWithCount(
        userId: UserId,
        projectId: ProjectId,
        page: number,
        limit: number,
    ) {
        return this.roomTypesRepo.findAndCount({
            where: { project: { projectId, owner: { userId } } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(
        userId: UserId,
        projectId: ProjectId,
        roomTypeId: RoomTypeId,
    ) {
        return await this.ensureExists(userId, projectId, roomTypeId);
    }

    async create(userId: UserId, projectId: ProjectId, dto: CreateRoomTypeDto) {
        await this.ensureNotExists(userId, projectId, dto.name);
        const roomType = this.roomTypesRepo.create({
            ...dto,
            project: { projectId },
        });
        return this.roomTypesRepo.save(roomType);
    }

    async update(
        userId: UserId,
        projectId: ProjectId,
        roomTypeId: RoomTypeId,
        dto: UpdateRoomTypeDto,
    ) {
        const roomType = await this.ensureExists(userId, projectId, roomTypeId);

        // check for name change, and ensure new name doesn't exist
        dto.name && (await this.ensureNotExists(userId, projectId, dto.name));

        this.roomTypesRepo.merge(roomType, dto);
        return this.roomTypesRepo.save(roomType);
    }

    async delete(userId: UserId, projectId: ProjectId, roomTypeId: RoomTypeId) {
        await this.roomTypesRepo.delete({
            roomTypeId,
            project: { projectId, owner: { userId } },
        });
    }
}
