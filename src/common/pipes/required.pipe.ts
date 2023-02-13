import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RequiredPipe implements PipeTransform {
    constructor(private readonly defaulters: any[] = [undefined, null, '']) {}

    transform(value: any, { type, data }: ArgumentMetadata) {
        if (this.defaulters.includes(value)) {
            const err = `missing required ${type} param - '${data}'`;
            throw new BadRequestException(err, {
                description: 'MissingRequiredParam',
            });
        }
        return value;
    }
}
