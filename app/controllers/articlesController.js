const express = require('express');
const { Article } = require('../models/article');
const router = express.Router();

const mongoose  = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const validateObjectId = (req, res, next) => {
   const id = req.params.id;
   if (!ObjectId.isValid(id)) {
       return res.status(400).send({ message: 'Invalid ObjectId' });
   }
   next();
};

router.get('/articles', async (req, res) => {
	const articles = await Article.find();

	return res.json(articles);
});

router.get('/article/:id', validateObjectId, async (req, res) => {
	const id = req.params.id;

	const article = await Article.findById(id);

	if (article !== null) {
		return res.json(article);
	} else {
		return res.status(404).send({ message: `No article found with id ${id}` });
	}
});

router.post('/article', async (req, res) => {
	const body = req.body;

	try {
		await Article.validate(body);
   } catch (err) {
   	return res.status(422).send({ message: 'Article validation failed', errors: err.errors });
   }

	try {
		await Article.create(body);
		return res.status(201).send({ message: 'Article created successfully!' });
	} catch (err) {
		return res.status(500).send({ message: 'Error creating article', errors: err.message });
	}
});

router.put('/article/:id', validateObjectId, async (req, res) => {
	const id = req.params.id;
	const body = req.body;

	try {
		const result = await Article.findByIdAndUpdate(id, body);

		if (result !== null) {
			return res.status(200).send({ message: 'Article updated successfully!' });
		} else {
			return res.status(404).send({ message: `No article found with id ${id}` });
		}
	} catch (err) {
		res.status(500).send({ message: 'Error updating article', error: err.message });
	}

});

router.delete('/article/:id', validateObjectId, async (req, res) => {
	const id = req.params.id;

	try {
		const result = await Article.findByIdAndDelete(id);
		if (result !== null) {
			return res.status(200).send({ message: 'Article deleted successfully!' });
		} else {
			return res.status(404).send({ message: `No article found with id ${id}` });
		}
	} catch (err) {
		res.status(500).send({ message: 'Error deleting article', error: err.message });
	}
});

module.exports = router;