import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
    resize(buffer: Buffer, size: number): Promise<Buffer>;
    resize(buffer: Buffer, width: number, height: number): Promise<Buffer>;
    resize(buffer: Buffer, width: number, height?: number): Promise<Buffer> {
        return sharp(buffer)
            .resize(width, height ?? width, { fit: 'outside' })
            .toBuffer();
    }

    toProfileImage(buffer: Buffer) {
        return sharp(buffer)
            .resize({ width: 300 })
            .webp({ quality: 80 })
            .toBuffer();
    }
}
