import { env, invalid, missing } from '.';

export const dbConfigShard = {
    host: env.DB__HOST || missing('DB__HOST'),
    port: Number(env.DB__PORT || missing('DB__PORT')) || invalid('DB__PORT'),
    database: env.DB__NAME || missing('DB__NAME'),
    username: env.DB__USERNAME || missing('DB__USERNAME'),
    password: env.DB__PASSWORD || missing('DB__PASSWORD'),
    timeoutMs: Number(env.DB__TIMEOUT_MS || 15000) || invalid('DB__TIMEOUT_MS'),
};
