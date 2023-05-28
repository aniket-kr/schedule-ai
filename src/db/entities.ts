import { Faculty } from '../faculties/entities';
import {
    Department,
    Division,
    Project,
    Room,
    RoomType,
    Subject,
    TimeSlot,
} from '../projects/entities';
import { Profile, User } from '../users/entities';

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
