/**
 * LiveClassAlert.jsx
 * Banner flottant affiché aux étudiants quand un cours en direct est actif.
 * Lit le localStorage `educ_live_rooms_data` toutes les 5 secondes.
 */
import React, { useState, useEffect } from 'react';
import { Radio, X, ChevronRight, Users } from 'lucide-react';

export const LiveClassAlert = ({ onNavigateToLive }) => {
  const [liveRooms, setLiveRooms] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  const loadLiveRooms = () => {
    try {
      const data = localStorage.getItem('educ_live_rooms_data');
      if (!data) return;
      const rooms = JSON.parse(data);
      setLiveRooms(rooms.filter(r => r.status === 'Live'));
    } catch (e) {}
  };

  useEffect(() => {
    loadLiveRooms();
    const interval = setInterval(loadLiveRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleRooms = liveRooms.filter(r => !dismissed.has(r.id));
  if (visibleRooms.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {visibleRooms.map(room => (
        <div
          key={room.id}
          className="flex items-center gap-3 px-4 py-3 bg-red-950/60 border border-red-500/50 rounded-2xl shadow-lg shadow-red-500/10 animate-fadeIn"
        >
          {/* Icône pulsante */}
          <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold text-red-400 bg-red-950 border border-red-700 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                🔴 En Direct Maintenant
              </span>
              <span className="text-[11px] text-slate-400 font-semibold truncate">{room.course}</span>
            </div>
            <p className="text-sm font-extrabold text-white truncate mt-0.5">{room.title}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
              <span>👨‍🏫 {room.teacherName}</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />{room.listenersCount} élèves
              </span>
            </div>
          </div>

          {/* Bouton rejoindre */}
          <button
            onClick={() => onNavigateToLive && onNavigateToLive()}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-red-500/20"
          >
            Rejoindre <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Fermer */}
          <button
            onClick={() => setDismissed(prev => new Set([...prev, room.id]))}
            className="p-1 rounded-lg text-slate-500 hover:text-white transition-all cursor-pointer shrink-0"
            title="Ignorer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
