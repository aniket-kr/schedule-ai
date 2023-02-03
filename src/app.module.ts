import { Module } from '@nestjs/common';
import { configModule } from './module-config/config';
import { typeormModule } from './module-config/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { SubjectsModule } from './subjects/subjects.module';
import { RoomsModule } from './rooms/rooms.module';
import { DepartmentsModule } from './departments/departments.module';
import { SchedulesModule } from './schedules/schedules.module';
import { FacultiesModule } from './faculties/faculties.module';
import { DivisionsModule } from './divisions/divisions.module';
import { TimeSlotsModule } from './time-slots/time-slots.module';
import { LecturesModule } from './lectures/lectures.module';
import { UserProfilesModule } from './user-profiles/user-profiles.module';
import { AuthModule } from './auth/auth.module';
import { RoomTypesController } from './room-types/room-types.controller';
import { RoomTypesService } from './room-types/room-types.service';
import { RoomTypesModule } from './room-types/room-types.module';

@Module({
    imports: [
        configModule,
        typeormModule,
        UsersModule,
        ProjectsModule,
        SubjectsModule,
        RoomsModule,
        DepartmentsModule,
        SchedulesModule,
        FacultiesModule,
        DivisionsModule,
        TimeSlotsModule,
        LecturesModule,
        UserProfilesModule,
        AuthModule,
        RoomTypesModule,
    ],
    controllers: [RoomTypesController],
    providers: [RoomTypesService],
})
export class AppModule {}
