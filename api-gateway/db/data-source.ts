import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'auth_db',
  password: '123456',
  database: 'auth_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
