import mongoose from 'mongoose';
import { connectDb, setCorsHeaders, getRequestBody } from '../lib/db.js';
import { verifyAdmin } from '../lib/auth.js';

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: new mongoose.Types.ObjectId(idParam) }] }
    : { id: idParam };
};

const formatProduct = (item) => {
  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : (item.image ? [item.image] : ['/assets/products/placeholder.svg']);
  return {
    ...item,
    id: item.id || String(item._id),
    _id: String(item._id),
    image: item.image || images[0],
    images
  };
};

export default async function handler(req, res) {
  setCorsHeaders(res);
  res.setHeader('Cache-Tag', 'products');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();
  const db = mongoose.connection.db;
  const collection = db.collection('products');

  // Extract ID from query or URL
  let targetId = req.query ? req.query.id : null;
  if (!targetId && req.url) {
    const urlParts = req.url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'products') {
      targetId = decodeURIComponent(lastPart);
    }
  }

  // -------------------------------------------------------------
  // GET: Read all or single product
  // -------------------------------------------------------------
  if (req.method === 'GET') {
    const isForceFresh = req.query?.refresh === 'true' || req.query?.t || (req.headers['cache-control'] && req.headers['cache-control'].includes('no-cache'));
    if (isForceFresh) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    }

    try {
      if (targetId) {
        const product = await collection.findOne(getQueryForId(targetId));
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(formatProduct(product));
      }

      const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(items.map(formatProduct));
    } catch (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
  }

  // -------------------------------------------------------------
  // MUTATIONS (Admin Protected)
  // -------------------------------------------------------------
  const auth = verifyAdmin(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const body = await getRequestBody(req);

  // POST: Create Product
  if (req.method === 'POST') {
    try {
      const { name, category, basePrice, images, image } = body;
      if (!name || !category || basePrice === undefined) {
        return res.status(400).json({ error: 'Name, category, and basePrice are required.' });
      }

      const incomingImages = Array.isArray(images) && images.length > 0
        ? images.filter(Boolean)
        : (image ? [image] : ['/assets/products/placeholder.svg']);
      const primaryImage = incomingImages[0] || image || '/assets/products/placeholder.svg';

      const slugId = body.id || (typeof name === 'string' ? name : (name.en || name.mr || 'product'))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `prod-${Date.now()}`;

      const newProductDoc = {
        ...body,
        id: slugId,
        image: primaryImage,
        images: incomingImages,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newProductDoc);
      return res.status(201).json(formatProduct({ ...newProductDoc, _id: result.insertedId }));
    } catch (err) {
      console.error('Error creating product:', err);
      return res.status(500).json({ error: 'Failed to create product', details: err.message });
    }
  }

  // PUT / PATCH: Update Product
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const updateId = targetId || body.id || body._id;
    if (!updateId) {
      return res.status(400).json({ error: 'Product ID is required for update.' });
    }

    try {
      const updateData = { ...body };
      delete updateData._id;

      if (Array.isArray(updateData.images)) {
        updateData.images = updateData.images.filter(Boolean);
        if (updateData.images.length > 0) {
          updateData.image = updateData.images[0];
        }
      } else if (updateData.image) {
        updateData.images = [updateData.image];
      }

      updateData.updatedAt = new Date();

      const updated = await collection.findOneAndUpdate(
        getQueryForId(updateId),
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      return res.status(200).json(formatProduct(updated));
    } catch (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update product', details: err.message });
    }
  }

  // DELETE: Delete Product
  if (req.method === 'DELETE') {
    const deleteId = targetId || body.id || body._id;
    if (!deleteId) {
      return res.status(400).json({ error: 'Product ID is required for deletion.' });
    }

    try {
      const delResult = await collection.deleteOne(getQueryForId(deleteId));
      if (delResult.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      return res.status(200).json({ success: true, message: 'Product deleted successfully', id: deleteId });
    } catch (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Failed to delete product', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
