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
import { UrlPath } from '../../common/decorators/path.decorator';
import { JwtUser } from '../../common/decorators/user.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination.dto';
import { Page } from '../../common/page';
import { UserId } from '../../users/entities';
import { DepartmentsService } from '../services';
import { CreateDepartmentDto } from '../dto';
import { DepartmentId, ProjectId } from '../entities';

@Controller('/projects/:projectId/departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
    constructor(private readonly deptsService: DepartmentsService) {}

    @Get()
    async getPaginated(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @UrlPath() urlPath: string,
        @Query() queryParams: PaginationParamsDto,
    ) {
        const { page, limit } = { page: 1, limit: 20, ...queryParams };
        const [depts, total] = await this.deptsService.findWithCount(
            userId,
            projectId,
            page,
            limit,
        );
        const params = { page: page + 1, limit };
        return Page.build(depts, total, urlPath, params);
    }

    @Get(':departmentId')
    async getOne(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('departmentId', ParseIntPipe) departmentId: DepartmentId,
    ) {
        return await this.deptsService.findOne(userId, projectId, departmentId);
    }

    @Post()
    async create(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Body() dto: CreateDepartmentDto,
    ) {
        return await this.deptsService.create(userId, projectId, dto);
    }

    @Patch(':departmentId')
    async update(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('departmentId', ParseIntPipe) departmentId: DepartmentId,
        @Body() dto: CreateDepartmentDto,
    ) {
        return await this.deptsService.update(
            userId,
            projectId,
            departmentId,
            dto,
        );
    }

    @Delete(':departmentId')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: UserId,
        @Param('projectId', ParseIntPipe) projectId: ProjectId,
        @Param('departmentId', ParseIntPipe) departmentId: DepartmentId,
    ) {
        return await this.deptsService.delete(userId, projectId, departmentId);
    }
}
