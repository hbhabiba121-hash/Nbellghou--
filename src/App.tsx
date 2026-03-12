import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TicketsProvider } from '@/context/TicketsContext';


// Pages
import SplashScreen from '@/pages/SplashScreen';
import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import CitizenDashboard from '@/pages/CitizenDashboard';
import PostTicketPage from '@/pages/PostTicketPage';
import MyTicketsPage from '@/pages/MyTicketsPage';
import AdminDashboard from '@/pages/AdminDashboard';
import TicketDetailPage from '@/pages/TicketDetailPage';

// Layout
import MainLayout from '@/components/layout/MainLayout';

// Protected route component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isRTL } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-100 border-t-[#C1272D] rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">{isRTL ? 'جاري التحميل...' : 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Role-based redirect component
function RoleBasedRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/auth');
      } else if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <div className="w-12 h-12 border-4 border-red-100 border-t-[#C1272D] rounded-full animate-spin" />
    </div>
  );
}

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true);

  // Check if user has seen splash before
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('nballgou-splash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('nballgou-splash', 'true');
    setShowSplash(false);
  };

  // Show splash screen on first visit
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Root redirect based on role */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Citizen Routes */}
      <Route element={<MainLayout />}>
        {/* Citizen Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <CitizenDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Map View (public but shows different things when logged in) */}
        <Route 
          path="/map" 
          element={<HomePage />} 
        />
        
        {/* Report Issue */}
        <Route 
          path="/report" 
          element={
            <ProtectedRoute>
              <PostTicketPage />
            </ProtectedRoute>
          } 
        />
        
        {/* My Tickets */}
        <Route 
          path="/my-tickets" 
          element={
            <ProtectedRoute>
              <MyTicketsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Ticket Detail */}
        <Route 
          path="/ticket/:id" 
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<MainLayout />}>
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin can also access ticket details */}
        <Route 
          path="/admin/ticket/:id" 
          element={
            <ProtectedRoute requireAdmin>
              <TicketDetailPage />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch all - redirect to auth */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TicketsProvider>
          <Router>
            <AppRoutes />
          </Router>
        </TicketsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
