/**
 * YouTube Data API v3 Service for Prachi Agro Industries
 * Fetches actual uploaded videos from the client's official YouTube channel.
 */

// Simple in-memory cache to prevent quota exhaustion and ensure fast response times
let videoCache = {
  data: null,
  timestamp: 0,
  channelInfo: null
};

// Default TTL: 15 minutes (configurable via env)
const CACHE_TTL_MS = (parseInt(process.env.YOUTUBE_CACHE_TTL_MINUTES, 10) || 15) * 60 * 1000;

/**
 * Format ISO 8601 duration (e.g. PT8M15S) into clean MM:SS or HH:MM:SS format
 */
export function formatISO8601Duration(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') return '05:00';
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '05:00';

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  const pad = (num) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format view count (e.g. 12450 -> "12.4K")
 */
export function formatViews(viewCountStr) {
  if (!viewCountStr) return '';
  const num = parseInt(viewCountStr, 10);
  if (isNaN(num)) return '';

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(num);
}

/**
 * Format ISO Date into relative human time (e.g. "2 weeks ago")
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
}

/**
 * Resolve YouTube Channel Details & Uploads Playlist ID
 */
async function resolveChannelDetails(apiKey, channelIdentifier) {
  const cleanIdentifier = (channelIdentifier || 'prachiagroindustries03').trim();
  
  let channelUrl = '';
  
  // Case A: ID starts with UC (Standard YouTube Channel ID)
  if (cleanIdentifier.startsWith('UC')) {
    channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${cleanIdentifier}&key=${apiKey}`;
  } else {
    // Case B: Handle e.g. @prachiagroindustries03 or prachiagroindustries03
    const handle = cleanIdentifier.startsWith('@') ? cleanIdentifier.slice(1) : cleanIdentifier;
    channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${handle}&key=${apiKey}`;
  }

  console.log(`[YouTube API] Fetching channel details for identifier: "${cleanIdentifier}"`);
  const res = await fetch(channelUrl);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`YouTube Channel API HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  let item = data.items && data.items[0];

  // Fallback: If forHandle didn't find the channel, try username or channel search
  if (!item && !cleanIdentifier.startsWith('UC')) {
    const handle = cleanIdentifier.startsWith('@') ? cleanIdentifier.slice(1) : cleanIdentifier;
    console.log(`[YouTube API] forHandle not found. Trying forUsername="${handle}"...`);
    const userRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forUsername=${handle}&key=${apiKey}`);
    if (userRes.ok) {
      const userData = await userRes.json();
      item = userData.items && userData.items[0];
    }
  }

  if (!item && !cleanIdentifier.startsWith('UC')) {
    const query = cleanIdentifier.replace('@', '');
    console.log(`[YouTube API] Trying search fallback for query="${query}"...`);
    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=1&key=${apiKey}`);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.items && searchData.items[0]) {
        const foundChannelId = searchData.items[0].id?.channelId || searchData.items[0].snippet?.channelId;
        if (foundChannelId) {
          const detailRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${foundChannelId}&key=${apiKey}`);
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            item = detailData.items && detailData.items[0];
          }
        }
      }
    }
  }

  if (!item) {
    throw new Error(`Could not find YouTube channel matching identifier: "${cleanIdentifier}"`);
  }

  const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    throw new Error(`Uploads playlist ID not found for channel: "${item.id}"`);
  }

  return {
    channelId: item.id,
    title: item.snippet?.title || 'Prachi Agro Industries',
    description: item.snippet?.description || '',
    customUrl: item.snippet?.customUrl || '@prachiagroindustries03',
    thumbnails: item.snippet?.thumbnails,
    uploadsPlaylistId
  };
}

/**
 * Fetch channel videos directly from YouTube Data API v3
 */
export async function fetchVideosFromYouTube(options = {}) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelIdentifier = process.env.YOUTUBE_CHANNEL_ID || '@prachiagroindustries03';
  const maxResults = options.maxResults || parseInt(process.env.YOUTUBE_MAX_RESULTS, 10) || 12;

  if (!apiKey) {
    console.warn('[YouTube API Warning] YOUTUBE_API_KEY is not set in environment variables.');
    return {
      success: false,
      error: 'MISSING_API_KEY',
      message: 'YouTube API key is missing. Please set YOUTUBE_API_KEY in backend/.env',
      videos: []
    };
  }

  try {
    // Step 1: Get channel details & uploads playlist ID
    const channelInfo = await resolveChannelDetails(apiKey, channelIdentifier);

    // Step 2: Fetch playlist items from the Uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${channelInfo.uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
    const playlistRes = await fetch(playlistUrl);
    
    if (!playlistRes.ok) {
      const errBody = await playlistRes.text();
      throw new Error(`YouTube PlaylistItems API HTTP ${playlistRes.status}: ${errBody}`);
    }

    const playlistData = await playlistRes.json();
    const playlistItems = playlistData.items || [];

    if (playlistItems.length === 0) {
      return {
        success: true,
        channelInfo,
        videos: []
      };
    }

    // Step 3: Extract Video IDs
    const videoIds = playlistItems.map(item => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId).filter(Boolean);

    // Step 4: Fetch detailed video info (Durations & View Counts)
    let detailsMap = {};
    if (videoIds.length > 0) {
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`;
      const videosRes = await fetch(videosUrl);
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        (videosData.items || []).forEach(v => {
          detailsMap[v.id] = v;
        });
      }
    }

    // Step 5: Normalize video items
    const videos = playlistItems.map(item => {
      const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
      const detail = detailsMap[videoId] || {};
      const snippet = detail.snippet || item.snippet || {};

      // Prefer highest resolution actual thumbnail returned by YouTube
      const thumbnails = snippet.thumbnails || item.snippet?.thumbnails || {};
      const thumbnailUrl = thumbnails.maxres?.url || 
                           thumbnails.standard?.url || 
                           thumbnails.high?.url || 
                           thumbnails.medium?.url || 
                           thumbnails.default?.url || 
                           `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      const titleStr = snippet.title || item.snippet?.title || 'YouTube Video';
      const publishedAt = snippet.publishedAt || item.snippet?.publishedAt || item.snippet?.publishedAt;

      return {
        id: videoId,
        videoId: videoId,
        embedId: videoId,
        title: {
          mr: titleStr,
          en: titleStr
        },
        rawTitle: titleStr,
        crop: { mr: 'सर्व पिके', en: 'All Crops' },
        category: { mr: 'युट्युब व्हिडिओ', en: 'YouTube Video' },
        duration: detail.contentDetails ? formatISO8601Duration(detail.contentDetails.duration) : '05:00',
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: thumbnailUrl,
        views: detail.statistics ? formatViews(detail.statistics.viewCount) : '',
        rawViews: detail.statistics?.viewCount || 0,
        publishedAt: publishedAt,
        uploaded: formatRelativeTime(publishedAt),
        channelTitle: channelInfo.title,
        channelId: channelInfo.channelId,
        description: snippet.description || ''
      };
    });

    return {
      success: true,
      channelInfo,
      videos
    };

  } catch (err) {
    console.error('[YouTube API Error]', err.message);
    return {
      success: false,
      error: 'API_FETCH_ERROR',
      message: err.message,
      videos: []
    };
  }
}

/**
 * Get channel videos with caching
 */
export async function getChannelVideos(options = {}) {
  const forceRefresh = options.forceRefresh || false;
  const now = Date.now();

  if (!forceRefresh && videoCache.data && (now - videoCache.timestamp < CACHE_TTL_MS)) {
    return {
      cached: true,
      timestamp: videoCache.timestamp,
      ...videoCache.data
    };
  }

  const result = await fetchVideosFromYouTube(options);

  if (result.success && result.videos.length > 0) {
    videoCache = {
      data: result,
      timestamp: now,
      channelInfo: result.channelInfo
    };
    return {
      cached: false,
      timestamp: now,
      ...result
    };
  }

  // If fetch failed but we have previous cache, return stale cache with warning
  if (videoCache.data) {
    return {
      cached: true,
      stale: true,
      timestamp: videoCache.timestamp,
      warning: result.message || 'Returning cached data due to API refresh failure',
      ...videoCache.data
    };
  }

  return result;
}

/**
 * Flush cache
 */
export function clearVideoCache() {
  videoCache = { data: null, timestamp: 0, channelInfo: null };
}
