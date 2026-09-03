import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Camera, Heart, MessageSquare, Share2, Globe, Lock, Sparkles, Send } from 'lucide-react';
import { JournalEntry, Site } from '../types';

interface TravelDiaryProps {
  sites: Site[];
  journals: JournalEntry[];
  onAddJournal: (entry: JournalEntry) => void;
}

export const TravelDiary: React.FC<TravelDiaryProps> = ({
  sites,
  journals,
  onAddJournal
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [isPublic, setIsPublic] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');

  // Web Speech API Voice Recognition
  useEffect(() => {
    let recognition: any = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };
    }

    if (isRecording && recognition) {
      try {
        recognition.start();
      } catch (e) {}
    } else if (!isRecording && recognition) {
      try {
        recognition.stop();
      } catch (e) {}
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [isRecording]);

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !transcript.trim()) return;

    const site = sites.find((s) => s.id === selectedSiteId);

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      locationId: site?.id,
      locationName: site?.name || 'Yaoundé',
      title: title.trim(),
      content: transcript.trim(),
      photoUrl: photoUrl.trim() || site?.image || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
      voiceTranscript: transcript.trim(),
      likes: 1,
      commentsCount: 0,
      isPublic,
      author: 'You (Traveler)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };

    onAddJournal(newEntry);
    setTitle('');
    setTranscript('');
    setPhotoUrl('');
  };

  return (
    <div className="space-y-4">
      {/* Voice Diary Creation Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 inline-flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-indigo-600" /> Voice-Activated Travel Diary
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">Record & Post Travel Memories</h2>
          </div>

          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isRecording ? 'Stop Dictating' : 'Start Voice Dictation'}</span>
          </button>
        </div>

        {/* Dictation Status */}
        {isRecording && (
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>Listening... Speak into your microphone to dictate your travel entry.</span>
          </div>
        )}

        {/* Entry Form */}
        <form onSubmit={handlePostJournal} className="space-y-2.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Journal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunset over Mont Fébé Monastery..."
                className="w-full bg-slate-50 text-slate-900 rounded-md px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-600"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Tag Yaoundé Location</label>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 rounded-md px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-600"
              >
                <option value="">-- Select Location --</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>📍 {s.name} ({s.quarter})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Diary Story (Voice Dictation or Text)</label>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Dictate using voice button or type your story here..."
              className="w-full bg-slate-50 text-slate-900 rounded-md p-2.5 border border-slate-200 focus:outline-none focus:border-indigo-600 leading-relaxed"
              required
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors border ${
                  isPublic
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isPublic ? <Globe className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                <span>{isPublic ? 'Public Social Post' : 'Private Offline Note'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Entry</span>
            </button>
          </div>
        </form>
      </div>

      {/* Public Social Travel Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-600" />
          Community Travel Journal & Photo Feed
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journals.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs space-y-2">
              {entry.photoUrl && (
                <div className="h-40 w-full bg-slate-100 overflow-hidden">
                  <img src={entry.photoUrl} alt={entry.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={entry.authorAvatar} alt={entry.author} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-slate-800">{entry.author}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{entry.date}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs">{entry.title}</h4>
                {entry.locationName && (
                  <span className="text-[11px] text-blue-700 font-semibold block">📍 {entry.locationName}</span>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{entry.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{entry.likes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{entry.commentsCount}</span>
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-medium">
                    {entry.isPublic ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
