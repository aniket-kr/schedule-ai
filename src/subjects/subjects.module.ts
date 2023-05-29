import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { ProjectsModule } from '../projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([Subject]), ProjectsModule],
    providers: [SubjectsService],
    controllers: [SubjectsController],
})
export class SubjectsModule {}
