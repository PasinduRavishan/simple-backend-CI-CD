import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MongoDB URI is required');
  try {
    await mongoose.connect(uri, {
      // current Mongoose defaults are fine; options kept minimal
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}
