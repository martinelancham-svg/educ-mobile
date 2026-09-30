import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import {
  User,
  BookOpen,
  TrendingUp,
  FileText,
  HelpCircle,
  Award,
  Bell,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Download,
  Flame,
  LogOut,
  WifiOff,
  Calculator,
  FlaskConical,
  GraduationCap,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  School,
  Briefcase,
  Wifi,
  Headphones,
  Share2,
  Bot,
  Brain,
  Target,
  BookMarked,
  Library,
  Search,
  X,
  Star,
  Lock,
  Radio
} from 'lucide-react';

export const STUDENT_MENU_ITEMS = [
  { id: 'profile', label: 'Profil Personnel', icon: User, badge: 'Profil' },
  { id: 'audiobooks', label: 'Livres Audio & Podcasts', icon: Headphones, badge: 'Audio MP3' },
  { id: 'digital-library', label: 'Bibliothèque Numérique', icon: Library, badge: 'Bibliothèque' },
  { id: 'grades-results', label: 'Notes & Certificats', icon: Award },
  { id: 'rate-teachers', label: 'Évaluer les Enseignants', icon: Star, badge: 'Avis' },
  { id: 'teacher-channels', label: 'Canaux & Réseaux', icon: Share2, badge: 'Réseaux' },
  { id: 'catalog', label: 'Catalogue des Cours', icon: BookOpen },
  { id: 'chat-forum', label: 'Chat & Forum', icon: MessageSquare, badgeCount: 2 },
  { id: 'student-live', label: 'Cours en Direct', icon: Radio, badge: '🔴 En Direct' },
  { id: 'downloads', label: 'Contenu Hors-Ligne', icon: Download },
  { id: 'digital-notebook', label: 'Cahier de Notes', icon: BookMarked, badge: 'Notes' },
  { id: 'downloadable-docs', label: 'Documents & Guides PDF', icon: FileText },
  { id: 'exams-quizzes', label: 'Examens & Quiz', icon: HelpCircle },
  { id: 'personal-goals', label: 'Mes Objectifs', icon: Target, badge: 'Objectifs' },
  { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: 3 },
  { id: 'online-teachers', label: 'Enseignants & Élèves', icon: Wifi, badge: '🟢 7 En Direct' },
  { id: 'secure-exams', label: 'Salles d\'Examen Sécurisées', icon: Lock, badge: '🔒 Examen' },
  { id: 'dashboard', label: 'Suivi des Progrès', icon: TrendingUp },
  { id: 'eso-exercises', label: 'Atelier d\'Exercices', icon: FlaskConical, badge: 'Atelier' },
  { id: 'ai-tutor', label: 'Tuteur IA 24/7', icon: Bot, badge: '🤖 IA Suite' }
];

export const StudentSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onSelectCourse }) => {
  const { user, logout, courses } = useAuth();
  const { isEffectiveOffline, offlineDownloads } = useOffline();

  const [filterQuery, setFilterQuery] = useState('');
  const [isCoursesAccordionOpen, setIsCoursesAccordionOpen] = useState(true);

  const profileItem = STUDENT_MENU_ITEMS.find(item => item.id === 'profile');
  const otherItems = STUDENT_MENU_ITEMS.filter(item => item.id !== 'profile')
    .sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));
  const sortedMenuItems = profileItem ? [profileItem, ...otherItems] : otherItems;

  const filteredMenuItems = sortedMenuItems.filter(item =>
    !filterQuery || item.label.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden animate-fadeIn"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900/95 border-r border-slate-700/80 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          isOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-emerald-500/20">
                <BookOpen className="w-5 h-5 stroke-[2.5]" />
              </div>
              {isOpen && (
                <div className="truncate">
                  <h2 className="text-sm font-extrabold text-white tracking-tight">EDUC-EG</h2>
                  <span className="text-[10px] text-emerald-400 font-bold block">Plateforme Éducative</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer hidden lg:flex"
              title={isOpen ? 'Réduire le menu' : 'Agrandir le menu'}
            >
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 border-b border-slate-800/80 bg-slate-850/50 shrink-0 flex items-center justify-center lg:justify-start">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Photo de Profil"
                  onClick={() => handleNavClick('profile')}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500/50 shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-md"
                  title={`Photo de Profil: ${user.name}`}
                />
              ) : (
                <div
                  onClick={() => handleNavClick('profile')}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-base shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                  title={`Photo de Profil: ${user?.name || 'Étudiant'}`}
                >
                  {user?.name ? user.name.charAt(0) : 'E'}
                </div>
              )}

              {isOpen && (
                <div className="truncate">
                  <h3 className="text-xs font-bold text-white truncate">{user?.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                      Niveau {user?.level || 1}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400" /> {user?.studyStreakDays || 1}j
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="p-2 border-b border-slate-800 shrink-0 relative bg-slate-950/40">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filtrer les options..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  title="Effacer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <nav className="flex-1 min-h-0 p-2 space-y-1 overflow-y-auto no-scrollbar">

            {filteredMenuItems.length === 0 && isOpen && (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                Aucune option trouvée
              </div>
            )}

            {filteredMenuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={!isOpen ? item.label : undefined}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-emerald-400 group-hover:scale-110 transition-transform'}`} />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>

                  {isOpen && (
                    <div className="flex items-center gap-1">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.badgeCount && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {item.badgeCount}
                        </span>
                      )}
                      {item.id === 'downloads' && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {offlineDownloads.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-900/90 space-y-2 shrink-0">
          {isOpen && isEffectiveOffline && (
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span>Connexion Hors-Ligne</span>
            </div>
          )}

          <button
            onClick={logout}
            className={`w-full p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:border-red-500/40 text-slate-300 hover:text-red-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer ${
              !isOpen ? 'px-0' : ''
            }`}
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4 text-red-400 shrink-0" />
            {isOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
