import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../config';

const AuthContext = createContext();

// Pre-seeded demo accounts for instant testing
const DEMO_USERS = {
  admin: {
    id: 'demo-admin',
    name: 'Prachi Agro Admin',
    email: 'admin@prachiagro.com',
    phone: '9021605160',
    role: 'admin',
    isVerifiedDealer: true,
    status: 'active'
  },
  customer: {
    id: 'demo-farmer',
    name: 'बाळासाहेब थोरात (शेतकरी)',
    email: 'farmer@prachiagro.com',
    phone: '9822334455',
    role: 'customer',
    mainCrops: 'ऊस, सोयाबीन, कापूस',
    landAcres: '8 एकर',
    city: 'बारामती',
    district: 'पुणे',
    isVerifiedDealer: true,
    status: 'active'
  },
  dealer: {
    id: 'demo-dealer',
    name: 'राजेंद्र देशमुख',
    email: 'dealer@prachiagro.com',
    phone: '9422001122',
    role: 'dealer',
    businessName: 'श्री स्वामी समर्थ कृषी सेवा केंद्र',
    gstNumber: '27AAAAA0000A1Z5',
    licenseNumber: 'AGRI/MH/2024/889',
    dealerDiscountPercent: 25, // 25% wholesale margin
    city: 'नाशिक',
    district: 'नाशिक',
    isVerifiedDealer: true,
    status: 'active'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('prachi_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('prachi_auth_token') || null;
  });

  // Keep localStorage synchronized
  useEffect(() => {
    if (user) {
      localStorage.setItem('prachi_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prachi_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('prachi_auth_token', token);
    } else {
      localStorage.removeItem('prachi_auth_token');
    }
  }, [token]);

  // Login handler with backend API + local demo fallback
  const login = async (email, password, preferredRole) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Check if user is logging into standard Demo accounts
    if (
      (trimmedEmail === 'admin@prachiagro.com' || trimmedEmail === 'admin') &&
      (cleanPassword === 'admin123' || cleanPassword === 'admin')
    ) {
      const adminUser = DEMO_USERS.admin;
      setUser(adminUser);
      setToken('demo-admin-token');
      return { success: true, user: adminUser };
    }

    if (
      (trimmedEmail === 'farmer@prachiagro.com' || trimmedEmail === 'farmer') &&
      cleanPassword === 'farmer123'
    ) {
      const farmerUser = DEMO_USERS.customer;
      setUser(farmerUser);
      setToken('demo-farmer-token');
      return { success: true, user: farmerUser };
    }

    if (
      (trimmedEmail === 'dealer@prachiagro.com' || trimmedEmail === 'dealer') &&
      cleanPassword === 'dealer123'
    ) {
      const dealerUser = DEMO_USERS.dealer;
      setUser(dealerUser);
      setToken('demo-dealer-token');
      return { success: true, user: dealerUser };
    }

    // 2. Try Backend API
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: cleanPassword, role: preferredRole })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setToken(data.token);
          return { success: true, user: data.user };
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.warn('Backend login endpoint unavailable, checking local registered users...');
    }

    // 3. Fallback: check locally registered users in localStorage
    const localUsers = JSON.parse(localStorage.getItem('prachi_registered_users') || '[]');
    const matched = localUsers.find(
      u => (u.email?.toLowerCase() === trimmedEmail || u.phone === trimmedEmail) && u.password === cleanPassword
    );

    if (matched) {
      const safeUser = { ...matched };
      delete safeUser.password;
      setUser(safeUser);
      setToken(`local-token-${safeUser.id}`);
      return { success: true, user: safeUser };
    }

    return { success: false, error: 'चुकीचा ईमेल किंवा पासवर्ड! (Invalid email or password)' };
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setToken(data.token);
          return { success: true, message: data.message, user: data.user };
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, saving user locally.');
    }

    // Save to local registered users
    const localUsers = JSON.parse(localStorage.getItem('prachi_registered_users') || '[]');
    const newUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      isVerifiedDealer: userData.role === 'dealer' ? false : true,
      status: userData.role === 'dealer' ? 'pending' : 'active',
      dealerDiscountPercent: userData.role === 'dealer' ? 20 : 0
    };
    localUsers.push(newUser);
    localStorage.setItem('prachi_registered_users', JSON.stringify(localUsers));

    const safeUser = { ...newUser };
    delete safeUser.password;
    setUser(safeUser);
    setToken(`local-token-${safeUser.id}`);

    return {
      success: true,
      message: userData.role === 'dealer'
        ? 'डीलर नोंदणी यशस्वी झाली. अ‍ॅडमिन पडताळणीनंतर पूर्ण ऍक्सेस मिळेल.'
        : 'शेतकरी नोंदणी यशस्वी झाली!',
      user: safeUser
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('prachi_auth_user');
    localStorage.removeItem('prachi_auth_token');
  };

  const updateUser = (updatedFields) => {
    setUser(prev => (prev ? { ...prev, ...updatedFields } : null));
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';
  const isFarmer = role === 'customer';
  const isDealer = role === 'dealer';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isAdmin,
        isFarmer,
        isDealer,
        login,
        register,
        logout,
        updateUser,
        DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
