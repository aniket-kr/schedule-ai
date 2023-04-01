import 'dotenv/config'; /* REQUIRED AS EARLIEST import */

import { Injectable } from '@nestjs/common';
import {
    appConfigShard,
    authConfigShard,
    dbConfigShard,
    s3ConfigShard,
} from './shards';

@Injectable()
export class ConfigService {
    readonly app = appConfigShard;
    readonly db = dbConfigShard;
    readonly auth = authConfigShard;
    readonly s3 = s3ConfigShard;
}
