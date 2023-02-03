import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtUser } from '../common/decorators/user.decorator';
import CreateTimeSlotDto from './dto/create-timeSlots.dto';
import UpdateTimeSlotDto from './dto/update-timeSlots.dto';
import { TimeSlotService } from './time-slots.service';

@Controller('time-slots')
@UseGuards(JwtAuthGuard)
export class TimeSlotsController {
    constructor(private readonly timeSlotsService: TimeSlotService) {}

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async fetchOne(@Param('id') projectId: number) {
        return await this.timeSlotsService.fetchOne(projectId);
    }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Body() timeSlotDto: CreateTimeSlotDto,
    ) {
        return await this.timeSlotsService.create(userId, timeSlotDto);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) timeSlotId: number,
        @Body() timeSlotDto: UpdateTimeSlotDto,
    ) {
        return await this.timeSlotsService.update(
            userId,
            timeSlotId,
            timeSlotDto,
        );
    }
}
