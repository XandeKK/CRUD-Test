import request, { Response } from 'supertest';
import mongoose from 'mongoose';
import { describe, it, expect, test, beforeEach, beforeAll, afterEach, afterAll } from '@jest/globals';
import { Article, IArticle } from '../../app/models/article';
import { app, server } from '../../app';
import { faker } from '@faker-js/faker';

const article_info = {
   title: faker.lorem.words(),
   body: faker.lorem.paragraphs(),
   date: new Date()
}

beforeAll( async () => {
   await Article.deleteMany();
});

afterAll( async () => {
   await server.close();
   await mongoose.connection.close();
});

describe('Empty database' , () => {
   afterAll( async () => {
      await Article.deleteMany();
   });

   describe('GET /articles', () => {
      it('should return an empty array', async () => {
         const response : Response = await request(app).get('/articles');

         expect(response.status).toBe(200);
         expect(response.body).toHaveLength(0);
      });
   });

   describe('GET /article/:id', () => {
      it('should return that no article found with id 111111111111111111111111', async () => {
         const response : Response = await request(app).get('/article/111111111111111111111111');

         expect(response.status).toBe(404);
         expect(response.body.message).toBe('No article found with id 111111111111111111111111');
      });
   });

   describe('POST /article', () => {
      it('should create an article', async () => {
         const response : Response = await request(app).post('/article').send(article_info);

         expect(response.status).toBe(201);
         expect(response.body.message).toBe('Article created successfully!');
      });

      it('should not create an article without title', async () => {
         const { title, ...article_info_copy } = article_info;

         const response : Response = await request(app).post('/article').send(article_info_copy);

         expect(response.status).toBe(422);
         expect(response.body.message).toBe('Article validation failed');
         expect(response.body.errors.title.message).toBe('Path `title` is required.');
      });

      it('should not create an article without body', async () => {
         const { body, ...article_info_copy } = article_info;

         const response : Response = await request(app).post('/article').send(article_info_copy);

         expect(response.status).toBe(422);
         expect(response.body.message).toBe('Article validation failed');
         expect(response.body.errors.body.message).toBe('Path `body` is required.');
      });

      it('should not create an article without title and body', async () => {
         const { title, body, ...article_info_copy } = article_info;

         const response : Response = await request(app).post('/article').send(article_info_copy);

         expect(response.status).toBe(422);
         expect(response.body.message).toBe('Article validation failed');
         expect(response.body.errors.title.message).toBe('Path `title` is required.');
         expect(response.body.errors.body.message).toBe('Path `body` is required.');
      });

      // Não consegui pensar em uma forma de causar o erro 500.
   });

   describe('PUT /article/:id', () => {
      it('should return that no article found with id 111111111111111111111111', async () => {
         const response : Response = await request(app).put('/article/111111111111111111111111').send(article_info);

         expect(response.status).toBe(404);
         expect(response.body.message).toBe('No article found with id 111111111111111111111111');
      });
   });

   describe('DELETE /article/:id', () => {
      it('should return that no article found with id 111111111111111111111111', async () => {
         const response : Response = await request(app).delete('/article/111111111111111111111111');

         expect(response.status).toBe(404);
         expect(response.body.message).toBe('No article found with id 111111111111111111111111');
      });
   });
});

describe('Database with some information' , () => {
   let articles : Array<IArticle>;

   beforeEach( async () => {
      for (let i = 1; i <= 5; i++) {
         await Article.create({
            title: faker.lorem.words(),
            body: faker.lorem.paragraphs()
         })
      }

      articles = await Article.find();
   });

   afterEach( async () => {
      await Article.deleteMany();
   });

   describe('GET /articles', () => {
      it('should return an array with a length of 5', async () => {
         const response : Response = await request(app).get('/articles');

         expect(response.status).toBe(200);
         expect(response.body).toHaveLength(5);
      });
   });

   describe('GET /article/:id', () => {
      it('should return an article', async () => {
         const response : Response = await request(app).get(`/article/${articles[0]._id}`);

         expect(response.status).toBe(200);

         expect(response.body._id).toBe(String(articles[0]._id));
         expect(response.body.title).toBe(articles[0].title);
         expect(response.body.body).toBe(articles[0].body);
      });
   });

   describe('PUT /article/:id', () => {
      it('should update an article', async () => {
         const article = {
            title: faker.lorem.words(),
            body: faker.lorem.paragraphs(),
            date: new Date()
         }

         const response : Response = await request(app).put(`/article/${articles[0]._id}`).send(article);

         expect(response.status).toBe(200);
         expect(response.body.message).toBe('Article updated successfully!');
      });

      it('should update an article without title', async () => {
         const article = {
            // title: faker.lorem.words(),
            body: faker.lorem.paragraphs()
         }

         const response : Response = await request(app).put(`/article/${articles[0]._id}`).send(article);

         expect(response.status).toBe(200);
         expect(response.body.message).toBe('Article updated successfully!');
      });

      it('should update an article without body', async () => {
         const article = {
            // title: faker.lorem.words(),
            body: faker.lorem.paragraphs()
         }

         const response : Response = await request(app).put(`/article/${articles[0]._id}`).send(article);

         expect(response.status).toBe(200);
         expect(response.body.message).toBe('Article updated successfully!');
      });

      it('should update an article without title and body', async () => {
         const article = {
            // title: faker.lorem.words(),
            // body: faker.lorem.paragraphs()
         }

         const response : Response = await request(app).put(`/article/${articles[0]._id}`).send(article);

         expect(response.status).toBe(200);
         expect(response.body.message).toBe('Article updated successfully!');
      });
      // Não consegui pensar em uma forma de causar o erro 500.
   });

   describe('DELETE /article/:id', () => {
      it('should delete an article', async () => {
         const response : Response = await request(app).delete(`/article/${articles[0]._id}`);

         expect(response.status).toBe(200);
      });

      // Não consegui pensar em uma forma de causar o erro 500.
   });
});

describe('Middleware', () => {
   describe('GET /article/:id', () => {
      it('should return invalid ObjectId', async () => {
         const response : Response = await request(app).get('/article/InvalidObjectId');

         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Invalid ObjectId');
      });
   });

   describe('PUT /article/:id', () => {
      it('should return invalid ObjectId', async () => {
         const response : Response = await request(app).put('/article/InvalidObjectId').send(article_info);

         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Invalid ObjectId');
      });
   });

   describe('DELETE /article/:id', () => {
      it('should return invalid ObjectId', async () => {
         const response : Response = await request(app).delete('/article/InvalidObjectId');

         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Invalid ObjectId');
      });
   });
});