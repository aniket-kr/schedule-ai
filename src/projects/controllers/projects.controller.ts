import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { UrlPath } from '../../common/decorators/path.decorator';
import { JwtUser } from '../../common/decorators/user.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination.dto';
import { Page } from '../../common/page';
import { UserId } from '../../users/entities';
import { CreateProjectDto, UpdateProjectDto } from '../dto';
import { ProjectId } from '../entities';
import { ProjectsService } from '../services';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId') userId: UserId,
        @Query() queryParams: PaginationParamsDto,
        @UrlPath() urlPath: string,
    ) {
        const { page, limit } = { page: 1, limit: 20, ...queryParams };
        const [projects, total] = await this.projectsService.findWithCount(
            userId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(projects, total, urlPath, params);
    }

    @Get(':projectId')
    async getOne(
        @JwtUser('userId') userId: UserId,
        @Param('projectId') projectId: ProjectId,
    ) {
        return await this.projectsService.findOne(userId, projectId);
    }

    @Post()
    @UseInterceptors(new ClassSerializerInterceptor({ groups: ['basic'] }))
    async create(
        @JwtUser('userId') userId: UserId,
        @Body() dto: CreateProjectDto,
    ) {
        return await this.projectsService.create(userId, dto);
    }

    @Patch(':projectId')
    async update(
        @JwtUser('userId') userId: UserId,
        @Param('projectId') projectId: ProjectId,
        @Body() dto: UpdateProjectDto,
    ) {
        return await this.projectsService.update(userId, projectId, dto);
    }

    @Delete(':projectId')
    async delete(
        @JwtUser('userId') userId: UserId,
        @Param('projectId') projectId: ProjectId,
    ) {
        await this.projectsService.delete(userId, projectId);
    }
}
