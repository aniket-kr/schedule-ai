import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from './departments/departments.module';
import { ProjectsModule } from './projects/projects.module';

import dbConfig from './config/db.config';
import appConfig from './config/app.config';
import { Department } from './departments/entities/department.entity';
import { Project } from './projects/entities/project.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [dbConfig, appConfig],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql' as const,
                host: configService.get<string>('db.hostname'),
                port: configService.get<number>('db.port'),
                username: configService.get<string>('db.username'),
                password: configService.get<string>('db.password'),
                database: configService.get<string>('db.databaseName'),
                synchronize: true,
                connectTimeout: configService.get<number>('db.timeoutMillis'),
                entities: [Department, Project],
            }),
        }),
        DepartmentsModule,
        ProjectsModule,
    ],
})
export class AppModule {}
