import React, { useState } from 'react';
import {
  Wifi,
  Users,
  MapPin,
  BookOpen,
  Smartphone,
  Laptop,
  CheckCircle2,
  RefreshCw,
  Search,
  Radio,
  Sparkles
} from 'lucide-react';

export const AdminOnlineStudents = () => {
  const [onlineList, setOnlineList] = useState([
    {
      id: 'st-on-1',
      name: 'Mariano Nsue Nchama',
      email: 'estudiante@educ-eg.org',
      location: 'Malabo (Île de Bioko)',
      school: 'Lycée National Rey Malabo',
      status: 'Online',
      currentCourse: 'Mathématiques Secondaire: Équations du Second Degré',
      lastAction: 'Évaluation du Module 1 en cours',
      device: 'Smartphone Android (PWA Hors-Ligne)',
      level: 4,
      xp: 680,
      ipNode: 'Nœud Malabo USB-01'
    },
    {
      id: 'st-on-2',
      name: 'Esperanza Obono Nsue',
      email: 'esperanza.obono@educ-eg.org',
      location: 'Bata (Río Muni)',
      school: 'Instituto Politécnico de Bata',
      status: 'Online',
      currentCourse: 'Physique et Chimie: Réactions',
      lastAction: 'Lecture du Guide Pédagogique PDF',
      device: 'Tablette Éducative 10"',
      level: 3,
      xp: 450,
      ipNode: 'Nœud Bata Central-04'
    },
    {
      id: 'st-on-3',
      name: 'Pascal Eto\'o Nchama',
      email: 'pascal.etoo@educ-eg.org',
      location: 'Malabo (Caracolas)',
      school: 'Instituto Nacional de Malabo',
      status: 'Online',
      currentCourse: 'Cours Complet de Mathématiques',
      lastAction: 'Consultation des Formules d\'Algèbre',
      device: 'Ordinateur Portable Lenovo (Mode Scolaire)',
      level: 2,
      xp: 310,
      ipNode: 'Nœud Malabo USB-02'
    },
    {
      id: 'st-on-4',
      name: 'Juan Antonio Nguema',
      email: 'juan.nguema@educ-eg.org',
      location: 'Ebebiyín (Kié-Ntem)',
      school: 'École Rurale Ebebiyín',
      status: 'Recent',
      currentCourse: 'Agroécologie & Développement Rural',
      lastAction: 'Progression synchronisée il y a 15 min',
      device: 'Smartphone Android',
      level: 5,
      xp: 890,
      ipNode: 'Nœud Ebebiyín USB-01'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const filtered = onlineList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.currentCourse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = onlineList.filter(s => s.status === 'Online').length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Wifi className="w-6 h-6 animate-pulse text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30 mb-1 inline-block">
              Surveillance en Temps Réel • Guinée Équatoriale
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white">Élèves En Ligne & Nœuds Actifs</h1>
            <p className="text-xs text-slate-300">Supervision des élèves connectés au réseau local PWA et impulsions de synchronisation.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center shrink-0">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">En Ligne Maintenant</span>
            <strong className="text-lg font-extrabold text-emerald-400 flex items-center justify-center gap-1">
              <Radio className="w-4 h-4 text-emerald-400 animate-ping" /> {onlineCount} Élèves
            </strong>
          </div>

          <button
            onClick={handleRefresh}
            className={`p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Actualiser la surveillance"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer par élève, ville (Malabo, Bata...) ou cours..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid de Estudiantes en Línea */}
      <div className="space-y-4">
        {filtered.map(st => (
          <div
            key={st.id}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3 hover:border-indigo-500/50 transition-all shadow-xl"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                  {st.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{st.name}</span>
                    {st.status === 'Online' ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> EN LIGNE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        RÉCENT (Il y a 15 min)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {st.location} • {st.school}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                  {st.ipNode}
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Niveau {st.level} • {st.xp} XP
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">COURS EN COURS D'ÉTUDE</span>
                <strong className="text-emerald-300">{st.currentCourse}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">DERNIÈRE ACTION EN DIRECT</span>
                <span className="text-slate-200">{st.lastAction}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">APPAREIL UTILISÉ</span>
                <span className="text-indigo-300 font-semibold">{st.device}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
