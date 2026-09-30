import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, X, BookOpen, Headphones, FileText, Radio, CheckCircle2 } from 'lucide-react';

export const ContentNotificationToast = () => {
  const { latestNotificationToast, clearLatestNotificationToast } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (latestNotificationToast) {
      setToast(latestNotificationToast);

      const timer = setTimeout(() => {
        setToast(null);
        if (clearLatestNotificationToast) clearLatestNotificationToast();
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [latestNotificationToast]);

  if (!toast) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'audiobook':
        return <Headphones className="w-6 h-6 text-indigo-400" />;
      case 'document':
        return <FileText className="w-6 h-6 text-emerald-400" />;
      case 'course':
        return <BookOpen className="w-6 h-6 text-amber-400" />;
      case 'live':
        return <Radio className="w-6 h-6 text-red-400 animate-pulse" />;
      default:
        return <Bell className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed top-20 left-4 sm:left-6 z-50 max-w-md w-full animate-slideDown pointer-events-auto">
      <div className="bg-slate-900/95 border border-emerald-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl relative space-y-2">
        <button
          onClick={() => {
            setToast(null);
            if (clearLatestNotificationToast) clearLatestNotificationToast();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
            {getIcon(toast.type)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                🔔 Notification Enseignant en Direct
              </span>
              <span className="text-[10px] text-slate-400 font-mono">À l'instant</span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">{toast.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{toast.text}</p>
            {toast.author && (
              <span className="text-[10px] text-amber-300 font-medium block">
                Par: {toast.author}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
