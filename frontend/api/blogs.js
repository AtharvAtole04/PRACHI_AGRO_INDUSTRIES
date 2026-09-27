import mongoose from 'mongoose';
import { connectDb, setCorsHeaders, getRequestBody } from './_lib/db.js';
import { verifyAdmin } from './_lib/auth.js';

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: new mongoose.Types.ObjectId(idParam) }] }
    : { id: idParam };
};

const formatBlog = (item) => ({
  ...item,
  id: item.id || String(item._id),
  _id: String(item._id)
});

export default async function handler(req, res) {
  setCorsHeaders(res);
  res.setHeader('Cache-Tag', 'blogs');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();
  const db = mongoose.connection.db;
  const collection = db.collection('blogs');

  let targetId = req.query ? (req.query.id || req.query.slug) : null;
  if (!targetId && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'blogs') {
      targetId = decodeURIComponent(lastPart);
    }
  }

  // -------------------------------------------------------------
  // GET: Return MongoDB blogs
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
        const blog = await collection.findOne(getQueryForId(targetId));
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        return res.status(200).json(formatBlog(blog));
      }

      const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(items.map(formatBlog));
    } catch (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).json({ error: 'Failed to fetch blogs', details: err.message });
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

  // POST: Create Blog
  if (req.method === 'POST') {
    try {
      const { title } = body;
      if (!title) {
        return res.status(400).json({ error: 'Blog title is required.' });
      }

      const titleText = typeof title === 'object' ? (title.en || title.mr || 'blog') : title;
      const slugId = body.id || titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `blog-${Date.now()}`;

      const newBlog = {
        ...body,
        id: slugId,
        date: body.date || new Date().toISOString().split('T')[0],
        readTime: body.readTime || '5 min read',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newBlog);
      return res.status(201).json(formatBlog({ ...newBlog, _id: result.insertedId }));
    } catch (err) {
      console.error('Error creating blog:', err);
      return res.status(500).json({ error: 'Failed to create blog', details: err.message });
    }
  }

  // PUT / PATCH: Update Blog
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const updateId = targetId || body.id || body._id;
    if (!updateId) {
      return res.status(400).json({ error: 'Blog ID is required for update.' });
    }

    try {
      const updateData = { ...body };
      delete updateData._id;
      updateData.updatedAt = new Date();

      const updated = await collection.findOneAndUpdate(
        getQueryForId(updateId),
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Blog not found.' });
      }

      return res.status(200).json(formatBlog(updated));
    } catch (err) {
      console.error('Error updating blog:', err);
      return res.status(500).json({ error: 'Failed to update blog', details: err.message });
    }
  }

  // DELETE: Delete Blog
  if (req.method === 'DELETE') {
    const deleteId = targetId || body.id || body._id;
    if (!deleteId) {
      return res.status(400).json({ error: 'Blog ID is required for deletion.' });
    }

    try {
      const delResult = await collection.deleteOne(getQueryForId(deleteId));
      if (delResult.deletedCount === 0) {
        return res.status(404).json({ error: 'Blog not found.' });
      }
      return res.status(200).json({ success: true, message: 'Blog deleted successfully', id: deleteId });
    } catch (err) {
      console.error('Error deleting blog:', err);
      return res.status(500).json({ error: 'Failed to delete blog', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
