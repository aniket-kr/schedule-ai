import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

const OriginalDto = PartialType(CreateProfileDto);
export class UpdateProfileDto extends OriginalDto {}
