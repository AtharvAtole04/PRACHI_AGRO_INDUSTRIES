import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import Routers
import productRouter from './routes/products.js';
import videoRouter from './routes/videos.js';
import blogRouter from './routes/blogs.js';
import reviewRouter from './routes/reviews.js';
import authRouter from './routes/auth.js';
import contentRouter from './routes/content.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prachi_agro';

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);
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
    service: 'Prachi Agro Backend API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets from the React build folder in production if present
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  
  // Fallback all other routing paths to index.html (React Router SPA Navigation)
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // If backend is run as standalone API service (e.g. Render standalone backend)
  app.get('/', (req, res) => {
    res.json({
      message: 'Prachi Agro API Server is running.',
      apiDocs: '/api/status',
      products: '/api/products',
      videos: '/api/videos'
    });
  });
}

// Boot listening
app.listen(PORT, () => {
  console.log(`Prachi Agro server is running and listening on http://localhost:${PORT}`);
});
