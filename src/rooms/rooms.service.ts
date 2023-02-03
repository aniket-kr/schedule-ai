import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateRoomDto from './dto/create-room.dto';
import UpdateRoomDto from './dto/update-room.dto';
import Room from './entities/room.entity';
import { RoomExistsException, RoomNotFoundException } from './rooms.exception';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private readonly roomsRepo: Repository<Room>,
    ) {}

    async fetchPaginated(projectId: number, limit: number, page: number) {
        return this.roomsRepo.findAndCount({
            skip: page * limit,
            take: limit,
            where: { project: { id: projectId } },
        });
    }

    // TODO: work on this @aniket-kr
    // async fetchDetailedPaginated(ownerId: number, limit: number, page: number) {
    // }

    async fetchOne(projectId: number) {
        const Division = await this.roomsRepo.findOneBy({ id: projectId });
        if (!Division) {
            throw new RoomNotFoundException(projectId);
        }
        return Division;
    }

    async create(userId: number, roomDto: CreateRoomDto) {
        const condition = { project: { id: userId }, name: roomDto.name };
        const existing = await this.roomsRepo.findOneBy(condition);
        if (existing) {
            throw new RoomExistsException(existing);
        }

        const division = this.roomsRepo.create(roomDto);
        await this.room.project;
        Room.project = await this.usersService.fetchOne(userId);
        return this.roomsRepo.save(division);
    }

    async update(userId: number, projectId: number, roomDto: UpdateRoomDto) {
        const where = { id: projectId, project: { id: userId } };
        const belongsToUser = await this.roomsRepo.exist({ where });
        if (!belongsToUser) {
            throw new RoomNotFoundException(projectId);
        }
        await this.roomsRepo.update({ id: projectId }, roomDto);
        return this.fetchOne(projectId);
    }
}
