import mongoose from 'mongoose';
import { connectDb, setCorsHeaders, getRequestBody } from '../lib/db.js';
import { verifyAdmin } from '../lib/auth.js';

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: new mongoose.Types.ObjectId(idParam) }] }
    : { id: idParam };
};

const formatReview = (item) => ({
  ...item,
  id: item.id || String(item._id),
  _id: String(item._id)
});

export default async function handler(req, res) {
  setCorsHeaders(res);
  res.setHeader('Cache-Tag', 'reviews');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();
  const db = mongoose.connection.db;
  const collection = db.collection('reviews');

  let targetId = req.query ? req.query.id : null;
  if (!targetId && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'reviews') {
      targetId = decodeURIComponent(lastPart);
    }
  }

  // -------------------------------------------------------------
  // GET: Return MongoDB reviews
  // -------------------------------------------------------------
  if (req.method === 'GET') {
    const isForceFresh = req.query?.refresh === 'true' || req.query?.t || (req.headers['cache-control'] && req.headers['cache-control'].includes('no-cache'));
    if (isForceFresh) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    }

    try {
      if (targetId) {
        const review = await collection.findOne(getQueryForId(targetId));
        if (!review) return res.status(404).json({ message: 'Review not found' });
        return res.status(200).json(formatReview(review));
      }

      const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(items.map(formatReview));
    } catch (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
    }
  }

  // -------------------------------------------------------------
  // MUTATIONS (Admin Protected)
  // -------------------------------------------------------------
  const auth = verifyAdmin(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const body = await getRequestBody(req);

  // POST: Create Review
  if (req.method === 'POST') {
    try {
      const { name, review, location } = body;
      if (!name || !review) {
        return res.status(400).json({ error: 'Name and review text are required.' });
      }

      const newReview = {
        name,
        location: location || '',
        crop: body.crop || { mr: '', en: '' },
        rating: Number(body.rating) || 5,
        photo: body.photo || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=100',
        review: typeof review === 'object' ? review : { mr: review, en: review },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newReview);
      return res.status(201).json(formatReview({ ...newReview, _id: result.insertedId }));
    } catch (err) {
      console.error('Error creating review:', err);
      return res.status(500).json({ error: 'Failed to create review', details: err.message });
    }
  }

  // PUT / PATCH: Update Review
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const updateId = targetId || body.id || body._id;
    if (!updateId) {
      return res.status(400).json({ error: 'Review ID is required for update.' });
    }

    try {
      const updateData = { ...body };
      delete updateData._id;
      if (updateData.rating !== undefined) updateData.rating = Number(updateData.rating);
      updateData.updatedAt = new Date();

      const updated = await collection.findOneAndUpdate(
        getQueryForId(updateId),
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Review not found.' });
      }

      return res.status(200).json(formatReview(updated));
    } catch (err) {
      console.error('Error updating review:', err);
      return res.status(500).json({ error: 'Failed to update review', details: err.message });
    }
  }

  // DELETE: Delete Review
  if (req.method === 'DELETE') {
    const deleteId = targetId || body.id || body._id;
    if (!deleteId) {
      return res.status(400).json({ error: 'Review ID is required for deletion.' });
    }

    try {
      const delResult = await collection.deleteOne(getQueryForId(deleteId));
      if (delResult.deletedCount === 0) {
        return res.status(404).json({ error: 'Review not found.' });
      }
      return res.status(200).json({ success: true, message: 'Review deleted successfully', id: deleteId });
    } catch (err) {
      console.error('Error deleting review:', err);
      return res.status(500).json({ error: 'Failed to delete review', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
