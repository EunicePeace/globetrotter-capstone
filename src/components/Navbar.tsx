import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Wallet, 
  Mic, 
  Languages, 
  Bot, 
  Cpu, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  Bell, 
  ShieldAlert,
  Globe2,
  Share2
} from 'lucide-react';
import { TravelAlert } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  lang: 'en' | 'fr';
  setLang: (lang: 'en' | 'fr') => void;
  currency: 'XAF' | 'USD';
  setCurrency: (c: 'XAF' | 'USD') => void;
  alerts: TravelAlert[];
  onOpenSOS: () => void;
  pinnedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
  lang,
  setLang,
  currency,
  setCurrency,
  alerts,
  onOpenSOS,
  pinnedCount
}) => {
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);

  const navItems = [
    { id: 'sites', labelEn: 'Sites & Places', labelFr: 'Sites & Lieux', icon: Compass },
    { id: 'map', labelEn: 'Interactive Map', labelFr: 'Carte Interactive', icon: MapPin, badge: pinnedCount > 0 ? pinnedCount : null },
    { id: 'itinerary', labelEn: 'Itinerary Planner', labelFr: 'Itinéraires', icon: Calendar },
    { id: 'budget', labelEn: 'Budget Tracker', labelFr: 'Budget', icon: Wallet },
    { id: 'diary', labelEn: 'Voice Journal', labelFr: 'Journal Vocal', icon: Mic },
    { id: 'translator', labelEn: 'Translator', labelFr: 'Traducteur', icon: Languages },
    { id: 'ai', labelEn: 'AI Travel Assistant', labelFr: 'Assistant IA', icon: Bot },
    { id: 'architecture', labelEn: 'System Architecture', labelFr: 'Architecture CS4122', icon: Cpu }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-600 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-blue-700">
            <Globe2 className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>GlobeTrotter Yaoundé</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 hidden sm:inline text-[11px]">ICT University CS4122 Distributed Travel Engine</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'XAF' ? 'USD' : 'XAF')}
            className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-blue-700 font-mono font-medium transition-colors"
            title="Toggle currency view"
          >
            Currency: {currency === 'XAF' ? 'FCFA (XAF)' : 'USD ($)'}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
            className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
          >
            {lang === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
          </button>

          {/* Offline Mode Switch */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors border ${
              isOffline 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
            title="Toggle offline map mode"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="hidden md:inline">{isOffline ? 'Offline Map Mode' : 'Online Sync'}</span>
          </button>

          {/* Notification Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="relative p-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Real-time Travel Alerts"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Alerts Dropdown */}
            {showAlertsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 text-slate-800">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <h4 className="font-bold text-xs flex items-center gap-1.5 text-amber-700">
                    <AlertTriangle className="w-4 h-4" /> Real-time Yaoundé Alerts
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">{alerts.length} active</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {alerts.map((a) => (
                    <div key={a.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-slate-500 font-medium">
                        <span className="text-blue-700 font-bold capitalize">{a.type} • {a.quarter || 'Yaoundé'}</span>
                        <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                      </div>
                      <p className="font-semibold text-slate-900 mt-0.5">{a.title}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span>{lang === 'en' ? item.labelEn : item.labelFr}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
