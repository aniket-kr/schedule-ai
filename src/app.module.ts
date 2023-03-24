import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { dataSourceOptions } from './db/typeorm';

@Module({
    imports: [ConfigModule, TypeOrmModule.forRoot(dataSourceOptions)],
})
export class AppModule {}
