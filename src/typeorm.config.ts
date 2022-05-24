/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormMysqlOptions = (
    database: string,
    overrides?: Partial<TypeOrmModuleOptions>,
): TypeOrmModuleOptions =>
({
    type: 'mysql',
    port: 3306,
    host: 'localhost',
    username: 'root',
    password: 'root',
    database,
    autoLoadEntities: true,
    synchronize: true,
    ...overrides,
} as TypeOrmModuleOptions);


export const typeormOrmConfig = (
    database: string,
    overrides?: Partial<TypeOrmModuleOptions>,
): TypeOrmModuleOptions => {

    return typeormMysqlOptions(database, overrides);
};

