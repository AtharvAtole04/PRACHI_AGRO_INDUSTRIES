import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, Store, User, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';

const Register = () => {
  const { language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.role || 'customer';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Farmer fields
    mainCrops: 'कापूस, सोयाबीन, ऊस',
    landAcres: '5',
    // Dealer fields
    businessName: '',
    gstNumber: '',
    licenseNumber: '',
    // Common
    city: '',
    district: '',
    state: 'Maharashtra'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(language === 'mr' ? 'पासवर्ड जुळत नाही!' : 'Passwords do not match.');
      return;
    }

    if (formData.password.length < 4) {
      setErrorMsg(language === 'mr' ? 'पासवर्ड किमान ४ अक्षरांचा असावा.' : 'Password must be at least 4 characters.');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      role
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        if (role === 'dealer') {
          navigate('/dealer-portal');
        } else {
          navigate('/account');
        }
      }, 1500);
    } else {
      setErrorMsg(res.error || 'नोंदणी अयशस्वी झाली.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-3 text-left max-w-xl mx-auto">
      <SEOHead 
        title={language === 'mr' ? 'नवीन नोंदणी - प्राची ॲग्रो' : 'Register - Prachi Agro'} 
        description="Register as a Farmer or Authorized Dealer at Prachi Agro Industries."
      />

      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-green-dark to-emerald-950 text-white p-6 sm:p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center mx-auto mb-3 text-brand-gold shadow-lg">
            <UserPlus size={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight m-0 text-white">
            {language === 'mr' ? 'नवीन खाते नोंदणी' : 'Create New Account'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium">
            {language === 'mr' ? 'शेतकरी किंवा कृषी केंद्र / डीलर खाते निवडा' : 'Choose Farmer or Dealer account type'}
          </p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-brand-green-dark shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌾</span>
            <span>{language === 'mr' ? 'शेतकरी नोंदणी (Farmer)' : 'Farmer Registration'}</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('dealer')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'dealer'
                ? 'bg-white text-brand-magenta shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store size={16} />
            <span>{language === 'mr' ? 'डीलर नोंदणी (Dealer / B2B)' : 'Dealer Registration'}</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          
          {successMsg && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-brand-green-dark rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce">
              <CheckCircle2 size={18} className="flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            
            {/* Dealer Specific: Business Name */}
            {role === 'dealer' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'कृषी सेवा केंद्र / दुकानाचे नाव' : 'Agri Center / Shop Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="उदा. श्री स्वामी समर्थ कृषी केंद्र"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                />
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {role === 'dealer' 
                  ? (language === 'mr' ? 'चालकाचे / मालकाचे पूर्ण नाव' : 'Owner / Manager Full Name')
                  : (language === 'mr' ? 'आपले पूर्ण नाव' : 'Your Full Name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="उदा. राहुल पाटील"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'ईमेल आयडी' : 'Email Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                />
              </div>
            </div>

            {/* Dealer Specific: GST & License */}
            {role === 'dealer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {language === 'mr' ? 'GST नंबर (ऐच्छिक)' : 'GST Number (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="27AAAAA0000A1Z5"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {language === 'mr' ? 'कृषी विक्री परवाना (License No.)' : 'Agri License No.'}
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="उदा. AGRI/MH/2024/..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            {/* Farmer Specific: Crops & Land */}
            {role === 'customer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {language === 'mr' ? 'प्रमुख पिके' : 'Main Crops'}
                  </label>
                  <input
                    type="text"
                    name="mainCrops"
                    value={formData.mainCrops}
                    onChange={handleChange}
                    placeholder="कापूस, सोयाबीन, कांदा, टोमॅटो"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {language === 'mr' ? 'शेती क्षेत्र (एकर)' : 'Land Area (Acres)'}
                  </label>
                  <input
                    type="text"
                    name="landAcres"
                    value={formData.landAcres}
                    onChange={handleChange}
                    placeholder="उदा. 5 एकर"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            {/* City & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'गाव / तालुका' : 'Town / Taluka'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="उदा. बारामती"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'जिल्हा' : 'District'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="उदा. पुणे"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'पासवर्ड तयार करा' : 'Create Password'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {language === 'mr' ? 'पासवर्ड पुन्हा टाका' : 'Confirm Password'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-slate-50/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full bg-brand-green-dark hover:bg-brand-green-light active:scale-[0.98] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all text-sm disabled:opacity-50"
            >
              {loading ? (
                <span>नोंदणी सुरू आहे...</span>
              ) : (
                <>
                  <span>{language === 'mr' ? 'खाते तयार करा (Complete Registration)' : 'Complete Registration'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          {/* Login Redirect */}
          <div className="mt-6 text-center text-xs text-slate-500 font-semibold border-t border-slate-100 pt-5">
            <span>{language === 'mr' ? 'आधीच खाते आहे का?' : 'Already have an account?'} </span>
            <Link to="/login" className="text-brand-green-dark hover:underline font-extrabold">
              {language === 'mr' ? 'येथे लॉगिन करा' : 'Login here'}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;
