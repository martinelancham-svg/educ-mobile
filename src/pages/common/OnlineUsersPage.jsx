import React, { useState } from 'react';
import {
  Wifi,
  Users,
  GraduationCap,
  UserCheck,
  MapPin,
  BookOpen,
  Smartphone,
  Laptop,
  CheckCircle2,
  RefreshCw,
  Search,
  Radio,
  Sparkles,
  MessageSquare,
  Send,
  Phone,
  Award,
  Zap,
  Globe
} from 'lucide-react';

export const OnlineUsersPage = ({ initialTab = 'teachers' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Estado de Profesores en Línea ──────────────────────────────────────────
  const [teachers, setTeachers] = useState([
    {
      id: 't-1',
      name: 'Prof. Baltasar Nsue Ondo',
      title: 'Professeur de Mathématiques & Physique (Secondaire / Baccalauréat)',
      location: 'Bata & UNGE (Río Muni)',
      status: 'Online',
      specialty: 'Équations du Second Degré, Géométrie, Mécanique et Statistique',
      phone: '+240 222 88 44 20',
      activeLevel: 'Secondaire & Baccalauréat',
      currentActivity: 'Gestion du forum de questions de 4ème Secondaire',
      device: 'Ordinateur Portable Lenovo ThinkPad (Réseau UNGE Bata)',
      node: 'Nœud Bata Central-01'
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
      currentActivity: 'Révision du questionnaire de Chimie Lavoisier',
      device: 'Tablette Samsung Tab S8 (Réseau Malabo-02)',
      node: 'Nœud Malabo USB-02'
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
      currentActivity: 'Publication de fiches de lecture interactive',
      device: 'Smartphone Galaxy A54 (Serveur Local Ebebiyín)',
      node: 'Nœud Ebebiyín USB-01'
    }
  ]);

  // ─── Estado de Estudiantes en Línea ─────────────────────────────────────────
  const [students, setStudents] = useState([
    {
      id: 'st-on-1',
      name: 'Mariano Nsue Nchama',
      email: 'etudiant@educ-eg.org',
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
      school: 'Institut Polytéchnique de Bata',
      status: 'Online',
      currentCourse: 'Physique et Chimie: Réactions Chimiques',
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
      lastAction: 'Consultation des Formules d\'Algèbre Audio',
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

  // Modal de Consulta Rápida a Profesor
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setToastMsg(`Question envoyée avec succès à ${selectedTeacherModal.name}! Il vous répondra sur le forum en direct.`);
    setQuestionText('');
    setSelectedTeacherModal(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.currentCourse.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOnline = teachers.filter(t => t.status === 'Online').length + students.filter(s => s.status === 'Online').length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ─── Encabezado Principal ───────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Wifi className="w-6 h-6 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
                Moniteur en Temps Réel • Guinée Équatoriale
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-400 animate-pulse" /> Nœuds Malabo, Bata & Ebebiyín
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Annuaire des Utilisateurs en Ligne</h1>
            <p className="text-xs text-slate-300">Visualisez en direct les enseignants disponibles et les élèves actifs sur le réseau local/en ligne.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Actualiser l'état du réseau"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Rafraîchir Réseau</span>
          </button>

          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Connectés</span>
            <strong className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5 justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> {totalOnline} En Direct
            </strong>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── Pestañas y Buscador ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80">
        
        {/* Switch de Pestañas */}
        <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Enseignants ({teachers.length})</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px]">3 En Ligne</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Élèves ({students.length})</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-emerald-300 text-[10px]">3 En Ligne</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'teachers' ? "Rechercher enseignant, matière ou ville..." : "Rechercher élève, école ou cours..."}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* ─── VISTA 1: PROFESORES EN LÍNEA ───────────────────────────────── */}
      {activeTab === 'teachers' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeachers.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900/90 p-5 rounded-3xl border border-amber-500/30 space-y-4 shadow-xl hover:border-amber-500/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Avatar + Status */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                        {t.name.charAt(6) || 'P'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white leading-snug">{t.name}</h3>
                        <p className="text-xs text-amber-300 font-medium">{t.title}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {t.location}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      En Ligne
                    </span>
                  </div>

                  {/* Especialidad & Actividad */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Spécialité Principale</span>
                      <p className="font-bold text-slate-200">{t.specialty}</p>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> {t.currentActivity}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{t.node}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTeacherModal(t)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Envoyer Consultation Rapide
                  </button>

                  <a
                    href={`tel:${t.phone.replace(/\s+/g, '')}`}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title={`Appeler le ${t.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── VISTA 2: ESTUDIANTES EN LÍNEA ──────────────────────────────── */}
      {activeTab === 'students' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                className="bg-slate-900/90 p-5 rounded-3xl border border-emerald-500/30 space-y-4 shadow-xl hover:border-emerald-500/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Encabezado del Estudiante */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white leading-snug">{s.name}</h3>
                        <p className="text-xs text-emerald-400 font-medium">{s.school}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {s.location}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shrink-0 ${
                      s.status === 'Online'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${s.status === 'Online' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                      {s.status === 'Online' ? 'En Direct' : 'Récent'}
                    </span>
                  </div>

                  {/* Curso Actual & Dispositivo */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cours Actif</span>
                      <p className="font-bold text-slate-200">{s.currentCourse}</p>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-teal-400" /> {s.device}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{s.ipNode}</span>
                    </div>
                  </div>
                </div>

                {/* Métricas XP / Nivel & Acción Contactar */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Niveau {s.level}
                      </span>
                      <span className="text-slate-400 text-[11px] font-semibold">
                        {s.xp} XP Cumulés
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 italic">
                      {s.lastAction}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTeacherModal(s);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Contacter l'Élève
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL CONSULTA RÁPIDA A PROFESOR ───────────────────────────── */}
      {selectedTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg border border-amber-500/30">
                  💬
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Consultation Directe en Ligne</h3>
                  <p className="text-xs text-amber-300">{selectedTeacherModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacherModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Fermer
              </button>
            </div>

            <form onSubmit={handleSendQuestion} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Écrivez votre question académique pour l'enseignant:</label>
                <textarea
                  rows={4}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder={`Ex: Bonjour ${selectedTeacherModal.name}, j'ai une question...`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeacherModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Envoyer Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
