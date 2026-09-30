import React, { useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  CheckCheck,
  ShieldCheck,
  UserCheck,
  Award
} from 'lucide-react';

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nouvelle Demande de Licence Enseignante',
      type: 'teacher',
      priority: 'high',
      text: 'Dra. Solange Nguema Avomo a envoyé sa demande d\'inscription avec le numéro LIC-ED-99321-GNQ pour l\'Institut National de Bata.',
      date: 'Il y a 10 min',
      read: false
    },
    {
      id: '2',
      title: 'Demande d\'Inscription d\'Élève',
      type: 'student',
      priority: 'medium',
      text: 'Pascal Eto\'o Nchama a complété le formulaire d\'inscription pour la classe de Secondaire à Malabo.',
      date: 'Il y a 45 min',
      read: false
    },
    {
      id: '3',
      title: 'Nouvelle Demande de Cours Particulier',
      type: 'tutoring',
      priority: 'high',
      text: 'Mariano Nsue Nchama demande un tutorat individuel de Mathématiques pour 1.500 FCFA avec le Prof. Baltasar Nsue Ondo.',
      date: 'Il y a 2 heures',
      read: true
    },
    {
      id: '4',
      title: 'Paquet USB Écoles Synchronisé',
      type: 'system',
      priority: 'info',
      text: 'Le paquet de contenus hors-ligne pour le Nœud d\'Ebebiyín a été préparé avec succès.',
      date: 'Hier',
      read: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-500/40 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Panneau de Notifications d'Administration</h1>
            <p className="text-xs text-slate-300">Alertes système, demandes d'inscription et journaux d'activité.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <CheckCheck className="w-4 h-4" /> Marquer comme Lues ({unreadCount})
            </button>
          )}
          <button
            onClick={handleClearRead}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            title="Effacer les lues"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/90 rounded-2xl border border-slate-700 text-slate-400 text-xs">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-80" />
            <p className="font-bold text-slate-300">No hay notificaciones sin leer</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all shadow-md ${
                !n.read
                  ? 'bg-slate-850 border-purple-500/50 shadow-purple-500/5'
                  : 'bg-slate-900/80 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    n.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : n.type === 'teacher'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {n.type === 'teacher' ? <Award className="w-5 h-5" /> : n.type === 'student' ? <UserCheck className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                  {n.date}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
