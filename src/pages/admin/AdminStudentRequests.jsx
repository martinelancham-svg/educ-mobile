import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  Archive,
  PauseCircle,
  Phone,
  Calendar,
  Building,
  UserCheck,
  Search
} from 'lucide-react';

export const AdminStudentRequests = () => {
  const {
    pendingStudents,
    approveStudentApplication,
    rejectStudentApplication,
    approveAllPendingStudents
  } = useAuth();

  // Local state for handling "En Espera" and "Archivado" student requests
  const [onHoldStudents, setOnHoldStudents] = useState([
    {
      id: 'req-s-hold-1',
      name: 'Esperanza Obono Nsue',
      email: 'esperanza.obono@educ-eg.org',
      phoneNumber: '+240 222 99 11 22',
      role: 'student',
      age: '14',
      gradeLevel: '3° ESO',
      schoolName: 'Instituto Politécnico de Bata (Río Muni)',
      country: 'Guinea Ecuatorial (Bata)',
      isMinor: true,
      tutorName: 'Manuel Obono (Padre)',
      tutorPhone: '+240 222 44 33 22',
      status: 'OnHold',
      appliedDate: '2026-08-18'
    }
  ]);

  const [archivedStudents, setArchivedStudents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleApprove = (appId, name) => {
    approveStudentApplication(appId);
    setOnHoldStudents(prev => prev.filter(s => s.id !== appId));
    setToastMsg(`¡Solicitud de ${name} APROBADA exitosamente!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handlePutOnHold = (student) => {
    approveStudentApplication(student.id); // removes from pending
    setOnHoldStudents(prev => [{ ...student, status: 'OnHold' }, ...prev.filter(s => s.id !== student.id)]);
    setToastMsg(`Solicitud de ${student.name} colocada EN ESPERA para revisión.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleArchive = (student) => {
    approveStudentApplication(student.id); // removes from pending
    setOnHoldStudents(prev => prev.filter(s => s.id !== student.id));
    setArchivedStudents(prev => [{ ...student, status: 'Archived' }, ...prev.filter(s => s.id !== student.id)]);
    setToastMsg(`Solicitud de ${student.name} ARCHIVADA correctamente.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleReject = (appId, name) => {
    rejectStudentApplication(appId);
    setOnHoldStudents(prev => prev.filter(s => s.id !== appId));
    setToastMsg(`Solicitud de ${name} rechazada.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Combine lists for filtering
  const allPendingMapped = (pendingStudents || []).map(s => ({ ...s, status: 'Pending' }));
  const combinedList = [...allPendingMapped, ...onHoldStudents, ...archivedStudents];

  const filteredList = combinedList.filter(s => {
    if (activeFilter === 'pending') return s.status === 'Pending';
    if (activeFilter === 'onhold') return s.status === 'OnHold';
    if (activeFilter === 'archived') return s.status === 'Archived';
    if (searchQuery.trim()) {
      return (
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.schoolName && s.schoolName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  const pendingCount = (pendingStudents || []).length;
  const onHoldCount = onHoldStudents.length;
  const archivedCount = archivedStudents.length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* ─── Encabezado ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 mb-2 inline-block">
            Contrôle Administratif des Étudiants
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Demandes d'Inscription des Étudiants</h1>
          <p className="text-xs text-slate-300">Gestion complète: Approuver, Mettre en attente, Archiver ou Refuser les inscriptions.</p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={() => {
              approveAllPendingStudents();
              setToastMsg(`TOUTES les ${pendingCount} demandes d'étudiants ont été APPROUVÉES!`);
              setTimeout(() => setToastMsg(''), 4000);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer hover:scale-[1.03] transition-transform"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            ⚡ Approuver Tous les Étudiants ({pendingCount})
          </button>
        )}
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── Barra de Búsqueda y Filtros de Estado (Pendiente, En Espera, Archivado) ─── */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par élève, école ou email..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs flex-wrap gap-1">
          {[
            ['all', `Toutes (${combinedList.length})`],
            ['pending', `⏳ En Attente (${pendingCount})`],
            ['onhold', `⏸️ En Pause (${onHoldCount})`],
            ['archived', `📁 Archivées (${archivedCount})`]
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveFilter(val)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === val
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Lista de Solicitudes ───────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="p-10 text-center bg-slate-900/90 rounded-2xl border border-slate-700 text-slate-400 text-xs space-y-2">
            <GraduationCap className="w-10 h-10 mx-auto text-slate-600 opacity-60" />
            <p className="font-bold text-slate-300">Aucune demande d'étudiant dans cette catégorie</p>
          </div>
        ) : (
          filteredList.map((st) => (
            <div
              key={st.id}
              className="bg-slate-900/90 p-6 rounded-2xl border border-slate-700/80 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {st.status === 'Pending' && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ⏳ EN ATTENTE D'APPROBATION
                      </span>
                    )}
                    {st.status === 'OnHold' && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        ⏸️ EN ATTENTE DE RÉVISION
                      </span>
                    )}
                    {st.status === 'Archived' && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                        📁 ARCHIVÉE
                      </span>
                    )}
                    <span className="text-xs text-slate-400">Demandé : {st.appliedDate || 'Aujourd\'hui'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{st.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span>{st.email}</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Phone className="w-3.5 h-3.5" /> {st.phoneNumber || '+240 222 12 34 56'}
                    </span>
                  </div>
                </div>

                {/* Acciones del Administrador: Aprobar, En Espera, Archivar, Rechazar */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                  {st.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(st.id, st.name)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approuver Inscription
                    </button>
                  )}

                  {st.status !== 'OnHold' && (
                    <button
                      onClick={() => handlePutOnHold(st)}
                      className="px-3.5 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      title="Mettre la demande en attente"
                    >
                      <PauseCircle className="w-4 h-4" /> En Attente
                    </button>
                  )}

                  {st.status !== 'Archived' && (
                    <button
                      onClick={() => handleArchive(st)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      title="Archiver la demande"
                    >
                      <Archive className="w-4 h-4" /> Archiver
                    </button>
                  )}

                  <button
                    onClick={() => handleReject(st.id, st.name)}
                    className="px-3 py-2 bg-slate-800 text-red-400 hover:bg-red-500/20 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Refuser
                  </button>
                </div>
              </div>

              {/* Información Académica y del Tutor */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">COURS / NIVEAU</span>
                  <strong className="text-amber-300 font-bold">{st.gradeLevel || '4ème Secondaire'}</strong>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ÂGE</span>
                  <strong className="text-slate-200">{st.age || '15'} ans</strong>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ÉCOLE / ÉTABLISSEMENT ÉDUCATIF</span>
                  <strong className="text-emerald-400">{st.schoolName || st.school} ({st.country})</strong>
                </div>

                {st.isMinor && (
                  <div className="sm:col-span-4 pt-2 border-t border-slate-800 space-y-1 text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] font-extrabold uppercase block text-amber-400">DONNÉES DU TUTEUR LÉGAL (MINEUR) :</span>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <span><strong>Tuteur :</strong> {st.tutorName} ({st.tutorRelationship || 'Père/Mère'})</span>
                      <span><strong>Téléphone Tuteur :</strong> {st.tutorPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
