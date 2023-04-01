import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '../aws/aws.module';
import { ImagesModule } from '../images/images.module';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersService } from './users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        ImagesModule,
        AwsModule,
    ],
    controllers: [ProfileController],
    providers: [UsersService, ProfileService],
    exports: [UsersService],
})
export class UsersModule {}
