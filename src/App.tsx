import React, { useState, useEffect } from 'react';
import { YAOUNDE_SITES } from './data/yaoundeSites';
import { Site, Itinerary, Expense, JournalEntry, TravelAlert } from './types';
import { Navbar } from './components/Navbar';
import { SiteExplorer } from './components/SiteExplorer';
import { InteractiveMap } from './components/InteractiveMap';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { BudgetPlanner } from './components/BudgetPlanner';
import { TravelDiary } from './components/TravelDiary';
import { TranslatorWidget } from './components/TranslatorWidget';
import { AiTravelAssistant } from './components/AiTravelAssistant';
import { PhaseArchitectureViewer } from './components/PhaseArchitectureViewer';
import { SiteDetailModal } from './components/SiteDetailModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('sites');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [currency, setCurrency] = useState<'XAF' | 'USD'>('XAF');

  // Pinned Map Sites State (LocalStorage persisted)
  const [pinnedSiteIds, setPinnedSiteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('globetrotter_pinned_sites');
      return saved ? JSON.parse(saved) : ['site-1', 'site-2', 'site-3'];
    } catch {
      return ['site-1', 'site-2', 'site-3'];
    }
  });

  // Selected site for detail modal
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  // SOS Modal State
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // AI Assistant Initial Query Trigger
  const [aiInitialQuery, setAiInitialQuery] = useState('');

  // Alerts State
  const [alerts, setAlerts] = useState<TravelAlert[]>([]);

  // Expenses State
  const [expenses, setExpenses] = useState<Expense[]>(() => [
    { id: 'exp-1', category: 'transport', description: 'Yellow Taxi from Post Office to Bastos', amountXAF: 500, date: new Date().toLocaleDateString() },
    { id: 'exp-2', category: 'entrance', description: 'National Museum Ticket', amountXAF: 2000, date: new Date().toLocaleDateString() },
    { id: 'exp-3', category: 'food', description: 'Braised Carp & Bobolo in Bastos', amountXAF: 3500, date: new Date().toLocaleDateString() }
  ]);

  // Journal Entries State
  const [journals, setJournals] = useState<JournalEntry[]>(() => [
    {
      id: 'journal-1',
      date: new Date().toLocaleDateString(),
      locationId: 'site-1',
      locationName: 'Reunification Monument',
      title: 'Historical Reflection at Ngoa-Ekelle',
      content: 'Standing beneath the spiraling concrete monument in Yaoundé felt deeply inspiring. The twin spirals representing the 1961 union of British and French Cameroon are magnificent.',
      photoUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
      likes: 12,
      commentsCount: 3,
      isPublic: true,
      author: 'Marie (Traveler)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'journal-2',
      date: new Date().toLocaleDateString(),
      locationId: 'site-3',
      locationName: 'Mont Fébé & Benedictine Monastery',
      title: 'Cool Mountain Air overlooking Yaoundé',
      content: 'Escaped the afternoon heat by heading up Mont Fébé. Visited the museum of traditional African art inside the monastery and watched the sun set over the seven hills.',
      photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
      likes: 18,
      commentsCount: 5,
      isPublic: true,
      author: 'Jean-Marc (ICT-U Student)',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  // Itineraries State
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  // Fetch real-time alerts from backend server
  useEffect(() => {
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) setAlerts(data.alerts);
      })
      .catch((e) => console.warn('Offline mode: Could not fetch live alerts'));
  }, []);

  // Save pinned sites to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('globetrotter_pinned_sites', JSON.stringify(pinnedSiteIds));
    } catch {}
  }, [pinnedSiteIds]);

  const handleTogglePin = (siteId: string) => {
    setPinnedSiteIds((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  const handleAskAiAboutSite = (siteName: string) => {
    setAiInitialQuery(`Tell me the detailed historical context and secret tips for visiting ${siteName} in Yaoundé.`);
    setActiveTab('ai');
  };

  const handleRecordVoiceJournal = (site: Site) => {
    setActiveTab('diary');
  };

  const handleAddToItinerary = (site: Site) => {
    setActiveTab('itinerary');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
        alerts={alerts}
        onOpenSOS={() => setIsSOSOpen(true)}
        pinnedCount={pinnedSiteIds.length}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6">
        {activeTab === 'sites' && (
          <SiteExplorer
            sites={YAOUNDE_SITES}
            currency={currency}
            pinnedSiteIds={pinnedSiteIds}
            onTogglePin={handleTogglePin}
            onSelectSite={(site) => setSelectedSite(site)}
            onAddToItinerary={handleAddToItinerary}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            sites={YAOUNDE_SITES}
            pinnedSiteIds={pinnedSiteIds}
            onTogglePin={handleTogglePin}
            onSelectSite={(site) => setSelectedSite(site)}
            isOffline={isOffline}
            currency={currency}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryPlanner
            sites={YAOUNDE_SITES}
            itineraries={itineraries}
            onSaveItinerary={(updated) => setItineraries([updated])}
            currency={currency}
            onSelectSite={(site) => setSelectedSite(site)}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            currency={currency}
            expenses={expenses}
            onAddExpense={(exp) => setExpenses((prev) => [exp, ...prev])}
            onRemoveExpense={(id) => setExpenses((prev) => prev.filter((e) => e.id !== id))}
          />
        )}

        {activeTab === 'diary' && (
          <TravelDiary
            sites={YAOUNDE_SITES}
            journals={journals}
            onAddJournal={(j) => setJournals((prev) => [j, ...prev])}
          />
        )}

        {activeTab === 'translator' && <TranslatorWidget />}

        {activeTab === 'ai' && (
          <AiTravelAssistant initialPrompt={aiInitialQuery} />
        )}

        {activeTab === 'architecture' && <PhaseArchitectureViewer />}
      </main>

      {/* Site Detail Modal */}
      <SiteDetailModal
        site={selectedSite}
        onClose={() => setSelectedSite(null)}
        currency={currency}
        isPinned={selectedSite ? pinnedSiteIds.includes(selectedSite.id) : false}
        onTogglePin={handleTogglePin}
        onAddToItinerary={handleAddToItinerary}
        onAskAiAboutSite={handleAskAiAboutSite}
        onRecordVoiceJournal={handleRecordVoiceJournal}
      />

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      {/* App Footer */}
      <footer className="mt-8 bg-white border-t border-slate-200 text-slate-600 py-5 text-xs text-center shadow-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-800">
            GlobeTrotter Yaoundé Travel Agency Engine • ICT University CS4122 Capstone Project
          </p>
          <p className="text-slate-500 text-[11px]">
            Highlighting 52 sites in Yaoundé across all 7 hills • Built with React 19, Leaflet Maps, Express Node.js & Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
