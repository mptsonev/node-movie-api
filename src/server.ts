const express = require('express');
const { Pool, Client } = require('pg')

const client = new Client({
    user: 'user',
    database: 'db',
    host: 'postgres',
    password: 'pass',
    port: 5432,
});
client.connect()
client.query('SELECT NOW()', (err: any, res: any) => {
    console.log(err, res)
    client.end()
})
// Constants
const PORT = 7777;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req: any, res: any) => {
    res.send('Hello World');
});

const server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

const startGracefulShutdown = () => {
    console.log('Starting gracefull shutdown of server...');
    server.close(() => {
        console.log('Server shut down.');
    });
}

process.on('SIGTERM', startGracefulShutdown);
process.on('SIGINT', startGracefulShutdown);
