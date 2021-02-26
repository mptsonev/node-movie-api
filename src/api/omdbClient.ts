import https from 'https';

interface MovieData {
  title: string;
  released: string;
  genre: string;
  director: string;
}

const getOMDBData = (title: String) => {
  const API_KEY = process.env.OMDB_API_KEY;
  let body = '';
  return new Promise<MovieData>((resolve, reject) => {
    https.get(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`, res => {
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        if (res.statusCode != 200) {
          reject(body);
        } else {
          const parsed = parseOmdbDataBody(body);
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
  const parsed = JSON.parse(body);
  const {
    Title: movieTitle,
    Released: released,
    Genre: genre,
    Director: director,
  } = parsed;
  const releasedDateIso = new Date(released).toISOString();
  return {
    title: movieTitle,
    released: releasedDateIso,
    genre,
    director,
  };
};

export { MovieData, getOMDBData };
