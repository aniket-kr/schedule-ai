import { env, invalid, missing } from '.';

export const appConfigShard = {
    host: env.APP__HOST || 'localhost',
    port: Number(env.PORT || missing('PORT')) || invalid('PORT'),
    isDevEnv: (env.NODE_ENV || '').toLowerCase() === 'development',
} as const;
