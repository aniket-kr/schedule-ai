import { Module } from '@nestjs/common';
import { DivisionService } from './divisions.service';
import { DivisionsController } from './divisions.controller';
import Division from './entities/division.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Division]), UsersModule],

    providers: [DivisionService],
    controllers: [DivisionsController],
})
export class DivisionsModule {}
