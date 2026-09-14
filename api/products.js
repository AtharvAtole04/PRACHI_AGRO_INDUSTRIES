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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDb();
    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Extract product ID from query parameter or URL path
    let productId = req.query ? (req.query.id || req.query.slug) : null;
    if (!productId && req.url) {
      const urlParts = req.url.split('?')[0].split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart !== 'products') {
        productId = decodeURIComponent(lastPart);
      }
    }

    // 1. GET Request
    if (req.method === 'GET') {
      if (productId) {
        const query = getQueryForId(productId);
        const product = await collection.findOne(query);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({
          ...product,
          id: product.id || String(product._id),
          _id: String(product._id),
          images: Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])
        });
      }

      const products = await collection.find({}).toArray();
      const normalized = products.map(p => ({
        ...p,
        id: p.id || String(p._id),
        _id: String(p._id),
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])
      }));
      return res.status(200).json(normalized);
    }

    // 2. POST Request (Create Product)
    if (req.method === 'POST') {
      const productData = normalizeLocalizedFields({ ...req.body });
      delete productData._id;

      if (!productData.id && productData.name) {
        productData.id = productData.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      if (!productData.id) {
        productData.id = `prod-${Date.now()}`;
      }

      const existing = await collection.findOne({ id: productData.id });
      if (existing) {
        productData.id = `${productData.id}-${Date.now()}`;
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

    // 3. PUT Request (Update Product)
    if (req.method === 'PUT') {
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required for update' });
      }

      const updateData = normalizeLocalizedFields({ ...req.body });
      delete updateData._id;
      delete updateData.id;
      updateData.updatedAt = new Date();

      const query = getQueryForId(productId);
      
      // Update in MongoDB
      await collection.updateOne(
        query,
        { $set: updateData },
        { upsert: true }
      );

      const updatedDoc = await collection.findOne(query);
      if (updatedDoc) {
        return res.status(200).json({
          ...updatedDoc,
          id: updatedDoc.id || String(updatedDoc._id),
          _id: String(updatedDoc._id),
          images: Array.isArray(updatedDoc.images) && updatedDoc.images.length > 0 ? updatedDoc.images : (updatedDoc.image ? [updatedDoc.image] : [])
        });
      }
      return res.status(200).json({ success: true, message: 'Product updated successfully' });
    }

    // 4. DELETE Request (Delete Product)
    if (req.method === 'DELETE') {
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required for deletion' });
      }

      const query = getQueryForId(productId);
      const deleteResult = await collection.deleteOne(query);

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({ success: true, message: 'Product deleted successfully', id: productId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vercel MongoDB API Error:', error);
    return res.status(500).json({ error: 'Database operation failed', details: error.message });
  }
}
