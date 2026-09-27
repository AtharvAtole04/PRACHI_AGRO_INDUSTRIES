import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';
import { revalidateVercelCache } from '../utils/revalidateVercel.js';

const router = express.Router();

const getQueryForId = (idParam) => {
  return mongoose.Types.ObjectId.isValid(idParam)
    ? { $or: [{ id: idParam }, { _id: idParam }] }
    : { id: idParam };
};

const normalizeLocalizedFields = (data) => {
  const fields = ['tagline', 'shortDescription', 'description', 'crops', 'usage'];
  fields.forEach(field => {
    if (typeof data[field] === 'string') {
      data[field] = { mr: data[field], en: data[field] };
    }
  });

  // Ensure images array & single image property are consistent and backward-compatible
  if (Array.isArray(data.images)) {
    data.images = Array.from(new Set(data.images.filter(Boolean)));
    if (data.images.length > 0) {
      if (!data.image || data.image === '/assets/products/placeholder.svg' || !data.images.includes(data.image)) {
        data.image = data.images[0];
      }
    } else if (data.image && data.image !== '/assets/products/placeholder.svg') {
      data.images = [data.image];
    } else {
      data.image = '/assets/products/placeholder.svg';
      data.images = [];
    }
  } else if (data.image && data.image !== '/assets/products/placeholder.svg') {
    data.images = [data.image];
  } else if (!data.image) {
    data.image = '/assets/products/placeholder.svg';
    data.images = [];
  }

  return data;
};

// GET all products (Public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product by ID slug or Mongo _id (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne(getQueryForId(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product (Admin Protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
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

    const existing = await Product.findOne({ id: productData.id });
    if (existing) {
      productData.id = `${productData.id}-${Date.now()}`;
    }

    const product = new Product(productData);
    const newProduct = await product.save();

    // Trigger targeted Vercel cache revalidation
    revalidateVercelCache('products').catch(err => console.error('[Revalidate Error]', err.message));

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT / PATCH update product (Admin Protected)
const handleUpdateProduct = async (req, res) => {
  try {
    const updateData = normalizeLocalizedFields({ ...req.body });
    delete updateData._id;

    const query = getQueryForId(req.params.id);
    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, updateData);
    const updatedProduct = await product.save();

    // Trigger targeted Vercel cache revalidation
    revalidateVercelCache('products').catch(err => console.error('[Revalidate Error]', err.message));

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(400).json({ message: err.message });
  }
};

router.put('/:id', verifyAdminToken, handleUpdateProduct);
router.patch('/:id', verifyAdminToken, handleUpdateProduct);

// DELETE product (Admin Protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete(getQueryForId(req.params.id));
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    // Trigger targeted Vercel cache revalidation
    revalidateVercelCache('products').catch(err => console.error('[Revalidate Error]', err.message));

    res.json({ message: 'Product successfully deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
