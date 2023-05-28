import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([Faculty])],
})
export class FacultiesModule {}
