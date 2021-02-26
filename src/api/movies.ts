import { Request, Response } from 'express';
import connection from '../sequelize';
import {
  createMovie,
  getAllMovies,
  getCreatedMoviesThisMonth,
} from '../sequelize/models/movie';
import { getOMDBData } from './omdbClient';

interface ErrorResponse {
  status: number;
  message: string;
}

const getMoviesRequest = (response: Response) => {
  getAllMovies(connection)
    .then(movies => {
      response.status(200).json(movies);
    })
    .catch(err => {
      console.log('Cannot get movies from DB', err);
      response.status(500).json({ error: 'Something went wrong!' });
    });
};

const createMovieRequest = (request: Request, response: Response) => {
  const { role, name: userName } = response.locals;
  const { title } = request.body;
  if (!title || !title.trim()) {
    response.status(400).json({ error: 'Title missing in request body!' });
    return;
  }

  const createPromise =
    role === 'premium'
      ? createMoviePremiumUser(title, userName)
      : createMovieBasicUser(title, userName);
  createPromise
    .then(() => {
      response.status(201).end();
    })
    .catch((err: ErrorResponse) => {
      response.status(err.status).json({ error: err.message });
    });
};

const createMoviePremiumUser = (
  title: string,
  userName: string
): Promise<ErrorResponse> => {
  return createMovieInDatabase(title, userName);
};

const createMovieBasicUser = (
  title: string,
  userName: string
): Promise<ErrorResponse> => {
  return new Promise<ErrorResponse>((resolve, reject) => {
    getCreatedMoviesThisMonth(connection, userName).then(createdCount => {
      if (createdCount < 5) {
        return createMovieInDatabase(title, userName)
          .then(() => {
            resolve(undefined);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        reject({
          status: 402,
          message: 'Movies limit reached, consider upgrading to premium!',
        });
      }
    });
  });
};

const createMovieInDatabase = (
  title: string,
  createdBy: string
): Promise<ErrorResponse> => {
  return new Promise<ErrorResponse>((resolve, reject) => {
    getOMDBData(title)
      .then(data => {
        createMovie(connection, createdBy, data)
          .then(() => {
            resolve(undefined);
          })
          .catch(err => {
            console.log('Cannot create movie in DB', err);
            reject({ status: 500, message: 'Cannot create movie in DB' });
          });
      })
      .catch(err => {
        console.log('Cannot fetch OMDB data', err);
        reject({ status: 500, message: 'Cannot fetch OMDB data' });
      });
  });
};

export { getMoviesRequest, createMovieRequest };
