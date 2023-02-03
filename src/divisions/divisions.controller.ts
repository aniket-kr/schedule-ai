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
import { DivisionService } from './divisions.service';
import CreateDivisionDto from './dto/create-division.dto';
import UpdateDivisionDto from './dto/update-division.dto';

@Controller('divisions')
@UseGuards(JwtAuthGuard)
export class DivisionsController {
    constructor(private readonly divisionsService: DivisionService) {}
    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async fetchOne(@Param('id') projectId: number) {
        return await this.divisionsService.fetchOne(projectId);
    }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Body() divisionDto: CreateDivisionDto,
    ) {
        return await this.divisionsService.create(userId, divisionDto);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) divisionId: number,
        @Body() divisionDto: UpdateDivisionDto,
    ) {
        return await this.divisionsService.update(
            userId,
            divisionId,
            divisionDto,
        );
    }
}
