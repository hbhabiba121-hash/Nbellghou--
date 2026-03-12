import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Camera, MapPin, X, Check, AlertCircle, Crosshair, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketsContext';
import type { TicketCategory } from '@/types';
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

const categories: { value: TicketCategory; label: string; icon: string }[] = [
  { value: 'pothole', label: 'pothole', icon: '🕳️' },
  { value: 'streetlight', label: 'streetlight', icon: '💡' },
  { value: 'garbage', label: 'garbage', icon: '🗑️' },
  { value: 'graffiti', label: 'graffiti', icon: '🎨' },
  { value: 'canal', label: 'canal', icon: '🌊' },
  { value: 'other', label: 'other', icon: '📍' },
];

// Location picker component
function LocationPicker({ 
  position, 
  onPositionChange 
}: { 
  position: [number, number] | null; 
  onPositionChange: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function PostTicketPage() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { addTicket } = useTickets();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as TicketCategory | '',
    images: [] as string[],
    location: null as [number, number] | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const rabatCenter: [number, number] = [34.0209, -6.8416];

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: [position.coords.latitude, position.coords.longitude]
          }));
        },
        () => {
          setError(t('errorLocation'));
        }
      );
    }
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.category) {
      setError(isRTL ? 'الرجاء اختيار الفئة' : 'Veuillez sélectionner une catégorie');
      return;
    }

    if (!formData.location) {
      setError(isRTL ? 'الرجاء تحديد الموقع على الخريطة' : 'Veuillez sélectionner un emplacement sur la carte');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    addTicket({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: 'pending',
      location: {
        lat: formData.location[0],
        lng: formData.location[1],
        address: 'Rabat, Morocco'
      },
      images: formData.images,
      userId: user?.id || '1'
    });

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      navigate('/my-tickets');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('ticketSubmitted')}
          </h2>
          <p className="text-gray-500">
            {isRTL ? 'شكراً لمساهمتك في تحسين مدينتنا!' : 'Merci de contribuer à améliorer notre ville !'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('newTicket')}
          </h1>
          <p className="text-gray-500">
            {isRTL ? 'أبلغ عن مشكلة في منطقتك' : 'Signalez un problème dans votre quartier'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8">
            {/* Category Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                {t('selectCategory')} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-4 rounded-2xl border-2 text-center transition-all ${
                      formData.category === cat.value
                        ? 'border-[#C1272D] bg-red-50'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{cat.icon}</span>
                    <span className={`text-xs font-medium ${
                      formData.category === cat.value ? 'text-[#C1272D]' : 'text-gray-600'
                    }`}>
                      {t(cat.label)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ticketTitle')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={isRTL ? 'مثال: حفرة في الطريق' : 'Ex: Nid de poule sur la route'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ticketDescription')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={isRTL ? 'صف المشكلة بالتفصيل...' : 'Décrivez le problème en détail...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all min-h-[120px] resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Photo Upload Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {t('addPhoto')}
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            {formData.images.length === 0 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-[#C1272D] bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-1">{t('dropPhotos')}</p>
                <p className="text-gray-400 text-sm">{t('orClickToUpload')}</p>
              </div>
            )}

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#C1272D] hover:text-[#C1272D] hover:bg-red-50 transition-all"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs">{t('addPhoto')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('location')} <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center gap-2 text-sm text-[#C1272D] hover:underline"
              >
                <Crosshair className="w-4 h-4" />
                {t('currentLocation')}
              </button>
            </div>
            
            <div className="h-[300px] rounded-2xl overflow-hidden border border-gray-200">
              <MapContainer
                center={formData.location || rabatCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <LocationPicker
                  position={formData.location}
                  onPositionChange={(pos) => setFormData(prev => ({ ...prev, location: pos }))}
                />
              </MapContainer>
            </div>
            
            {formData.location && (
              <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C1272D]" />
                {formData.location[0].toFixed(6)}, {formData.location[1].toFixed(6)}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#C1272D] to-[#E85A5F] text-white py-4 rounded-2xl text-base font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('loading')}
              </span>
            ) : (
              t('submit')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
