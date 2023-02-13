import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtUser } from '../common/decorators/user.decorator';
import { DefaultPipe } from '../common/pipes/default.pipe';
import { makeUrl } from '../common/utils';
import CreateProjectDto from './dto/create-project.dto';
import UpdateProjectDto from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async fetchPaginated(
        @Req() req: Request,
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Query('limit', new DefaultPipe('20'), ParseIntPipe) limit: number,
        @Query('offset', new DefaultPipe('0'), ParseIntPipe) page: number,
        // @Query('detailed', new DefaultPipe('false'), ParseBoolPipe)
        // detailed: boolean,
    ) {
        const nextUrl = makeUrl(req, { limit, offset: page + 1 });
        const [projects, total] = await this.projectsService.fetchPaginated(
            page,
            limit,
            { owner: { id: userId } },
        );
        const hasNext = total > page * limit + projects.length;
        return { projects, next: hasNext ? nextUrl : undefined };
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async fetchOne(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) projectId: number,
    ) {
        return await this.projectsService.fetchOne({
            id: projectId,
            owner: { id: userId },
        });
    }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateProjectDto,
    ) {
        return await this.projectsService.create({ ownerId: userId, dto });
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) projectId: number,
        @Body() dto: UpdateProjectDto,
    ) {
        return await this.projectsService.update({
            ownerId: userId,
            projectId,
            dto,
        });
    }

    @Delete(':id')
    async delete(
        @JwtUser('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) projectId: number,
    ) {
        await this.projectsService.delete({
            id: projectId,
            owner: { id: userId },
        });
    }
}
