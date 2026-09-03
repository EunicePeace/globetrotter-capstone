import React from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Navigation, 
  Bus, 
  DollarSign, 
  Bookmark, 
  Calendar, 
  Mic, 
  Bot, 
  History, 
  Info, 
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import { Site } from '../types';

interface SiteDetailModalProps {
  site: Site | null;
  onClose: () => void;
  currency: 'XAF' | 'USD';
  isPinned: boolean;
  onTogglePin: (siteId: string) => void;
  onAddToItinerary: (site: Site) => void;
  onAskAiAboutSite: (siteName: string) => void;
  onRecordVoiceJournal: (site: Site) => void;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  currency,
  isPinned,
  onTogglePin,
  onAddToItinerary,
  onAskAiAboutSite,
  onRecordVoiceJournal
}) => {
  if (!site) return null;

  const [copied, setCopied] = React.useState(false);

  const priceDisplay = currency === 'XAF'
    ? `${site.priceEstimateXAF.toLocaleString()} FCFA`
    : `$${site.priceEstimateUSD.toFixed(2)}`;

  const entranceDisplay = currency === 'XAF'
    ? `${site.entranceFeeXAF.toLocaleString()} FCFA`
    : `$${site.entranceFeeUSD.toFixed(2)}`;

  const handleShare = () => {
    navigator.clipboard.writeText(`Explore ${site.name} in Yaoundé on GlobeTrotter! Historical context: ${site.historicalContext}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto text-slate-900 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-slate-700 hover:text-slate-900 hover:bg-white shadow-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Image */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-100">
          <img
            src={site.image}
            alt={site.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {site.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/90 text-amber-300 border border-slate-700">
                  📍 {site.quarter}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                  {site.budgetTier}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                {site.name}
              </h2>
              <p className="text-xs text-slate-200 italic">{site.frenchName}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTogglePin(site.id)}
                className={`p-2 rounded-full backdrop-blur-xs transition-all ${
                  isPinned ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-900/80 text-white'
                }`}
                title={isPinned ? 'Unpin location' : 'Pin to map'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-slate-900/80 text-white hover:text-amber-300 transition-all"
                title="Share location details"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Travel Time</span>
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                {site.estimatedTimeMinutes} mins
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Est. Total Cost</span>
              <span className="font-bold text-blue-700 text-sm flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                {priceDisplay}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Entrance Fee</span>
              <span className="font-bold text-slate-900 text-sm">
                {site.entranceFeeXAF === 0 ? 'Free Entry' : entranceDisplay}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Rec. Duration</span>
              <span className="font-bold text-slate-900 text-sm">
                {site.recommendedDurationMinutes} mins
              </span>
            </div>
          </div>

          {/* Historical Context Backstory */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
              <History className="w-4 h-4 text-blue-700" />
              Historical Context & Origin
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {site.historicalContext}
            </p>
          </div>

          {/* Description & Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Info className="w-4 h-4 text-blue-600" />
              Overview & Highlights
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {site.description}
            </p>
          </div>

          {/* Destination Path & Route Directions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
              <Navigation className="w-4 h-4 text-amber-600" />
              Destination Path & Navigation Directions
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {site.routeDirections}
            </p>

            {/* Means of Transportation */}
            <div className="mt-3 pt-2.5 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                Recommended Means of Transport:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {site.meansOfTransport.map((t, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-white text-xs font-medium text-slate-800 border border-slate-200 flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Insider Local Tip */}
          {site.insiderTip && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-950 mb-0.5">Local Insider Tip</span>
                {site.insiderTip}
              </div>
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => onAddToItinerary(site)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Itinerary</span>
            </button>

            <button
              onClick={() => onRecordVoiceJournal(site)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>Voice Journal Entry</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onAskAiAboutSite(site.name);
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-xs transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
