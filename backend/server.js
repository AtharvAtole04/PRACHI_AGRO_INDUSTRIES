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

// Allowed origins list
const allowedOrigins = [
  'https://www.prachiagroindustries.in',
  'https://prachiagroindustries.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));
app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logger middleware for debugging
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Payload:', JSON.stringify(req.body, null, 2));
  }
  next();
});

import { seedIfEmpty } from './seedIfEmpty.js';

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB database.');
    await seedIfEmpty();
  })
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

// Healthcheck endpoint (Render / Uptime monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
const possibleBuildPaths = [
  path.join(__dirname, '../frontend/dist'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(process.cwd(), 'dist')
];

const frontendBuildPath = possibleBuildPaths.find(p => fs.existsSync(p));

if (frontendBuildPath) {
  console.log(`Serving React frontend from: ${frontendBuildPath}`);
  app.use(express.static(frontendBuildPath));
  
  // Fallback all other routing paths to index.html (React Router SPA Navigation)
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  console.warn('Frontend build folder not found. Serving API status fallback.');
  app.get('/', (req, res) => {
    res.json({
      message: 'Prachi Agro API Server is running.',
      health: '/health',
      apiDocs: '/api/status',
      products: '/api/products',
      videos: '/api/videos'
    });
  });
}

// Boot listening on 0.0.0.0 (Render requirement)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Prachi Agro server is running and listening on 0.0.0.0:${PORT}`);
});
