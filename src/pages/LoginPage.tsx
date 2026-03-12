import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { t, isRTL } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(t('errorLogin'));
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
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-2xl">{t('appName')}</span>
                <span className="block text-sm opacity-80">{t('appNameArabic')}</span>
              </div>
            </Link>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              {isRTL ? 'شارك في بناء مدينتك' : 'Participez à construire\nvotre ville'}
            </h2>
            <p className="text-lg opacity-80 max-w-md">
              {isRTL 
                ? 'انضم إلى آلاف المواطنين الذين يساهمون في تحسين الرباط يومياً'
                : 'Rejoignez des milliers de citoyens qui contribuent à améliorer Rabat chaque jour'}
            </p>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm opacity-70">{isRTL ? 'بلاغ' : 'Signalements'}</p>
              </div>
              <div>
                <p className="text-3xl font-bold">85%</p>
                <p className="text-sm opacity-70">{isRTL ? 'محلول' : 'Résolus'}</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm opacity-70">{isRTL ? 'مواطن' : 'Citoyens'}</p>
              </div>
            </div>
          </div>

          <p className="text-sm opacity-60">
            © 2024 {t('appName')} — {t('smartCity')}
          </p>
        </div>

        {/* Decorative shapes */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/4 -right-16 w-32 h-32 rounded-full bg-white/10" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C1272D] to-[#E85A5F] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">{t('appName')}</span>
              <span className="block text-xs text-[#C1272D]">{t('appNameArabic')}</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('welcomeBack')}
              </h1>
              <p className="text-gray-500 text-sm">
                {t('loginSubtitle')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('loading')}
                  </span>
                ) : (
                  t('login')
                )}
              </button>
            </form>

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

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                {t('dontHaveAccount')}{' '}
                <Link to="/register" className="text-[#C1272D] hover:underline font-medium">
                  {t('register')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
