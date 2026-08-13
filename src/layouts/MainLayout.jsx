import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import MainHeader from '../components/MainHeader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import CartDrawer from '../components/CartDrawer';

const MainLayout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Top Header Information Strip */}
      <TopBar />

      {/* Main Header with Logo and Search */}
      <MainHeader onCartClick={() => setIsCartOpen(true)} />

      {/* Primary Green Navigation Bar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp and Call Action buttons (Bottom-left) */}
      <WhatsAppButton />

      {/* Sliding Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default MainLayout;
