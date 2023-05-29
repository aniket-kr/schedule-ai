import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from './config/config.module';
import { dataSourceOptions } from './db/typeorm';
import { FacultiesModule } from './faculties/faculties.module';
import { ImagesModule } from './images/images.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRoot(dataSourceOptions),
        ImagesModule,
        AwsModule,
        AuthModule,
        UsersModule,
        ProjectsModule,
        FacultiesModule,
        SubjectsModule,
    ],
})
export class AppModule {}
