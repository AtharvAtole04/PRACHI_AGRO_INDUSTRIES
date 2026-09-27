import express from 'express';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';
import { revalidateVercelCache } from '../utils/revalidateVercel.js';

const router = express.Router();

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: idParam }] }
    : { id: idParam };
};

// GET all blogs (Public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single blog by ID slug or Mongo _id (Public)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne(getQueryForId(req.params.id));
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const normalizeBlogFields = (data) => {
  const fields = ['title', 'category', 'excerpt', 'content'];
  fields.forEach(f => {
    if (typeof data[f] === 'string') {
      data[f] = { mr: data[f], en: data[f] };
    }
  });
  return data;
};

// POST create blog (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const blogData = normalizeBlogFields({ ...req.body });
    delete blogData._id;

    if (!blogData.id && blogData.title?.en) {
      blogData.id = blogData.title.en.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    if (!blogData.id) {
      blogData.id = `blog-${Date.now()}`;
    }

    const blog = new Blog(blogData);
    const newBlog = await blog.save();

    // Trigger Vercel cache revalidation
    revalidateVercelCache('blogs').catch(err => console.error('[Revalidate Error]', err.message));

    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT / PATCH update blog (Admin Protected)
const handleUpdateBlog = async (req, res) => {
  try {
    const query = getQueryForId(req.params.id);
    const blog = await Blog.findOne(query);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const updateData = normalizeBlogFields({ ...req.body });
    delete updateData._id;

    Object.assign(blog, updateData);
    const updatedBlog = await blog.save();

    // Trigger Vercel cache revalidation
    revalidateVercelCache('blogs').catch(err => console.error('[Revalidate Error]', err.message));

    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

router.put('/:id', verifyAdminToken, handleUpdateBlog);
router.patch('/:id', verifyAdminToken, handleUpdateBlog);

// DELETE blog (Admin Protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete(getQueryForId(req.params.id));
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });

    // Trigger Vercel cache revalidation
    revalidateVercelCache('blogs').catch(err => console.error('[Revalidate Error]', err.message));

    res.json({ message: 'Blog successfully deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
