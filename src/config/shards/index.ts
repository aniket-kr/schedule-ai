import { Logger } from '@nestjs/common';
import { exit } from 'process';

export const env = process.env;

export function missing(label: string): never {
    Logger.error(`Required config missing: ${label}`, 'ConfigModule');
    exit(1);
}

export function invalid(label: string): never {
    Logger.error(`Invalid config value: ${label}`, 'ConfigModule');
    exit(1);
}

export * from './app.shard';
export * from './auth.shard';
export * from './db.shard';
export * from './s3.shard';
