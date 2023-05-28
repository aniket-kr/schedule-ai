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
import { JwtAuthGuard } from '../../auth/auth.guard';
import { type RoomTypesService } from '../services';
import { Page } from '../../common/page';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserId } from '../../users/entities';
import { ProjectId, RoomTypeId } from '../entities';
import { UrlPath } from '../../common/decorators/path.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination.dto';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from '../dto';

@Controller('/projects/:projectId/room-types')
@UseGuards(JwtAuthGuard)
export class RoomTypesController {
    constructor(private readonly roomTypesService: RoomTypesService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @UrlPath() urlPath: string,
        @Query() queryParams: PaginationParamsDto,
    ) {
        const { page, limit } = { page: 1, limit: 10, ...queryParams };
        const [roomTypes, total] = await this.roomTypesService.findWithCount(
            userId,
            projectId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(roomTypes, total, urlPath, params);
    }

    @Get(':roomTypeId')
    async getOne(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('roomTypeId', ParseIntPipe) roomTypeId: RoomTypeId,
    ) {
        return await this.roomTypesService.findOne(
            userId,
            projectId,
            roomTypeId,
        );
    }

    @Post()
    async create(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Body() dto: CreateRoomTypeDto,
    ) {
        return await this.roomTypesService.create(userId, projectId, dto);
    }

    @Patch(':roomTypeId')
    async update(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('roomTypeId', ParseIntPipe) roomTypeId: RoomTypeId,
        @Body() dto: UpdateRoomTypeDto,
    ) {
        return await this.roomTypesService.update(
            userId,
            projectId,
            roomTypeId,
            dto,
        );
    }

    @Delete(':roomTypeId')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('roomTypeId', ParseIntPipe) roomTypeId: RoomTypeId,
    ) {
        return await this.roomTypesService.delete(
            userId,
            projectId,
            roomTypeId,
        );
    }
}
