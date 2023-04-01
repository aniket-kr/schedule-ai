import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class S3Service {
    private readonly s3: S3Client;

    constructor(private readonly config: ConfigService) {
        this.s3 = new S3Client({
            region: config.s3.region,
            credentials: {
                accessKeyId: config.s3.accessKeyId,
                secretAccessKey: config.s3.secretAccessKey,
            },
        });
    }

    private encode(key: string) {
        return key.replace(
            /[^a-z0-9_/.]/gi,
            (match) => `-${match.charCodeAt(0)}`,
        );
    }

    getObjectUrl(key: string, skipKeyEncoding = false) {
        const { bucketName, region } = this.config.s3;
        const encodedKey = skipKeyEncoding ? key : this.encode(key);
        return `https://${bucketName}.s3.${region}.amazonaws.com/${encodedKey}`;
    }

    async uploadFile(buffer: Buffer, key: string) {
        const encodedKey = this.encode(key);
        const putCommand = new PutObjectCommand({
            Bucket: this.config.s3.bucketName,
            Key: encodedKey,
            Body: buffer,
        });
        await this.s3.send(putCommand);
        return this.getObjectUrl(encodedKey, true);
    }
}
