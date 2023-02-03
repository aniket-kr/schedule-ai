import { PartialType } from '@nestjs/mapped-types';
import CreateDivisionDto from './create-division.dto';

const PartialDto = PartialType(CreateDivisionDto);
export default class UpdateDivisionDto extends PartialDto {}
