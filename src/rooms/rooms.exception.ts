import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import Room from './entities/room.entity';

export class RoomNotFoundException extends NotFoundException {
    constructor(roomId: number) {
        super(`room with id ${roomId} does not exist`, {
            description: 'RoomNotFoundException',
        });
    }
}

export class RoomExistsException extends ConflictException {
    constructor(room: Room) {
        super(`room with name ${room.name} already exists with id ${room.id}`, {
            description: 'RoomExistsException',
        });
    }
}
