import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useTheme } from '../context/ThemeContext';
import { DocumentReaderModal } from './DocumentReaderModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  Wifi,
  WifiOff,
  BookOpen,
  LogOut,
  ChevronDown,
  FileText,
  Sun,
  Moon,
  Headphones,
  Share2,
  Bot,
  Library,
  BookMarked,
  Target,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Users,
  Search,
  X,
  Filter,
  ArrowRight,
  ArrowLeft,
  Bell,
  BellRing,
  CheckCheck,
  CheckCircle2,
  Key
} from 'lucide-react';

export const SEARCHABLE_ITEMS = [
  // Cursos
  { id: 'c-1', category: 'courses', title: 'Mathématiques Supérieures & Préparation Examen', level: 'Secondaire & Baccalauréat', typeLabel: 'Cours', tab: 'catalog' },
  { id: 'c-2', category: 'courses', title: 'Physique Moderne: Lois de Newton & Thermodynamique', level: 'Baccalauréat', typeLabel: 'Cours', tab: 'catalog' },
  { id: 'c-3', category: 'courses', title: 'Informatique Pro: Réseaux Locaux & Serveurs', level: 'Formation Professionnelle', typeLabel: 'Cours', tab: 'catalog' },
  { id: 'c-4', category: 'courses', title: 'Chimie Organique: Réactions & Équilibres', level: 'Baccalauréat & Université', typeLabel: 'Cours', tab: 'catalog' },
  
  // Biblioteca
  { id: 'b-1', category: 'library', title: 'Manuel Officiel de Mathématiques', level: 'Secondaire / Baccalauréat', typeLabel: 'Livre PDF', tab: 'digital-library' },
  { id: 'b-2', category: 'library', title: 'Sujets d\'Examens Officiels & Corrigés 2026', level: 'Baccalauréat & Université', typeLabel: 'Examen Officiel', tab: 'digital-library' },
  { id: 'b-3', category: 'library', title: 'Physique Moderne: Lois de Newton PPT', level: 'Baccalauréat', typeLabel: 'Présentation PPT', tab: 'digital-library' },
  { id: 'b-4', category: 'library', title: 'Tableau Périodique Interactif & Formulaire Chimie', level: 'Secondaire & Baccalauréat', typeLabel: 'Guide PDF', tab: 'digital-library' },

  // Apuntes
  { id: 'n-1', category: 'notebook', title: 'Formules d\'Équations du Second Degré', level: 'Note Personnelle', typeLabel: 'Note', tab: 'digital-notebook' },
  { id: 'n-2', category: 'notebook', title: 'Résumé Loi d\'Ohm & Circuits Électriques', level: 'Note Personnelle', typeLabel: 'Note', tab: 'digital-notebook' },
  { id: 'n-3', category: 'notebook', title: 'Glossaire Technique Réseaux & IP Serveurs', level: 'Note Personnelle', typeLabel: 'Note', tab: 'digital-notebook' },

  // Estudiantes
  { id: 's-1', category: 'students', title: 'Mariano Nsue Nchama', level: '4ème Secondaire • Lycée Rey Malabo', typeLabel: 'Étudiant', tab: 'student-list' },
  { id: 's-2', category: 'students', title: 'Esperanza Obono Nguema', level: 'Baccalauréat • Inst. Polytechnique Bata', typeLabel: 'Étudiante', tab: 'student-list' },
  { id: 's-3', category: 'students', title: 'Pascal Eto\'o Nchama', level: '3ème Secondaire • Institut National', typeLabel: 'Étudiant', tab: 'student-list' }
];

export const Navbar = ({ activeTab, setActiveTab, onBack, canGoBack }) => {
  const { user, login, logout, activeRole, notifications, markAllNotificationsRead } = useAuth();
  const { toggleDarkLight, isLightMode } = useTheme();
  const {
    isEffectiveOffline,
    toggleOfflineSimulation,
    syncQueue
  } = useOffline();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showDocReader, setShowDocReader] = useState(false);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

  const visibleNotifications = (notifications || []).filter(n => {
    if (n.targetRoles && n.targetRoles.length > 0) {
      return n.targetRoles.includes(activeRole);
    }
    if (n.title.includes('Abandono') || n.title.includes('Cerrada Automáticamente') || n.title.includes('Incidencia')) {
      return activeRole === 'teacher' || activeRole === 'admin';
    }
    return true;
  });
  const unreadNotificationsCount = visibleNotifications.filter(n => !n.read).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sampleReaderDoc = {
    title: 'Guide Général d\'Étude & Examens (PDF / DOCX)',
    name: 'Guide_Etude_General_2026.pdf',
    targetLevel: 'Primaire, Secondaire & Baccalauréat',
    author: 'Prof. Baltasar Nsue Ondo',
    totalPages: 4
  };

  const handleQuickSwitchRole = (email, targetRole) => {
    login(email, '123', targetRole);
    setShowProfileMenu(false);
    if (targetRole === 'teacher') setActiveTab('teacher-dash');
    else if (targetRole === 'admin') setActiveTab('admin-dash');
    else setActiveTab('catalog');
  };

  const searchResults = SEARCHABLE_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      item.title.toLowerCase().includes(q) ||
      item.level.toLowerCase().includes(q) ||
      item.typeLabel.toLowerCase().includes(q)
    );
    return matchesCategory && matchesQuery;
  });

  const handleSelectSearchResult = (targetTab) => {
    setActiveTab(targetTab);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300 ${
      isLightMode
        ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
        : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl'
    }`}>
      {/* Banner de aviso cuando está sin conexión */}
      {isEffectiveOffline && (
        <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-100 animate-pulse" />
            <span>
              <strong>MODE HORS-LIGNE ACTIF:</strong> Fonctionnement avec les données locales IndexedDB. {syncQueue.length > 0 ? `(${syncQueue.length} actions en attente de synchronisation)` : ''}
            </span>
          </div>
          <button
            onClick={toggleOfflineSimulation}
            className="underline hover:text-amber-100 transition-colors text-[11px] cursor-pointer font-bold"
          >
            Reconnecter
          </button>
        </div>
      )}

      <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-13 gap-2">
          
          {/* Logo y Marca + Botón de Retroceder */}
          <div className="flex items-center gap-2 shrink-0">
            {onBack && (
              <button
                onClick={onBack}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer hover:scale-105 ${
                  isLightMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/80 text-slate-200'
                }`}
                title="Retourner à l'écran précédent"
              >
                <ArrowLeft className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Retour</span>
              </button>
            )}

            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setActiveTab(activeRole === 'teacher' ? 'teacher-dash' : activeRole === 'admin' ? 'admin-dash' : 'catalog')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4 text-slate-950 font-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-black text-sm sm:text-base tracking-tight ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                    EDUC-EG
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border uppercase ${
                    activeRole === 'teacher'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : activeRole === 'admin'
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {activeRole === 'teacher' ? 'Enseignant' : activeRole === 'admin' ? 'Admin' : 'Étudiant'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA Y FILTRADO GLOBAL */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-sm mx-1">
            <div className={`relative flex items-center rounded-xl border transition-all ${
              isLightMode
                ? 'bg-slate-100 border-slate-300 focus-within:border-emerald-500 focus-within:bg-white'
                : 'bg-slate-950/80 border-slate-700/80 focus-within:border-emerald-500 focus-within:bg-slate-950'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Rechercher cours, PDFs, élèves..."
                className={`w-full pl-8 pr-7 py-1 text-xs font-medium bg-transparent focus:outline-none ${
                  isLightMode ? 'text-slate-900 placeholder-slate-500' : 'text-white placeholder-slate-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* POPOVER DESPLEGABLE DE RESULTADOS Y FILTROS DE BÚSQUEDA GLOBAL */}
            {isSearchOpen && (searchQuery.trim().length > 0 || selectedCategory !== 'all') && (
              <div className={`absolute top-full left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] mt-2 rounded-3xl border shadow-2xl z-50 p-4 space-y-3 animate-fadeIn ${
                isLightMode
                  ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                  : 'bg-slate-900 border-slate-700 text-white shadow-black/80'
              }`}>
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Résultats de Recherche Globale
                  </span>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                    title="Fermer les résultats"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-amber-400" /> Filtrer:
                  </span>
                  {[
                    ['all', 'Tous'],
                    ['courses', '📚 Cours'],
                    ['library', '📖 Bibliothèque'],
                    ['notebook', '✍️ Notes'],
                    ['students', '👥 Élèves']
                  ].map(([cKey, cLabel]) => (
                    <button
                      key={cKey}
                      onClick={() => setSelectedCategory(cKey)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                        selectedCategory === cKey
                          ? 'bg-emerald-500 text-slate-950 font-black shadow'
                          : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      {cLabel}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar pt-1">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      Aucun résultat trouvé pour "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map(res => (
                      <div
                        key={res.id}
                        onClick={() => handleSelectSearchResult(res.tab)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                          isLightMode
                            ? 'bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                            : 'bg-slate-950 border-slate-800 hover:border-emerald-500/60 hover:bg-slate-850'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                              {res.typeLabel}
                            </span>
                            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                              {res.title}
                            </h4>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{res.level}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Navegación Rápida por Rol */}
          <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-2xl border ${
            isLightMode ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700/60'
          }`}>
            {activeRole === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('digital-notebook')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'digital-notebook'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <BookMarked className="w-3.5 h-3.5 text-amber-400" /> Notes
                </button>

                <button
                  onClick={() => setActiveTab('digital-library')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'digital-library'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Library className="w-3.5 h-3.5 text-indigo-400" /> Bibliothèque
                </button>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'catalog'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Catalogue
                </button>

                <button
                  onClick={() => setActiveTab('personal-goals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'personal-goals'
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-rose-400" /> Objectifs
                </button>

                <button
                  onClick={() => setActiveTab('ai-tutor')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === 'ai-tutor'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/30'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Tuteur IA
                </button>
              </>
            )}

            {activeRole === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('digital-library')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'digital-library'
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Library className="w-3.5 h-3.5 text-indigo-400" /> Bibliothèque
                </button>

                <button
                  onClick={() => setActiveTab('teacher-progress')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'teacher-progress'
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-amber-400" /> Objectifs Élèves
                </button>

                <button
                  onClick={() => setActiveTab('teacher-dash')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'teacher-dash'
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Espace Enseignant
                </button>
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('digital-library')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'digital-library'
                      ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Library className="w-3.5 h-3.5 text-purple-300" /> Bibliothèque
                </button>

                <button
                  onClick={() => setActiveTab('admin-dash')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'admin-dash'
                      ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Console Admin
                </button>

                <button
                  onClick={() => setActiveTab('admin-student-requests')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'admin-student-requests'
                      ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                      : isLightMode ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Demandes
                </button>
              </>
            )}
          </nav>

          {/* Controles de Estado de Red, Tema y Usuario */}
          <div className="flex items-center gap-1.5">

            <button
              onClick={toggleOfflineSimulation}
              className={`px-2.5 py-1 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isEffectiveOffline
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
              }`}
              title={isEffectiveOffline ? 'Mode Hors-Ligne simulé' : 'Connecté au réseau'}
            >
              {isEffectiveOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Hors-ligne</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">En Ligne</span>
                </>
              )}
            </button>

            <button
              onClick={toggleDarkLight}
              className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                isLightMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 hover:bg-amber-500/30'
                  : 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
              }`}
              title={isLightMode ? 'Basculer en Mode Sombre' : 'Basculer en Mode Clair'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {/* BARRA DE NOTIFICACIONES Y ALERTAS */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationsMenu(!showNotificationsMenu);
                  setShowProfileMenu(false);
                }}
                className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
                  unreadNotificationsCount > 0
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse'
                    : isLightMode
                      ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title="Barre de Notifications & Alertes"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-slate-900 animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Popover Desplegable de Notificaciones */}
              {showNotificationsMenu && (
                <div className={`absolute right-0 mt-2 w-80 sm:w-96 border rounded-3xl p-4 shadow-2xl z-50 animate-fadeIn space-y-3 ${
                  isLightMode
                    ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                    : 'bg-slate-900 border-slate-700 text-white shadow-black/80'
                }`}>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-extrabold">Barre de Notifications & Alertes</span>
                    </div>

                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" /> Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {visibleNotifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800">
                        Aucune notification récente
                      </div>
                    ) : (
                      visibleNotifications.slice(0, 10).map((n, idx) => (
                        <div
                          key={n.id || idx}
                          onClick={() => {
                            setShowNotificationsMenu(false);
                            if (n.title.includes('Examen') || n.title.includes('Sala') || n.title.includes('Abandono')) {
                              setActiveTab('secure-exams');
                            } else {
                              setActiveTab('notifications');
                            }
                          }}
                          className={`p-3 rounded-2xl border text-xs transition-all cursor-pointer space-y-1 ${
                            !n.read
                              ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20'
                              : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white text-[11px] truncate flex items-center gap-1.5">
                              {n.title.includes('Abandono') || n.title.includes('🚨') ? (
                                <span className="text-red-400">⚠️</span>
                              ) : n.title.includes('Examen') || n.title.includes('✅') ? (
                                <span className="text-emerald-400">✅</span>
                              ) : (
                                <span className="text-amber-400">📢</span>
                              )}
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">{n.text}</p>
                          {n.author && (
                            <span className="text-[9px] text-slate-400 block font-mono">Par: {n.author}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setShowNotificationsMenu(false);
                        setActiveTab('notifications');
                      }}
                      className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      Voir toutes les notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menú de Perfil de Usuario Logueado & Selector de Rol Demo */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-1.5 p-1 rounded-xl border transition-all cursor-pointer ${
                  isLightMode
                    ? 'bg-slate-100 border-slate-300 hover:border-slate-400'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-lg object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                )}
                <span className="text-[11px] font-semibold hidden md:inline truncate max-w-[90px]">
                  {user?.name || 'Utilisateur'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 mr-0.5" />
              </button>

              {/* Menú Desplegable de Perfil y Cambio Rápido de Rol */}
              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-64 border rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn space-y-3 ${
                  isLightMode
                    ? 'bg-white border-slate-200 text-slate-900'
                    : 'bg-slate-900 border-slate-700 text-white'
                }`}>
                  <div className="pb-2 border-b border-slate-800">
                    <p className="text-xs font-extrabold">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">{user?.school}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Changement Rapide de Rôle (Démo):
                    </span>

                    <button
                      onClick={() => handleQuickSwitchRole('admin@educ-eg.org', 'admin')}
                      className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        activeRole === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Administrateur</span>
                      {activeRole === 'admin' && <span className="text-[10px]">Actif</span>}
                    </button>

                    <button
                      onClick={() => handleQuickSwitchRole('estudiante@educ-eg.org', 'student')}
                      className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        activeRole === 'student'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Étudiant</span>
                      {activeRole === 'student' && <span className="text-[10px]">Actif</span>}
                    </button>

                    <button
                      onClick={() => handleQuickSwitchRole('profesor@educ-eg.org', 'teacher')}
                      className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        activeRole === 'teacher'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-amber-400" /> Enseignant</span>
                      {activeRole === 'teacher' && <span className="text-[10px]">Actif</span>}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <button
                      onClick={() => { setShowProfileMenu(false); setIsChangePassModalOpen(true); }}
                      className="w-full p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-amber-400" />
                      Changer le mot de passe
                    </button>
                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <DocumentReaderModal
        isOpen={showDocReader}
        onClose={() => setShowDocReader(false)}
        document={sampleReaderDoc}
      />

      <ChangePasswordModal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
      />
    </header>
  );
};
