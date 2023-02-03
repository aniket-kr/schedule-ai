import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import RoomType from './entities/room-type.entity';
import { RoomTypesController } from './room-types.controller';
import { RoomTypesService } from './room-types.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoomType]), UsersModule],
    controllers: [RoomTypesController],
    providers: [RoomTypesService],
})
export class RoomTypesModule {}
