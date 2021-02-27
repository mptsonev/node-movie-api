import { DataTypes, Model, Op, Sequelize } from 'sequelize';
import { MovieData } from '../../api/omdbClient';
import { getStartOfMonthISODate } from '../../utils/dateUtils';

const Movie = (sequelize: Sequelize) => {
  sequelize.define(
    'movie',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      released: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      director: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['createdAt'],
        },
      ],
    }
  );
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

const getAllMovies = (sequelize: Sequelize): Promise<any[]> => {
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
