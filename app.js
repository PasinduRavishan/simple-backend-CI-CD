import express from 'express';
import bookRoutes from './routes/bookRoutes.js';

const app = express();

app.use(express.json());

// simple logger (skip noise in tests)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/books', bookRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
