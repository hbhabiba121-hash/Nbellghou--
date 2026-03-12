import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Plus, MapPin, Search, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketsContext';
import type { TicketStatus, TicketCategory } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Status colors for markers
const statusColors: Record<TicketStatus, string> = {
  pending: '#DC2626',
  in_progress: '#F97316',
  resolved: '#16A34A',
  rejected: '#6B7280'
};

// Custom marker icons by status
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
  pending: { 
    label: 'Signalé', 
    className: 'bg-red-50 text-red-600 border border-red-100',
    icon: Clock 
  },
  in_progress: { 
    label: 'En cours', 
    className: 'bg-orange-50 text-orange-600 border border-orange-100',
    icon: AlertCircle 
  },
  resolved: { 
    label: 'Résolu', 
    className: 'bg-green-50 text-green-600 border border-green-100',
    icon: CheckCircle 
  },
  rejected: { 
    label: 'Rejeté', 
    className: 'bg-gray-50 text-gray-600 border border-gray-100',
    icon: Clock 
  }
};

// Neighborhoods with approximate coordinates
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

// Get nearest neighborhood
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

export default function HomePage() {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { tickets } = useTickets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = useMemo(() => {
    if (!searchQuery) return tickets.slice(0, 10);
    return tickets.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10);
  }, [tickets, searchQuery]);

  // Rabat coordinates
  const rabatCenter: [number, number] = [34.0209, -6.8416];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#F7F8FA]">
      {/* Hero Tagline */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('tagline')}</h1>
            <p className="text-sm text-gray-500">{t('taglineSub')}</p>
          </div>
          {isAuthenticated && user?.role === 'citizen' && (
            <Link to="/report">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] transition-all">
                <Plus className="w-4 h-4" />
                {t('reportIssue')}
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={rabatCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {tickets.map((ticket) => (
              <Marker
                key={ticket.id}
                position={[ticket.location.lat, ticket.location.lng]}
                icon={getStatusIcon(ticket.status)}
              >
                <Popup className="rounded-2xl overflow-hidden">
                  <div className="p-3 min-w-[240px]">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {categoryIcons[ticket.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{ticket.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{getNeighborhood(ticket.location.lat, ticket.location.lng, language)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[ticket.status].className}`}>
                      {(() => {
                        const Icon = statusConfig[ticket.status].icon;
                        return <Icon className="w-3 h-3" />;
                      })()}
                      {t(ticket.status)}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Report Button on Map */}
          {isAuthenticated && user?.role === 'citizen' && (
            <Link to="/report" className="absolute bottom-6 left-6 z-[400]">
              <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white rounded-2xl text-sm font-semibold shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all">
                <Plus className="w-5 h-5" />
                {t('reportIssue')}
              </button>
            </Link>
          )}
        </div>

        {/* Right Side - Tickets Panel */}
        <div className={`w-[400px] bg-white border-l border-gray-100 flex flex-col ${isRTL ? 'border-r border-l-0' : ''}`}>
          {/* Panel Header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-1">{t('issuesNearYou')}</h2>
            <p className="text-xs text-gray-500">{t('exploreMap')}</p>
            
            {/* Search */}
            <div className="relative mt-4">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-10 pl-4' : ''}`}
              />
            </div>
          </div>

          {/* Tickets List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredTickets.map((ticket, index) => {
              const StatusIcon = statusConfig[ticket.status].icon;
              return (
                <Link
                  key={ticket.id}
                  to={`/ticket/${ticket.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-red-100 transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Image or Category Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {ticket.images.length > 0 ? (
                        <img src={ticket.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        categoryIcons[ticket.category]
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-[#C1272D] transition-colors">
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
                          {new Date(ticket.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-MA', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-[#C1272D] transition-colors flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-gray-100">
            <Link to="/my-tickets" className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-[#C1272D] hover:bg-red-50 rounded-xl transition-colors">
              {t('viewAll')}
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
