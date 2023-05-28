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
} from '@nestjs/common';
import { RoomsService } from '../services';
import { Page } from '../../common/page';
import { JwtUser } from '../../common/decorators/user.decorator';
import { UserId } from '../../users/entities';
import { ProjectId, RoomId } from '../entities';
import { UrlPath } from '../../common/decorators/path.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination.dto';
import { CreateRoomDto, UpdateRoomDto } from '../dto';

@Controller('/projects/:projectId/rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @UrlPath() urlPath: string,
        @Query() queryParams: PaginationParamsDto,
    ) {
        const { page, limit } = { page: 1, limit: 20, ...queryParams };
        const [rooms, total] = await this.roomsService.findWithCount(
            userId,
            projectId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(rooms, total, urlPath, params);
    }

    @Get(':roomId')
    async getOne(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('roomId', ParseIntPipe) roomId: RoomId,
    ) {
        return await this.roomsService.findOne(userId, projectId, roomId);
    }

    @Post()
    async create(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Body() dto: CreateRoomDto,
    ) {
        return await this.roomsService.create(userId, projectId, dto);
    }

    @Patch(':roomId')
    async update(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('roomId', ParseIntPipe) roomId: RoomId,
        @Body() dto: UpdateRoomDto,
    ) {
        return await this.roomsService.update(userId, projectId, roomId, dto);
    }

    @Delete(':roomId')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('roomId', ParseIntPipe) roomId: RoomId,
    ) {
        await this.roomsService.delete(userId, projectId, roomId);
    }
}
