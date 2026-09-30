import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import {
  ShieldCheck,
  User,
  Users,
  Award,
  DollarSign,
  Wifi,
  BellRing,
  Clock,
  Archive,
  FileSpreadsheet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  UserCheck,
  CheckCircle2,
  Headphones,
  Share2,
  Bot,
  Brain,
  Library,
  CalendarCheck,
  Search,
  X,
  FileCheck2,
  Lock
} from 'lucide-react';

export const ADMIN_MENU_ITEMS = [
  { id: 'admin-profile', label: 'Profil Admin', icon: User, badge: 'Profil' },
  { id: 'admin-archived', label: 'Archives & En Attente', icon: Archive },
  { id: 'audiobooks', label: 'Livres Audio & Pods', icon: Headphones, badge: 'Audio MP3' },
  { id: 'digital-library', label: 'Bibliothèque Numérique', icon: Library, badge: 'Multimedia' },
  { id: 'admin-grades', label: 'Notes & Résultats Généraux', icon: FileCheck2, badge: 'Notes' },
  { id: 'teacher-channels', label: 'Canaux & Réseaux', icon: Share2, badge: 'Réseaux' },
  { id: 'admin-dash', label: 'Console de Contrôle', icon: ShieldCheck },
  { id: 'admin-export', label: 'Exporter Pack USB', icon: FileSpreadsheet },
  { id: 'admin-reminders', label: 'Gestionnaire de Rappels', icon: Clock },
  { id: 'admin-teacher-requests', label: 'Licences Enseignants', icon: Award, badgeCount: 1 },
  { id: 'student-list', label: 'Liste des Étudiants', icon: Users, badge: 'Étudiants' },
  { id: 'teacher-list', label: 'Liste des Enseignants', icon: Award, badge: 'Enseignants' },
  { id: 'admin-notifications', label: 'Panneau de Notifications', icon: BellRing, badgeCount: 3 },
  { id: 'admin-tutoring-pricing', label: 'Tarifs Cours Particuliers', icon: DollarSign, badge: 'Tarifs' },
  { id: 'admin-online-students', label: 'Enseignants & Étudiants', icon: Wifi, badge: '🟢 7 En Direct' },
  { id: 'secure-exams', label: 'Salles d\'Examen Sécurisées', icon: Lock, badge: '🔒 Contrôle' },
  { id: 'admin-student-requests', label: 'Demandes des Étudiants', icon: Users, badgeCount: 2 },
  { id: 'admin-users', label: 'Utilisateurs & Permissions', icon: UserCheck }
];

export const AdminSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout, pendingTeachers, pendingStudents, tutoringRequests } = useAuth();
  const { isEffectiveOffline } = useOffline();

  const [filterQuery, setFilterQuery] = useState('');

  const profileItem = ADMIN_MENU_ITEMS.find(item => item.id === 'admin-profile');
  const otherItems = ADMIN_MENU_ITEMS.filter(item => item.id !== 'admin-profile')
    .sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));
  const sortedMenuItems = profileItem ? [profileItem, ...otherItems] : otherItems;

  const filteredMenuItems = sortedMenuItems.filter(item =>
    !filterQuery || item.label.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  const totalPending = (pendingTeachers.length || 0) + ((pendingStudents || []).length || 0);

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
        className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900/95 border-r border-purple-500/40 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          isOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-purple-500/30">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              {isOpen && (
                <div className="truncate">
                  <h2 className="text-sm font-extrabold text-white tracking-tight">EDUC-EG</h2>
                  <span className="text-[10px] text-purple-300 font-bold block">Console Admin</span>
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

          <div className="p-3 border-b border-slate-800/80 bg-purple-950/20 shrink-0 flex items-center justify-center lg:justify-start">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Admin Avatar"
                  onClick={() => handleNavClick('admin-profile')}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-purple-500/50 shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-md"
                  title={`Profil Admin: ${user.name}`}
                />
              ) : (
                <div
                  onClick={() => handleNavClick('admin-profile')}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-base shrink-0 cursor-pointer shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
                  title={`Profil Admin: ${user?.name || 'Admin'}`}
                >
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
              )}
              {isOpen && (
                <div className="truncate">
                  <h3 className="text-xs font-bold text-white truncate">{user?.name || 'Administrateur Admin'}</h3>
                  <span className="text-[10px] text-purple-300 font-semibold block">Super Admin</span>
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
                placeholder="Filtrer le menu admin..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
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
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-extrabold shadow-lg shadow-purple-500/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-400 group-hover:scale-110 transition-transform'}`} />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>

                  {isOpen && (
                    <div className="flex items-center gap-1">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          isActive ? 'bg-slate-950 text-purple-300' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.badgeCount && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-slate-950 text-purple-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.id === 'admin-student-requests' ? (pendingStudents?.length || 0) : item.id === 'admin-teacher-requests' ? pendingTeachers.length : item.badgeCount}
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
