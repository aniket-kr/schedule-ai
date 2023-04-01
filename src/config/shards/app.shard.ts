import { env, invalid, missing } from '.';

export const appConfigShard = {
    host: env.APP__HOST || '127.0.0.1',
    port: Number(env.PORT || missing('PORT')) || invalid('PORT'),
    isDevEnv: (env.NODE_ENV || '').toLowerCase() === 'development',
} as const;
