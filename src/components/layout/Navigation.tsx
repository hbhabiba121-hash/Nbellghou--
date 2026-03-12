import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, User, LogOut, LayoutDashboard, FilePlus, List, Globe, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/logo.png'; 

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Different nav links based on user role
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/map', label: t('map'), icon: MapPin },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { to: '/admin', label: t('dashboard'), icon: LayoutDashboard },
        { to: '/map', label: t('map'), icon: MapPin },
      ];
    }

    // Citizen links
    return [
      { to: '/dashboard', label: t('home'), icon: Home },
      { to: '/map', label: t('map'), icon: MapPin },
      { to: '/my-tickets', label: t('myTickets'), icon: List },
    ];
  };

  const navLinks = getNavLinks();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/map'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C1272D] to-[#E85A5F] flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/30 transition-shadow">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-red-50 text-[#C1272D]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Report Button - Primary CTA (Citizens only) */}
            {isAuthenticated && user?.role === 'citizen' && (
              <Link to="/report">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] transition-all duration-200">
                  <FilePlus className="w-4 h-4" />
                  {t('reportIssue')}
                </button>
              </Link>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs uppercase font-semibold">
                {language === 'fr' ? 'AR' : 'FR'}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#006233] to-[#1A8C5C] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title={t('logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <Link to="/auth">
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
                    {t('login')}
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-red-50 text-[#C1272D]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}

            {/* Mobile Report Button */}
            {isAuthenticated && user?.role === 'citizen' && (
              <Link to="/report" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white rounded-xl text-sm font-medium">
                  <FilePlus className="w-5 h-5" />
                  {t('reportIssue')}
                </button>
              </Link>
            )}

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
              >
                <Globe className="w-4 h-4" />
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  {t('logout')}
                </button>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
                    {t('login')}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
