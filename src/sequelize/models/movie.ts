import { DataTypes, Sequelize, Op, Model } from 'sequelize';
import { MovieData } from '../../api/omdbClient';
import { getStartOfMonthISODate } from '../../utils/dateUtils';

const Movie = (sequelize: Sequelize) => {
  sequelize.define('movie', {
    title: DataTypes.STRING,
    released: DataTypes.DATE,
    genre: DataTypes.STRING,
    director: DataTypes.STRING,
    createdBy: DataTypes.STRING,
  });
};

const getCreatedMoviesThisMonth = (
  sequelize: Sequelize,
  user: string
): Promise<number> => {
  const startOfMonth = getStartOfMonthISODate();
  return sequelize.models.movie.count({
    where: {
      createdAt: {
        [Op.gt]: startOfMonth,
      },
      createdBy: {
        [Op.eq]: user,
      },
    },
  });
};

const getAllMovies = (sequelize: Sequelize): Promise<Model<any, any>[]> => {
  return sequelize.models.movie.findAll();
};

const createMovie = (
  sequelize: Sequelize,
  createdBy: string,
  data: MovieData
): Promise<Model<any, any>> => {
  return sequelize.models.movie.create({
    ...data,
    createdBy,
  });
};

export { getCreatedMoviesThisMonth, getAllMovies, createMovie, Movie };
