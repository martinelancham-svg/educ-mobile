import React, { useState } from 'react';
import {
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  UserCheck,
  Filter,
  X,
  Mail,
  MapPin,
  ShieldAlert,
  UserPlus,
  ArrowUpDown
} from 'lucide-react';

export const INITIAL_SYSTEM_USERS = [
  { id: '1', name: 'Mariano Nsue Nchama', email: 'estudiante@educ-eg.org', role: 'student', status: 'Active', country: 'Guinée Équatoriale (Malabo)', school: 'Colegio Rey Malabo' },
  { id: '2', name: 'Esperanza Obono Nguema', email: 'esperanza.obono@educ-eg.org', role: 'student', status: 'Active', country: 'Guinée Équatoriale (Bata)', school: 'Inst. Politécnico Bata' },
  { id: '3', name: 'Prof. Baltasar Nsue Ondo', email: 'profesor@educ-eg.org', role: 'teacher', status: 'Active', country: 'Guinée Équatoriale (Bata / Malabo)', school: 'Inst. Politécnico & UNGE' },
  { id: '4', name: 'Prof. Isabel Carmen Avomo', email: 'isabel.avomo@educ-eg.org', role: 'teacher', status: 'Active', country: 'Guinée Équatoriale (Malabo)', school: 'Colegio Rey Malabo' },
  { id: '5', name: 'Super Admin GNQ', email: 'admin@educ-eg.org', role: 'admin', status: 'Active', country: 'Guinée Équatoriale (Malabo)', school: 'Ministère / DIP' },
  { id: '6', name: 'Emmanuel Olinga', email: 'emmanuel@educ-eg.org', role: 'student', status: 'Active', country: 'Cameroun (Yaoundé)', school: 'Lycée de Yaoundé' },
  { id: '7', name: 'Amina Diallo', email: 'amina@educ-eg.org', role: 'teacher', status: 'Suspended', country: 'Tchad (N\'Djamena)', school: 'Institut Ndjamena' },
  { id: '8', name: 'Koffi Mensah', email: 'koffi@educ-eg.org', role: 'student', status: 'Active', country: 'Togo (Lomé)', school: 'Collège de Lomé' }
];

export const UserManagement = () => {
  const [usersList, setUsersList] = useState(INITIAL_SYSTEM_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  // Filtrado de usuarios cruzado en tiempo real
  const filteredUsers = usersList.filter(u => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q) ||
      u.school.toLowerCase().includes(q)
    );

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || (
      (countryFilter === 'gnq' && u.country.includes('Guinea Ecuatorial')) ||
      (countryFilter === 'cmr' && u.country.includes('Camerún')) ||
      (countryFilter === 'tcd' && u.country.includes('Chad')) ||
      (countryFilter === 'tgo' && u.country.includes('Togo'))
    );

    return matchesSearch && matchesRole && matchesStatus && matchesCountry;
  });

  const toggleStatus = (id, name) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        setToastMsg(`Estado del usuario "${name}" actualizado a ${nextStatus === 'Active' ? '🟢 Activo' : '⛔ Suspendido'}`);
        setTimeout(() => setToastMsg(''), 4000);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleRoleChange = (id, name, newRole) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        setToastMsg(`Rol de "${name}" asignado a: ${newRole === 'teacher' ? 'Profesor' : newRole === 'admin' ? 'Administrador' : 'Estudiante'}`);
        setTimeout(() => setToastMsg(''), 4000);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCountryFilter('all');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ─── Encabezado Principal ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-3 py-0.5 rounded-full border border-purple-500/30 mb-1 inline-block">
              Console d'Administration Centrale
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Gestion des Utilisateurs, Rôles & Permissions</h1>
            <p className="text-xs text-slate-300">
              Contrôle d'accès pour étudiants, enseignants autorisés et administrateurs locaux en Guinée Équatoriale et région.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Utilisateurs</span>
            <strong className="text-lg font-black text-purple-300">{usersList.length}</strong>
          </div>
          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Actifs</span>
            <strong className="text-lg font-black text-emerald-400">✅ {usersList.filter(u => u.status === 'Active').length}</strong>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── BARRA DE BÚSQUEDA Y FILTRADO MULTI-CRITERIO DE USUARIOS ──────── */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-purple-400" /> Filtres Croisés d'Utilisateurs & Permissions
          </span>
          
          {(search || roleFilter !== 'all' || statusFilter !== 'all' || countryFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Réinitialiser Filtres
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Campo de búsqueda libre */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, e-mail, école ou pays..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Filtro por Rol */}
          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">🎭 Tous les Rôles</option>
              <option value="student">🎓 Étudiant</option>
              <option value="teacher">👨‍🏫 Enseignant</option>
              <option value="admin">🛡️ Administrateur</option>
            </select>
          </div>

          {/* Filtro por Estado */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">⚡ Tous les Statuts</option>
              <option value="Active">🟢 Actif</option>
              <option value="Suspended">⛔ Suspendu</option>
            </select>
          </div>

          {/* Filtro por País */}
          <div className="md:col-span-2">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">🌍 Tous les Pays</option>
              <option value="gnq">🇬🇶 Guinée Équatoriale</option>
              <option value="cmr">🇨🇲 Cameroun</option>
              <option value="tcd">🇹🇩 Tchad</option>
              <option value="tgo">🇹🇬 Togo</option>
            </select>
          </div>

        </div>
      </div>

      {/* ─── TABLA DE RESULTADOS DE USUARIOS ─────────────────────────────── */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl space-y-2">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Utilisateurs trouvés : <strong className="text-white">{filteredUsers.length}</strong></span>
          <span className="text-purple-300 font-semibold">🛡️ Contrôle des Permissions et Licences d'Accès</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Utilisateur / E-mail</th>
                <th className="p-4">Rôle Attribué</th>
                <th className="p-4">Pays & Établissement</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Aucun utilisateur ne correspond aux filtres appliqués.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-850/60 transition-colors">
                    
                    {/* Usuario & Email */}
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-extrabold">{user.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rol & Cambiar Rol */}
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, user.name, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer focus:outline-none ${
                          user.role === 'teacher'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : user.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        <option value="student">🎓 Étudiant</option>
                        <option value="teacher">👨‍🏫 Enseignant</option>
                        <option value="admin">🛡️ Administrateur</option>
                      </select>
                    </td>

                    {/* País & Escuela */}
                    <td className="p-4">
                      <div className="text-xs text-slate-200 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" /> {user.country}
                      </div>
                      <div className="text-[11px] text-slate-400">{user.school}</div>
                    </td>

                    {/* Estado Activo / Suspendido */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        user.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {user.status === 'Active' ? '🟢 Actif' : '⛔ Suspendu'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleStatus(user.id, user.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          user.status === 'Active'
                            ? 'bg-slate-800 text-red-400 border-slate-700 hover:bg-red-500/20'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {user.status === 'Active' ? 'Suspendre l\'accès' : 'Activer l\'accès'}
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
