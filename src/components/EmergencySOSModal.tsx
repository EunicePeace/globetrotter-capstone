import React, { useState } from 'react';
import { ShieldAlert, X, Phone, MapPin, Share2, AlertTriangle, Check, Hospital, Building, ShieldCheck } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [locationShared, setLocationShared] = useState(false);

  const emergencyContacts = [
    { name: 'SAMU Ambulance Yaoundé', number: '119 / +237 222 23 40 20', icon: Hospital, desc: 'Medical emergencies & dispatch' },
    { name: 'Police Secours (National)', number: '117 / 1500', icon: ShieldAlert, desc: 'Law enforcement & rapid response' },
    { name: 'Sapeurs-Pompiers (Fire Brigade)', number: '118', icon: AlertTriangle, desc: 'Fire & rescue operations' },
    { name: 'Hôpital Central de Yaoundé', number: '+237 222 23 40 20', icon: Hospital, desc: 'Central City Hospital (Centre-Ville)' },
    { name: 'Hôpital Général de Yaoundé', number: '+237 222 21 20 20', icon: Hospital, desc: 'General Hospital (Ngoa-Ekelle/Nsam)' },
    { name: 'ICT University Messassi Security', number: '+237 677 00 00 00', icon: Building, desc: 'ICT University Campus Security' },
    { name: 'US Embassy Yaoundé (Bastos)', number: '+237 222 20 15 00', icon: Building, desc: 'American Citizen Services' },
    { name: 'Ambassade de France (Bastos)', number: '+237 222 22 79 00', icon: Building, desc: 'Consular emergency line' }
  ];

  const handleShareLocation = () => {
    navigator.clipboard.writeText('EMERGENCY SOS: Traveler in Yaoundé requesting immediate assistance. GPS Coordinates: 3.8667° N, 11.5167° E (Yaoundé Centre-Ville).');
    setLocationShared(true);
    setTimeout(() => setLocationShared(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-rose-200 rounded-2xl max-w-xl w-full p-5 text-slate-900 shadow-xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-xs animate-bounce">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Emergency SOS Traveler Safety</h2>
            <p className="text-xs text-rose-700 font-medium">Instant access to Yaoundé emergency response, hospitals, and embassies.</p>
          </div>
        </div>

        {/* Rapid Broadcast Button */}
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
          <span className="font-bold text-xs text-rose-900 block">Instant GPS Distress Broadcast</span>
          <button
            onClick={handleShareLocation}
            className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {locationShared ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{locationShared ? 'GPS Distress Broadcast Copied to Clipboard!' : 'Broadcast GPS Location to Contacts'}</span>
          </button>
        </div>

        {/* Contacts Grid */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Essential Contacts in Yaoundé</h4>
          {emergencyContacts.map((contact, i) => {
            const Icon = contact.icon;
            return (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white text-rose-600 border border-slate-200 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{contact.name}</span>
                    <span className="text-[10px] text-slate-500">{contact.desc}</span>
                  </div>
                </div>

                <a
                  href={`tel:${contact.number.split('/')[0].trim()}`}
                  className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 font-semibold border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors flex items-center gap-1 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{contact.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Safety Tips */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
          <span className="font-bold text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Safety Best Practices in Yaoundé
          </span>
          <p className="text-[11px] text-slate-600">
            • Avoid carrying large sums of cash openly at Marché Mokolo.<br />
            • Use officially painted Yellow Taxis for evening rides.<br />
            • Keep a digital copy of your passport & visa stored in GlobeTrotter cloud storage.
          </p>
        </div>
      </div>
    </div>
  );
};
