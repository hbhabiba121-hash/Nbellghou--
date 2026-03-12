import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { ArrowLeft, MapPin, Calendar, User, Clock, CheckCircle, AlertCircle, Send, MessageSquare, UserCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketsContext';
import type { TicketStatus } from '@/types';
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

const categoryIcons: Record<string, string> = {
  pothole: '🕳️',
  streetlight: '💡',
  garbage: '🗑️',
  graffiti: '🎨',
  canal: '🌊',
  other: '📍'
};

const statusConfig: Record<TicketStatus, { label: string; className: string; icon: typeof Clock; description: string }> = {
  pending: { 
    label: 'Signalé', 
    className: 'bg-red-50 text-red-600 border border-red-100',
    icon: Clock,
    description: 'Le signalement est en attente de traitement par la municipalité.'
  },
  in_progress: { 
    label: 'En cours', 
    className: 'bg-orange-50 text-orange-600 border border-orange-100',
    icon: AlertCircle,
    description: 'La municipalité est en train de traiter ce signalement.'
  },
  resolved: { 
    label: 'Résolu', 
    className: 'bg-green-50 text-green-600 border border-green-100',
    icon: CheckCircle,
    description: 'Le problème a été résolu.'
  },
  rejected: { 
    label: 'Rejeté', 
    className: 'bg-gray-50 text-gray-600 border border-gray-100',
    icon: AlertCircle,
    description: 'Ce signalement a été rejeté.'
  }
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const { getTicketById, updateTicketStatus } = useTickets();
  const navigate = useNavigate();

  const ticket = id ? getTicketById(id) : undefined;

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">{isRTL ? 'البلاغ غير موجود' : 'Signalement non trouvé'}</p>
          <Link to="/" className="text-[#C1272D] hover:underline mt-4 inline-block">
            {t('back')}
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[ticket.status].icon;
  const isAdmin = user?.role === 'admin';

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicketStatus(ticket.id, newStatus);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          {t('back')}
        </button>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Ticket Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                      {categoryIcons[ticket.category]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-xl font-bold text-gray-900">
                          {ticket.title}
                        </h1>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                          #{ticket.id.slice(-4)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ticket.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ticket.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-MA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${statusConfig[ticket.status].className}`}>
                    <StatusIcon className="w-4 h-4" />
                    {t(ticket.status)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {isRTL ? 'الوصف' : 'Description'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 rounded-2xl p-4">
                    {ticket.description}
                  </p>
                </div>

                {/* Status Info */}
                <div className={`p-5 rounded-2xl ${statusConfig[ticket.status].className}`}>
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`w-5 h-5 mt-0.5`} />
                    <div>
                      <h4 className="font-semibold">
                        {statusConfig[ticket.status].label}
                      </h4>
                      <p className="text-sm opacity-80 mt-1">
                        {statusConfig[ticket.status].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Images */}
                {ticket.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {isRTL ? 'الصور' : 'Photos'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {ticket.images.map((img, index) => (
                        <div key={index} className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                          <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {t('location')}
                  </h3>
                  <div className="h-[250px] rounded-2xl overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[ticket.location.lat, ticket.location.lng]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />
                      <Marker position={[ticket.location.lat, ticket.location.lng]} />
                    </MapContainer>
                  </div>
                  {ticket.location.address && (
                    <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C1272D]" />
                      {ticket.location.address}
                    </p>
                  )}
                </div>

                {/* Timeline */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isRTL ? 'سجل النشاط' : 'Historique'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-[#C1272D]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {isRTL ? 'تم إنشاء البلاغ' : 'Signalement créé'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleString(language === 'fr' ? 'fr-FR' : 'ar-MA')}
                        </p>
                      </div>
                    </div>
                    {ticket.status !== 'pending' && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {isRTL ? 'تم تحديث الحالة' : 'Statut mis à jour'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(ticket.updatedAt).toLocaleString(language === 'fr' ? 'fr-FR' : 'ar-MA')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Action Panel (Admin Only) */}
          {isAdmin && (
            <div className="space-y-6">
              {/* Actions Card */}
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('updateStatus')}
                </h3>
                <div className="space-y-3">
                  {ticket.status !== 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange('in_progress')}
                      className="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{isRTL ? 'بدء المعالجة' : 'Marquer en cours'}</p>
                        <p className="text-xs opacity-70">{isRTL ? 'البدء في معالجة البلاغ' : 'Commencer le traitement'}</p>
                      </div>
                    </button>
                  )}
                  {ticket.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange('resolved')}
                      className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{isRTL ? 'تحديد كمحلول' : 'Marquer comme résolu'}</p>
                        <p className="text-xs opacity-70">{isRTL ? 'تم حل المشكلة' : 'Problème résolu'}</p>
                      </div>
                    </button>
                  )}
                  {ticket.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange('rejected')}
                      className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{isRTL ? 'رفض البلاغ' : 'Rejeter le signalement'}</p>
                        <p className="text-xs opacity-70">{isRTL ? 'البلاغ غير صالح' : 'Signalement non valide'}</p>
                      </div>
                    </button>
                  )}
                  {ticket.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange('pending')}
                      className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{isRTL ? 'إعادة إلى الانتظار' : 'Remettre en attente'}</p>
                        <p className="text-xs opacity-70">{isRTL ? 'إعادة البلاغ للقائمة' : 'Retourner à la liste'}</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Citizen Info Card */}
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isRTL ? 'معلومات المواطن' : 'Informations du citoyen'}
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006233] to-[#1A8C5C] flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ticket.userName}</p>
                    <p className="text-sm text-gray-500">{t('citizen')}</p>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isRTL ? 'ملاحظات داخلية' : 'Notes internes'}
                </h3>
                <div className="space-y-3">
                  <textarea
                    placeholder={isRTL ? 'أضف ملاحظة...' : 'Ajouter une note...'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 min-h-[100px] resize-none"
                  />
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Send className="w-4 h-4" />
                    {isRTL ? 'إضافة ملاحظة' : 'Ajouter une note'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Citizen View - Quick Stats */}
          {!isAdmin && (
            <div className="space-y-6">
              {/* Status Help Card */}
              <div className="bg-gradient-to-br from-[#C1272D] to-[#E85A5F] rounded-3xl p-6 text-white">
                <h3 className="font-semibold mb-2">
                  {isRTL ? 'حالة بلاغك' : 'Statut de votre signalement'}
                </h3>
                <p className="text-sm text-white/80">
                  {statusConfig[ticket.status].description}
                </p>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isRTL ? 'هل تحتاج مساعدة؟' : 'Besoin d\'aide ?'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {isRTL 
                    ? 'يمكنك التواصل مع فريق الدعم إذا كان لديك أي استفسار'
                    : 'Vous pouvez contacter notre équipe de support pour toute question'}
                </p>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {isRTL ? 'تواصل معنا' : 'Contactez-nous'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
