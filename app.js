const express = require('express');
const articlesRoutes = require('./app/controllers/articlesController');

const app = express();

app.use(express.json());
app.use(articlesRoutes);

const server = app.listen(3000, () => {
	console.log('Test app listening on port 3000!');
});

module.exports = { app, server };