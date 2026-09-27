export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prachiagroindustris9696_db_user:VeKB6JZ38j5ub5YW@cluster0.tgx61bg.mongodb.net/?appName=Cluster0';

let isConnected = false;

async function connectDb() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  isConnected = true;
}

const formatCrop = (item) => ({
  ...item,
  id: item.id || String(item._id),
  _id: String(item._id)
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDb();
    const db = mongoose.connection.db;
    const collection = db.collection('crops');

    if (req.method === 'GET') {
      const items = await collection.find({}).sort({ name: 1 }).toArray();
      return res.status(200).json(items.map(formatCrop));
    }

    if (req.method === 'POST') {
      const newCrop = { ...req.body, createdAt: new Date() };
      const ins = await collection.insertOne(newCrop);
      return res.status(201).json(formatCrop({ ...newCrop, _id: ins.insertedId }));
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
