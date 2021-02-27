import https from 'https';
import { OMDB_API_KEY } from '../config';

interface MovieData {
  title: string;
  released: string;
  genre: string;
  director: string;
}

const OMDB_API_URL = 'https://www.omdbapi.com/';

const getOMDBData = (title: String): Promise<MovieData> => {
  let body = '';
  return new Promise<MovieData>((resolve, reject) => {
    https.get(`${OMDB_API_URL}?t=${title}&apikey=${OMDB_API_KEY}`, res => {
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        const parsedJSON = JSON.parse(body);
        if (res.statusCode != 200 || !!parsedJSON.Error) {
          console.log('Failed to get OMDB data', body);
          reject('Failed to get OMDB data');
        } else {
          const parsed = parseOmdbDataBody(parsedJSON);
          resolve(parsed);
        }
      });
      res.on('error', err => {
        reject(err);
      });
    });
  });
};

const parseOmdbDataBody = (body: any): MovieData => {
  const {
    Title: movieTitle,
    Released: released,
    Genre: genre,
    Director: director,
  } = body;
  const releasedDateIso = new Date(released).toISOString();
  return {
    title: movieTitle,
    released: releasedDateIso,
    genre,
    director,
  };
};

export { MovieData, getOMDBData };
