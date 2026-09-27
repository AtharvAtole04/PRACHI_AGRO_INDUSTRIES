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

const getQueryForId = (idParam) => {
  if (!idParam) return {};
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return {
      $or: [
        { id: idParam },
        { _id: new mongoose.Types.ObjectId(idParam) }
      ]
    };
  }
  return { id: idParam };
};

const formatReview = (item) => ({
  ...item,
  id: item.id || String(item._id),
  _id: String(item._id)
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDb();
    const db = mongoose.connection.db;
    const collection = db.collection('reviews');

    let reviewId = req.query ? req.query.id : null;
    if (!reviewId && req.url) {
      const urlParts = req.url.split('?')[0].split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart !== 'reviews') {
        reviewId = decodeURIComponent(lastPart);
      }
    }

    if (req.method === 'GET') {
      if (reviewId) {
        const review = await collection.findOne(getQueryForId(reviewId));
        if (!review) return res.status(404).json({ message: 'Review not found' });
        return res.status(200).json(formatReview(review));
      }
      const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(items.map(formatReview));
    }

    if (req.method === 'POST') {
      const { name, review, location } = req.body || {};
      if (!name || !review) {
        return res.status(400).json({ error: 'Name and review are required' });
      }

      const newDoc = {
        name,
        location: location || '',
        crop: req.body.crop || { mr: '', en: '' },
        rating: Number(req.body.rating) || 5,
        photo: req.body.photo || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100',
        review: typeof review === 'object' ? review : { mr: review, en: review },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await collection.insertOne(newDoc);
      return res.status(201).json(formatReview({ ...newDoc, _id: result.insertedId }));
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const updateId = reviewId || req.body?.id || req.body?._id;
      if (!updateId) return res.status(400).json({ error: 'Review ID required for update' });

      const updateData = { ...req.body };
      delete updateData._id;
      if (updateData.rating !== undefined) updateData.rating = Number(updateData.rating);
      updateData.updatedAt = new Date();

      const query = getQueryForId(updateId);
      await collection.updateOne(query, { $set: updateData }, { upsert: true });
      const updated = await collection.findOne(query);
      return res.status(200).json(formatReview(updated || updateData));
    }

    if (req.method === 'DELETE') {
      const deleteId = reviewId || req.body?.id || req.body?._id;
      if (!deleteId) return res.status(400).json({ error: 'Review ID required for deletion' });
      await collection.deleteOne(getQueryForId(deleteId));
      return res.status(200).json({ success: true, message: 'Review deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Reviews API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
