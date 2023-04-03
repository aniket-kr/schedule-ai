import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from '.';

const PartialDto = PartialType(CreateDepartmentDto);
export class UpdateDepartmentDto extends PartialDto {}
