import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import Book from '../models/book.model.js';

// Increase Jest timeout for this file (30s)
jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  // Give enough time for binary download on first run
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { /* defaults */ });
}, 30000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  await Book.deleteMany({});
});

describe('Books API (ESM)', () => {
  test('POST /books -> creates book', async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: 'The Odyssey', author: 'Homer', year: -700 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('The Odyssey');
  });

  test('GET /books -> array', async () => {
    let res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);

    await Book.create({ title: '1984', author: 'George Orwell' });
    res = await request(app).get('/books');
    expect(res.body.length).toBe(1);
  });

  test('GET /books/:id -> 200 or 404', async () => {
    const book = await Book.create({ title: 'A', author: 'B' });
    const res = await request(app).get(`/books/${book._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('A');

    const res404 = await request(app).get('/books/000000000000000000000000');
    expect(res404.statusCode).toBe(404);
  });

  test('PUT /books/:id -> replace', async () => {
    const book = await Book.create({ title: 'Old', author: 'X' });
    const res = await request(app)
      .put(`/books/${book._id}`)
      .send({ title: 'New', author: 'Y', year: 2020 });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New');
  });

  test('PATCH /books/:id -> partial update', async () => {
    const book = await Book.create({ title: 'Patch', author: 'Auth' });
    const res = await request(app)
      .patch(`/books/${book._id}`)
      .send({ summary: 'short summary' });
    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toBe('short summary');
  });

  test('DELETE /books/:id -> 204 then 404', async () => {
    const book = await Book.create({ title: 'ToDel', author: 'A' });
    const res = await request(app).delete(`/books/${book._id}`);
    expect(res.statusCode).toBe(204);

    const get = await request(app).get(`/books/${book._id}`);
    expect(get.statusCode).toBe(404);
  });

  test('Validation -> 400 on create missing fields', async () => {
    const res = await request(app).post('/books').send({ title: '' });
    expect(res.statusCode).toBe(400);
  });

  test('PATCH invalid fields -> 400', async () => {
    const book = await Book.create({ title: 'x', author: 'y' });
    const res = await request(app).patch(`/books/${book._id}`).send({ foo: 'bar' });
    expect(res.statusCode).toBe(400);
  });
});
