import { Faculty } from '../faculties/entities';
import {
    Department,
    Division,
    Project,
    Room,
    RoomType,
    TimeSlot,
} from '../projects/entities';
import { Profile, User } from '../users/entities';
import { Subject } from '../subjects/entities';

export const entities = [
    User,
    Profile,
    Project,
    Department,
    Division,
    Room,
    RoomType,
    Subject,
    TimeSlot,
    Faculty,
];
