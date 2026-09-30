import React, { useState } from 'react';
import {
  Wifi,
  MessageSquare,
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Send,
  GraduationCap
} from 'lucide-react';

export const OnlineTeachersPage = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 't-1',
      name: 'Prof. Baltasar Nsue Ondo',
      title: 'Professeur de Mathématiques & Physique (Secondaire / Baccalauréat)',
      location: 'Bata & UNGE (Río Muni)',
      status: 'Online',
      specialty: 'Équations, Géométrie, Mécanique et Statistique',
      phone: '+240 222 88 44 20',
      activeLevel: 'Secondaire & Baccalauréat',
      avatarUrl: null
    },
    {
      id: 't-2',
      name: 'Dra. Solange Nguema Avomo',
      title: 'Enseignante en Sciences Naturelles & Biologie',
      location: 'Malabo (Île de Bioko)',
      status: 'Online',
      specialty: 'Botanique, Écologie Rurale et Chimie Organique',
      phone: '+240 222 99 33 11',
      activeLevel: 'Secondaire & FP',
      avatarUrl: null
    },
    {
      id: 't-3',
      name: 'Prof. Carmen Ruiz Nchama',
      title: 'Spécialiste Pédagogique du Primaire (1ère à 6ème)',
      location: 'Ebebiyín (Kié-Ntem)',
      status: 'Online',
      specialty: 'Arithmétique de Base, Fiches d\'Étude et Lecture',
      phone: '+240 222 55 22 11',
      activeLevel: 'Primaire (1ère à 6ème)',
      avatarUrl: null
    }
  ]);

  const [search, setSearch] = useState('');
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase()) ||
    t.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendDirectQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setToastMsg(`Votre question a été envoyée avec succès à ${selectedTeacherModal.name} ! Il vous répondra sous peu.`);
    setQuestionText('');
    setSelectedTeacherModal(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* Encabezado Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Wifi className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30 mb-1 inline-block">
              Réseau d'Enseignants • Guinée Équatoriale
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white">Enseignants Connectés En Ligne</h1>
            <p className="text-xs text-slate-300">Posez vos questions en direct à vos professeurs de Malabo, Bata et Ebebiyín.</p>
          </div>
        </div>

        <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center shrink-0">
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Disponibilité</span>
          <strong className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> 3 Enseignants En Ligne
          </strong>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Búsqueda */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un professeur par nom, spécialité ou ville (Malabo, Bata...)..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid de Profesores en Línea */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredTeachers.map(t => (
          <div
            key={t.id}
            className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3 flex flex-col justify-between shadow-xl hover:border-emerald-500/50 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> EN LIGNE MAINTENANT
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-emerald-400" /> {t.location}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                  {t.name.charAt(6) || 'P'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{t.name}</h3>
                  <span className="text-[11px] text-amber-300 font-semibold block">{t.title}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">SPÉCIALITÉ PÉDAGOGIQUE</span>
                <p className="text-slate-200">{t.specialty}</p>
                <div className="pt-1 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> Niveau : {t.activeLevel}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedTeacherModal(t)}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Envoyer la Question à l'Enseignant
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Consulta Rápida */}
      {selectedTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1 inline-block">
                  🟢 Enseignant En Ligne
                </span>
                <h3 className="text-base font-bold text-white">{selectedTeacherModal.name}</h3>
                <p className="text-xs text-slate-400">{selectedTeacherModal.title}</p>
              </div>
              <button
                onClick={() => setSelectedTeacherModal(null)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendDirectQuestion} className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">Rédiger la Question Éducative *</label>
              <textarea
                required
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder={`Écrivez votre question sur les Mathématiques, la Physique ou les cours pour ${selectedTeacherModal.name}...`}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeacherModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" /> Envoyer le Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
