import express, { Request, Response, NextFunction, Router } from 'express';
import { Article, IArticle } from '../models/article';
import mongoose from 'mongoose';

const router : Router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

const validateObjectId = (req : Request, res : Response, next : NextFunction) => {
	const id : string = req.params.id;

	if (!ObjectId.isValid(id)) {
		return res.status(400).send({ message: 'Invalid ObjectId' });
	}
	next();
};

const getErrorMessage = (err : unknown) => {
	if (err instanceof Error) {
		return err.message;
	}

	return "Unknown Error";
}

const getErrorErrors = (err : unknown) => {
	if (err instanceof mongoose.Error.ValidationError) {
		return err.errors;
	}

	return "Unknown Error";
}

router.get('/articles', async (req : Request, res : Response) => {
	try {
		const articles : IArticle[] = await Article.find();

		return res.json(articles);
	} catch (err) {
		return res.status(500).send({ message: 'Error fetching articles', error: getErrorMessage(err) });
	}
});

router.get('/article/:id', validateObjectId, async (req : Request, res : Response) => {
	const id : string = req.params.id;

	const article : IArticle | null = await Article.findById(id);

	if (article !== null) {
		return res.json(article);
	} else {
		return res.status(404).send({ message: `No article found with id ${id}` });
	}
});

router.post('/article', async (req : Request, res : Response) => {
	const body : IArticle = req.body;

	try {
		await Article.validate(body);
	} catch (err) {
		return res.status(422).send({ message: 'Article validation failed', errors: getErrorErrors(err) });
	}

	try {
		await Article.create(body);
		return res.status(201).send({ message: 'Article created successfully!' });
	} catch (err) {
		return res.status(500).send({ message: 'Error creating article', errors: getErrorMessage(err) });
	}
});

router.put('/article/:id', validateObjectId, async (req : Request, res : Response) => {
	const id : string = req.params.id;
	const body : IArticle = req.body;

	try {
		const result = await Article.findByIdAndUpdate(id, body);

		if (result !== null) {
			return res.status(200).send({ message: 'Article updated successfully!' });
		} else {
			return res.status(404).send({ message: `No article found with id ${id}` });
		}
	} catch (err) {
		res.status(500).send({ message: 'Error updating article', error: getErrorMessage(err) });
	}
});

router.delete('/article/:id', validateObjectId, async (req : Request, res : Response) => {
	const id : string = req.params.id;

	try {
		const result = await Article.findByIdAndDelete(id);
		if (result !== null) {
			return res.status(200).send({ message: 'Article deleted successfully!' });
		} else {
			return res.status(404).send({ message: `No article found with id ${id}` });
		}
	} catch (err) {
		res.status(500).send({ message: 'Error deleting article', error: getErrorMessage(err) });
	}
});

export default router;