import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Department, Division, Project, Room, RoomType } from './entities';
import {
    DepartmentsController,
    DivisionsController,
    ProjectsController,
    RoomsController,
    RoomTypesController,
} from './controllers';
import {
    DepartmentsService,
    DivisionsService,
    ProjectsService,
    RoomsService,
    RoomTypesService,
} from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Project,
            Department,
            Division,
            Room,
            RoomType,
        ]),
        UsersModule,
    ],
    providers: [
        ProjectsService,
        DepartmentsService,
        DivisionsService,
        RoomsService,
        RoomTypesService,
    ],
    controllers: [
        ProjectsController,
        DepartmentsController,
        DivisionsController,
        RoomsController,
        RoomTypesController,
    ],
    exports: [RoomTypesService],
})
export class ProjectsModule {}
