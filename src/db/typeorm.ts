import { DataSource, type DataSourceOptions } from 'typeorm';
import { ConfigService } from '../config/config.service';

const config = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    synchronize: true,
    connectTimeout: config.db.timeoutMs,
    migrations: ['dist/db/migrations/*.js'],
    entities: ['dist/**/entities/*.entity.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
