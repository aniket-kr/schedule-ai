import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from './entities';

@Injectable()
export class FacultiesService {
    constructor(
        @InjectRepository(Faculty)
        private readonly facultiesRepo: Repository<Faculty>,
    ) {}
}
