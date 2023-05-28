import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Project } from './entities';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), UsersModule],
    providers: [ProjectsService],
    controllers: [ProjectsController],
})
export class ProjectsModule {}
