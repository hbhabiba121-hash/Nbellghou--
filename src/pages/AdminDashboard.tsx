import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, MapPin, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, Timer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
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

const categoryIcons: Record<TicketCategory, string> = {
  pothole: '🕳️',
  streetlight: '💡',
  garbage: '🗑️',
  graffiti: '🎨',
  canal: '🌊',
  other: '📍'
};

const categoryColors: Record<TicketCategory, string> = {
  pothole: '#DC2626',
  streetlight: '#2563EB',
  garbage: '#16A34A',
  graffiti: '#9333EA',
  canal: '#0891B2',
  other: '#6B7280'
};

const statusColors = {
  pending: '#DC2626',
  in_progress: '#F97316',
  resolved: '#16A34A',
  rejected: '#6B7280'
};

const statusConfig: Record<TicketStatus, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: 'Signalé', className: 'bg-red-50 text-red-600 border border-red-100', icon: Clock },
  in_progress: { label: 'En cours', className: 'bg-orange-50 text-orange-600 border border-orange-100', icon: AlertCircle },
  resolved: { label: 'Résolu', className: 'bg-green-50 text-green-600 border border-green-100', icon: CheckCircle },
  rejected: { label: 'Rejeté', className: 'bg-gray-50 text-gray-600 border border-gray-100', icon: XCircle }
};

export default function AdminDashboard() {
  const { t, isRTL } = useLanguage();
  const { tickets, stats, updateTicketStatus } = useTickets();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'map'>('overview');

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = !searchQuery || 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  // Chart data
  const statusChartData = [
    { name: t('reported'), value: stats.pendingTickets, color: statusColors.pending },
    { name: t('in_progress'), value: stats.inProgressTickets, color: statusColors.in_progress },
    { name: t('resolved'), value: stats.resolvedTickets, color: statusColors.resolved },
    { name: t('rejected'), value: stats.rejectedTickets, color: statusColors.rejected },
  ];

  const categoryChartData = Object.entries(stats.ticketsByCategory).map(([cat, count]) => ({
    name: t(cat as TicketCategory),
    value: count,
    color: categoryColors[cat as TicketCategory]
  }));

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateTicketStatus(ticketId, newStatus);
  };

  const rabatCenter: [number, number] = [34.0209, -6.8416];

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {t('dashboard')}
            </h1>
            <p className="text-gray-500 text-sm">
              {isRTL ? 'لوحة تحكم الإدارة' : 'Tableau de bord administrateur'}
            </p>
          </div>
        </div>

        {/* Stats Overview - Modern Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: t('totalTickets'), 
              value: stats.totalTickets, 
              icon: TrendingUp, 
              color: 'bg-gradient-to-br from-gray-900 to-gray-800 text-white',
              shadow: 'shadow-gray-900/20'
            },
            { 
              label: t('openTickets'), 
              value: stats.pendingTickets + stats.inProgressTickets, 
              icon: AlertCircle, 
              color: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
              shadow: 'shadow-orange-500/20'
            },
            { 
              label: t('resolvedTickets'), 
              value: stats.resolvedTickets, 
              icon: CheckCircle, 
              color: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
              shadow: 'shadow-green-500/20'
            },
            { 
              label: t('avgResolutionTime'), 
              value: '3.2j', 
              icon: Timer, 
              color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
              shadow: 'shadow-blue-500/20'
            },
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl ${stat.color} shadow-lg ${stat.shadow}`}>
              <stat.icon className="w-6 h-6 mb-3 opacity-80" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: isRTL ? 'نظرة عامة' : 'Vue d\'ensemble' },
            { id: 'tickets', label: isRTL ? 'البلاغات' : 'Signalements' },
            { id: 'map', label: isRTL ? 'الخريطة' : 'Carte' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Status Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-6">
                {t('ticketsByStatus')}
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {statusChartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-6">
                {t('ticketsByCategory')}
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('recentActivity')}
              </h3>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {categoryIcons[ticket.category]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{ticket.title}</p>
                      <p className="text-sm text-gray-500">{ticket.userName}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-medium ${statusConfig[ticket.status].className}`}>
                      {t(ticket.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isRTL ? 'البحث في البلاغات...' : 'Rechercher des signalements...'}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                  >
                    <option value="all">{t('all')} {t('status')}</option>
                    <option value="pending">{t('reported')}</option>
                    <option value="in_progress">{t('in_progress')}</option>
                    <option value="resolved">{t('resolved')}</option>
                    <option value="rejected">{t('rejected')}</option>
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | 'all')}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                  >
                    <option value="all">{t('all')} {t('categories')}</option>
                    {Object.keys(categoryIcons).map((cat) => (
                      <option key={cat} value={cat}>{t(cat as TicketCategory)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('categories')}</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('ticketTitle')}</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('location')}</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('reportedBy')}</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('status')}</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('reportedOn')}</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('updateStatus')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTickets.map((ticket) => {
                      const StatusIcon = statusConfig[ticket.status].icon;
                      return (
                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-gray-500">#{ticket.id.slice(-4)}</td>
                          <td className="px-6 py-4">
                            <span className="text-2xl">{categoryIcons[ticket.category]}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{ticket.title}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {ticket.location.address || 'Rabat'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{ticket.userName}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${statusConfig[ticket.status].className}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {t(ticket.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {ticket.status !== 'in_progress' && (
                                <button
                                  onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                                  className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
                                >
                                  {isRTL ? 'بدء' : 'Start'}
                                </button>
                              )}
                              {ticket.status !== 'resolved' && (
                                <button
                                  onClick={() => handleStatusChange(ticket.id, 'resolved')}
                                  className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                                >
                                  {isRTL ? 'حل' : 'Resolve'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="h-[600px] rounded-2xl overflow-hidden">
              <MapContainer
                center={rabatCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {tickets.map((ticket) => (
                  <Marker
                    key={ticket.id}
                    position={[ticket.location.lat, ticket.location.lng]}
                  >
                    <Popup className="rounded-2xl overflow-hidden">
                      <div className="p-3 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{categoryIcons[ticket.category]}</span>
                          <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{ticket.userName}</p>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[ticket.status].className}`}>
                          {t(ticket.status)}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
