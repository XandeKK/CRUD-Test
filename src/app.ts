import express, { Express } from 'express';
import { Server } from 'http';
import articlesRoutes from './app/controllers/articlesController';

const app : Express = express();

app.use(express.json());
app.use(articlesRoutes);

const server : Server = app.listen(3000, () => {
	console.log('Test app listening on port 3000!');
});

export { app, server }