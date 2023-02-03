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
import CreateRoomDto from './dto/create-room.dto';
import UpdateRoomDto from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async fetchOne(@Param('id') roomId: number) {
        return await this.roomsService.fetchOne(roomId);
    }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Body() roomDto: CreateRoomDto,
    ) {
        return await this.roomsService.create(userId, roomDto);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) roomId: number,
        @Body() roomDto: UpdateRoomDto,
    ) {
        return await this.roomsService.update(userId, roomId, roomDto);
    }
}
