import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Flame, DownloadCloud, Trophy, Star, Sparkles, CheckCircle2 } from 'lucide-react';

export const StudentBadges = () => {
  const { user } = useAuth();

  const leaderboardMock = [
    { rank: 1, name: 'Emmanuel Olinga', xp: user.xpPoints, country: 'Camerún', avatar: '👨‍🎓' },
    { rank: 2, name: 'Fatou Ndiaye', xp: 410, country: 'Senegal', avatar: '👩‍🎓' },
    { rank: 3, name: 'Koffi Mensah', xp: 380, country: 'Togo', avatar: '👨‍🌾' },
    { rank: 4, name: 'Grace Kanza', xp: 320, country: 'R.D. Congo', avatar: '👩‍🏫' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Gamificación */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
            Gamification & Réussites Hors-Ligne
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Centre de Badges et Réussites</h1>
          <p className="text-xs text-slate-300">Gagnez des points XP en lisant des cours, en répondant aux quiz et en maintenant votre racha d'étude.</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-850 p-4 rounded-2xl border border-slate-700/80">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Niveau Actuel</span>
            <strong className="text-xl font-extrabold text-amber-300">Niveau {user.level}</strong>
          </div>
        </div>
      </div>

      {/* Grid de Insignias Desbloqueadas */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Vos Badges Débloqués ({user.badges ? user.badges.length : 0})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.badges && user.badges.map(badge => (
            <div key={badge.id} className="bg-slate-800/80 p-5 rounded-2xl border border-amber-500/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
                <Award className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{badge.desc}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Débloqué
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Regional */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Classement Régional des Étudiants (Afrique Centrale)
        </h2>

        <div className="space-y-2">
          {leaderboardMock.map(item => (
            <div
              key={item.rank}
              className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                item.rank === 1
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm w-6 text-center">{item.rank}</span>
                <span className="text-lg">{item.avatar}</span>
                <div>
                  <span className="font-bold text-white block">{item.name}</span>
                  <span className="text-[10px] text-slate-400">{item.country}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-extrabold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>{item.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
