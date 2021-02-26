import express, { Request, Response } from 'express';

import { createMovieRequest, getMoviesRequest } from './api/movies';
import { PORT } from './config';

// App
const app = express();

app.use(express.json());
app.use('/movies', require('./middleware'));

const errorHandler = (err: any, res: Response) => {
  const { message = 'Something went wrong', status = 500 } = err;
  res.status(status).json({ error: message });
};

app.get('/movies', (request: Request, response: Response) => {
  getMoviesRequest(response).catch(err => errorHandler(err, response));
});

app.post('/movies', (request: Request, response: Response) => {
  createMovieRequest(request, response).catch(err =>
    errorHandler(err, response)
  );
});

const server = app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

const startGracefulShutdown = () => {
  console.log('Starting gracefull shutdown of server...');
  server.close(() => {
    console.log('Server shut down.');
  });
};

process.on('SIGTERM', startGracefulShutdown);
process.on('SIGINT', startGracefulShutdown);
