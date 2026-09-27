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
    const collection = db.collection('videos');

    let videoId = req.query ? req.query.id : null;
    if (!videoId && req.url) {
      const urlParts = req.url.split('?')[0].split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart !== 'videos') {
        videoId = decodeURIComponent(lastPart);
      }
    }

    if (req.method === 'GET') {
      if (videoId) {
        const video = await collection.findOne(getQueryForId(videoId));
        if (!video) return res.status(404).json({ message: 'Video not found' });
        return res.status(200).json(formatVideo(video));
      }
      const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({
        source: 'mongodb',
        count: items.length,
        videos: items.map(formatVideo)
      });
    }

    if (req.method === 'POST') {
      const videoData = { ...req.body };
      delete videoData._id;
      const embedId = videoData.embedId || extractEmbedId(videoData.youtubeUrl);
      const titleText = typeof videoData.title === 'object' ? (videoData.title.en || videoData.title.mr || 'video') : (videoData.title || 'video');
      const slugId = videoData.id || titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `vid-${Date.now()}`;

      const newDoc = {
        ...videoData,
        id: slugId,
        embedId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await collection.insertOne(newDoc);
      return res.status(201).json(formatVideo({ ...newDoc, _id: result.insertedId }));
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const updateId = videoId || req.body?.id || req.body?._id;
      if (!updateId) return res.status(400).json({ error: 'Video ID required for update' });

      const updateData = { ...req.body };
      delete updateData._id;
      if (updateData.youtubeUrl) {
        updateData.embedId = extractEmbedId(updateData.youtubeUrl);
      }
      updateData.updatedAt = new Date();

      const query = getQueryForId(updateId);
      await collection.updateOne(query, { $set: updateData }, { upsert: true });
      const updated = await collection.findOne(query);
      return res.status(200).json(formatVideo(updated || updateData));
    }

    if (req.method === 'DELETE') {
      const deleteId = videoId || req.body?.id || req.body?._id;
      if (!deleteId) return res.status(400).json({ error: 'Video ID required for deletion' });
      await collection.deleteOne(getQueryForId(deleteId));
      return res.status(200).json({ success: true, message: 'Video deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Videos API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
