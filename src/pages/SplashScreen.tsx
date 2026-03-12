import { useEffect, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import logo from '@/assets/logo.png'; 

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Complete after 2.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F7F8FA] via-white to-[#F0FDF4] overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Abstract Rabat-inspired shapes */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#C1272D]/5 to-transparent animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#006233]/5 to-transparent animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gray-100 opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gray-100 opacity-30" />
        
        {/* Smart city grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(to right, #C1272D 1px, transparent 1px),
            linear-gradient(to bottom, #C1272D 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />

        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C1272D]/10 to-[#C1272D]/5 rotate-12 animate-fade-in-up" />
        <div className="absolute bottom-32 left-24 w-12 h-12 rounded-xl bg-gradient-to-br from-[#006233]/10 to-[#006233]/5 -rotate-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-40 left-1/4 w-8 h-8 rounded-lg bg-gradient-to-br from-[#C1272D]/10 to-transparent rotate-45 animate-fade-in-up" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C1272D] to-[#E85A5F] rounded-3xl blur-2xl opacity-20 animate-pulse-soft" />
          
          {/* Logo */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#C1272D] to-[#E85A5F] rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/30 animate-fade-in-up">
            <img src={logo} alt="Nbellghou Logo" className="w-20 h-20 object-contain"/>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C1272D] to-[#E85A5F] bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          <p className="text-xl font-semibold text-[#006233] mt-1">
            {t('appNameArabic')}
          </p>
        </div>

        {/* Tagline */}
        <p className="text-gray-500 text-lg mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {t('tagline')}
        </p>

        {/* Loading Indicator */}
        <div className="w-64 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {/* Progress bar background */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            {/* Animated progress */}
            <div 
              className="h-full bg-gradient-to-r from-[#C1272D] to-[#E85A5F] rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#C1272D] to-[#E85A5F] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-gray-400">
          {t('smartCity')} • Rabat 2030
        </p>
      </div>
    </div>
  );
}
