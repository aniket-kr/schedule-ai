import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationParamsDto {
    @IsPositive()
    @Transform(({ value }) => Number(value))
    @IsOptional()
    page?: number;

    @IsPositive()
    @Transform(({ value }) => Number(value))
    @IsOptional()
    limit?: number;
}
