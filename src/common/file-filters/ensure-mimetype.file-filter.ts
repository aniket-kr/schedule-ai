import { BadRequestException } from '@nestjs/common';
import type { FileFilterProducer } from '.';

export const ensureMimetype: FileFilterProducer<[string[]]> = (
    allowed: string[],
) => {
    return (_, file, cb) => {
        const { mimetype } = file;
        if (allowed.includes(mimetype)) {
            return cb(null, true);
        }

        const msg = `${mimetype} not valid. Allowed: ${allowed.join(', ')}`;
        const err = new BadRequestException(msg);
        cb(err, false);
    };
};
