import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import CreateTimeSlotDto from './dto/create-timeSlots.dto';
import UpdateTimeSlotDto from './dto/update-timeSlots.dto';
import TimeSlot from './entities/time-slot.entity';
import {
    TimeSlotExistsException,
    TimeSlotNotFoundException,
} from './time-slots.exception';

@Injectable()
export class TimeSlotService {
    constructor(
        @InjectRepository(TimeSlot)
        private readonly timeSlotsRepo: Repository<TimeSlot>,
        private readonly usersService: UsersService,
    ) {}

    async fetchPaginated(projectId: number, limit: number, page: number) {
        return this.timeSlotsRepo.findAndCount({
            skip: page * limit,
            take: limit,
            where: { project: { id: projectId } },
        });
    }

    // TODO: work on this @aniket-kr
    // async fetchDetailedPaginated(ownerId: number, limit: number, page: number) {
    // }

    async fetchOne(timeSlotId: number) {
        const timeSlot = await this.timeSlotsRepo.findOneBy({
            id: timeSlotId,
        });
        if (!timeSlot) {
            throw new TimeSlotNotFoundException(timeSlotId);
        }
        return timeSlot;
    }

    async create(projectId: number, timeSlotDto: CreateTimeSlotDto) {
        const condition = {
            project: { id: projectId },
            name: timeSlotDto.name,
        };
        const existing = await this.timeSlotsRepo.findOneBy(condition);
        if (existing) {
            throw new TimeSlotExistsException(existing);
        }

        const timeSlot = this.timeSlotsRepo.create(timeSlotDto);
        await timeSlot.project;
        return this.timeSlotsRepo.save(timeSlot);
    }

    async update(
        userId: number,
        timeSlotId: number,
        timeSlotDto: UpdateTimeSlotDto,
    ) {
        const where = { id: timeSlotId, project: { id: userId } };
        const belongsToUser = await this.timeSlotsRepo.exist({ where });
        if (!belongsToUser) {
            throw new TimeSlotNotFoundException(timeSlotId);
        }
        await this.timeSlotsRepo.update({ id: timeSlotId }, timeSlotDto);
        return this.fetchOne(timeSlotId);
    }
}
