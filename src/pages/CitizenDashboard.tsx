import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Plus, MapPin, Search, ChevronRight, Clock, CheckCircle, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketsContext';
import type { TicketStatus, TicketCategory } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const statusColors: Record<TicketStatus, string> = {
  pending: '#DC2626',
  in_progress: '#F97316',
  resolved: '#16A34A',
  rejected: '#6B7280'
};

const getStatusIcon = (status: TicketStatus) => {
  const color = statusColors[status];
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 36px;
      height: 36px;
      background: ${color};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
};

const categoryIcons: Record<TicketCategory, string> = {
  pothole: '🕳️',
  streetlight: '💡',
  garbage: '🗑️',
  graffiti: '🎨',
  canal: '🌊',
  other: '📍'
};

const statusConfig: Record<TicketStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: 'Signalé', className: 'bg-red-50 text-red-600 border border-red-100', icon: Clock },
  in_progress: { label: 'En cours', className: 'bg-orange-50 text-orange-600 border border-orange-100', icon: AlertCircle },
  resolved: { label: 'Résolu', className: 'bg-green-50 text-green-600 border border-green-100', icon: CheckCircle },
  rejected: { label: 'Rejeté', className: 'bg-gray-50 text-gray-600 border border-gray-100', icon: Clock }
};

const neighborhoods = [
  { name: 'Agdal', nameAr: 'أكدال', lat: 34.005, lng: -6.845 },
  { name: 'Hay Riad', nameAr: 'حي الرياض', lat: 34.025, lng: -6.855 },
  { name: 'Hassan', nameAr: 'حسان', lat: 34.015, lng: -6.835 },
  { name: 'Souissi', nameAr: 'السويسي', lat: 33.98, lng: -6.82 },
  { name: 'Centre Ville', nameAr: 'وسط المدينة', lat: 34.02, lng: -6.84 },
  { name: 'Médina', nameAr: 'المدينة', lat: 34.025, lng: -6.825 },
  { name: 'Océan', nameAr: 'المحيط', lat: 34.035, lng: -6.815 },
  { name: 'Akkari', nameAr: 'عكاري', lat: 34.01, lng: -6.865 },
  { name: 'Yacoub El Mansour', nameAr: 'يعقوب المنصور', lat: 33.995, lng: -6.875 },
];

const getNeighborhood = (lat: number, lng: number, language: string) => {
  let nearest = neighborhoods[0];
  let minDist = Infinity;
  neighborhoods.forEach(n => {
    const dist = Math.sqrt(Math.pow(lat - n.lat, 2) + Math.pow(lng - n.lng, 2));
    if (dist < minDist) {
      minDist = dist;
      nearest = n;
    }
  });
  return language === 'ar' ? nearest.nameAr : nearest.name;
};

export default function CitizenDashboard() {
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const { tickets, userTickets } = useTickets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = useMemo(() => {
    if (!searchQuery) return tickets.slice(0, 8);
    return tickets.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [tickets, searchQuery]);

  const stats = useMemo(() => ({
    total: userTickets.length,
    pending: userTickets.filter(t => t.status === 'pending').length,
    inProgress: userTickets.filter(t => t.status === 'in_progress').length,
    resolved: userTickets.filter(t => t.status === 'resolved').length,
  }), [userTickets]);

  const rabatCenter: [number, number] = [34.0209, -6.8416];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm mb-1">
                {isRTL ? 'مرحباً بك،' : 'Bienvenue,'}
              </p>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
            </div>
            <Link to="/report">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#C1272D] rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                <Plus className="w-4 h-4" />
                {t('reportIssue')}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('totalTickets'), value: stats.total, icon: TrendingUp, color: 'bg-gray-900 text-white' },
            { label: t('reported'), value: stats.pending, color: 'bg-red-50 text-red-600 border border-red-100' },
            { label: t('in_progress'), value: stats.inProgress, color: 'bg-orange-50 text-orange-600 border border-orange-100' },
            { label: t('resolved'), value: stats.resolved, color: 'bg-green-50 text-green-600 border border-green-100' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-2xl shadow-sm ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Map */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{t('map')}</h2>
                <Link to="/" className="text-sm text-[#C1272D] hover:underline">
                  {t('viewAll')}
                </Link>
              </div>
              <div className="h-[400px]">
                <MapContainer
                  center={rabatCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  {tickets.map((ticket) => (
                    <Marker
                      key={ticket.id}
                      position={[ticket.location.lat, ticket.location.lng]}
                      icon={getStatusIcon(ticket.status)}
                    >
                      <Popup className="rounded-2xl overflow-hidden">
                        <div className="p-3 min-w-[200px]">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                              {categoryIcons[ticket.category]}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{ticket.title}</h3>
                              <p className="text-xs text-gray-500">{getNeighborhood(ticket.location.lat, ticket.location.lng, language)}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${statusConfig[ticket.status].className}`}>
                            {t(ticket.status)}
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Right Side - Recent Reports */}
          <div className="lg:w-[380px]">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">{t('recentTickets')}</h2>
                  <Link to="/my-tickets" className="text-sm text-[#C1272D] hover:underline">
                    {t('viewAll')}
                  </Link>
                </div>
                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search')}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
                {filteredTickets.map((ticket) => {
                  const StatusIcon = statusConfig[ticket.status].icon;
                  return (
                    <Link
                      key={ticket.id}
                      to={`/ticket/${ticket.id}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                        {ticket.images.length > 0 ? (
                          <img src={ticket.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          categoryIcons[ticket.category]
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-[#C1272D] transition-colors">
                          {ticket.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {getNeighborhood(ticket.location.lat, ticket.location.lng, language)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${statusConfig[ticket.status].className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {t(ticket.status)}
                          </span>
                          <span className="text-xs text-gray-400">
                            #{ticket.id.slice(-4)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-300 flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-gradient-to-br from-[#006233] to-[#1A8C5C] rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{isRTL ? 'بلاغاتي' : 'Mes signalements'}</h3>
                  <p className="text-sm text-white/70">{stats.total} {isRTL ? 'بلاغ' : 'signalements'}</p>
                </div>
              </div>
              <Link to="/my-tickets">
                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
                  {t('viewAll')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
