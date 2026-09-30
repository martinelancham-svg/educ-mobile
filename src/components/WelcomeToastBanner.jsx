import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Flame,
  X,
  Award,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Zap,
  BookOpen
} from 'lucide-react';

export const WelcomeToastBanner = () => {
  const { currentUser, isAuthenticated, activeRole } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [currentSessionUser, setCurrentSessionUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (!currentSessionUser || currentSessionUser.email !== currentUser.email || currentSessionUser.role !== currentUser.role) {
        setCurrentSessionUser(currentUser);
        setShowToast(true);

        const timer = setTimeout(() => {
          setShowToast(false);
        }, 6000);

        return () => clearTimeout(timer);
      }
    } else {
      setShowToast(false);
      setCurrentSessionUser(null);
    }
  }, [isAuthenticated, currentUser, activeRole]);

  if (!showToast || !currentUser) return null;

  const role = currentUser.role || activeRole || 'student';

  let badgeText = 'Connecté en tant qu\'Étudiant';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  let iconComp = GraduationCap;
  let title = `Bienvenue en tant qu'Étudiant, ${currentUser.name || 'Élève'}! 🚀`;
  let subtitle = 'Votre environnement d\'étude hors-ligne est prêt. Cours, examens et cahier de notes disponibles.';
  let highlightPills = [
    `🔥 Série: ${currentUser.studyStreakDays || 1} jours`,
    `⭐ XP: ${currentUser.xpPoints || 100} pts`,
    '🟢 100% Hors-Ligne'
  ];

  if (role === 'teacher') {
    badgeText = 'Connecté en tant qu\'Enseignant';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    iconComp = UserCheck;
    title = `Bienvenue en tant qu'Enseignant, ${currentUser.name || 'Docente'}! 📚`;
    subtitle = `Votre espace enseignant est actif (Licence ${currentUser.licenseNumber || 'LIC-ED-88420'}). Gestion des cours, examens et présence prête.`;
    highlightPills = [
      '📖 Dépôt Numérique',
      '🟢 Licence Validée'
    ];
  } else if (role === 'admin') {
    badgeText = 'Connecté en tant qu\'Administrateur';
    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    iconComp = ShieldCheck;
    title = `Bienvenue en tant qu'Administrateur, ${currentUser.name || 'Super Admin'}! ⚡`;
    subtitle = 'Console centrale EDUC-EG active. Gestion des licences d\'enseignants, annuaire et rapports à jour.';
    highlightPills = [
      '🛡️ Super Admin',
      '🟢 Base Synchronisée'
    ];
  }

  const IconComp = iconComp;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-slideDown pointer-events-auto">
      <div className="bg-slate-900/95 border border-emerald-500/50 rounded-3xl p-5 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl relative space-y-3">
        
        <button
          onClick={() => setShowToast(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20 shrink-0">
            <IconComp className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                {badgeText}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Session Ouverte
              </span>
            </div>

            <h3 className="text-sm font-black text-white leading-snug pt-0.5">
              {title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
          {highlightPills.map((pill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-slate-950 text-amber-400 font-extrabold text-[11px] border border-slate-800 flex items-center gap-1 shadow-inner"
            >
              {pill}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};
