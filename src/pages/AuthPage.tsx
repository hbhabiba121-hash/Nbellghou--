import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Globe, MapPin, Building2, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import logo from '@/assets/logo.png'; 

export default function AuthPage() {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register form
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen' as UserRole
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      // Redirect based on role will be handled by the router
      navigate('/');
    } catch (err) {
      setError(t('errorLogin'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.name,
        registerData.role
      );
      navigate('/');
    } catch (err) {
      setError(t('errorRegister'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C1272D] via-[#D64045] to-[#006233]">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Nbellghou Logo"className="w-20 h-20 object-contain"/>
              <div>
                <span className="font-bold text-2xl">{t('appName')}</span>
                <span className="block text-sm opacity-80">{t('appNameArabic')}</span>
              </div>
            </Link>
          </div>

          <div className="space-y-8">
            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold leading-tight">
                {isRTL ? 'شارك في بناء مدينتك' : 'Participez à construire\nvotre ville'}
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: isRTL ? 'إبلاغ سهل وسريع' : 'Signalement facile et rapide' },
                  { icon: Building2, text: isRTL ? 'متابعة حالة البلاغ' : 'Suivi du statut en temps réel' },
                  { icon: Users, text: isRTL ? 'تأثير حقيقي على مدينتك' : 'Impact réel sur votre ville' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm opacity-90">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-white/20">
              {[
                { value: '10K+', label: isRTL ? 'بلاغ' : 'Signalements' },
                { value: '85%', label: isRTL ? 'محلول' : 'Résolus' },
                { value: '50K+', label: isRTL ? 'مواطن' : 'Citoyens' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm opacity-60 space-y-1">
            <p> 2026 {t('appName')} — {t('smartCity')}</p>
            <p className="text-xs opacity-80"> Design & Developed by <span className="font-semibold">Habiba El Mahfoudi</span></p>
          </div>
         </div>

        {/* Decorative shapes */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/4 -right-16 w-32 h-32 rounded-full bg-white/10" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C1272D] to-[#E85A5F] flex items-center justify-center">
              <img src={logo} alt="Nbellghou Logo"className="w-20 h-20 object-contain"/>
            </div>
            <span className="font-bold text-lg">{t('appName')}</span>
          </Link>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all ml-auto"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{language === 'fr' ? 'AR' : 'FR'}</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'login'
                      ? 'text-[#C1272D] border-b-2 border-[#C1272D] bg-red-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'register'
                      ? 'text-[#C1272D] border-b-2 border-[#C1272D] bg-red-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('register')}
                </button>
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {activeTab === 'login' ? t('welcomeBack') : t('joinPlatform')}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {activeTab === 'login' ? t('loginSubtitle') : t('registerSubtitle')}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 text-sm">!</span>
                    </div>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('email')}
                      </label>
                      <div className="relative">
                        <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                        <input
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="exemple@email.com"
                          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('password')}
                      </label>
                      <div className="relative">
                        <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="••••••••"
                          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                        >
                          {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {t('login')}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-5">
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('selectRole')}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRegisterData({ ...registerData, role: 'citizen' })}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            registerData.role === 'citizen'
                              ? 'border-[#C1272D] bg-red-50 text-[#C1272D]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <Users className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-medium">{t('citizen')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegisterData({ ...registerData, role: 'admin' })}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            registerData.role === 'admin'
                              ? 'border-[#006233] bg-green-50 text-[#006233]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <Building2 className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-medium">{t('admin')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('name')}
                      </label>
                      <div className="relative">
                        <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                        <input
                          type="text"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          placeholder={isRTL ? 'الاسم الكامل' : 'Nom complet'}
                          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('email')}
                      </label>
                      <div className="relative">
                        <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                        <input
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="exemple@email.com"
                          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('password')}
                      </label>
                      <div className="relative">
                        <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="••••••••"
                          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                        >
                          {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {t('register')}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 text-center mb-2">
                    {isRTL ? 'بيانات تجريبية:' : 'Identifiants de démo:'}
                  </p>
                  <div className="text-xs text-gray-600 text-center space-y-1">
                    <p><strong>Citoyen:</strong> citizen@example.com / password</p>
                    <p><strong>Admin:</strong> admin@rabat.ma / password</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
