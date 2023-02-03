import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import TimeSlot from './entities/time-slot.entity';

export class TimeSlotNotFoundException extends NotFoundException {
    constructor(timeSlotId: number) {
        super(`timeSlot with id ${timeSlotId} does not exist`, {
            description: 'TimeSlotNotFoundException',
        });
    }
}

export class TimeSlotExistsException extends ConflictException {
    constructor(timeSlot: TimeSlot) {
        super(
            `timeSlot with name ${timeSlot.day} already exists with id ${timeSlot.id}`,
            { description: 'TimeSlotExistsException' },
        );
    }
}
