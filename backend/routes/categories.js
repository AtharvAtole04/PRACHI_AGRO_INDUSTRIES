import express from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { slug: idParam }, { _id: idParam }] }
    : { $or: [{ id: idParam }, { slug: idParam }] };
};

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne(getQueryForId(req.params.id));
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create category (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update category (Admin Protected)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      getQueryForId(req.params.id),
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE category (Admin Protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete(getQueryForId(req.params.id));
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category successfully deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
