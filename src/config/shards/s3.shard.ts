import { env, missing } from '.';

export const s3ConfigShard = {
    region: env.S3__REGION || missing('S3__REGION'),
    bucketName: env.S3__BUCKET_NAME || missing('S3__BUCKET_NAME'),
    accessKeyId: env.S3__ACCESS_ID || missing('S3__ACCESS_ID'),
    secretAccessKey: env.S3__ACCESS_KEY || missing('S3__ACCESS_KEY'),
} as const;
