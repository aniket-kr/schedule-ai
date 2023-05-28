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
import { type DivisionsService } from '../services';
import { UserId } from '../../users/entities';
import { DivisionId, ProjectId } from '../entities';
import { UrlPath } from '../../common/decorators/path.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination.dto';
import { JwtUser } from '../../common/decorators/user.decorator';
import { Page } from '../../common/page';
import { CreateDivisionDto, UpdateDivisionDto } from '../dto';

@Controller('/projects/:projectId/divisions')
@UseGuards(JwtAuthGuard)
export class DivisionsController {
    constructor(private readonly divisionsService: DivisionsService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @UrlPath() urlPath: string,
        @Query() queryParams: PaginationParamsDto,
    ) {
        const { page, limit } = { page: 1, limit: 20, ...queryParams };
        const [divisions, total] = await this.divisionsService.findWithCount(
            userId,
            projectId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(divisions, total, urlPath, params);
    }

    @Get(':divisionId')
    async getOne(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('divisionId', ParseIntPipe) divisionId: DivisionId,
    ) {
        return await this.divisionsService.findOne(
            userId,
            projectId,
            divisionId,
        );
    }

    @Post()
    async create(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Body() dto: CreateDivisionDto,
    ) {
        return await this.divisionsService.create(userId, projectId, dto);
    }

    @Patch(':divisionId')
    async update(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('divisionId', ParseIntPipe) divisionId: DivisionId,
        @Body() dto: UpdateDivisionDto,
    ) {
        return await this.divisionsService.update(
            userId,
            projectId,
            divisionId,
            dto,
        );
    }

    @Delete(':divisionId')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('divisionId', ParseIntPipe) divisionId: DivisionId,
    ) {
        return await this.divisionsService.delete(
            userId,
            projectId,
            divisionId,
        );
    }
}
