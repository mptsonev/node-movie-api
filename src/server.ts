import express from 'express';

import { createMovieRequest, getMoviesRequest } from './api/movies';
import { PORT } from './config';

// App
const app = express();

app.use(express.json());
app.use('/movies', require('./middleware'));

app.get('/movies', (request: express.Request, response: express.Response) => {
  getMoviesRequest(response);
});

app.post('/movies', (request: express.Request, response: express.Response) => {
  createMovieRequest(request, response);
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
