import { PartialType } from '@nestjs/mapped-types';
import CreateTimeSlotDto from './create-timeSlots.dto';

const PartialDto = PartialType(CreateTimeSlotDto);
export default class UpdateTimeSlotDto extends PartialDto {}
