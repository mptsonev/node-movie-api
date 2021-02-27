import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../config';
import { Movie } from './models/movie';

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
