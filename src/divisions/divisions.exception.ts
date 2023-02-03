import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import Division from './entities/division.entity';

export class DivisionNotFoundException extends NotFoundException {
    constructor(divisionId: number) {
        super(`division with id ${divisionId} does not exist`, {
            description: 'DivisionNotFoundException',
        });
    }
}

export class DivisionExistsException extends ConflictException {
    constructor(division: Division) {
        super(
            `division with name ${division.name} already exists with id ${division.id}`,
            { description: 'DivisionExistsException' },
        );
    }
}
