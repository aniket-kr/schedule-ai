import { ProjectId, Room, RoomId } from '../entities';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserId } from '../../users/entities';
import { CreateRoomDto, UpdateRoomDto } from '../dto';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private readonly roomsRepo: Repository<Room>,
    ) {}

    async ensureExists(userId: UserId, projectId: ProjectId, roomId: RoomId) {
        const room = await this.roomsRepo.findOne({
            where: { roomId, project: { projectId, owner: { userId } } },
        });
        if (!room) {
            const msg = `Room-${roomId} doesn't exist or is not accessible.`;
            throw new NotFoundException(msg);
        }
        return room;
    }

    async ensureNotExists(userId: UserId, projectId: ProjectId, code: string) {
        const exists = await this.roomsRepo.exist({
            where: { code, project: { projectId, owner: { userId } } },
        });
        if (exists) {
            throw new ConflictException(`Room-${code} already exists.`);
        }
    }

    async findWithCount(
        userId: UserId,
        projectId: ProjectId,
        page: number,
        limit: number,
    ) {
        return this.roomsRepo.findAndCount({
            where: { project: { projectId, owner: { userId } } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(userId: UserId, projectId: ProjectId, roomId: RoomId) {
        return this.ensureExists(userId, projectId, roomId);
    }

    async create(userId: UserId, projectId: ProjectId, dto: CreateRoomDto) {
        await this.ensureNotExists(userId, projectId, dto.code);
        const room = this.roomsRepo.create({
            ...dto,
            project: { projectId },
        });
        return this.roomsRepo.save(room);
    }

    async update(
        userId: UserId,
        projectId: ProjectId,
        roomId: RoomId,
        dto: UpdateRoomDto,
    ) {
        const room = await this.ensureExists(userId, projectId, roomId);

        // check for code change, and ensure it's not taken
        dto.code && (await this.ensureNotExists(userId, projectId, dto.code));

        this.roomsRepo.merge(room, dto);
        return this.roomsRepo.save(room);
    }

    async delete(userId: UserId, projectId: ProjectId, roomId: RoomId) {
        await this.roomsRepo.delete({
            roomId,
            project: { projectId, owner: { userId } },
        });
    }
}
