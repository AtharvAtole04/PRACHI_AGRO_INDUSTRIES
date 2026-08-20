import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import Models
import Product from './models/Product.js';
import Video from './models/Video.js';
import Blog from './models/Blog.js';
import Review from './models/Review.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prachi_agro';

async function clear() {
  try {
    console.log('Connecting to database to clear all collections...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Wiping all data...');

    const productsResult = await Product.deleteMany({});
    const videosResult = await Video.deleteMany({});
    const blogsResult = await Blog.deleteMany({});
    const reviewsResult = await Review.deleteMany({});

    console.log('--------------------------------------------------');
    console.log(`Deleted Products: ${productsResult.deletedCount}`);
    console.log(`Deleted Videos:   ${videosResult.deletedCount}`);
    console.log(`Deleted Blogs:    ${blogsResult.deletedCount}`);
    console.log(`Deleted Reviews:  ${reviewsResult.deletedCount}`);
    console.log('--------------------------------------------------');
    console.log('🎉 Database cleared successfully! Collections are now empty.');
  } catch (err) {
    console.error('❌ Error clearing database:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

clear();
