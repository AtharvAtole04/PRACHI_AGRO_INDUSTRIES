import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';
import { revalidateVercelCache } from '../utils/revalidateVercel.js';

const router = express.Router();

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: idParam }] }
    : { id: idParam };
};

const normalizeReviewFields = (data) => {
  if (typeof data.crop === 'string') {
    data.crop = { mr: data.crop, en: data.crop };
  }
  if (typeof data.review === 'string') {
    data.review = { mr: data.review, en: data.review };
  }
  if (data.rating !== undefined) {
    data.rating = Number(data.rating) || 5;
  }
  return data;
};

// GET all reviews (Public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create review (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const reviewData = normalizeReviewFields({ ...req.body });
    delete reviewData._id;

    const review = new Review(reviewData);
    const newReview = await review.save();

    revalidateVercelCache('reviews').catch(err => console.error('[Revalidate Error]', err.message));

    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT / PATCH update review (Admin Protected)
const handleUpdateReview = async (req, res) => {
  try {
    const query = getQueryForId(req.params.id);
    const review = await Review.findOne(query);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updateData = normalizeReviewFields({ ...req.body });
    delete updateData._id;

    Object.assign(review, updateData);
    const updatedReview = await review.save();

    revalidateVercelCache('reviews').catch(err => console.error('[Revalidate Error]', err.message));

    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

router.put('/:id', verifyAdminToken, handleUpdateReview);
router.patch('/:id', verifyAdminToken, handleUpdateReview);

// DELETE review (Admin Protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const query = getQueryForId(req.params.id);
    const deletedReview = await Review.findOneAndDelete(query);
    if (!deletedReview) return res.status(404).json({ message: 'Review not found' });

    revalidateVercelCache('reviews').catch(err => console.error('[Revalidate Error]', err.message));

    res.json({ message: 'Review successfully deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
