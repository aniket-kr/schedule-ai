import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import {
    Department,
    Division,
    Project,
    Room,
    RoomType,
    TimeSlot,
} from './entities';
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
    TimeSlotsService,
} from './services';
import { TimeSlotsController } from './controllers/time-slots.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Project,
            Department,
            Division,
            Room,
            RoomType,
            TimeSlot,
        ]),
        UsersModule,
    ],
    providers: [
        ProjectsService,
        DepartmentsService,
        DivisionsService,
        RoomsService,
        RoomTypesService,
        TimeSlotsService,
    ],
    controllers: [
        ProjectsController,
        DepartmentsController,
        DivisionsController,
        RoomsController,
        RoomTypesController,
        TimeSlotsController,
    ],
    exports: [RoomTypesService],
})
export class ProjectsModule {}
