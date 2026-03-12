import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTickets } from '@/context/TicketsContext';
import type { TicketStatus, TicketCategory } from '@/types';

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

export default function MyTicketsPage() {
  const { t, isRTL, language } = useLanguage();
  const { userTickets } = useTickets();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  const filteredTickets = useMemo(() => {
    return userTickets.filter(ticket => {
      const matchesSearch = !searchQuery || 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [userTickets, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: userTickets.length,
    pending: userTickets.filter(t => t.status === 'pending').length,
    inProgress: userTickets.filter(t => t.status === 'in_progress').length,
    resolved: userTickets.filter(t => t.status === 'resolved').length,
  }), [userTickets]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {t('myTickets')}
            </h1>
            <p className="text-gray-500 text-sm">
              {isRTL ? 'تتبع بلاغاتك ومتابعة حالتها' : 'Suivez vos signalements et leur statut'}
            </p>
          </div>
          <Link to="/report">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] transition-all">
              <Plus className="w-4 h-4" />
              {t('reportIssue')}
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: isRTL ? 'الإجمالي' : 'Total', value: stats.total, color: 'bg-gray-900 text-white' },
            { label: t('reported'), value: stats.pending, color: 'bg-red-50 text-red-600 border border-red-100' },
            { label: t('in_progress'), value: stats.inProgress, color: 'bg-orange-50 text-orange-600 border border-orange-100' },
            { label: t('resolved'), value: stats.resolved, color: 'bg-green-50 text-green-600 border border-green-100' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-2xl ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'البحث في البلاغات...' : 'Rechercher dans vos signalements...'}
                className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
              >
                <option value="all">{t('all')}</option>
                <option value="pending">{t('reported')}</option>
                <option value="in_progress">{t('in_progress')}</option>
                <option value="resolved">{t('resolved')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? 'لا توجد بلاغات' : 'Aucun signalement'}
            </h3>
            <p className="text-gray-500 mb-6">
              {isRTL ? 'لم تقم بإرسال أي بلاغات بعد' : 'Vous n\'avez pas encore fait de signalements'}
            </p>
            <Link to="/report">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all mx-auto">
                <Plus className="w-4 h-4" />
                {t('reportIssue')}
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTickets.map((ticket, index) => {
              const StatusIcon = statusConfig[ticket.status].icon;
              return (
                <Link
                  key={ticket.id}
                  to={`/ticket/${ticket.id}`}
                  className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-red-100 border border-transparent transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="h-40 rounded-2xl bg-gray-100 mb-4 overflow-hidden">
                    {ticket.images.length > 0 ? (
                      <img src={ticket.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {categoryIcons[ticket.category]}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium ${statusConfig[ticket.status].className}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {t(ticket.status)}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        #{ticket.id.slice(-4)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#C1272D] transition-colors">
                      {ticket.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {ticket.location.address || 'Rabat'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ticket.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-MA', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
