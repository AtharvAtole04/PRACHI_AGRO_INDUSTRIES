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

const formatBlog = (item) => ({
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
    const collection = db.collection('blogs');

    let blogId = req.query ? (req.query.id || req.query.slug) : null;
    if (!blogId && req.url) {
      const urlParts = req.url.split('?')[0].split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart !== 'blogs') {
        blogId = decodeURIComponent(lastPart);
      }
    }

    if (req.method === 'GET') {
      if (blogId) {
        const blog = await collection.findOne(getQueryForId(blogId));
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        return res.status(200).json(formatBlog(blog));
      }
      const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(items.map(formatBlog));
    }

    if (req.method === 'POST') {
      const blogData = { ...req.body };
      delete blogData._id;
      const titleText = typeof blogData.title === 'object' ? (blogData.title.en || blogData.title.mr || 'blog') : (blogData.title || 'blog');
      const slugId = blogData.id || titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `blog-${Date.now()}`;

      const newDoc = {
        ...blogData,
        id: slugId,
        date: blogData.date || new Date().toISOString().split('T')[0],
        readTime: blogData.readTime || '5 min read',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await collection.insertOne(newDoc);
      return res.status(201).json(formatBlog({ ...newDoc, _id: result.insertedId }));
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const updateId = blogId || req.body?.id || req.body?._id;
      if (!updateId) return res.status(400).json({ error: 'Blog ID required for update' });

      const updateData = { ...req.body };
      delete updateData._id;
      updateData.updatedAt = new Date();

      const query = getQueryForId(updateId);
      await collection.updateOne(query, { $set: updateData }, { upsert: true });
      const updated = await collection.findOne(query);
      return res.status(200).json(formatBlog(updated || updateData));
    }

    if (req.method === 'DELETE') {
      const deleteId = blogId || req.body?.id || req.body?._id;
      if (!deleteId) return res.status(400).json({ error: 'Blog ID required for deletion' });
      await collection.deleteOne(getQueryForId(deleteId));
      return res.status(200).json({ success: true, message: 'Blog deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Blogs API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
