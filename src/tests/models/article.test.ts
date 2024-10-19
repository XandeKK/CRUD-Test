import mongoose from 'mongoose';
import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import { Article, IArticle } from '../../app/models/article';
import { faker } from '@faker-js/faker';

const article_info = {
	title: faker.lorem.words(),
	body: faker.lorem.paragraphs(),
	date: new Date()
}

beforeEach( async () => {
	await Article.deleteMany();
});

afterAll( async () => {
	await mongoose.connection.close();
});

test('it should be valid', async () => {
	expect( async () => {
		await Article.validate(article_info);
	}).not.toThrow(mongoose.Error.ValidationError);
});

test('it should be invalid without title', async () => {
	const { title, ...article_info_copy } = article_info;


	try {
		await Article.validate(article_info_copy);
	} catch (err : any) {
		expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(err.errors.title.message).toBe('Path `title` is required.');
	}
});

test('it should be invalid without body', async () => {
	const { body, ...article_info_copy } = article_info;

	try {
		await Article.validate(article_info_copy);
	} catch (err : any) {
		expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(err.errors.body.message).toBe('Path `body` is required.');
	}
});

test('it should be invalid without title and body', async () => {
	const { title, body, ...article_info_copy } = article_info;

	try {
		await Article.validate(article_info_copy);
	} catch (err : any) {
		expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(err.errors.title.message).toBe('Path `title` is required.');
		expect(err.errors.body.message).toBe('Path `body` is required.');
	}
});

test('it should create an article', async () => {
	expect(await Article.countDocuments()).toBe(0);

	await Article.create(article_info);
	
	const article : IArticle | null = await Article.findOne();
	
	expect(article).not.toBeNull();  
	expect(await Article.countDocuments()).toBe(1);

	if (article !== null) {
		expect(article.title).toBe(article_info.title);
		expect(article.body).toBe(article_info.body);
	}
});

test('it should delete an article', async () => {
	await Article.create(article_info);
	
	expect(await Article.countDocuments()).toBe(1);

	await Article.deleteOne(article_info);

	expect(await Article.countDocuments()).toBe(0);
});

test('it should update an article', async () => {
	const article_info_updated = {
		title: faker.lorem.words(),
		body: faker.lorem.paragraphs(),
		date: new Date()
	};

	const article : IArticle | null = await Article.create(article_info);
	
	const article_updated : IArticle | null  = await Article.findOneAndUpdate(article_info, article_info_updated, { new: true });

	if (article_updated !== null) {
		expect(article_updated.title).toBe(article_info_updated.title);
		expect(article_updated.body).toBe(article_info_updated.body);
	}
});
