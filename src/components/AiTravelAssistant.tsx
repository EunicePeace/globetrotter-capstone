import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, Compass, History, DollarSign } from 'lucide-react';

interface AiTravelAssistantProps {
  initialPrompt?: string;
}

export const AiTravelAssistant: React.FC<AiTravelAssistantProps> = ({ initialPrompt = '' }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Bonjour! I am GlobeTrotter AI, your personal travel guide and local historian for Yaoundé, Cameroon 🇨🇲.\n\nAsk me anything about historical backstories of monuments, local transport fares (Yellow Taxis, Bensikin), traditional cuisine (Ndéolég, Braised fish, Koki), bargaining tips (marchander), or safety recommendations!"
    }
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);

  const presetQuestions = [
    'What is the historical backstory of the Reunification Monument?',
    'How do I bargain (marchander) with yellow taxi drivers in Yaoundé?',
    'Where is the best place to eat braised carp and Alloco in Bastos?',
    'Give me a budget-friendly 1-day itinerary around Ngoa-Ekelle and Mvolyé.'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || "Pardon, I couldn't generate an answer right now."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Je suis désolé. Unable to connect to GlobeTrotter server. Check your network or server status."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Bot className="w-3.5 h-3.5 text-blue-600" /> Powered by Gemini 3.6-Flash AI
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">GlobeTrotter AI Guide & Historian</h2>
          <p className="text-xs text-slate-600">Your 24/7 intelligent assistant for travel advice, transport routes, and cultural etiquette in Yaoundé.</p>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-500 font-semibold shrink-0">Quick Queries:</span>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 transition-colors shrink-0 border border-slate-200 shadow-2xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 shadow-xs flex flex-col justify-between">
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-2xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-xl p-3 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-blue-700">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 italic text-slate-600">
                GlobeTrotter AI is generating your response...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-3 pt-3 border-t border-slate-100 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Yaoundé history, sites, transport, or cuisine..."
            className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-md px-3 py-2 border border-slate-200 focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
