export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-revalidate-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const secret = process.env.REVALIDATION_SECRET || 'prachi_agro_revalidate_secret_key_2026';
  const incomingSecret = req.headers['x-revalidate-secret'] || req.query.secret || (req.body && req.body.secret);

  if (incomingSecret !== secret) {
    return res.status(401).json({ error: 'Invalid revalidation token' });
  }

  const tag = req.query.tag || (req.body && req.body.tag) || 'all';

  try {
    // If Next.js / Vercel On-Demand Revalidation is available in req.res:
    if (typeof res.revalidate === 'function') {
      await res.revalidate(`/api/${tag}`);
    }
    return res.status(200).json({
      revalidated: true,
      tag,
      message: `Successfully revalidated cache for ${tag}`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to revalidate cache', details: err.message });
  }
}
