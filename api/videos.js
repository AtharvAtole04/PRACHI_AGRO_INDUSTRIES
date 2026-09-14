import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prachiagroindustris9696_db_user:VeKB6JZ38j5ub5YW@cluster0.tgx61bg.mongodb.net/?appName=Cluster0';

let isConnected = false;

async function connectDb() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { dbName: 'test', bufferCommands: false });
  isConnected = true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    try {
      const renderUrl = `https://prachi-agro-industries.onrender.com${req.url || '/api/videos'}`;
      const headers = { ...req.headers };
      delete headers.host;

      const fetchOptions = {
        method: req.method,
        headers: headers
      };

      if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
        fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }

      const response = await fetch(renderUrl, fetchOptions);
      const data = await response.text();
      res.status(response.status);
      const contentType = response.headers.get('content-type');
      if (contentType) res.setHeader('Content-Type', contentType);
      return res.send(data);
    } catch (err) {
      console.error('Proxying admin request to Render failed:', err);
      return res.status(500).json({ error: 'Failed to delegate admin request to Render backend', details: err.message });
    }
  }

  try {
    await connectDb();
    const db = mongoose.connection.db;
    const items = await db.collection('videos').find({}).toArray();
    const normalized = items.map(item => ({
      ...item,
      id: item.id || String(item._id),
      _id: String(item._id)
    }));
    return res.status(200).json(normalized);
  } catch (error) {
    console.error('Vercel MongoDB API Error (videos):', error);
    return res.status(500).json({ error: 'Failed to fetch videos from MongoDB', details: error.message });
  }
}
