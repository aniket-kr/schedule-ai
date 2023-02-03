import { Test, TestingModule } from '@nestjs/testing';
import { DivisionService } from './divisions.service';

describe('DivisionsService', () => {
    let service: DivisionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DivisionService],
        }).compile();

        service = module.get<DivisionService>(DivisionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
