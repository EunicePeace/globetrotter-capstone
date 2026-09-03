import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Share2, 
  Users, 
  DollarSign, 
  Clock, 
  Check, 
  Copy, 
  Sparkles, 
  MapPin, 
  Send 
} from 'lucide-react';
import { Site, Itinerary, ItineraryItem } from '../types';

interface ItineraryPlannerProps {
  sites: Site[];
  itineraries: Itinerary[];
  onSaveItinerary: (itinerary: Itinerary) => void;
  currency: 'XAF' | 'USD';
  onSelectSite: (site: Site) => void;
}

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  sites,
  itineraries,
  onSaveItinerary,
  currency,
  onSelectSite
}) => {
  const [activeItinerary, setActiveItinerary] = useState<Itinerary>(
    itineraries[0] || {
      id: 'itinerary-default',
      title: 'My Yaoundé Heritage & Culture Tour',
      description: 'A 3-day exploration of Yaoundé historical monuments, museums, and local markets.',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      items: [
        { id: 'item-1', siteId: 'site-1', timeSlot: '09:00', dayNumber: 1, notes: 'Morning photo tour at Reunification Monument' },
        { id: 'item-2', siteId: 'site-2', timeSlot: '11:30', dayNumber: 1, notes: 'Explore National Museum royal exhibits' },
        { id: 'item-3', siteId: 'site-3', timeSlot: '15:00', dayNumber: 2, notes: 'Hike Mont Fébé & visit Benedictine Monastery' }
      ],
      totalCostXAF: 7000,
      totalCostUSD: 11.55,
      createdBy: 'You (Traveler)',
      isGroup: true,
      shareCode: 'GT-YAO-9842',
      groupMembers: ['You', 'Marc (ICT-U)', 'Sarah (Explorer)']
    }
  );

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  // Calculate totals
  const totalXAF = activeItinerary.items.reduce((acc, item) => {
    const s = sites.find((x) => x.id === item.siteId);
    return acc + (s ? s.priceEstimateXAF : 0);
  }, 0);

  const totalUSD = totalXAF / 606; // Approx XAF to USD rate

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = activeItinerary.items.filter((i) => i.id !== itemId);
    const updatedItinerary = {
      ...activeItinerary,
      items: updatedItems,
      totalCostXAF: totalXAF,
      totalCostUSD: totalUSD
    };
    setActiveItinerary(updatedItinerary);
    onSaveItinerary(updatedItinerary);
  };

  const handleAddItem = (site: Site) => {
    const newItem: ItineraryItem = {
      id: `item-${Date.now()}`,
      siteId: site.id,
      timeSlot: '14:00',
      dayNumber: selectedDay,
      notes: `Visit ${site.name}`
    };

    const updatedItinerary = {
      ...activeItinerary,
      items: [...activeItinerary.items, newItem],
      totalCostXAF: totalXAF + site.priceEstimateXAF,
      totalCostUSD: (totalXAF + site.priceEstimateXAF) / 606
    };

    setActiveItinerary(updatedItinerary);
    onSaveItinerary(updatedItinerary);
    setShowAddSiteModal(false);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const updated = {
      ...activeItinerary,
      groupMembers: [...activeItinerary.groupMembers, newMemberName.trim()]
    };
    setActiveItinerary(updated);
    onSaveItinerary(updated);
    setNewMemberName('');
  };

  const copyShareCode = () => {
    navigator.clipboard.writeText(activeItinerary.shareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Group Collaborative Planning
            </span>
            <span className="text-xs text-slate-500 font-mono">Code: {activeItinerary.shareCode}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">{activeItinerary.title}</h2>
          <p className="text-xs text-slate-600 max-w-xl">{activeItinerary.description}</p>
        </div>

        {/* Group Share Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <button
            onClick={copyShareCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Code Copied!' : 'Share Group Code'}</span>
          </button>

          <div className="flex items-center gap-1 text-xs text-slate-700 font-semibold px-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span>{activeItinerary.groupMembers.length} Members</span>
          </div>
        </div>
      </div>

      {/* Group Members Row */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Co-Explorers:</span>
          <div className="flex flex-wrap gap-1.5">
            {activeItinerary.groupMembers.map((m, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-blue-800 font-semibold border border-slate-200">
                👤 {m}
              </span>
            ))}
          </div>
        </div>

        {/* Add Member Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Invite friend by name..."
            className="bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-md px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={handleAddMember}
            className="px-2.5 py-1.5 rounded-md bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            + Invite
          </button>
        </div>
      </div>

      {/* Main Day Selector & Cost Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 space-y-3">
          {/* Day Tabs */}
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedDay === day
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddSiteModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-500 text-white font-bold text-xs shadow-xs hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Site to Day {selectedDay}</span>
            </button>
          </div>

          {/* Schedule List for Selected Day */}
          <div className="space-y-2.5">
            {activeItinerary.items.filter((i) => i.dayNumber === selectedDay).length === 0 ? (
              <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-1.5 shadow-xs">
                <Calendar className="w-7 h-7 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No stops scheduled for Day {selectedDay} yet</p>
                <p className="text-xs text-slate-500">Click "+ Add Site to Day {selectedDay}" to select from 50+ Yaoundé locations.</p>
              </div>
            ) : (
              activeItinerary.items
                .filter((i) => i.dayNumber === selectedDay)
                .map((item) => {
                  const site = sites.find((s) => s.id === item.siteId);
                  if (!site) return null;

                  return (
                    <div key={item.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 hover:border-blue-400 shadow-2xs transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={site.image}
                          alt={site.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-700">⏰ {item.timeSlot}</span>
                            <span className="text-xs text-slate-500">📍 {site.quarter}</span>
                          </div>
                          <h4 
                            onClick={() => onSelectSite(site)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors text-sm"
                          >
                            {site.name}
                          </h4>
                          <p className="text-xs text-slate-500">{item.notes}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs">
                          <span className="font-bold text-blue-700 block">
                            {currency === 'XAF' ? `${site.priceEstimateXAF.toLocaleString()} FCFA` : `$${site.priceEstimateUSD.toFixed(2)}`}
                          </span>
                          <span className="text-slate-500 text-[10px]">⏱ {site.estimatedTimeMinutes} mins travel</span>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 rounded-md bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Remove from itinerary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Cost & Summary Sidebar */}
        <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            Estimated Total Expenses
          </h3>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Total Scheduled Stops:</span>
              <span className="font-bold text-slate-900">{activeItinerary.items.length} sites</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Estimated Transport & Tickets:</span>
              <span className="font-bold text-blue-700 text-sm">
                {currency === 'XAF' ? `${totalXAF.toLocaleString()} FCFA` : `$${totalUSD.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed space-y-1">
            <span className="font-bold block text-emerald-800">💡 Smart Travel Tip</span>
            <p>Group travelers in Yaoundé can save up to 40% on Yellow Taxi courses by sharing "Depôt" fares between central quarters.</p>
          </div>
        </div>
      </div>

      {/* Add Site Modal Picker */}
      {showAddSiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-5 space-y-3 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-blue-700">Add Location to Day {selectedDay}</h3>
              <button
                onClick={() => setShowAddSiteModal(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-500 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={site.image} alt={site.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{site.name}</h5>
                      <span className="text-[11px] text-slate-500">📍 {site.quarter} • {site.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddItem(site)}
                    className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                  >
                    + Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
