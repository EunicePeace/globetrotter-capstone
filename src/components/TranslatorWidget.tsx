import React, { useState } from 'react';
import { Languages, Volume2, Search, Sparkles, BookOpen, MessageSquareText } from 'lucide-react';
import { TRANSLATION_PHRASES } from '../data/translationData';
import { TranslationPhrase } from '../types';

export const TranslatorWidget: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [customInput, setCustomInput] = useState('');
  const [customTranslation, setCustomTranslation] = useState<any | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const categories = ['All', 'Greetings', 'Directions', 'Bargaining & Money', 'Dining', 'Emergency', 'Transport'];

  const filteredPhrases = TRANSLATION_PHRASES.filter((p) => {
    const matchesSearch = 
      p.english.toLowerCase().includes(search.toLowerCase()) ||
      p.french.toLowerCase().includes(search.toLowerCase()) ||
      p.ewondo.toLowerCase().includes(search.toLowerCase()) ||
      p.camfranglais.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCustomTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsTranslating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Translate the following phrase into French, Ewondo (the Beti language of Yaoundé), and Camfranglais (local Yaoundé pidgin/slang): "${customInput}". Provide the response strictly in bullet points with pronunciations.`
        })
      });
      const data = await response.json();
      setCustomTranslation(data.reply || 'Translation complete.');
    } catch (e) {
      setCustomTranslation('Could not complete custom translation at this time.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <Languages className="w-3.5 h-3.5 text-amber-700" />
          <span>Multilingual Yaoundé Phrasebook</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">English • Français • Ewondo • Camfranglais</h2>
        <p className="text-xs text-slate-600 max-w-xl">
          Communicate smoothly with local taxi drivers ("mola"), market vendors, and elders in Yaoundé using indigenous Ewondo phrases and popular Camfranglais slang.
        </p>
      </div>

      {/* AI Live Translator Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" /> Custom AI Instant Translator
        </h3>

        <form onSubmit={handleCustomTranslate} className="flex gap-2 text-xs">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type any sentence to translate (e.g., 'Where can I buy fresh avocadoes?')..."
            className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-md px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={isTranslating}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </form>

        {customTranslation && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-1">
            <span className="font-bold text-blue-700 block">AI Translation Result:</span>
            <div className="whitespace-pre-line">{customTranslation}</div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search phrases in English, French, Ewondo, or Camfranglais..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-md pl-8 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phrasebook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredPhrases.map((phrase) => (
          <div key={phrase.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-amber-800 text-[10px] font-bold border border-slate-200">
                {phrase.category}
              </span>
              <button
                onClick={() => speakText(phrase.french)}
                className="p-1 rounded-md bg-slate-100 text-slate-600 hover:text-blue-700 hover:bg-slate-200 transition-colors"
                title="Listen to pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs">{phrase.english}</h4>
              <p className="text-[11px] text-slate-500 italic">🇫🇷 {phrase.french}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-blue-700 font-bold block">Ewondo (Beti)</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{phrase.ewondo}</span>
                <span className="text-[10px] text-slate-500 block italic mt-0.5">🗣 {phrase.pronunciation}</span>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-amber-700 font-bold block">Camfranglais (Slang)</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{phrase.camfranglais}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
