import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import CreateDivisionDto from './dto/create-division.dto';
import UpdateDivisionDto from './dto/update-division.dto';
import Division from './entities/division.entity';
import {
    DivisionExistsException,
    DivisionNotFoundException,
} from './divisions.exception';

@Injectable()
export class DivisionService {
    constructor(
        @InjectRepository(Division)
        private readonly divisionsRepo: Repository<Division>,
        private readonly usersService: UsersService,
    ) {}

    async fetchPaginated(projectId: number, limit: number, page: number) {
        return this.divisionsRepo.findAndCount({
            skip: page * limit,
            take: limit,
            where: { project: { id: projectId } },
        });
    }

    // TODO: work on this @aniket-kr
    // async fetchDetailedPaginated(ownerId: number, limit: number, page: number) {
    // }

    async fetchOne(divisionId: number) {
        const division = await this.divisionsRepo.findOneBy({ id: divisionId });
        if (!division) {
            throw new DivisionNotFoundException(divisionId);
        }
        return division;
    }

    async create(projectId: number, divisionDto: CreateDivisionDto) {
        const condition = {
            project: { id: projectId },
            name: divisionDto.name,
        };
        const existing = await this.divisionsRepo.findOneBy(condition);
        if (existing) {
            throw new DivisionExistsException(existing);
        }

        const division = this.divisionsRepo.create(divisionDto);
        await division.project;
        return this.divisionsRepo.save(division);
    }

    async update(
        userId: number,
        divisionId: number,
        divisionDto: UpdateDivisionDto,
    ) {
        const where = { id: divisionId, project: { id: userId } };
        const belongsToUser = await this.divisionsRepo.exist({ where });
        if (!belongsToUser) {
            throw new DivisionNotFoundException(divisionId);
        }
        await this.divisionsRepo.update({ id: divisionId }, divisionDto);
        return this.fetchOne(divisionId);
    }
}
