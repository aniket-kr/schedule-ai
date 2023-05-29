import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entities';
import { UsersModule } from '../users/users.module';
import { FacultiesService } from './faculties.service';
import { FacultiesController } from './faculties.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Faculty]), UsersModule],
    providers: [FacultiesService],
    controllers: [FacultiesController],
})
export class FacultiesModule {}
