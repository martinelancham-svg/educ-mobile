import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Headphones,
  FileText,
  Radio,
  CheckCheck,
  Play,
  ChevronRight
} from 'lucide-react';

export const NotificationsPage = ({ onNavigateToLive }) => {
  const { notifications, markAllNotificationsRead, activeRole } = useAuth();
  const [filter, setFilter] = useState('all');
  const [liveNotifs, setLiveNotifs] = useState([]);

  // Charger les notifications live depuis localStorage
  useEffect(() => {
    const load = () => {
      try {
        const data = localStorage.getItem('educ_live_notifications');
        if (data) setLiveNotifs(JSON.parse(data));
      } catch (e) {}
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fusionner notifications contexte + notifications live localStorage
  const allLiveNotifs = liveNotifs.map(n => ({ ...n, fromStorage: true }));

  const visibleNotifications = [
    ...allLiveNotifs,
    ...(notifications || []).filter(n => {
      if (n.targetRoles && n.targetRoles.length > 0) {
        return n.targetRoles.includes(activeRole);
      }
      if (n.title.includes('Abandono') || n.title.includes('Cerrada Automáticamente') || n.title.includes('Incidencia')) {
        return activeRole === 'teacher' || activeRole === 'admin';
      }
      return true;
    }),
  ];

  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  const filtered = visibleNotifications.filter(n => {
    if (filter === 'course') return n.type === 'course' || n.type === 'document';
    if (filter === 'audiobook') return n.type === 'audiobook';
    if (filter === 'teacher') return n.type === 'teacher';
    if (filter === 'live') return n.type === 'live';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'audiobook':
        return <Headphones className="w-5 h-5 text-indigo-400" />;
      case 'document':
        return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'course':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'live':
        return <Radio className="w-5 h-5 text-red-400 animate-pulse" />;
      case 'reward':
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-16">
      
      {/* Header Notificaciones */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Notifications en Temps Réel
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">Centre d'Annonces & Nouvelles Leçons</h1>
            <p className="text-xs text-slate-300">Avis automatiques lorsque les enseignants publient des cours, PDF ou livres audio.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <CheckCheck className="w-4 h-4" /> Marquer comme Lues ({unreadCount})
            </button>
          )}

          <span className="text-xs font-bold text-emerald-400 bg-slate-850 px-3 py-2 rounded-2xl border border-slate-700">
            {(notifications || []).length} Notifications
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-emerald-500 text-slate-950 font-extrabold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('course')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'course' ? 'bg-emerald-500 text-slate-950 font-extrabold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Cours & PDF
        </button>
        <button
          onClick={() => setFilter('audiobook')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'audiobook' ? 'bg-emerald-500 text-slate-950 font-extrabold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Livres Audio MP3
        </button>
        <button
          onClick={() => setFilter('teacher')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'teacher' ? 'bg-emerald-500 text-slate-950 font-extrabold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Avis des Enseignants
        </button>
        <button
          onClick={() => setFilter('live')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'live' ? 'bg-red-500 text-white font-extrabold shadow' : 'bg-red-950/40 border border-red-700/40 text-red-400 hover:bg-red-900/40'
          }`}
        >
          <Radio className="w-3.5 h-3.5" /> Cours en Direct
          {liveNotifs.filter(n => n.status === 'live' && !n.read).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-3">
      {filtered.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border flex items-start gap-4 transition-all shadow-md ${
              n.type === 'live' && n.status === 'live'
                ? 'bg-red-950/40 border-red-500/60 ring-1 ring-red-500/20'
                : !n.read
                  ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 opacity-90'
            }`}
          >
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow ${
              n.type === 'live' && n.status === 'live' ? 'bg-red-950 border-red-700' : 'bg-slate-950 border-slate-800'
            }`}>
              {getIcon(n.type)}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold ${n.type === 'live' && n.status === 'live' ? 'text-red-300' : 'text-white'}`}>
                    {n.title}
                  </h3>
                  {!n.read && <span className={`w-2 h-2 rounded-full animate-pulse ${n.type === 'live' ? 'bg-red-400' : 'bg-emerald-400'}`} />}
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {n.startedAt || n.time || n.date || 'Récent'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>

              {n.type === 'live' && n.status === 'live' && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] font-mono text-red-400 bg-red-950 border border-red-800 px-2 py-0.5 rounded-lg">
                    {n.roomCode}
                  </span>
                  {onNavigateToLive && (
                    <button
                      onClick={onNavigateToLive}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> Rejoindre la Session
                    </button>
                  )}
                </div>
              )}

              {n.author && (
                <span className="text-[10px] text-amber-300 font-medium block pt-0.5">
                  Publié par: {n.author}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
