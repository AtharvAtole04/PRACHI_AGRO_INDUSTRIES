import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prachiagroindustris9696_db_user:VeKB6JZ38j5ub5YW@cluster0.tgx61bg.mongodb.net/?appName=Cluster0';

let isConnected = false;

async function connectDb() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  isConnected = true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDb();
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    const normalized = products.map(p => ({
      ...p,
      id: p.id || String(p._id),
      _id: String(p._id),
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])
    }));
    return res.status(200).json(normalized);
  } catch (error) {
    console.error('Vercel MongoDB API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch products from MongoDB', details: error.message });
  }
}
