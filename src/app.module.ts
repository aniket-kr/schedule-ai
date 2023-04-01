import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from './config/config.module';
import { dataSourceOptions } from './db/typeorm';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRoot(dataSourceOptions),
        ImagesModule,
        AwsModule,
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
