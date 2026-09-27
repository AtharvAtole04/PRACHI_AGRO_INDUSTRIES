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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDb();
    const db = mongoose.connection.db;
    const collection = db.collection('sitecontents');

    if (req.method === 'GET') {
      const content = await collection.findOne({ key: 'main_content' });
      return res.status(200).json(content || { key: 'main_content' });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const updateData = { ...req.body, updatedAt: new Date() };
      delete updateData._id;
      const updated = await collection.findOneAndUpdate(
        { key: 'main_content' },
        { $set: updateData },
        { upsert: true, returnDocument: 'after' }
      );
      return res.status(200).json({ success: true, content: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
