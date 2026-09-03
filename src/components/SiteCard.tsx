import React from 'react';
import { Clock, MapPin, Bus, DollarSign, Bookmark, ArrowRight, Star, Compass } from 'lucide-react';
import { Site } from '../types';

interface SiteCardProps {
  site: Site;
  currency: 'XAF' | 'USD';
  isPinned: boolean;
  onTogglePin: (siteId: string) => void;
  onSelectSite: (site: Site) => void;
  onAddToItinerary: (site: Site) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  currency,
  isPinned,
  onTogglePin,
  onSelectSite,
  onAddToItinerary
}) => {
  const priceDisplay = currency === 'XAF'
    ? `${site.priceEstimateXAF.toLocaleString()} FCFA`
    : `$${site.priceEstimateUSD.toFixed(2)}`;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all group flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={site.image}
            alt={site.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

          {/* Quarter & Category Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white shadow-xs">
              {site.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/90 text-slate-800 backdrop-blur-md border border-slate-200 shadow-xs">
              📍 {site.quarter}
            </span>
          </div>

          {/* Quick Pin Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(site.id);
            }}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-md backdrop-blur-md transition-transform active:scale-90 ${
              isPinned
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white/80 text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200'
            }`}
            title={isPinned ? 'Unpin location from map' : 'Pin location to interactive map'}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Rating */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-amber-700 font-bold text-[11px] bg-white/95 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{site.rating}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3.5">
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {site.name}
          </h3>
          <p className="text-[11px] text-slate-500 italic mb-1.5 line-clamp-1">
            {site.frenchName}
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 mb-2.5 leading-relaxed">
            {site.description}
          </p>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{site.estimatedTimeMinutes} mins away</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-blue-700">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              <span>{priceDisplay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-3.5 pt-0 grid grid-cols-2 gap-2 mt-1">
        <button
          onClick={() => onSelectSite(site)}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Details</span>
        </button>

        <button
          onClick={() => onAddToItinerary(site)}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Add Trip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
