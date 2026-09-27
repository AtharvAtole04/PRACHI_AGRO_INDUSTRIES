import mongoose from 'mongoose';
import { connectDb, setCorsHeaders, getRequestBody } from './_lib/db.js';
import { verifyAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  res.setHeader('Cache-Tag', 'content');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();
  const db = mongoose.connection.db;
  const collection = db.collection('sitecontents');

  if (req.method === 'GET') {
    try {
      const content = await collection.findOne({ key: 'main_content' });
      if (!content) {
        return res.status(200).json({ key: 'main_content', message: 'Using default content' });
      }
      return res.status(200).json(content);
    } catch (err) {
      console.error('Error fetching content:', err);
      return res.status(500).json({ error: 'Failed to fetch site content' });
    }
  }

  // PUT: Update site content
  if (req.method === 'PUT' || req.method === 'POST') {
    const auth = verifyAdmin(req);
    if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

    const body = await getRequestBody(req);
    try {
      const updateData = { ...body, updatedAt: new Date() };
      delete updateData._id;

      const updated = await collection.findOneAndUpdate(
        { key: 'main_content' },
        { $set: updateData },
        { upsert: true, returnDocument: 'after' }
      );
      return res.status(200).json({ success: true, content: updated });
    } catch (err) {
      console.error('Error updating content:', err);
      return res.status(500).json({ error: 'Failed to update content', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
