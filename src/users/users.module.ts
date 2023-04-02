import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '../aws/aws.module';
import { ImagesModule } from '../images/images.module';
import { Profile, User } from './entities';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { UsersService } from './users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        ImagesModule,
        AwsModule,
    ],
    controllers: [ProfilesController],
    providers: [UsersService, ProfilesService],
    exports: [UsersService],
})
export class UsersModule {}
