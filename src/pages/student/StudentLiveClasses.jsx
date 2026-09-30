import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Radio,
  Calendar,
  Volume2,
  VolumeX,
  Hand,
  MessageSquare,
  Send,
  LogOut,
  Search,
  Users,
  Signal,
  Play,
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertCircle,
  Wifi,
  ChevronRight,
} from 'lucide-react';

// ─────────────────────────────────────────────
//  FALLBACK si l'enseignant n'a pas encore créé de salles
// ─────────────────────────────────────────────
const FALLBACK_ROOMS = [
  {
    id: 'room-101',
    title: "Session Audio en Direct : Résolution d'Équations du Second Degré & Isolations",
    course: 'Mathématiques 4e Secondaire & Baccalauréat',
    format: 'Audio Compressé Faible Débit MP3',
    scheduledDate: "Aujourd'hui - Diffusion Active",
    roomCode: 'SALA-LIVE-8842-GNQ',
    status: 'Live',
    teacherName: 'Prof. Baltasar Nsue Ondo',
    listenersCount: 18,
    slides: [
      { id: 's1', title: "Formule Générale de l'Équation du Second Degré", content: 'a·x² + b·x + c = 0  =>  x = [ -b ± √(b² - 4ac) ] / 2a' },
      { id: 's2', title: 'Exemple Pratique Guidé', content: 'x² - 5x + 6 = 0  =>  a=1, b=-5, c=6  =>  Discriminant = 25 - 24 = 1' },
    ],
    messages: [
      { id: 'm1', sender: 'Mariano Nsue', text: 'Professeur, le discriminant doit-il toujours être positif ?', time: '16:05', isTeacher: false },
      { id: 'm2', sender: 'Prof. Baltasar', text: 'Non, s\'il est négatif les racines sont complexes !', time: '16:06', isTeacher: true },
    ],
  },
  {
    id: 'room-102',
    title: "Atelier Sonore en Direct : Loi d'Ohm & Circuits Électriques à la Maison",
    course: 'Physique et Chimie 2e Baccalauréat',
    format: 'Audio Faible Débit & Tableau Interactif',
    scheduledDate: 'Vendredi 10:00 AM',
    roomCode: 'SALA-LIVE-9941-GNQ',
    status: 'Scheduled',
    teacherName: 'Prof. Baltasar Nsue Ondo',
    listenersCount: 12,
    slides: [{ id: 's10', title: "Principes de la Loi d'Ohm", content: 'U = I · R  (Tension = Intensité × Résistance)' }],
    messages: [],
  },
];

// ─────────────────────────────────────────────
//  ONDES AUDIO ANIMÉES (SVG / CSS)
// ─────────────────────────────────────────────
const AudioWaves = ({ active }) => (
  <div className="flex items-center justify-center gap-1 h-10">
    {[0.4, 0.7, 1.0, 0.75, 0.5, 0.9, 0.6, 1.0, 0.8, 0.45, 0.85, 0.55].map((h, i) => (
      <div
        key={i}
        className={`w-1.5 rounded-full bg-emerald-400 transition-all ${active ? 'animate-pulse' : 'opacity-30'}`}
        style={{
          height: active ? `${h * 40}px` : '6px',
          animationDelay: `${i * 80}ms`,
          animationDuration: `${600 + i * 90}ms`,
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────
//  PAGE PRINCIPALE
// ─────────────────────────────────────────────
export const StudentLiveClasses = () => {
  const { user } = useAuth();

  // Lit les salles depuis localStorage (créées par l'enseignant)
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('educ_live_rooms_data');
      return saved ? JSON.parse(saved) : FALLBACK_ROOMS;
    } catch (e) {
      return FALLBACK_ROOMS;
    }
  });

  // Recharge les salles toutes les 5 secondes pour voir les nouvelles sessions
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('educ_live_rooms_data');
        if (saved) setRooms(JSON.parse(saved));
      } catch (e) {}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [activeRoom, setActiveRoom] = useState(null);   // salle rejointe
  const [isMuted, setIsMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [showCodeSearch, setShowCodeSearch] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [toast, setToast] = useState('');
  const chatEndRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  // Scroll chat vers le bas
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoom?.messages]);

  const liveRooms = rooms.filter(r => r.status === 'Live');
  const scheduledRooms = rooms.filter(r => r.status === 'Scheduled');
  const endedRooms = rooms.filter(r => r.status === 'Ended');

  // ── Rejoindre une salle ──────────────────────────────────────────────────────
  const handleJoin = (room) => {
    if (room.status !== 'Live') {
      showToast(`⌛ Cette session débutera ${room.scheduledDate}. Revenez à ce moment !`);
      return;
    }
    // Incrémente le compteur d'auditeurs
    const updated = rooms.map(r => r.id === room.id ? { ...r, listenersCount: r.listenersCount + 1 } : r);
    setRooms(updated);
    try { localStorage.setItem('educ_live_rooms_data', JSON.stringify(updated)); } catch (e) {}
    setActiveRoom(updated.find(r => r.id === room.id));
    setHandRaised(false);
    setIsMuted(false);
    showToast(`✅ Vous avez rejoint "${room.title}"`);
  };

  // ── Rejoindre par code ───────────────────────────────────────────────────────
  const handleJoinByCode = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { setCodeError('Veuillez saisir un code.'); return; }
    const found = rooms.find(r => r.roomCode === code || r.roomCode?.toUpperCase() === code);
    if (!found) { setCodeError(`Aucune salle trouvée avec le code "${code}". Vérifiez avec votre enseignant.`); return; }
    setCodeError('');
    setShowCodeSearch(false);
    setCodeInput('');
    handleJoin(found);
  };

  // ── Quitter la salle ─────────────────────────────────────────────────────────
  const handleLeave = () => {
    if (!activeRoom) return;
    const updated = rooms.map(r => r.id === activeRoom.id ? { ...r, listenersCount: Math.max(0, r.listenersCount - 1) } : r);
    setRooms(updated);
    try { localStorage.setItem('educ_live_rooms_data', JSON.stringify(updated)); } catch (e) {}
    setActiveRoom(null);
    setShowChat(true);
  };

  // ── Envoyer un message ───────────────────────────────────────────────────────
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeRoom) return;
    const newMsg = {
      id: `student-${Date.now()}`,
      sender: user?.name || 'Élève',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isTeacher: false,
      isMe: true,
    };
    const updatedRoom = { ...activeRoom, messages: [...(activeRoom.messages || []), newMsg] };
    setActiveRoom(updatedRoom);
    const updated = rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r);
    setRooms(updated);
    try { localStorage.setItem('educ_live_rooms_data', JSON.stringify(updated)); } catch (e) {}
    setChatInput('');
  };

  // ── Lever la main ────────────────────────────────────────────────────────────
  const handleRaiseHand = () => {
    setHandRaised(prev => !prev);
    if (!handRaised) showToast('✋ Main levée ! L\'enseignant a été notifié.');
  };

  // ════════════════════════════════════════════
  //  VUE — DANS UNE SESSION ACTIVE
  // ════════════════════════════════════════════
  if (activeRoom) {
    const currentSlide = activeRoom.slides?.[0];
    return (
      <div className="h-full flex flex-col bg-slate-950 animate-fadeIn">

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-emerald-500/50 text-emerald-300 text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {toast}
          </div>
        )}

        {/* Header session */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-red-500/40 shrink-0">
          <div className="flex items-center gap-1.5 bg-red-950 border border-red-700 rounded-lg px-2.5 py-1 shrink-0">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-black text-red-400 uppercase tracking-wide">En Direct</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-white truncate">{activeRoom.title}</p>
            <p className="text-[11px] text-slate-400">{activeRoom.teacherName} • {activeRoom.course}</p>
          </div>
          <button onClick={handleLeave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800 text-red-400 hover:bg-red-900/40 text-xs font-bold transition-all cursor-pointer shrink-0">
            <LogOut className="w-3.5 h-3.5" /> Quitter
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* Zone audio + tableau */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">

            {/* Carte écoute */}
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 flex flex-col items-center text-center gap-3 shadow-lg shadow-emerald-500/5">
              <span className="text-[11px] font-extrabold text-emerald-400 tracking-widest uppercase">🔊 TRANSMISSION AUDIO EN COURS</span>
              <p className="text-xs text-slate-400 font-semibold">{activeRoom.course}</p>
              <p className="text-lg font-black text-white leading-tight">{activeRoom.title}</p>
              <AudioWaves active={!isMuted} />
              <p className="text-xs text-slate-500">{activeRoom.format}</p>
              <code className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-lg">{activeRoom.roomCode}</code>
            </div>

            {/* Méta */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-extrabold text-white">{activeRoom.listenersCount} élèves</p>
                  <p className="text-[10px] text-slate-500">Connectés</p>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 flex items-center gap-2">
                <Signal className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-extrabold text-white">Faible Débit</p>
                  <p className="text-[10px] text-slate-500">Optimisé</p>
                </div>
              </div>
            </div>

            {/* Tableau / Slide du cours */}
            {currentSlide && (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">TABLEAU DU COURS</span>
                </div>
                <p className="text-sm font-bold text-white mb-2">{currentSlide.title}</p>
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-700">
                  <p className="text-sm font-mono text-emerald-300 leading-relaxed">{currentSlide.content}</p>
                </div>
              </div>
            )}

            {/* Contrôles */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setIsMuted(!isMuted)}
                className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border transition-all cursor-pointer ${isMuted ? 'bg-red-950/30 border-red-700 text-red-400' : 'bg-slate-900 border-slate-700 text-emerald-400 hover:border-emerald-600'}`}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className="text-[10px] font-extrabold">{isMuted ? 'Muet' : 'Écouter'}</span>
              </button>

              <button onClick={handleRaiseHand}
                className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border transition-all cursor-pointer ${handRaised ? 'bg-amber-950/40 border-amber-600 text-amber-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-amber-600 hover:text-amber-400'}`}>
                <Hand className="w-5 h-5" />
                <span className="text-[10px] font-extrabold">{handRaised ? 'Main ✋' : 'Lever Main'}</span>
              </button>

              <button onClick={() => setShowChat(!showChat)}
                className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border transition-all cursor-pointer ${showChat ? 'bg-indigo-950/40 border-indigo-600 text-indigo-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-indigo-600 hover:text-indigo-400'}`}>
                <MessageSquare className="w-5 h-5" />
                <span className="text-[10px] font-extrabold">Chat</span>
              </button>
            </div>

            {/* Quitter (mobile) */}
            <button onClick={handleLeave}
              className="lg:hidden flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-950/30 border border-red-800 text-red-400 text-sm font-extrabold hover:bg-red-900/30 transition-all cursor-pointer">
              <LogOut className="w-4 h-4" /> Quitter la Session
            </button>
          </div>

          {/* Chat latéral */}
          {showChat && (
            <div className="w-full lg:w-80 flex flex-col bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 shrink-0 max-h-[50vh] lg:max-h-none">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-extrabold text-white">Chat de la Session</span>
                </div>
                <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white transition-all cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {(activeRoom.messages || []).length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-4">Aucun message pour le moment.</p>
                )}
                {(activeRoom.messages || []).map((msg) => (
                  <div key={msg.id}
                    className={`rounded-xl p-2.5 text-xs ${msg.isMe ? 'bg-indigo-950/50 border border-indigo-800/50 ml-4' : msg.isTeacher ? 'bg-amber-950/40 border border-amber-700/40' : 'bg-slate-800 mr-4'}`}>
                    <p className={`font-extrabold mb-0.5 text-[10px] ${msg.isMe ? 'text-indigo-300' : msg.isTeacher ? 'text-amber-400' : 'text-slate-400'}`}>
                      {msg.isMe ? 'Vous' : msg.sender} {msg.isTeacher && '👨‍🏫'}
                    </p>
                    <p className="text-white font-semibold leading-relaxed">{msg.text}</p>
                    <p className="text-slate-600 text-[10px] text-right mt-1">{msg.time}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input message */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2 shrink-0">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button type="submit"
                  className="w-8 h-8 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  //  VUE — LISTE DES SESSIONS
  // ════════════════════════════════════════════
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fadeIn">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-emerald-500/50 text-emerald-300 text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-[11px] font-extrabold text-red-400 tracking-widest uppercase">Cours en Direct • Audio Faible Débit</span>
          </div>
          <h1 className="text-2xl font-black text-white">Rejoindre un Cours en Direct</h1>
          <p className="text-sm text-slate-400 mt-1">Écoutez votre enseignant en temps réel, posez vos questions et participez — même avec une faible connexion.</p>
        </div>
        <button onClick={() => { setShowCodeSearch(!showCodeSearch); setCodeError(''); setCodeInput(''); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-amber-500/40 text-amber-400 font-bold text-sm rounded-2xl hover:border-amber-500 transition-all cursor-pointer shrink-0">
          <Search className="w-4 h-4" /> Code Salle
        </button>
      </div>

      {/* Recherche par code */}
      {showCodeSearch && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 animate-fadeIn">
          <h2 className="text-base font-extrabold text-white mb-1">🔑 Rejoindre par Code</h2>
          <p className="text-sm text-slate-400 mb-4">Saisissez le code fourni par votre enseignant (ex : SALA-LIVE-8842-GNQ)</p>
          <div className="flex gap-2">
            <input
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(''); }}
              placeholder="SALA-LIVE-XXXX-GNQ"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all tracking-wider uppercase"
              onKeyDown={e => e.key === 'Enter' && handleJoinByCode()}
            />
            <button onClick={handleJoinByCode}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-extrabold text-sm rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-amber-500/20">
              Rejoindre
            </button>
          </div>
          {codeError && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-950/30 border border-red-800/40 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {codeError}
            </div>
          )}
        </div>
      )}

      {/* ── Sessions en direct ── */}
      {liveRooms.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">🔴 En Direct Maintenant ({liveRooms.length})</h2>
            <div className="flex items-center gap-1.5 bg-red-950 border border-red-700 rounded-lg px-2 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-400">LIVE</span>
            </div>
          </div>
          <div className="space-y-3">
            {liveRooms.map(room => (
              <div key={room.id} className="bg-slate-900 border-2 border-red-500/50 rounded-3xl p-5 shadow-lg shadow-red-500/5 hover:border-red-500/80 transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-red-950 border border-red-700 text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase">🔴 EN DIRECT</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{room.course}</span>
                  </div>
                  <code className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-lg font-mono shrink-0">{room.roomCode}</code>
                </div>
                <h3 className="text-base font-extrabold text-white mb-1 leading-tight">{room.title}</h3>
                <p className="text-sm text-slate-300 font-semibold mb-3">👨‍🏫 {room.teacherName}</p>
                <div className="flex items-center gap-4 mb-4 text-xs text-slate-400 font-semibold">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-400" /> {room.listenersCount} élèves</span>
                  <span className="flex items-center gap-1"><Signal className="w-3.5 h-3.5 text-amber-400" /> {room.format}</span>
                </div>
                <button onClick={() => handleJoin(room)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold text-sm rounded-2xl transition-all cursor-pointer shadow-lg shadow-red-500/20">
                  <Play className="w-4 h-4" /> ▶ Rejoindre la Session en Direct
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Aucune session active ── */}
      {liveRooms.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center gap-3">
          <Radio className="w-10 h-10 text-slate-600" />
          <p className="text-base font-extrabold text-white">Aucune session en direct pour le moment</p>
          <p className="text-sm text-slate-400">Revenez quand votre enseignant démarrera une diffusion, ou rejoignez directement avec un code de salle.</p>
          <button onClick={() => setShowCodeSearch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-amber-500/30 text-amber-400 text-sm font-bold rounded-xl hover:border-amber-500 transition-all cursor-pointer">
            <Search className="w-4 h-4" /> Saisir un Code
          </button>
        </div>
      )}

      {/* ── Sessions programmées ── */}
      {scheduledRooms.length > 0 && (
        <div>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-widest mb-3">📅 Sessions Programmées ({scheduledRooms.length})</h2>
          <div className="space-y-3">
            {scheduledRooms.map(room => (
              <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-4 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="bg-amber-950/60 border border-amber-700/50 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">⌛ PROGRAMMÉE</span>
                    <code className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-lg font-mono">{room.roomCode}</code>
                  </div>
                  <p className="text-sm font-extrabold text-white leading-tight mb-0.5">{room.title}</p>
                  <p className="text-xs text-slate-400 font-semibold">👨‍🏫 {room.teacherName}</p>
                  <p className="text-xs text-amber-400 font-bold mt-1">📅 {room.scheduledDate}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{room.listenersCount} inscrits</span>
                    <span>{room.format}</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast(`🔔 Vous serez notifié quand "${room.title}" commence.`)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-bold transition-all cursor-pointer">
                  🔔 M'avertir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sessions terminées ── */}
      {endedRooms.length > 0 && (
        <div>
          <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-3">✅ Sessions Terminées ({endedRooms.length})</h2>
          <div className="space-y-2">
            {endedRooms.map(room => (
              <div key={room.id} className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-4 flex items-center gap-3 opacity-60">
                <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-300 truncate">{room.title}</p>
                  <p className="text-xs text-slate-500">{room.teacherName} • Enregistrement disponible hors-ligne</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
        <h3 className="text-sm font-extrabold text-white mb-3">ℹ️ Comment rejoindre un cours en direct ?</h3>
        <div className="space-y-2">
          {[
            ['1', 'Attendez qu\'un cours passe en 🔴 EN DIRECT dans la liste ci-dessus'],
            ['2', 'Cliquez sur « Rejoindre la Session en Direct »'],
            ['3', 'Ou saisissez le code fourni par votre enseignant'],
            ['4', 'Écoutez, levez la main et participez au chat !'],
          ].map(([n, t]) => (
            <div key={n} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{n}</span>
              <p className="text-sm text-slate-400 font-semibold leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
