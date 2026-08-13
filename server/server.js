import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routers
import productRouter from './routes/products.js';
import videoRouter from './routes/videos.js';
import blogRouter from './routes/blogs.js';
import reviewRouter from './routes/reviews.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prachi_agro';

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger middleware for debugging
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Payload:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch((err) => {
    console.error('MongoDB database connection error:', err.message);
    console.log('Ensure MongoDB service is running locally or check your connection string in .env file.');
  });

// API Routes
app.use('/api/products', productRouter);
app.use('/api/videos', videoRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/reviews', reviewRouter);

// Admin Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  const expectedPasscode = process.env.ADMIN_PASSCODE || 'admin123';
  
  if (passcode === expectedPasscode) {
    res.json({ success: true, token: 'mock-jwt-token-prachi-agro' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid passcode' });
  }
});

// Root API Healthcheck status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Boot listening
app.listen(PORT, () => {
  console.log(`Prachi Agro server is running and listening on http://localhost:${PORT}`);
});
