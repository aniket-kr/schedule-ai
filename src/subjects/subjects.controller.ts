import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Put,
    Query,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { PaginationParamsDto } from '../common/dto/pagination.dto';
import { JwtUser } from '../common/decorators/user.decorator';
import { UserId } from '../users/entities';
import { ProjectId } from '../projects/entities';
import { UrlPath } from '../common/decorators/path.decorator';
import { Page } from '../common/page';
import { SubjectId } from './entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

@Controller('/projects/:projectId/subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @UrlPath() urlPath: string,
        @Query() queryParams: PaginationParamsDto,
    ) {
        const { page, limit } = { page: 1, limit: 20, ...queryParams };
        const [subjects, total] = await this.subjectsService.findWithCount(
            userId,
            projectId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(subjects, total, urlPath, params);
    }

    @Get(':subjectId')
    async getOne(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('subjectId', ParseIntPipe) subjectId: SubjectId,
    ) {
        return await this.subjectsService.findOne(userId, projectId, subjectId);
    }

    @Put()
    async create(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Body() dto: CreateSubjectDto,
    ) {
        return await this.subjectsService.create(userId, projectId, dto);
    }

    @Patch(':subjectId')
    async update(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('subjectId', ParseIntPipe) subjectId: SubjectId,
        @Body() dto: UpdateSubjectDto,
    ) {
        return await this.subjectsService.update(
            userId,
            projectId,
            subjectId,
            dto,
        );
    }

    @Delete(':subjectId')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('subjectId', ParseIntPipe) subjectId: SubjectId,
    ) {
        await this.subjectsService.delete(userId, projectId, subjectId);
    }
}
