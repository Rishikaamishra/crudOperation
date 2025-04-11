import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

console.log(`${__dirname}/../user/migration/*-migration{.ts,.js}`);

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '12345',
  database: 'postgres',
  entities: [__dirname + '/../user/entities/*{.ts,.js}'],
  migrations: [__dirname + '/../user/migration/*{.ts,.js}'],
  synchronize: true,
  logging: true,
};

export const AppDataSource = new DataSource(typeOrmConfig);