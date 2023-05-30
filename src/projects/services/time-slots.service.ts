import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Day, ProjectId, TimeSlot, TimeSlotId } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserId } from '../../users/entities';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from '../dto';

@Injectable()
export class TimeSlotsService {
    constructor(
        @InjectRepository(TimeSlot)
        private readonly timeSlotsRepo: Repository<TimeSlot>,
    ) {}

    async ensureExists(
        userId: UserId,
        projectId: ProjectId,
        timeSlotId: TimeSlotId,
    ) {
        const timeSlot = await this.timeSlotsRepo.findOne({
            where: { timeSlotId, project: { projectId, owner: { userId } } },
        });
        if (!timeSlot) {
            const msg = `TimeSlot-${timeSlotId} doesn't exist or is not accessible.`;
            throw new NotFoundException(msg);
        }
        return timeSlot;
    }

    async ensureNotExists(
        userId: UserId,
        projectId: ProjectId,
        fields: { startTime: number; endTime: number; day: Day },
        opts: { excludeId?: TimeSlotId } = {},
    ) {
        const queryBuilder = this.timeSlotsRepo.createQueryBuilder('ts');

        queryBuilder
            .where('ts.project.owner.userId = :userId', { userId })
            .andWhere('ts.projectId = :projectId', { projectId })
            .andWhere('ts.day = :day', { day: fields.day })
            .andWhere(
                `
                    (:start < ts.endTime AND :start > ts.startTime) OR
                    (:end > ts.startTime AND :end < ts.endTime)
                `,
                { start: fields.startTime, end: fields.endTime },
            );

        if (opts.excludeId) {
            queryBuilder.andWhere('ts.timeSlotId != :excludeId', {
                excludeId: opts.excludeId,
            });
        }

        const exists = await queryBuilder.getExists();
        if (exists) {
            throw new ConflictException(
                `Time slot conflicts with existing time slots.`,
            );
        }
    }

    async findWithCount(
        userId: UserId,
        projectId: ProjectId,
        page: number,
        limit: number,
    ) {
        return this.timeSlotsRepo.findAndCount({
            where: { project: { projectId, owner: { userId } } },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOne(
        userId: UserId,
        projectId: ProjectId,
        timeSlotId: TimeSlotId,
    ) {
        return this.ensureExists(userId, projectId, timeSlotId);
    }

    async create(userId: UserId, projectId: ProjectId, dto: CreateTimeSlotDto) {
        await this.ensureNotExists(userId, projectId, dto);
        const timeSlot = this.timeSlotsRepo.create({
            ...dto,
            project: { projectId },
        });
        return this.timeSlotsRepo.save(timeSlot);
    }

    async update(
        userId: UserId,
        projectId: ProjectId,
        timeSlotId: TimeSlotId,
        dto: UpdateTimeSlotDto,
    ) {
        const timeSlot = await this.ensureExists(userId, projectId, timeSlotId);
        const newTimeSlot = { ...timeSlot, ...dto };
        await this.ensureNotExists(userId, projectId, newTimeSlot, {
            excludeId: timeSlotId,
        });
        return this.timeSlotsRepo.save(newTimeSlot);
    }

    async delete(userId: UserId, projectId: ProjectId, timeSlotId: TimeSlotId) {
        await this.timeSlotsRepo.delete({
            timeSlotId,
            project: { projectId, owner: { userId } },
        });
    }
}
