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
import { FacultiesService } from './faculties.service';
import { PaginationParamsDto } from '../common/dto/pagination.dto';
import { JwtUser } from '../common/decorators/user.decorator';
import { UserId } from '../users/entities';
import { ProjectId } from '../projects/entities';
import { UrlPath } from '../common/decorators/path.decorator';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Page } from '../common/page';
import { CreateFacultyDto, UpdateFacultyDto } from './dto';
import { FacultyId } from './entities';

@Controller('/projects/:projectId/faculties')
@UseGuards(JwtAuthGuard)
export class FacultiesController {
    constructor(private readonly facultiesService: FacultiesService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @UrlPath() urlPath: string,
        @Query() queryParams: PaginationParamsDto,
    ) {
        const { page, limit } = { page: 1, limit: 20, ...queryParams };
        const [faculties, total] = await this.facultiesService.findWithCount(
            userId,
            projectId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(faculties, total, urlPath, params);
    }

    @Get(':facultyId')
    async getOne(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('facultyId', ParseIntPipe) facultyId: FacultyId,
    ) {
        return await this.facultiesService.findOne(
            userId,
            projectId,
            facultyId,
        );
    }

    @Get(':facultyId/subjects')
    async getAllSubjectsTaught(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('facultyId', ParseIntPipe) facultyId: FacultyId,
    ) {
        return await this.facultiesService.subjectsTaughtAll(
            userId,
            projectId,
            facultyId,
        );
    }

    @Post()
    async create(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Body() dto: CreateFacultyDto,
    ) {
        return await this.facultiesService.create(userId, projectId, dto);
    }

    @Patch(':facultyId')
    async update(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('facultyId', ParseIntPipe) facultyId: FacultyId,
        @Body() dto: UpdateFacultyDto,
    ) {
        return await this.facultiesService.update(
            userId,
            projectId,
            facultyId,
            dto,
        );
    }

    @Delete(':facultyId')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('facultyId', ParseIntPipe) facultyId: FacultyId,
    ) {
        await this.facultiesService.delete(userId, projectId, facultyId);
    }
}
