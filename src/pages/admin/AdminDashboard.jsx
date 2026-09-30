import React, { useState } from 'react';
import { INITIAL_ADMIN_STATS } from '../../data/initialMockData';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DownloadCloud,
  HardDrive,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  FileText,
  UserCheck,
  Clock,
  Phone,
  GraduationCap,
  Calendar,
  Lock
} from 'lucide-react';

export const AdminDashboard = ({ onNavigateToExport, onNavigateToSecureExams }) => {
  const {
    pendingTeachers, approveTeacherApplication, rejectTeacherApplication, approveAllPendingTeachers,
    pendingStudents, approveStudentApplication, rejectStudentApplication, approveAllPendingStudents,
    tutoringRequests, acceptTutoringRequest, rejectTutoringRequest, acceptAllTutoringRequests,
    approveAllPendingRequests
  } = useAuth();
  const stats = INITIAL_ADMIN_STATS || {
    totalUsers: 1240,
    activeCourses: 18,
    pendingApprovals: 1,
    totalStorageGB: '6.2 GB',
    offlineDownloadsCount: 4890
  };

  const [notificationMsg, setNotificationMsg] = useState('');
  const [studentToast, setStudentToast] = useState('');
  const [tutoringToast, setTutoringToast] = useState('');

  const totalPendingCount = (pendingTeachers.length || 0) + ((pendingStudents || []).length || 0) + ((tutoringRequests || []).filter(r => r.status === 'Pending').length || 0);

  const handleApproveTeacher = (appId, teacherName) => {
    approveTeacherApplication(appId);
    setNotificationMsg(`Demande approuvée! ${teacherName} est maintenant un Enseignant Approuvé et peut créer des cours.`);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleRejectTeacher = (appId, teacherName) => {
    rejectTeacherApplication(appId);
    setNotificationMsg(`Demande de ${teacherName} refusée.`);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 mb-2 inline-block">
            Panneau d'Administration Globale
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Console de Contrôle EDUC-EG</h1>
          <p className="text-xs text-slate-300">Gestion des utilisateurs, supervision des salles d'examen et exportation régionale USB.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {totalPendingCount > 0 && (
            <button
              onClick={() => {
                approveAllPendingRequests();
                setNotificationMsg(`Accepté avec succès TOUTES les ${totalPendingCount} demandes en attente sur la plateforme!`);
                setTimeout(() => setNotificationMsg(''), 5000);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/30 cursor-pointer hover:scale-[1.03] transition-transform"
            >
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
              ⚡ Approuver TOUT ({totalPendingCount})
            </button>
          )}

          <button
            onClick={onNavigateToSecureExams}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-red-500/25 cursor-pointer transition-transform hover:scale-105"
          >
            <Lock className="w-5 h-5" />
            Salles d'Examen Sécurisé
          </button>

          <button
            onClick={onNavigateToExport}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/30 cursor-pointer"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Exporter Paquet USB
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Grid de Métricas Administrador */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Utilisateurs Inscrits</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.totalUsers}</p>
          <span className="text-[11px] text-slate-400">{stats.studentsCount} Étudiants • {stats.teachersCount} Enseignants</span>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Demandes Étudiants</span>
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-300">{(pendingStudents || []).length}</p>
          <span className="text-[11px] text-emerald-400 font-bold">En Attente d'Approbation</span>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Demandes Enseignants</span>
            <UserCheck className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-300">{pendingTeachers.length}</p>
          <span className="text-[11px] text-amber-400 font-bold">En Attente d'Approbation</span>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Téléchargements Cumulés</span>
            <DownloadCloud className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.offlineDownloadsCount}</p>
          <span className="text-[11px] text-slate-400">Total en zones rurales</span>
        </div>
      </div>

      {/* SOLICITUDES DE REGISTRO DE PROFESORES CON LICENCIA, TELÉFONO Y CV */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-amber-500/40 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Demandes d'Inscription d'Enseignants (En Attente d'Approbation)
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30">
              {pendingTeachers.length} Demandes
            </span>
            {pendingTeachers.length > 0 && (
              <button
                onClick={() => {
                  approveAllPendingTeachers();
                  setNotificationMsg('Toutes les licences d\'enseignants ont été approuvées avec succès!');
                  setTimeout(() => setNotificationMsg(''), 4000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" /> Approuver Tous les Enseignants
              </button>
            )}
          </div>
        </div>

        {pendingTeachers.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-700 text-slate-400 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-300">Aucune demande d'enseignant en attente</p>
            <p className="text-slate-500 mt-1">Toutes les licences d'enseignement ont été vérifiées et approuvées.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTeachers.map(app => (
              <div
                key={app.id}
                className="bg-slate-850 p-6 rounded-2xl border border-amber-500/30 space-y-4 hover:border-amber-500/60 transition-all shadow-xl"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        EN ATTENTE D'APPROBATION ADMIN
                      </span>
                      <span className="text-xs text-slate-400">Demandé : {app.appliedDate || 'Aujourd\'hui'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{app.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{app.email}</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Phone className="w-3 h-3" /> {app.phoneNumber || '+240 222 55 44 33'}
                      </span>
                    </div>
                  </div>

                  {/* Acciones de Aprobación */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => handleApproveTeacher(app.id, app.name)}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approuver Licence & Activer
                    </button>
                    <button
                      onClick={() => handleRejectTeacher(app.id, app.name)}
                      className="px-4 py-2.5 bg-slate-800 text-red-400 hover:bg-red-500/20 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      Refuser
                    </button>
                  </div>
                </div>

                {/* Detalles de Licencia, Teléfono, Experiencia, Escuelas y CV */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">NUMÉRO DE LICENCE</span>
                    <strong className="text-amber-300 font-mono text-xs">{app.licenseNumber}</strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">TÉLÉPHONE / WHATSAPP</span>
                    <strong className="text-emerald-400 font-mono text-xs">{app.phoneNumber || '+240 222 55 44 33'}</strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">ANNÉES D'EXPÉRIENCE</span>
                    <strong className="text-slate-200">{app.experienceYears}</strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">SPÉCIALITÉ</span>
                    <strong className="text-emerald-400">{app.specialty || 'Secondaire / ESBA'}</strong>
                  </div>

                  <div className="sm:col-span-3 space-y-1 pt-2 border-t border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">LIEUX DE TRAVAIL ET ÉTABLISSEMENTS PRÉCÉDENTS</span>
                    <p className="text-slate-300">{app.workplaces}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">CURRICULUM VITAE (CV)</span>
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold hover:underline cursor-pointer">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{app.cvFile || 'CV_Professeur.pdf'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PANEL DE GESTIÓN DE SOLICITUDES DE CLASES PARTICULARES */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-teal-500/40 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            Demandes de Cours Particuliers (Gestion Administrative)
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30">
              {(tutoringRequests || []).filter(r => r.status === 'Pending').length} En Attente
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-full border border-slate-700">
              {(tutoringRequests || []).length} Total
            </span>
          </div>
        </div>

        {tutoringToast && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{tutoringToast}</span>
          </div>
        )}

        {(!tutoringRequests || tutoringRequests.length === 0) ? (
          <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-700 text-xs">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-slate-300">No hay solicitudes de clases particulares registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(tutoringRequests || []).map(req => (
              <div key={req.id} className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-3 hover:border-teal-500/40 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {req.status === 'Accepted' && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ ACCEPTÉE</span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">⏳ EN ATTENTE</span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">✗ REFUSÉE</span>
                      )}
                      <span className="text-[10px] text-slate-400">{req.format}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{req.studentName}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Phone className="w-3 h-3" /> {req.studentPhone}
                      </span>
                      <span className="text-slate-400">Enseignant : <strong className="text-amber-300">{req.teacherName}</strong></span>
                    </div>
                  </div>

                  {req.status === 'Pending' && (
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => {
                          acceptTutoringRequest(req.id);
                          setTutoringToast(`Cours particulier accepté pour ${req.studentName}.`);
                          setTimeout(() => setTutoringToast(''), 3500);
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Autoriser Cours
                      </button>
                      <button
                        onClick={() => {
                          rejectTutoringRequest(req.id);
                          setTutoringToast(`Demande de ${req.studentName} refusée.`);
                          setTimeout(() => setTutoringToast(''), 3000);
                        }}
                        className="px-4 py-2 bg-slate-800 text-red-400 border border-slate-700 hover:bg-red-500/20 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">MATIÈRE / SUJET</span>
                    <strong className="text-amber-300">{req.subject}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">DATE ET HEURE</span>
                    <strong className="text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" /> {req.preferredDate} • {req.preferredTime}
                    </strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">MODALITÉ</span>
                    <strong className="text-teal-400">{req.format}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
