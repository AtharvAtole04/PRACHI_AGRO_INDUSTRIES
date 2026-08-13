import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

// Layout Skeleton
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Videos from './pages/Videos';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import NotFound from './pages/NotFound';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Core Page Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reviews" element={<Reviews />} />
              
              {/* Mock placeholder static routes to avoid 404 on Footer links */}
              <Route path="/privacy" element={<Home />} />
              <Route path="/terms" element={<Home />} />
              <Route path="/account" element={<Home />} />
              <Route path="/orders" element={<Home />} />

              {/* 404 Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
