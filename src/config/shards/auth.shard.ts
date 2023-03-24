import { env, invalid, missing } from '.';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const authConfigShard = {
    jwtSecretKey: env.AUTH__JWT_SECRET || missing('AUTH__JWT_SECRET'),

    jwtExpiryMs:
        Number(env.AUTH__JWT_EXPIRY_MS || ONE_DAY_IN_MS) ||
        invalid('AUTH__JWT_EXPIRY_MS'),

    saltRounds:
        Number(env.AUTH__SALT_ROUNDS || 10) || invalid('AUTH__SALT_ROUNDS'),
} as const;
