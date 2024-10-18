const { mongoose } = require('mongoose');
const { Article } = require('../../app/models/article.js');
const { faker } = require('@faker-js/faker');

const article_info = {
   title: faker.lorem.words(),
   body: faker.lorem.paragraphs()
}

beforeEach( async () => {
   await Article.deleteMany();
});

afterAll( async () => {
   mongoose.connection.close();
});

test('it should be valid', async () => {
	const result = await Article.validate(article_info);
	expect(result).toMatchObject(article_info);
});

test('it should be invalid without title', async () => {
	const article_info_copy = { ...article_info };
    delete article_info_copy.title;

    try {
		await Article.validate(article_info_copy);
    } catch (err) {
    	expect(err.errors.title.message).toBe('Path `title` is required.');
    }
});

test('it should be invalid without body', async () => {
	const article_info_copy = { ...article_info };
    delete article_info_copy.body;

    try {
		await Article.validate(article_info_copy);
    } catch (err) {
    	expect(err.errors.body.message).toBe('Path `body` is required.');
    }
});

test('it should be invalid without title and body', async () => {
	const article_info_copy = { ...article_info };
    delete article_info_copy.title;
    delete article_info_copy.body;

    try {
		await Article.validate(article_info_copy);
    } catch (err) {
    	expect(err.errors.title.message).toBe('Path `title` is required.');
    	expect(err.errors.body.message).toBe('Path `body` is required.');
    }
});

test('it should create an article', async () => {
	expect(await Article.countDocuments()).toBe(0);

	await Article.create(article_info);
	
	const article = await Article.findOne();
	
	expect(await Article.countDocuments()).toBe(1);
	expect(article).toMatchObject(article_info);
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
	   body: faker.lorem.paragraphs()
	};

	const article = await Article.create(article_info);
	
	const article_updated = await Article.findOneAndUpdate(article_info, article_info_updated, { new: true });

	expect(article_updated).toMatchObject(article_info_updated);
});
