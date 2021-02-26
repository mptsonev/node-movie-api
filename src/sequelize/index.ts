import { Sequelize } from 'sequelize';
import { Movie } from './models/movie';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } from '../config';

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

const modelDefiners = [Movie];

for (const modelDefiner of modelDefiners) {
  modelDefiner(connection);
}

connection.sync();

export default connection;
