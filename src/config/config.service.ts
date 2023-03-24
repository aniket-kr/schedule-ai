import 'dotenv/config'; /* REQUIRED AS EARLIEST IMPORT */

import { Injectable } from '@nestjs/common';
import { appConfigShard, authConfigShard, dbConfigShard } from './shards';

@Injectable()
export class ConfigService {
    readonly app = appConfigShard;
    readonly db = dbConfigShard;
    readonly auth = authConfigShard;
}
