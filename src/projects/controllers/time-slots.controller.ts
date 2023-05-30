import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TimeSlotsService } from '../services';
import { AuthGuard } from '@nestjs/passport';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserId } from '../../users/entities';
import { ProjectId, TimeSlotId } from '../entities';
import { UrlPath } from '../../common/decorators/path.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination.dto';
import { Page } from '../../common/page';
import { CreateTimeSlotDto, UpdateTimeSlotDto } from '../dto';

@Controller('/projects/:projectId/time-slots')
@UseGuards(AuthGuard('jwt'))
export class TimeSlotsController {
    constructor(private readonly timeSlotsService: TimeSlotsService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @UrlPath() urlPath: string,
        @Query() queryParams: PaginationParamsDto,
    ) {
        const { page, limit } = { page: 1, limit: 10, ...queryParams };
        const [timeSlots, total] = await this.timeSlotsService.findWithCount(
            userId,
            projectId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(timeSlots, total, urlPath, params);
    }

    @Get(':timeSlotId')
    async getOne(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('timeSlotId', ParseIntPipe) timeSlotId: TimeSlotId,
    ) {
        return await this.timeSlotsService.findOne(
            userId,
            projectId,
            timeSlotId,
        );
    }

    @Post()
    async create(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Body() createDto: CreateTimeSlotDto,
    ) {
        return await this.timeSlotsService.create(userId, projectId, createDto);
    }

    @Patch(':timeSlotId')
    async update(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('timeSlotId', ParseIntPipe) timeSlotId: TimeSlotId,
        @Body() updateDto: UpdateTimeSlotDto,
    ) {
        return await this.timeSlotsService.update(
            userId,
            projectId,
            timeSlotId,
            updateDto,
        );
    }

    @Delete(':timeSlotId')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('timeSlotId', ParseIntPipe) timeSlotId: TimeSlotId,
    ) {
        return await this.timeSlotsService.delete(
            userId,
            projectId,
            timeSlotId,
        );
    }
}
