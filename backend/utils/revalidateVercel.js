/**
 * Sends a server-to-server cache revalidation request to Vercel
 * when an admin mutation succeeds on the Render backend.
 * Uses native Node.js fetch API.
 * 
 * @param {string} tag - Resource tag to revalidate ('products', 'blogs', 'videos', 'reviews', etc.)
 */
export async function revalidateVercelCache(tag) {
  const secret = process.env.REVALIDATION_SECRET || 'prachi_agro_revalidate_secret_key_2026';
  const vercelUrl = process.env.VERCEL_REVALIDATION_URL || process.env.VERCEL_REVALIDATE_URL || 'https://www.prachiagroindustries.in/api/revalidate';

  try {
    const res = await fetch(vercelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret
      },
      body: JSON.stringify({ tag, timestamp: Date.now() })
    });

    if (res.ok) {
      console.log(`[Revalidate Success] Triggered Vercel cache invalidation for tag: ${tag}`);
    } else {
      console.warn(`[Revalidate Warning] Vercel cache invalidation status ${res.status} for tag: ${tag}`);
    }
  } catch (err) {
    console.error(`[Revalidate Error] Failed to trigger Vercel cache invalidation for tag: ${tag}:`, err.message);
  }
}
