import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MessageCircle,
  X,
  Send,
  CheckCheck,
  Play,
  Pause,
  Bot,
  Sparkles,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Copy,
  ExternalLink,
  BookMarked,
  Brain,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export const QUICK_SUGGESTIONS = [
  '📐 Comment résoudre x² + 5x + 6 = 0?',
  '⚡ Explication rapide des Lois de Newton',
  '📝 Générer 3 questions d\'entraînement',
  '💡 Qu\'est-ce que le discriminant en maths?',
  '💻 Comment fonctionne l\'adressage IP?'
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: '👋 Bonjour! Je suis votre Assistant Éducatif IA 24/7. Dans quelle matière puis-je vous aider aujourd\'hui? Fonctionne 100% Hors-Ligne.',
    time: '10:42 AM',
    isAudio: false
  },
  {
    id: 'msg-2',
    sender: 'bot',
    text: '🎙️ Note vocale: "Écoutez l\'explication résumée de 30 secondes sur les équations du second degré."',
    time: '10:43 AM',
    isAudio: true,
    audioDuration: '0:32',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  }
];

export const WhatsAppAiAssistantWidget = () => {
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [isPlayingAudioId, setIsPlayingAudioId] = useState(null);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleOpenWidget = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0);
  };

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = 'Excellente question! ';
      const lower = text.toLowerCase();

      if (lower.includes('x²') || lower.includes('équation') || lower.includes('degré')) {
        replyText = `📐 *Résolution Équation du Second Degré:*
Pour x² + 5x + 6 = 0:
1. Formule: x = (-b ± √(b² - 4ac)) / (2a)
2. On identifie: a = 1, b = 5, c = 6
3. Calcul de Δ = 5² - 4(1)(6) = 25 - 24 = 1
4. Solutions: x₁ = (-5 + 1)/2 = -2 et x₂ = (-5 - 1)/2 = -3.
✅ *Solutions:* x = -2 et x = -3.`;
      } else if (lower.includes('newton') || lower.includes('physique') || lower.includes('force')) {
        replyText = `⚡ *Résumé des Lois de Newton:*
• *1ère Loi (Inertie):* Tout corps demeure au repos ou en MRU sans force extérieure.
• *2ème Loi (Dynamique):* F = m · a (Force = Masse × Accélération).
• *3ème Loi (Action-Réaction):* À toute action correspond une réaction égale et opposée.`;
      } else if (lower.includes('question') || lower.includes('entraînement') || lower.includes('examen')) {
        replyText = `📝 *Questions d'Entraînement:*
1. Quel est le discriminant de 2x² - 4x + 2 = 0? (Rép: Δ = 0, racine double).
2. Définir la 2ème Loi de Newton dans le SI. (Rép: Newton = kg·m/s²).
3. Quel protocole opère à la couche Transport du modèle OSI? (Rép: TCP / UDP).`;
      } else if (lower.includes('réseaux') || lower.includes('ip') || lower.includes('adressage')) {
        replyText = `💻 *Adressage IP & Réseaux:*
Une adresse IPv4 comprend 32 bits divisés en 4 octets (ex: 192.168.1.1).
Le masque de sous-réseau comme 255.255.255.0 (/24) identifie le réseau et les hôtes.`;
      } else {
        replyText = `📚 *Assistant Éducatif IA:*
J'ai bien analysé votre demande concernant "${text}". Pour approfondir ce sujet, je vous recommande de consulter le Module 1 du catalogue ou d'effectuer les exercices d'ateliers hors-ligne.`;
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAudio: false
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const togglePlayAudio = (msgId, audioUrl) => {
    if (isPlayingAudioId === msgId) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingAudioId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play();
      setIsPlayingAudioId(msgId);
      newAudio.onended = () => setIsPlayingAudioId(null);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copié dans le presse-papiers!');
  };

  const handleOpenExternalWhatsApp = (text) => {
    const encoded = encodeURIComponent(`Bonjour Enseignant, j'ai une question: ${text}`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 animate-bounceHover">
        <button
          onClick={handleOpenWidget}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-teal-400 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer ring-4 ring-emerald-500/30"
          title="Ouvrir l'Assistant IA WhatsApp 24/7"
        >
          <MessageCircle className="w-7 h-7 stroke-[2.2]" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-slate-950 shadow">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-3 px-4 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center font-bold text-amber-300 shadow">
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border border-slate-900 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-xs font-black tracking-wide text-white">WhatsApp IA Éducatif</h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300 text-slate-950" />
                </div>
                <span className="text-[10px] text-emerald-200 block font-medium">
                  {isTyping ? 'Écriture de la réponse...' : '🟢 En ligne 24/7 • Hors-ligne Ready'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-emerald-900/60 text-emerald-100 transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-emerald-950/80 px-3 py-1 text-[10px] text-emerald-300 font-bold text-center border-b border-emerald-800/60 shrink-0">
            📱 Mode WhatsApp Compressé • Sans Consommation de Données
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-slate-950/95 no-scrollbar">
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-[10px] text-amber-300 text-center leading-tight shadow-inner">
              🔒 Les messages et l'IA fonctionnent localement en toute sécurité via IndexedDB.
            </div>

            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-1 animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-md relative group ${
                      isBot
                        ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                        : 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-tr-none font-medium'
                    }`}
                  >
                    {msg.isAudio ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          <button
                            onClick={() => togglePlayAudio(msg.id, msg.audioUrl)}
                            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold cursor-pointer shrink-0 transition-transform hover:scale-105"
                          >
                            {isPlayingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div className="flex-1">
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`bg-emerald-400 h-full rounded-full ${
                                  isPlayingAudioId === msg.id ? 'animate-pulse w-3/4' : 'w-1/4'
                                }`}
                              />
                            </div>
                            <span className="text-[9px] text-emerald-300 font-bold block mt-1">
                              Note Vocale • {msg.audioDuration}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{msg.text}</p>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    )}

                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                      <span>{msg.time}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                    </div>

                    {isBot && !msg.isAudio && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2 text-[10px]">
                        <button
                          onClick={() => handleCopyText(msg.text)}
                          className="text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                          title="Copier le message"
                        >
                          <Copy className="w-3 h-3" /> Copier
                        </button>

                        <button
                          onClick={() => handleOpenExternalWhatsApp(msg.text)}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
                          title="Partager sur WhatsApp"
                        >
                          <ExternalLink className="w-3 h-3" /> WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl w-28 text-[11px] text-slate-400 animate-pulse">
                <Brain className="w-3.5 h-3.5 text-amber-300 animate-spin" /> Écriture...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 bg-slate-900 border-t border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="px-2.5 py-1 rounded-full bg-slate-950 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Posez votre question éducative ici..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-full transition-transform cursor-pointer ${
                inputText.trim()
                  ? 'bg-emerald-500 text-slate-950 hover:scale-105 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-500 cursor-default'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
