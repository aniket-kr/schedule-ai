import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import CreateRoomTypeDto from './dto/create-roomType.dto';
import UpdateRoomTypeDto from './dto/update-roomType.dto';
import RoomTypes from './entities/room-type.entity';
import {
    RoomTypeExistsException,
    RoomTypeNotFoundException,
} from './room-types.exception';

@Injectable()
export class RoomTypesService {
    constructor(
        @InjectRepository(RoomTypes)
        private readonly roomTypesRepo: Repository<RoomTypes>,
        private readonly usersService: UsersService,
    ) {}

    async fetchPaginated(projectId: number, limit: number, page: number) {
        return this.roomTypesRepo.findAndCount({
            skip: page * limit,
            take: limit,
            where: { project: { id: projectId } },
        });
    }

    // TODO: work on this @aniket-kr
    // async fetchDetailedPaginated(ownerId: number, limit: number, page: number) {
    // }

    async fetchOne(projectId: number) {
        const project = await this.roomTypesRepo.findOneBy({ id: projectId });
        if (!project) {
            throw new RoomTypeNotFoundException(projectId);
        }
        return project;
    }

    async create(userId: number, roomTypeDto: CreateRoomTypeDto) {
        const condition = { owner: { id: userId }, name: roomTypeDto.name };
        const existing = await this.roomTypesRepo.findOneBy(condition);
        if (existing) {
            throw new RoomTypeExistsException(existing);
        }

        const roomType = this.roomTypesRepo.create(roomTypeDto);
        await roomType.project;
        return this.roomTypesRepo.save(roomType);
    }

    async update(
        userId: number,
        roomTypeId: number,
        roomTypeDto: UpdateRoomTypeDto,
    ) {
        const where = { id: roomTypeId, project: { id: userId } };
        const belongsToUser = await this.roomTypesRepo.exist({ where });
        if (!belongsToUser) {
            throw new RoomTypeNotFoundException(roomTypeId);
        }
        await this.roomTypesRepo.update({ id: roomTypeId }, roomTypeDto);
        return this.fetchOne(roomTypeId);
    }
}
