import { PartialType } from '@nestjs/mapped-types';
import CreateRoomTypeDto from './create-roomType.dto';

const PartialDto = PartialType(CreateRoomTypeDto);
export default class UpdateRoomTypeDto extends PartialDto {}
