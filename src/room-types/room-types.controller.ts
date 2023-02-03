import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtUser } from '../common/decorators/user.decorator';
import CreateRoomTypeDto from './dto/create-roomType.dto';
import UpdateRoomTypeDto from './dto/update-roomType.dto';
import { RoomTypesService } from './room-types.service';

@Controller('room-types')
export class RoomTypesController {
    constructor(private readonly roomTypesService: RoomTypesService) {}

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async fetchOne(@Param('id') projectId: number) {
        return await this.roomTypesService.fetchOne(projectId);
    }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Body() roomTypeDto: CreateRoomTypeDto,
    ) {
        return await this.roomTypesService.create(userId, roomTypeDto);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) roomTypeId: number,
        @Body() roomTypeDto: UpdateRoomTypeDto,
    ) {
        return await this.roomTypesService.update(
            userId,
            roomTypeId,
            roomTypeDto,
        );
    }
}
