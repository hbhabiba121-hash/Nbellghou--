import { Link } from 'react-router-dom';
import {  Mail, Phone, Facebook, Instagram, Twitter, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import logo from '@/assets/logo.png'; 

export default function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C1272D] to-[#E85A5F] flex items-center justify-center shadow-lg shadow-red-500/20">
                 <img src={logo} alt="Nbellghou Logo"className="w-20 h-20 object-contain"/>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 leading-none tracking-tight">
                  {t('appName')}
                </span>
                <span className="text-xs text-[#C1272D] font-medium leading-none mt-0.5">
                  {t('appNameArabic')}
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('tagline')}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#C1272D] hover:bg-red-50 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#C1272D] hover:bg-red-50 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#C1272D] hover:bg-red-50 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              {isRTL ? 'روابط سريعة' : 'Liens rapides'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#C1272D] transition-colors text-sm">
                  {t('map')}
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-500 hover:text-[#C1272D] transition-colors text-sm">
                  {t('reportIssue')}
                </Link>
              </li>
              <li>
                <Link to="/my-tickets" className="text-gray-500 hover:text-[#C1272D] transition-colors text-sm">
                  {t('myTickets')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              {t('contact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <Mail className="w-4 h-4 text-[#C1272D]" />
                contact@nbellghou.rabat.ma
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <Phone className="w-4 h-4 text-[#C1272D]" />
                +212 5XX-XXXXXX
              </li>
              <li className="text-gray-500 text-sm">
                {t('municipality')}
              </li>
            </ul>
          </div>

          {/* Smart City */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              {t('smartCity')}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {isRTL 
                ? 'منصة رقمية ضمن رؤية الرباط 2030 للتحول الرقمي والمدينة الذكية'
                : 'Plateforme digitale dans le cadre de la vision Rabat 2030 pour la transformation digitale et la ville intelligente.'
              }
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-6 h-4 rounded-sm bg-gradient-to-r from-[#C1272D] to-[#C1272D] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#006233] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#006233] border border-[#C1272D]"></div>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">Rabat 2030</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
<div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
  <p className="text-gray-400 text-sm flex flex-col md:flex-row items-center gap-1">
    © 2026 {t('appName')} 
    <span className="flex items-center gap-1 ml-2">
      <Heart className="w-3 h-3 text-[#C1272D] fill-[#C1272D]" />
      {isRTL ? 'تم التصميم والتطوير بواسطة حبيبة المحفوظي' : 'Made with ❤️ by Habiba El Mahfoudi'}
    </span>
   
  </p>
  <div className="flex gap-6">
    <Link to="#" className="text-gray-400 hover:text-[#C1272D] text-sm transition-colors">
      {t('privacy')}
    </Link>
    <Link to="#" className="text-gray-400 hover:text-[#C1272D] text-sm transition-colors">
      {t('terms')}
    </Link>
    <Link to="#" className="text-gray-400 hover:text-[#C1272D] text-sm transition-colors">
      {t('about')}
    </Link>
  </div>
</div>
      </div>
    </footer>
  );
}
