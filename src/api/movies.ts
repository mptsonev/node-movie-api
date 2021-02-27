import { Request, Response } from 'express';
import { Model } from 'sequelize';
import connection from '../sequelize';
import {
  createMovie,
  getAllMovies,
  getCreatedMoviesThisMonth,
} from '../sequelize/models/movie';
import { getOMDBData } from './omdbClient';
import { Role } from './role';

class ApiError extends Error {
  status: number;
  message: string;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const getMoviesRequest = async (response: Response) => {
  const movies = await getAllMovies(connection);
  response.status(200).json(movies);
};

const createMovieRequest = async (request: Request, response: Response) => {
  const { role, name: userName } = response.locals;
  const { title } = request.body;
  if (!title || !title.trim()) {
    throw new ApiError('Title missing in request body!', 400);
  }

  const createdMovie =
    role === Role.Premium
      ? await createMoviePremiumUser(title, userName)
      : await createMovieBasicUser(title, userName);
  response.status(201).json(createdMovie);
};

const createMoviePremiumUser = async (
  title: string,
  userName: string
): Promise<Model<any, any>> => {
  return createMovieInDatabase(title, userName);
};

const createMovieBasicUser = async (
  title: string,
  userName: string
): Promise<Model<any, any>> => {
  const createdMoviesCount = await getCreatedMoviesThisMonth(
    connection,
    userName
  );

  if (createdMoviesCount < 5) {
    return createMovieInDatabase(title, userName);
  } else {
    throw new ApiError(
      'Monthly quota reached, consider upgrading to premium',
      402
    );
  }
};

const createMovieInDatabase = async (
  title: string,
  createdBy: string
): Promise<Model<any, any>> => {
  const omdbData = await getOMDBData(title);
  return createMovie(connection, createdBy, omdbData);
};

export { getMoviesRequest, createMovieRequest };
