import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import TimeSlot from './entities/time-slot.entity';
import { TimeSlotsController } from './time-slots.controller';
import { TimeSlotService } from './time-slots.service';

@Module({
    imports: [TypeOrmModule.forFeature([TimeSlot]), UsersModule],
    controllers: [TimeSlotsController],
    providers: [TimeSlotService],
})
export class TimeSlotsModule {}
