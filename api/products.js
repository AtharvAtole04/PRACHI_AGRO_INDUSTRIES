export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prachiagroindustris9696_db_user:VeKB6JZ38j5ub5YW@cluster0.tgx61bg.mongodb.net/?appName=Cluster0';

let isConnected = false;

async function connectDb() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  isConnected = true;
}

const getQueryForId = (idParam) => {
  if (!idParam) return {};
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return {
      $or: [
        { id: idParam },
        { _id: new mongoose.Types.ObjectId(idParam) }
      ]
    };
  }
  return { id: idParam };
};

const normalizeLocalizedFields = (data) => {
  const fields = ['tagline', 'shortDescription', 'description', 'crops', 'usage'];
  fields.forEach(field => {
    if (typeof data[field] === 'string') {
      data[field] = { mr: data[field], en: data[field] };
    }
  });
  return data;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDb();
    const db = mongoose.connection.db;
    const collection = db.collection('products');

    let productId = req.query ? (req.query.id || req.query.slug) : null;
    if (!productId && req.url) {
      const urlParts = req.url.split('?')[0].split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart !== 'products') {
        productId = decodeURIComponent(lastPart);
      }
    }

    // 1. GET: Read all or single
    if (req.method === 'GET') {
      if (productId) {
        const query = getQueryForId(productId);
        const product = await collection.findOne(query);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        const images = Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : (product.image ? [product.image] : []);
        return res.status(200).json({
          ...product,
          id: product.id || String(product._id),
          _id: String(product._id),
          image: product.image || images[0],
          images
        });
      }

      const products = await collection.find({}).toArray();
      const normalized = products.map(p => {
        const images = Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : (p.image ? [p.image] : []);
        return {
          ...p,
          id: p.id || String(p._id),
          _id: String(p._id),
          image: p.image || images[0],
          images
        };
      });
      return res.status(200).json(normalized);
    }

    // 2. POST: Create Product
    if (req.method === 'POST') {
      const productData = normalizeLocalizedFields({ ...req.body });
      delete productData._id;

      if (!productData.id && productData.name) {
        productData.id = (typeof productData.name === 'string' ? productData.name : (productData.name.en || productData.name.mr || 'product'))
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      if (!productData.id) {
        productData.id = `prod-${Date.now()}`;
      }

      if (Array.isArray(productData.images) && productData.images.length > 0) {
        productData.images = productData.images.filter(Boolean);
        productData.image = productData.images[0];
      } else if (productData.image) {
        productData.images = [productData.image];
      }

      productData.createdAt = new Date();
      productData.updatedAt = new Date();

      const result = await collection.insertOne(productData);
      return res.status(201).json({
        ...productData,
        _id: String(result.insertedId),
        id: productData.id || String(result.insertedId)
      });
    }

    // 3. PUT / PATCH: Update Product
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const updateId = productId || req.body?.id || req.body?._id;
      if (!updateId) {
        return res.status(400).json({ error: 'Product ID is required for update' });
      }

      const updateData = normalizeLocalizedFields({ ...req.body });
      delete updateData._id;
      delete updateData.id;
      updateData.updatedAt = new Date();

      if (Array.isArray(updateData.images)) {
        updateData.images = updateData.images.filter(Boolean);
        if (updateData.images.length > 0) {
          updateData.image = updateData.images[0];
        }
      } else if (updateData.image) {
        updateData.images = [updateData.image];
      }

      const query = getQueryForId(updateId);
      await collection.updateOne(
        query,
        { $set: updateData },
        { upsert: true }
      );

      const updatedDoc = await collection.findOne(query);
      if (updatedDoc) {
        const images = Array.isArray(updatedDoc.images) && updatedDoc.images.length > 0
          ? updatedDoc.images
          : (updatedDoc.image ? [updatedDoc.image] : []);
        return res.status(200).json({
          ...updatedDoc,
          id: updatedDoc.id || String(updatedDoc._id),
          _id: String(updatedDoc._id),
          image: updatedDoc.image || images[0],
          images
        });
      }
      return res.status(200).json({ success: true, message: 'Product updated successfully' });
    }

    // 4. DELETE: Delete Product
    if (req.method === 'DELETE') {
      const deleteId = productId || req.body?.id || req.body?._id;
      if (!deleteId) {
        return res.status(400).json({ error: 'Product ID is required for deletion' });
      }

      const query = getQueryForId(deleteId);
      const deleteResult = await collection.deleteOne(query);

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ success: true, message: 'Product deleted successfully', id: deleteId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vercel MongoDB API Error:', error);
    return res.status(500).json({ error: 'Database operation failed', details: error.message });
  }
}
