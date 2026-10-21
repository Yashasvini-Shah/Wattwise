import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, Zap, User } from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';

interface Message {
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const GeminiAiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'gemini',
      text: 'Hello! I am your WattWise Gemini Energy Assistant ⚡. Ask me anything about your room energy usage, bill savings, or hostel tariff settings!',
      timestamp: 'Just now',
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const { rooms, settings } = useHostel();
  const { authState } = useAuth();

  const userRoomId = authState.user?.roomId || '301';
  const currentRoom = rooms.find((r) => r.id === userRoomId);

  const generateOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('save') || q.includes('reduce') || q.includes('tip') || q.includes('cut')) {
      return `💡 Energy Tip: The Air Conditioner (1200W) accounts for ~65% of your total room power. Raising target cooling from 20°C to 24°C saves roughly $12.50/month per room! Also, turning off fans when leaving for lectures saves 4.5 kWh weekly.`;
    }

    if (q.includes('bill') || q.includes('cost') || q.includes('limit') || q.includes('exceed')) {
      const roomCost = currentRoom
        ? (currentRoom.monthlyUsageKwh * settings.electricityRate).toFixed(2)
        : '0.00';
      const cap = currentRoom?.customLimit ?? settings.monthlyChargeLimit;
      return `💰 Billing Summary: Your current estimated monthly cost is ${settings.currencySymbol}${roomCost} against an allocated limit cap of ${settings.currencySymbol}${cap.toFixed(
        2
      )}. Current electricity rate is ${settings.currencySymbol}${settings.electricityRate}/kWh.`;
    }

    if (q.includes('room') || q.includes('load') || q.includes('watt') || q.includes('power')) {
      if (currentRoom) {
        return `⚡ Telemetry for Room ${currentRoom.roomNumber}: Active load is ${
          currentRoom.activePowerWatts
        } Watts with ${
          currentRoom.appliances.filter((a) => a.isOn).length
        } active appliances. ${
          currentRoom.residents.filter((r) => r.isPresent).length
        }/4 residents are currently present.`;
      }
    }

    if (q.includes('admin') || q.includes('hostel') || q.includes('total')) {
      const totalKw = (
        rooms.reduce((sum, r) => sum + r.activePowerWatts, 0) / 1000
      ).toFixed(2);
      return `🏢 Hostel Overview: Total active load across all 25 rooms is ${totalKw} kW. There are ${
        rooms.filter((r) => r.status === 'exceeded').length
      } rooms currently exceeding their monthly budget limit.`;
    }

    if (q.includes('who') || q.includes('what') || q.includes('wattwise')) {
      return `⚡ WattWise is an offline-first Smart Hostel Energy Management Dashboard. It helps students track live room telemetry and helps admins prevent budget overruns using AI insights.`;
    }

    return `⚡ Gemini Advisor: Based on current telemetry, your hostel room load is running smoothly. Keep fans and study lamps off when not in use to stay well within your ${settings.currencySymbol}${settings.monthlyChargeLimit} monthly limit!`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg: Message = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      const reply = generateOfflineResponse(userText);
      const geminiMsg: Message = {
        sender: 'gemini',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, geminiMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all cursor-pointer glow-cyan"
      >
        <Sparkles className="w-4 h-4 fill-slate-950" />
        Ask Gemini AI
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-full max-w-sm glass-panel border border-cyan-500/40 shadow-2xl overflow-hidden rounded-2xl flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white m-0 flex items-center gap-1">
                  Gemini Energy Assistant
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40">
                    Active
                  </span>
                </h4>
                <span className="text-[10px] text-slate-400">Hostel Q&A & Energy Guidance</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-950/60">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'gemini' && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-1 ${
                      msg.sender === 'user' ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Gemini is analyzing telemetry...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Gemini about savings or load..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
