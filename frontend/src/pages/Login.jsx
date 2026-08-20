import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Store, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';

const Login = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Role Tab: 'customer' | 'dealer' | 'admin'
  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectAfterLogin = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }

    if (userRole === 'admin') {
      navigate('/admin', { replace: true });
    } else if (userRole === 'dealer') {
      navigate('/dealer-portal', { replace: true });
    } else {
      navigate('/account', { replace: true });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password, selectedRole);
    setLoading(false);

    if (res.success && res.user) {
      redirectAfterLogin(res.user.role);
    } else {
      setErrorMsg(res.error || 'लॉगिन अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  // 1-Click Quick Demo Login Helper
  const handleQuickDemoLogin = async (roleType) => {
    setSelectedRole(roleType);
    setErrorMsg('');
    setLoading(true);

    let demoEmail = 'farmer@prachiagro.com';
    let demoPass = 'farmer123';

    if (roleType === 'admin') {
      demoEmail = 'admin@prachiagro.com';
      demoPass = 'admin123';
    } else if (roleType === 'dealer') {
      demoEmail = 'dealer@prachiagro.com';
      demoPass = 'dealer123';
    }

    setEmail(demoEmail);
    setPassword(demoPass);

    const res = await login(demoEmail, demoPass, roleType);
    setLoading(false);

    if (res.success && res.user) {
      redirectAfterLogin(res.user.role);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-3 text-left max-w-lg mx-auto">
      <SEOHead 
        title={language === 'mr' ? 'लॉगिन करा - प्राची ॲग्रो' : 'Login - Prachi Agro'} 
        description="Login to access Farmer discounts, Dealer wholesale portal, or Admin dashboard."
      />

      {/* Main Login Card */}
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-gradient-to-br from-brand-green-dark to-emerald-950 text-white p-6 sm:p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center mx-auto mb-3 text-brand-gold shadow-lg">
            <Lock size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight m-0 text-white">
            {language === 'mr' ? 'प्राची ॲग्रो पोर्टल लॉगिन' : 'Prachi Agro Portal Login'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium">
            {language === 'mr' ? 'आपल्या भूमिकेनुसार लॉगिन निवडा' : 'Select your account type to continue'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1.5 border-b border-slate-200">
          
          {/* Tab 1: Farmer */}
          <button
            type="button"
            onClick={() => { setSelectedRole('customer'); setErrorMsg(''); }}
            className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'customer'
                ? 'bg-white text-brand-green-dark shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌾</span>
            <span>{language === 'mr' ? 'शेतकरी' : 'Farmer'}</span>
          </button>

          {/* Tab 2: Dealer */}
          <button
            type="button"
            onClick={() => { setSelectedRole('dealer'); setErrorMsg(''); }}
            className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'dealer'
                ? 'bg-white text-brand-magenta shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store size={14} className={selectedRole === 'dealer' ? 'text-brand-magenta' : ''} />
            <span>{language === 'mr' ? 'डीलर' : 'Dealer'}</span>
          </button>

          {/* Tab 3: Admin */}
          <button
            type="button"
            onClick={() => { setSelectedRole('admin'); setErrorMsg(''); }}
            className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={14} className={selectedRole === 'admin' ? 'text-slate-900' : ''} />
            <span>{language === 'mr' ? 'अ‍ॅडमिन' : 'Admin'}</span>
          </button>

        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">

          {/* Role Benefit Banner */}
          <div className={`mb-5 p-3 rounded-2xl text-xs font-bold border flex items-center gap-2.5 ${
            selectedRole === 'customer'
              ? 'bg-emerald-50 text-brand-green-dark border-emerald-100'
              : selectedRole === 'dealer'
              ? 'bg-pink-50 text-brand-magenta border-pink-100'
              : 'bg-slate-100 text-slate-800 border-slate-200'
          }`}>
            <Sparkles size={16} className="flex-shrink-0" />
            <span>
              {selectedRole === 'customer' && (language === 'mr' ? 'शेतकरी विशेष: टॉनिक व खतांवर अतिरिक्त ५% हंगामी सूट' : 'Farmer Benefit: Extra 5% seasonal discount on products')}
              {selectedRole === 'dealer' && (language === 'mr' ? 'डीलर विशेष: २०% ते ३५% होलसेल मार्जिन व थेट B2B ऑर्डर' : 'Dealer Benefit: 20-35% wholesale margins and B2B ordering')}
              {selectedRole === 'admin' && (language === 'mr' ? 'अ‍ॅडमिन पोर्टल: उत्पादने, व्हिडिओ, ब्लॉग व कन्टेन्ट मॅनेजमेंट' : 'Admin: Full control over CMS content and approvals')}
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            
            {/* Email / Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {selectedRole === 'admin' 
                  ? (language === 'mr' ? 'अ‍ॅडमिन ईमेल किंवा युझरनेम' : 'Admin Email / Username')
                  : (language === 'mr' ? 'ईमेल किंवा मोबाईल नंबर' : 'Email or Mobile Number')}
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'admin'
                    ? 'admin@prachiagro.com'
                    : selectedRole === 'dealer'
                    ? 'dealer@prachiagro.com'
                    : 'farmer@prachiagro.com'
                }
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {language === 'mr' ? 'पासवर्ड (Password)' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-brand-green-dark hover:bg-brand-green-light active:scale-[0.98] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all text-sm disabled:opacity-50"
            >
              {loading ? (
                <span>प्रक्रिया सुरू आहे...</span>
              ) : (
                <>
                  <span>{language === 'mr' ? 'लॉगिन करा' : 'Login'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              {language === 'mr' ? '⚡ त्वरित टेस्टिंगसाठी डेमो लॉगिन (1-Click Demo)' : '⚡ Quick 1-Click Demo Logins'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="bg-emerald-50 hover:bg-emerald-100 text-brand-green-dark border border-emerald-200 text-[11px] font-bold py-2 px-1 rounded-lg transition-colors cursor-pointer text-center truncate"
              >
                🌾 Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('dealer')}
                className="bg-pink-50 hover:bg-pink-100 text-brand-magenta border border-pink-200 text-[11px] font-bold py-2 px-1 rounded-lg transition-colors cursor-pointer text-center truncate"
              >
                🏪 Demo Dealer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-bold py-2 px-1 rounded-lg transition-colors cursor-pointer text-center truncate"
              >
                👑 Demo Admin
              </button>
            </div>
          </div>

          {/* Register Redirect */}
          {selectedRole !== 'admin' && (
            <div className="mt-6 text-center text-xs text-slate-500 font-semibold">
              <span>{language === 'mr' ? 'खाते नाही का?' : "Don't have an account?"} </span>
              <Link 
                to="/register" 
                state={{ role: selectedRole }}
                className="text-brand-green-dark hover:underline font-extrabold"
              >
                {selectedRole === 'dealer'
                  ? (language === 'mr' ? 'डीलर नोंदणी करा' : 'Register as Dealer')
                  : (language === 'mr' ? 'नवीन शेतकरी नोंदणी करा' : 'Register as Farmer')}
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Login;
