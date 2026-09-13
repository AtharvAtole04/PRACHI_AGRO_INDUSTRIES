import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';

const Login = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login('info@prachiagroindustries.in', passcode, 'admin');
    setLoading(false);

    if (res.success && res.user && res.user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      setErrorMsg(language === 'mr' ? 'चुकीचा अ‍ॅडमिन पासवर्ड! कृपया पुन्हा प्रयत्न करा.' : 'Incorrect admin passcode. Try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-3 text-left max-w-md mx-auto">
      <SEOHead 
        title={language === 'mr' ? 'अ‍ॅडमिन लॉगिन - प्राची ॲग्रो' : 'Admin Login - Prachi Agro'} 
        description="Admin portal login for Prachi Agro Industries website management."
      />

      {/* Main Admin Login Card */}
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-gradient-to-br from-brand-green-dark via-emerald-900 to-slate-900 text-white p-6 sm:p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center mx-auto mb-3 text-brand-gold shadow-lg">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight m-0 text-white">
            {language === 'mr' ? 'अ‍ॅडमिन पोर्टल लॉगिन' : 'Admin Portal Login'}
          </h1>
          <p className="text-xs text-emerald-200 mt-1 font-medium">
            {language === 'mr' ? 'वेबसाईट व्यवस्थापनासाठी अ‍ॅडमिन पासवर्ड टाका' : 'Enter passcode to access website admin dashboard'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">

          {/* Info Banner */}
          <div className="mb-5 p-3 rounded-2xl text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-2.5">
            <Sparkles size={16} className="text-brand-gold flex-shrink-0" />
            <span>
              {language === 'mr' 
                ? 'केवळ अ‍ॅडमिन प्रवेश: ग्राहक व शेतकऱ्यांना खरेदीसाठी लॉगिनची आवश्यकता नाही.' 
                : 'Admin Access Only: Customers & dealers can browse and order without login.'}
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="flex flex-col gap-4">
            
            {/* Admin Passcode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Lock size={14} className="text-brand-green-dark" />
                <span>{language === 'mr' ? 'अ‍ॅडमिन पासवर्ड (Admin Passcode)' : 'Admin Passcode'}</span>
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50 font-bold"
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
                  <span>{language === 'mr' ? 'अ‍ॅडमिन लॉगिन करा' : 'Login to Admin'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;
