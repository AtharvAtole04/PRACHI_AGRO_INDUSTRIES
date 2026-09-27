import mongoose from 'mongoose';
import { connectDb, setCorsHeaders, getRequestBody } from './_lib/db.js';
import { verifyAdmin } from './_lib/auth.js';

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: new mongoose.Types.ObjectId(idParam) }] }
    : { id: idParam };
};

const extractEmbedId = (url) => {
  if (!url) return 'dQw4w9WgXcQ';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
};

const formatVideo = (item) => ({
  ...item,
  id: item.id || String(item._id),
  _id: String(item._id),
  embedId: item.embedId || extractEmbedId(item.youtubeUrl)
});

export default async function handler(req, res) {
  setCorsHeaders(res);
  res.setHeader('Cache-Tag', 'videos');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();
  const db = mongoose.connection.db;
  const collection = db.collection('videos');

  let targetId = req.query ? req.query.id : null;
  if (!targetId && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'videos') {
      targetId = decodeURIComponent(lastPart);
    }
  }

  // -------------------------------------------------------------
  // GET: Return MongoDB videos
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
        const video = await collection.findOne(getQueryForId(targetId));
        if (!video) return res.status(404).json({ message: 'Video not found' });
        return res.status(200).json(formatVideo(video));
      }

      const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({
        source: 'mongodb',
        count: items.length,
        videos: items.map(formatVideo)
      });
    } catch (err) {
      console.error('Error fetching videos:', err);
      return res.status(500).json({ error: 'Failed to fetch videos', details: err.message });
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

  // POST: Create Video
  if (req.method === 'POST') {
    try {
      const { title, youtubeUrl } = body;
      if (!title || !youtubeUrl) {
        return res.status(400).json({ error: 'Title and YouTube URL are required.' });
      }

      const embedId = body.embedId || extractEmbedId(youtubeUrl);
      const titleText = typeof title === 'object' ? (title.en || title.mr || 'video') : title;
      const slugId = body.id || titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `vid-${Date.now()}`;

      const newVideo = {
        ...body,
        id: slugId,
        embedId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newVideo);
      return res.status(201).json(formatVideo({ ...newVideo, _id: result.insertedId }));
    } catch (err) {
      console.error('Error creating video:', err);
      return res.status(500).json({ error: 'Failed to create video', details: err.message });
    }
  }

  // PUT / PATCH: Update Video
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const updateId = targetId || body.id || body._id;
    if (!updateId) {
      return res.status(400).json({ error: 'Video ID is required for update.' });
    }

    try {
      const updateData = { ...body };
      delete updateData._id;

      if (updateData.youtubeUrl) {
        updateData.embedId = extractEmbedId(updateData.youtubeUrl);
      }
      updateData.updatedAt = new Date();

      const updated = await collection.findOneAndUpdate(
        getQueryForId(updateId),
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Video not found.' });
      }

      return res.status(200).json(formatVideo(updated));
    } catch (err) {
      console.error('Error updating video:', err);
      return res.status(500).json({ error: 'Failed to update video', details: err.message });
    }
  }

  // DELETE: Delete Video
  if (req.method === 'DELETE') {
    const deleteId = targetId || body.id || body._id;
    if (!deleteId) {
      return res.status(400).json({ error: 'Video ID is required for deletion.' });
    }

    try {
      const delResult = await collection.deleteOne(getQueryForId(deleteId));
      if (delResult.deletedCount === 0) {
        return res.status(404).json({ error: 'Video not found.' });
      }
      return res.status(200).json({ success: true, message: 'Video deleted successfully', id: deleteId });
    } catch (err) {
      console.error('Error deleting video:', err);
      return res.status(500).json({ error: 'Failed to delete video', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
