import { HttpException } from '@nestjs/common';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export type Options<Entity> = FindOptionsWhere<Entity>;

export type BaseServiceOptions<T> = {
    notFound: (opts: Options<T>) => HttpException;
    exists: (opts: Options<T>) => HttpException;
};

export abstract class BaseService<T extends ObjectLiteral> {
    protected readonly repo: Repository<T>;
    protected readonly makeNotFound: BaseServiceOptions<T>['notFound'];
    protected readonly makeExists: BaseServiceOptions<T>['exists'];

    constructor({ notFound, exists }: BaseServiceOptions<T>) {
        this.makeNotFound = notFound;
        this.makeExists = exists;
    }

    async ensureExists(opts: Options<T>) {
        const exists = await this.repo.exist({ where: opts });
        if (!exists) {
            throw this.makeNotFound(opts);
        }
    }

    async ensureNotExists(opts: Options<T> = {}) {
        const entity = await this.repo.findOneBy(opts);
        if (entity) {
            throw this.makeExists(entity);
        }
    }

    async fetchOne(opts: Options<T>) {
        const entity = await this.repo.findOneBy(opts);
        if (!entity) {
            throw this.makeNotFound(opts);
        }
        return entity;
    }

    async fetchPaginated(page: number, limit: number, opts: Options<T> = {}) {
        return this.repo.findAndCount({
            skip: page * limit,
            take: limit,
            where: opts,
        });
    }

    async fetchAll(opts: Options<T>) {
        return this.repo.findBy(opts);
    }

    async delete(opts: Options<T>) {
        this.repo.delete(opts);
    }
}
