import express from 'express';
import Video from '../models/Video.js';

const router = express.Router();

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create video
router.post('/', async (req, res) => {
  const video = new Video(req.body);
  try {
    const newVideo = await video.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE video
router.delete('/:id', async (req, res) => {
  try {
    const deletedVideo = await Video.findOneAndDelete({ id: req.params.id });
    if (!deletedVideo) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video successfully deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
