import mongoose from 'mongoose';
import { connectDb, setCorsHeaders, getRequestBody } from '../lib/db.js';
import { verifyAdmin } from '../lib/auth.js';

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: new mongoose.Types.ObjectId(idParam) }] }
    : { id: idParam };
};

const formatCrop = (item) => ({
  ...item,
  id: item.id || String(item._id),
  _id: String(item._id)
});

export default async function handler(req, res) {
  setCorsHeaders(res);
  res.setHeader('Cache-Tag', 'crops');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();
  const db = mongoose.connection.db;
  const collection = db.collection('crops');

  let targetId = req.query ? req.query.id : null;
  if (!targetId && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'crops') {
      targetId = decodeURIComponent(lastPart);
    }
  }

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    try {
      if (targetId) {
        const crop = await collection.findOne(getQueryForId(targetId));
        if (!crop) return res.status(404).json({ message: 'Crop not found' });
        return res.status(200).json(formatCrop(crop));
      }
      const items = await collection.find({}).sort({ name: 1 }).toArray();
      return res.status(200).json(items.map(formatCrop));
    } catch (err) {
      console.error('Error fetching crops:', err);
      return res.status(500).json({ error: 'Failed to fetch crops' });
    }
  }

  // Mutations
  const auth = verifyAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const body = await getRequestBody(req);

  if (req.method === 'POST') {
    try {
      const slugId = body.id || (body.name?.en || body.name?.mr || 'crop').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCrop = { ...body, id: slugId, createdAt: new Date() };
      const ins = await collection.insertOne(newCrop);
      return res.status(201).json(formatCrop({ ...newCrop, _id: ins.insertedId }));
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create crop', details: err.message });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const updateId = targetId || body.id || body._id;
    try {
      const updateData = { ...body };
      delete updateData._id;
      const updated = await collection.findOneAndUpdate(
        getQueryForId(updateId),
        { $set: updateData },
        { returnDocument: 'after' }
      );
      if (!updated) return res.status(404).json({ error: 'Crop not found' });
      return res.status(200).json(formatCrop(updated));
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update crop', details: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const deleteId = targetId || body.id || body._id;
    try {
      await collection.deleteOne(getQueryForId(deleteId));
      return res.status(200).json({ success: true, message: 'Crop deleted' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete crop', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
