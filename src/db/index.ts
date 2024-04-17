import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '@config';
import { Profile } from '@entities/profile.entity';

export const dbConnectionOptions: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  
  models: [Profile],

  synchronize: true,
  autoLoadModels: true,
};
