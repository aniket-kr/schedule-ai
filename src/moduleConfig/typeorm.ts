import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormModule = (entities: TypeOrmModuleOptions['entities']) =>
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
            entities: entities,
        }),
    });
