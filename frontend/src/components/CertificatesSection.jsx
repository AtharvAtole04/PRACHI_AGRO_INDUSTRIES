import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Award, CheckCircle, Sparkles } from 'lucide-react';

const certificatesData = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-brand-green-dark" />,
    title_en: 'Government Approved',
    title_mr: 'शासन मान्यताप्राप्त',
    desc_en: 'All formulations registered and approved under standard agricultural norms.',
    desc_mr: 'सर्व उत्पादने अधिकृत कृषी नियमांनुसार नोंदणीकृत व प्रमाणित.'
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-brand-green-dark" />,
    title_en: 'Quality Tested',
    title_mr: 'गुणवत्ता चाचणी',
    desc_en: 'Every batch undergoes rigorous lab testing for efficacy, safety, and purity.',
    desc_mr: 'प्रत्येक बॅच कठोर प्रयोगशाळा चाचणी व गुणवत्तेच्या निकषांमधून जातो.'
  },
  {
    icon: <Sparkles className="w-8 h-8 text-brand-green-dark" />,
    title_en: 'Field Tested',
    title_mr: 'शेत चाचणी प्रमाणित',
    desc_en: 'Proven performance and high yield results tested in actual field conditions.',
    desc_mr: 'विविध पिकांवर प्रत्यक्ष शेत चाचण्यांमध्ये भरघोस उत्पादनाचे सिद्ध परिणाम.'
  },
  {
    icon: <Award className="w-8 h-8 text-brand-green-dark" />,
    title_en: "Farmer's Trust",
    title_mr: 'शेतकरी विश्वास',
    desc_en: 'Preferred choice of thousands of satisfied farmers for superior harvests.',
    desc_mr: 'उत्तम उत्पादनासाठी हजारो शेतकऱ्यांची पहिली आणि विश्वासू पसंती.'
  }
];

const CertificatesSection = () => {
  const { language } = useLanguage();

  return (
    <section className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <span className="bg-emerald-100/70 text-brand-green-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full inline-block mb-2">
            गुणवत्ता आणि विश्वास
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-green-dark tracking-tight">
            {language === 'mr' ? 'प्रमाणपत्रे आणि गुणवत्ता हमी' : 'Certificates & Quality Assurance'}
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {certificatesData.map((cert, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="mb-4 p-3 bg-emerald-50 rounded-2xl group-hover:bg-brand-green-dark group-hover:text-white transition-colors duration-300 text-brand-green-dark">
                {cert.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 group-hover:text-brand-green-dark transition-colors">
                {language === 'mr' ? cert.title_mr : cert.title_en}
              </h3>
              <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">
                {language === 'mr' ? cert.desc_mr : cert.desc_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
