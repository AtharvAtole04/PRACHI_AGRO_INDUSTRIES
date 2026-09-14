import express from 'express';
import mongoose from 'mongoose';
import Video from '../models/Video.js';
import { getChannelVideos, clearVideoCache } from '../services/youtubeService.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to prevent stale HTTP caching on video API endpoints
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: idParam }] }
    : { id: idParam };
};

/**
 * GET /api/videos
 * Returns YouTube channel videos if API key is configured and functional;
 * falls back to MongoDB records if YouTube API key is unconfigured or fails.
 */
router.get('/', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const limit = parseInt(req.query.limit, 10) || 12;

  // Try fetching live YouTube videos from client's channel
  const ytResult = await getChannelVideos({ forceRefresh, maxResults: limit });

  if (ytResult.success && Array.isArray(ytResult.videos) && ytResult.videos.length > 0) {
    // Optionally sync into MongoDB in background
    syncVideosToDb(ytResult.videos).catch(err => console.warn('[YouTube Sync Warning]', err.message));

    return res.json({
      source: 'youtube',
      cached: ytResult.cached || false,
      channelInfo: ytResult.channelInfo,
      count: ytResult.videos.length,
      videos: ytResult.videos
    });
  }

  // Fallback to MongoDB database records
  try {
    const mongoVideos = await Video.find().sort({ createdAt: -1 }).limit(limit);
    if (mongoVideos.length > 0) {
      return res.json({
        source: 'mongodb',
        warning: ytResult.message || 'YouTube API key not configured or API call failed. Returning database records.',
        count: mongoVideos.length,
        videos: mongoVideos
      });
    }
  } catch (dbErr) {
    console.error('[Database Error]', dbErr.message);
  }

  // Final response if both YouTube API and MongoDB return 0 items
  res.json({
    source: 'empty',
    warning: ytResult.message || 'No videos available.',
    count: 0,
    videos: []
  });
});

/**
 * GET /api/videos/youtube
 * Direct endpoint for YouTube API channel status and video payload
 */
router.get('/youtube', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const ytResult = await getChannelVideos({ forceRefresh });
  res.json(ytResult);
});

/**
 * POST /api/videos/sync
 * Force sync YouTube channel videos into database & clear cache (Admin Protected)
 */
router.post('/sync', verifyAdminToken, async (req, res) => {
  clearVideoCache();
  const ytResult = await getChannelVideos({ forceRefresh: true });
  
  if (ytResult.success && ytResult.videos.length > 0) {
    await syncVideosToDb(ytResult.videos);
    return res.json({
      message: 'Successfully synced YouTube channel videos',
      channelInfo: ytResult.channelInfo,
      count: ytResult.videos.length,
      videos: ytResult.videos
    });
  }

  res.status(400).json({
    message: 'Failed to sync YouTube channel videos',
    error: ytResult.message || 'Check YOUTUBE_API_KEY in backend/.env'
  });
});

/**
 * Helper to upsert YouTube videos into MongoDB
 */
async function syncVideosToDb(videos) {
  for (const v of videos) {
    const videoId = v.id || v.videoId;
    if (!videoId) continue;

    await Video.findOneAndUpdate(
      { $or: [{ id: videoId }, { embedId: videoId }] },
      {
        id: videoId,
        embedId: videoId,
        title: v.title,
        crop: v.crop,
        category: v.category,
        duration: v.duration,
        youtubeUrl: v.youtubeUrl,
        thumbnail: v.thumbnail,
        views: v.views,
        publishedAt: v.publishedAt
      },
      { upsert: true, new: true }
    );
  }
}

// POST create video manually (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  const video = new Video(req.body);
  try {
    const newVideo = await video.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update video (Admin Protected)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const updatedVideo = await Video.findOneAndUpdate(
      getQueryForId(req.params.id),
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(updatedVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE video (Admin Protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const deletedVideo = await Video.findOneAndDelete(getQueryForId(req.params.id));
    if (!deletedVideo) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video successfully deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
