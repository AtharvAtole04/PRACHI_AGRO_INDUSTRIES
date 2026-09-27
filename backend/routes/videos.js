import express from 'express';
import mongoose from 'mongoose';
import Video from '../models/Video.js';
import { getChannelVideos, clearVideoCache } from '../services/youtubeService.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';
import { revalidateVercelCache } from '../utils/revalidateVercel.js';

const router = express.Router();

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: idParam }] }
    : { id: idParam };
};

/**
 * GET /api/videos
 * Returns MongoDB video records as the primary source of truth.
 * Optionally attempts YouTube channel fetch if MongoDB is empty.
 */
router.get('/', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const limit = parseInt(req.query.limit, 10) || 50;

  try {
    const mongoVideos = await Video.find().sort({ createdAt: -1 }).limit(limit);
    if (mongoVideos.length > 0) {
      return res.json({
        source: 'mongodb',
        count: mongoVideos.length,
        videos: mongoVideos
      });
    }
  } catch (dbErr) {
    console.error('[Database Error in videos GET]:', dbErr.message);
  }

  // If MongoDB has 0 items, check YouTube API
  const ytResult = await getChannelVideos({ forceRefresh, maxResults: limit });
  if (ytResult.success && Array.isArray(ytResult.videos) && ytResult.videos.length > 0) {
    syncVideosToDb(ytResult.videos).catch(err => console.warn('[YouTube Sync Warning]', err.message));
    return res.json({
      source: 'youtube',
      cached: ytResult.cached || false,
      channelInfo: ytResult.channelInfo,
      count: ytResult.videos.length,
      videos: ytResult.videos
    });
  }

  // Final response if both return 0 items
  res.json({
    source: 'empty',
    warning: 'No videos available.',
    count: 0,
    videos: []
  });
});

/**
 * GET /api/videos/youtube
 */
router.get('/youtube', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';
  const ytResult = await getChannelVideos({ forceRefresh });
  res.json(ytResult);
});

/**
 * POST /api/videos/sync (Admin Protected)
 */
router.post('/sync', verifyAdminToken, async (req, res) => {
  clearVideoCache();
  const ytResult = await getChannelVideos({ forceRefresh: true });
  
  if (ytResult.success && ytResult.videos.length > 0) {
    await syncVideosToDb(ytResult.videos);
    revalidateVercelCache('videos').catch(err => console.error('[Revalidate Error]', err.message));
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

// POST create video (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const videoData = { ...req.body };
    delete videoData._id;

    if (typeof videoData.title === 'string') videoData.title = { mr: videoData.title, en: videoData.title };
    if (typeof videoData.crop === 'string') videoData.crop = { mr: videoData.crop, en: videoData.crop };
    if (typeof videoData.category === 'string') videoData.category = { mr: videoData.category, en: videoData.category };

    if (videoData.youtubeUrl && !videoData.embedId) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoData.youtubeUrl.match(regExp);
      videoData.embedId = (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
    }

    if (!videoData.id && videoData.embedId) {
      videoData.id = videoData.embedId;
    }

    const video = new Video(videoData);
    const newVideo = await video.save();

    revalidateVercelCache('videos').catch(err => console.error('[Revalidate Error]', err.message));

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT / PATCH update video (Admin Protected)
const handleUpdateVideo = async (req, res) => {
  try {
    const query = getQueryForId(req.params.id);
    const video = await Video.findOne(query);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const updateData = { ...req.body };
    delete updateData._id;

    if (typeof updateData.title === 'string') updateData.title = { mr: updateData.title, en: updateData.title };
    if (typeof updateData.crop === 'string') updateData.crop = { mr: updateData.crop, en: updateData.crop };
    if (typeof updateData.category === 'string') updateData.category = { mr: updateData.category, en: updateData.category };

    if (updateData.youtubeUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = updateData.youtubeUrl.match(regExp);
      if (match && match[2].length === 11) {
        updateData.embedId = match[2];
      }
    }

    Object.assign(video, updateData);
    const updatedVideo = await video.save();

    revalidateVercelCache('videos').catch(err => console.error('[Revalidate Error]', err.message));

    res.json(updatedVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

router.put('/:id', verifyAdminToken, handleUpdateVideo);
router.patch('/:id', verifyAdminToken, handleUpdateVideo);

// DELETE video (Admin Protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const deletedVideo = await Video.findOneAndDelete(getQueryForId(req.params.id));
    if (!deletedVideo) return res.status(404).json({ message: 'Video not found' });

    revalidateVercelCache('videos').catch(err => console.error('[Revalidate Error]', err.message));

    res.json({ message: 'Video successfully deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
