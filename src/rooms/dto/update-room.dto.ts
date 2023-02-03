import { PartialType } from '@nestjs/mapped-types';
import CreateRoomDto from './create-room.dto';

const PartialDto = PartialType(CreateRoomDto);
export default class UpdateRoomDto extends PartialDto {}
