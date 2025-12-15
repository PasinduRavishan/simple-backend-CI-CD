import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { query } from '../db/connection.js';

// Increase Jest timeout
jest.setTimeout(30000);

// Helper to clean test database before each test
async function cleanTestDB() {
  await query('DELETE FROM books');
  await query('ALTER TABLE books AUTO_INCREMENT = 1');
}

beforeAll(async () => {
  // Ensure we're using test database
  if (process.env.NODE_ENV !== 'test') {
    process.env.NODE_ENV = 'test';
  }
  await cleanTestDB();
}, 30000);

afterEach(async () => {
  await cleanTestDB();
});

afterAll(async () => {
  const { closePool } = await import('../db/connection.js');
  await closePool();
});

describe('Books API (MySQL)', () => {
  test('POST /books -> creates book', async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: 'The Odyssey', author: 'Homer', year: -700 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('The Odyssey');
    expect(res.body.author).toBe('Homer');
    expect(res.body.year).toBe(-700);
  });

  test('GET /books -> array', async () => {
    let res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);

    await query('INSERT INTO books (title, author) VALUES (?, ?)', ['1984', 'George Orwell']);
    res = await request(app).get('/books');
    expect(res.body.length).toBe(1);
  });

  test('GET /books/:id -> 200 or 404', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['A', 'B']);
    const bookId = result.insertId;
    
    const res = await request(app).get(`/books/${bookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('A');

    const res404 = await request(app).get('/books/999999');
    expect(res404.statusCode).toBe(404);
  });

  test('PUT /books/:id -> replace', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Old', 'X']);
    const bookId = result.insertId;
    
    const res = await request(app)
      .put(`/books/${bookId}`)
      .send({ title: 'New', author: 'Y', year: 2020 });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New');
    expect(res.body.year).toBe(2020);
  });

  test('PATCH /books/:id -> partial update', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Patch', 'Auth']);
    const bookId = result.insertId;
    
    const res = await request(app)
      .patch(`/books/${bookId}`)
      .send({ summary: 'short summary' });
    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toBe('short summary');
    expect(res.body.title).toBe('Patch'); // Title should remain
  });

  test('DELETE /books/:id -> 204 then 404', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['ToDel', 'A']);
    const bookId = result.insertId;
    
    const res = await request(app).delete(`/books/${bookId}`);
    expect(res.statusCode).toBe(204);

    const get = await request(app).get(`/books/${bookId}`);
    expect(get.statusCode).toBe(404);
  });

  test('Validation -> 400 on create missing fields', async () => {
    const res = await request(app).post('/books').send({ title: '' });
    expect(res.statusCode).toBe(400);
  });

  test('PATCH invalid fields -> 400', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['x', 'y']);
    const bookId = result.insertId;
    
    const res = await request(app).patch(`/books/${bookId}`).send({ foo: 'bar' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /books with all fields -> 201', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Test Book',
        author: 'Test Author',
        year: 2023,
        summary: 'This is a test book summary'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Book');
    expect(res.body.author).toBe('Test Author');
    expect(res.body.year).toBe(2023);
    expect(res.body.summary).toBe('This is a test book summary');
    expect(res.body).toHaveProperty('id');
  });

  test('GET /books with search filters', async () => {
    await query('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', ['First', 'Author A', 2020]);
    await query('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', ['Second', 'Author B', 2021]);
    await query('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', ['Third', 'Author A', 2022]);

    // Filter by author
    let res = await request(app).get('/books?author=Author A');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);

    // Filter by year
    res = await request(app).get('/books?year=2021');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Second');
  });

  test('PUT /books/:id with missing author -> 400', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Old', 'X']);
    const bookId = result.insertId;
    
    const res = await request(app)
      .put(`/books/${bookId}`)
      .send({ title: 'New Title Only' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('author');
  });

  test('PUT /books/:id with missing title -> 400', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Old', 'X']);
    const bookId = result.insertId;
    
    const res = await request(app)
      .put(`/books/${bookId}`)
      .send({ author: 'New Author Only' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('title');
  });

  test('PATCH /books/:id with invalid ID format -> 404', async () => {
    const res = await request(app)
      .patch('/books/999999')
      .send({ title: 'Updated' });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /books/:id with invalid ID format -> 404', async () => {
    const res = await request(app).delete('/books/999999');
    expect(res.statusCode).toBe(404);
  });

  test('PUT /books/:id with invalid ID format -> 404', async () => {
    const res = await request(app)
      .put('/books/999999')
      .send({ title: 'Test', author: 'Author' });
    expect(res.statusCode).toBe(404);
  });

  test('PATCH /books/:id updates only provided fields', async () => {
    const result = await query('INSERT INTO books (title, author, year) VALUES (?, ?, ?)', 
      ['Original', 'Original Author', 2020]);
    const bookId = result.insertId;
    
    const res = await request(app)
      .patch(`/books/${bookId}`)
      .send({ year: 2024 });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Original');
    expect(res.body.author).toBe('Original Author');
    expect(res.body.year).toBe(2024);
  });

  test('POST /books with negative year -> 201', async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: 'Ancient Text', author: 'Unknown', year: -300 });
    expect(res.statusCode).toBe(201);
    expect(res.body.year).toBe(-300);
  });

  test('GET /books/:id with non-existent ID -> 404', async () => {
    const res = await request(app).get('/books/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContain('not found');
  });

  test('POST /books with missing author -> 400', async () => {
    const res = await request(app)
      .post('/books')
      .send({ title: 'Title Only' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('author');
  });

  test('404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });

  test('PATCH /books/:id with empty body -> 400', async () => {
    const result = await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Test', 'Author']);
    const bookId = result.insertId;
    
    const res = await request(app)
      .patch(`/books/${bookId}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('DELETE /books (deleteAll) -> removes all books', async () => {
    // Create multiple books
    await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Book1', 'Author1']);
    await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Book2', 'Author2']);
    await query('INSERT INTO books (title, author) VALUES (?, ?)', ['Book3', 'Author3']);

    // Verify books exist
    let res = await request(app).get('/books');
    expect(res.body.length).toBe(3);

    // Delete all books
    res = await request(app).delete('/books');
    expect(res.statusCode).toBe(200);
    expect(res.body.deletedCount).toBe(3);

    // Verify all books are gone
    res = await request(app).get('/books');
    expect(res.body.length).toBe(0);
  });
});
