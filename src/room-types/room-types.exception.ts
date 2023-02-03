import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import RoomType from './entities/room-type.entity';

export class RoomTypeNotFoundException extends NotFoundException {
    constructor(projectId: number) {
        super(`room-type with id ${projectId} does not exist`, {
            description: 'RoomTypeNotFoundException',
        });
    }
}

export class RoomTypeExistsException extends ConflictException {
    constructor(roomType: RoomType) {
        super(
            `room-type with name ${roomType.name} already exists with id ${roomType.id}`,
            { description: 'RoomTypeExistsException' },
        );
    }
}
