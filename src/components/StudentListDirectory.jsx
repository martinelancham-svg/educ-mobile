import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  School,
  Phone,
  Mail,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  CalendarCheck,
  MapPin,
  Sparkles,
  Flame,
  Target,
  ChevronDown,
  ChevronUp,
  Award,
  UserX,
  FileSpreadsheet,
  MessageSquare,
  MessageCircle,
  Check
} from 'lucide-react';

export const INITIAL_REGISTERED_STUDENTS = [
  {
    id: 'std-101',
    name: 'Mariano Nsue Nchama',
    email: 'estudiante@educ-eg.org',
    phoneNumber: '+240 222 12 34 56',
    role: 'student',
    age: '16',
    gradeLevel: '4ème Secondaire',
    schoolName: 'Lycée National Rey Malabo (Île de Bioko)',
    country: 'Guinée Équatoriale (Malabo)',
    approvalStatus: 'Approved',
    isMinor: true,
    tutorName: 'Santiago Nsue',
    tutorPhone: '+240 222 77 88 99',
    tutorRelationship: 'Père',
    xpPoints: 340,
    studyStreakDays: 5,
    isOnline: true,
    personalGoal: {
      title: '🎯 Préparation 4ème Secondaire & Obtention du Diplôme',
      targetWeeklyHours: 12,
      progressPercent: 75,
      currentMilestone: 'Semaine 3: Équations du Second Degré & Cinématique'
    }
  },
  {
    id: 'std-102',
    name: 'Esperanza Obono Nguema',
    email: 'esperanza.obono@educ-eg.org',
    phoneNumber: '+240 222 99 11 22',
    role: 'student',
    age: '17',
    gradeLevel: '2ème Baccalauréat',
    schoolName: 'Institut Polytéchnique de Bata (Río Muni)',
    country: 'Guinée Équatoriale (Bata)',
    approvalStatus: 'Approved',
    isMinor: true,
    tutorName: 'Teresa Nguema',
    tutorPhone: '+240 222 55 66 77',
    tutorRelationship: 'Mère',
    xpPoints: 580,
    studyStreakDays: 12,
    isOnline: true,
    personalGoal: {
      title: '🏆 Examen de Sélectivité UNGE 2026',
      targetWeeklyHours: 16,
      progressPercent: 88,
      currentMilestone: 'Semaine 4: Annales Officielles des Examens UNGE'
    }
  },
  {
    id: 'std-103',
    name: 'Pascal Eto\'o Nchama',
    email: 'pascal.etoo@educ-eg.org',
    phoneNumber: '+240 222 88 44 21',
    role: 'student',
    age: '15',
    gradeLevel: '3ème Secondaire',
    schoolName: 'Institut National de Malabo',
    country: 'Guinée Équatoriale (Malabo)',
    approvalStatus: 'Pending',
    isMinor: true,
    tutorName: 'Joseph Eto\'o',
    tutorPhone: '+240 222 33 22 11',
    tutorRelationship: 'Tuteur Légal',
    xpPoints: 120,
    studyStreakDays: 2,
    isOnline: false,
    personalGoal: {
      title: '📘 Renforcement en Mathématiques & Sciences',
      targetWeeklyHours: 10,
      progressPercent: 40,
      currentMilestone: 'Semaine 2: Algèbre Polynômiale'
    }
  },
  {
    id: 'std-104',
    name: 'Salomé Mangue Avomo',
    email: 'salome.mangue@educ-eg.org',
    phoneNumber: '+240 222 44 55 66',
    role: 'student',
    age: '19',
    gradeLevel: 'FP Supérieur (Informatique & Réseaux)',
    schoolName: 'Centre de Formation Technique Ebebiyín',
    country: 'Guinée Équatoriale (Ebebiyín)',
    approvalStatus: 'Approved',
    isMinor: false,
    xpPoints: 420,
    studyStreakDays: 7,
    isOnline: false,
    personalGoal: {
      title: '💻 Spécialité FP en Réseaux & Maintenance Informatique',
      targetWeeklyHours: 14,
      progressPercent: 65,
      currentMilestone: 'Semaine 3: Configuration des Serveurs Locaux'
    }
  },
  {
    id: 'std-105',
    name: 'Lucas Ondo Mikue',
    email: 'lucas.ondo@educ-eg.org',
    phoneNumber: '+240 222 66 77 88',
    role: 'student',
    age: '11',
    gradeLevel: '6ème Primaire',
    schoolName: 'École Primaire Evinayong',
    country: 'Guinée Équatoriale (Evinayong)',
    approvalStatus: 'Approved',
    isMinor: true,
    tutorName: 'Carmen Mikue',
    tutorPhone: '+240 222 11 99 88',
    tutorRelationship: 'Mère',
    xpPoints: 210,
    studyStreakDays: 4,
    isOnline: false,
    personalGoal: {
      title: '🎒 Passage du Primaire au Secondaire',
      targetWeeklyHours: 8,
      progressPercent: 50,
      currentMilestone: 'Semaine 2: Fractions & Géométrie De Base'
    }
  }
];

export const StudentListDirectory = () => {
  const { activeRole, approveStudentApplication } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [students, setStudents] = useState(INITIAL_REGISTERED_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Estado de Asistencia por Estudiante en el Directorio
  const [attendanceMap, setAttendanceMap] = useState(() => {
    try {
      const saved = localStorage.getItem(`educ_attendance_${todayStr}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      'std-101': 'present',
      'std-102': 'present',
      'std-103': 'absent',
      'std-104': 'present',
      'std-105': 'tardy'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(`educ_attendance_${todayStr}`, JSON.stringify(attendanceMap));
    } catch (e) {
      console.error(e);
    }
  }, [attendanceMap, todayStr]);

  const handleSetStudentAttendance = (studentId, status, name) => {
    setAttendanceMap(prev => {
      const updated = { ...prev, [studentId]: status };
      const label = status === 'present' ? 'PRÉSENT' : status === 'absent' ? 'ABSENT' : status === 'justified' ? 'ABSENCE JUSTIFIÉE' : 'RETARD';
      setToastMsg(`Présence de ${name} mise à jour: ${label}`);
      setTimeout(() => setToastMsg(''), 3500);
      return updated;
    });
  };

  // Notificar inasistencia por WhatsApp al tutor
  const handleSendAbsenceNotice = (std) => {
    const text = encodeURIComponent(`Bonjour ${std.tutorName}, nous vous informons depuis la plateforme EDUC-EG qu'aujourd'hui (${todayStr}) une ABSENCE en classe a été enregistrée pour votre enfant ${std.name}. Nous restons à votre disposition.`);
    window.open(`https://wa.me/${std.tutorPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Algoritmo de filtrado avanzado en tiempo real
  const filteredStudents = students.filter(std => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      std.name.toLowerCase().includes(q) ||
      std.email.toLowerCase().includes(q) ||
      std.schoolName.toLowerCase().includes(q) ||
      std.gradeLevel.toLowerCase().includes(q)
    );

    const matchesGrade = gradeFilter === 'all' || (
      (gradeFilter === 'primaria' && std.gradeLevel.includes('Primaria')) ||
      (gradeFilter === 'eso' && std.gradeLevel.includes('ESO')) ||
      (gradeFilter === 'bach' && std.gradeLevel.includes('Bachillerato')) ||
      (gradeFilter === 'fp' && std.gradeLevel.includes('FP'))
    );

    const matchesStatus = statusFilter === 'all' || (
      (statusFilter === 'online' && std.isOnline) ||
      (statusFilter === 'pending' && std.approvalStatus === 'Pending') ||
      (statusFilter === 'approved' && std.approvalStatus === 'Approved')
    );

    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleApproveStudent = (id, name) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, approvalStatus: 'Approved' } : s));
    if (approveStudentApplication) approveStudentApplication(id);
    setToastMsg(`¡Solicitud del estudiante "${name}" aprobada exitosamente!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleToggleSuspendStudent = (id, name, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Suspended' : 'Approved';
    setStudents(prev => prev.map(s => s.id === id ? { ...s, approvalStatus: newStatus } : s));
    setToastMsg(`Estado del estudiante "${name}" cambiado a: ${newStatus === 'Approved' ? 'Aprobado' : 'Suspendido'}`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ─── Encabezado Principal ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-3 py-0.5 rounded-full border border-indigo-500/30 mb-1 inline-block">
              {activeRole === 'admin' ? 'Console d\'Administration Centrale' : 'Supervision Pédagogique des Enseignants'}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Annuaire Complet avec Suivi de Présence</h1>
            <p className="text-xs text-slate-300">
              Contrôle de présence quotidien (Présent, Absent, Justifié, Retard) et suivi des élèves en temps réel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Enregistrés</span>
            <strong className="text-lg font-black text-amber-400">{students.length} Élèves</strong>
          </div>
          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">En Ligne</span>
            <strong className="text-lg font-black text-emerald-400">🟢 {students.filter(s => s.isOnline).length}</strong>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── BARRA DE BÚSQUEDA Y FILTROS CRUZADOS ─────────────────────────── */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Campo de Búsqueda */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher élève par nom, e-mail, établissement..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filtro de Nivel Educativo */}
          <div className="md:col-span-3">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">🎓 Tous les Niveaux</option>
              <option value="primaria">🏫 Primaire (1ère-6ème)</option>
              <option value="eso">🎓 Secondaire</option>
              <option value="bach">🏅 Baccalauréat</option>
              <option value="fp">💼 FP Supérieur / Moyen</option>
            </select>
          </div>

          {/* Filtro de Estado de Aprobación */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">⚡ Tous les Statuts</option>
              <option value="online">🟢 Étudiants en Ligne</option>
              <option value="pending">🟡 En Attente d'Approbation</option>
              <option value="approved">✅ Licence Approuvée</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── LISTADO DE TARJETAS DE ESTUDIANTES CON CONTROL DE ASISTENCIA ───── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Affichage de <strong className="text-white">{filteredStudents.length}</strong> étudiants dans l'annuaire</span>
          <span className="text-emerald-400 font-semibold">🟢 Présence Synchronisée ({todayStr})</span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">Aucun étudiant trouvé selon les critères indiqués</h3>
            <p className="text-xs">Essayez de réinitialiser le terme de recherche ou les filtres de statut.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((std) => {
              const isExpanded = expandedStudentId === std.id;
              const currentAttStatus = attendanceMap[std.id] || 'present';

              return (
                <div
                  key={std.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-700/80 p-5 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Info Básica del Estudiante */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                          {std.name.charAt(0)}
                        </div>
                        {std.isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" title="En línea" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-extrabold text-white">{std.name}</h3>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${
                            std.approvalStatus === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : std.approvalStatus === 'Pending'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {std.approvalStatus === 'Approved' ? '✅ Licence Active' : std.approvalStatus === 'Pending' ? '🟡 En Attente d\'Approbation' : '⛔ Suspendu'}
                          </span>

                          {/* Badge de Estado de Asistencia Hoy */}
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase flex items-center gap-1 ${
                            currentAttStatus === 'present'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : currentAttStatus === 'absent'
                                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                : currentAttStatus === 'justified'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                  : 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                          }`}>
                            {currentAttStatus === 'present' ? '✅ Présent Aujourd\'hui' : currentAttStatus === 'absent' ? '❌ Absence Constatée' : currentAttStatus === 'justified' ? '🟡 Absence Justifiée' : '⏱️ Retard Aujourd\'hui'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-400"><Mail className="w-3.5 h-3.5" /> {std.email}</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold"><Phone className="w-3.5 h-3.5" /> {std.phoneNumber}</span>
                        </p>

                        <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                          <School className="w-3.5 h-3.5 text-indigo-400" />
                          <strong className="text-slate-200">{std.gradeLevel}</strong> • {std.schoolName}
                        </p>
                      </div>
                    </div>

                    {/* Stats & Botones de Acción */}
                    <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                      
                      <div className="text-right hidden sm:block pr-2 border-r border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Points & Série</span>
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1 justify-end">
                          <Sparkles className="w-3.5 h-3.5" /> {std.xpPoints} XP • 🔥 {std.studyStreakDays}j
                        </span>
                      </div>

                      {/* Acción Aprobar en Admin */}
                      {activeRole === 'admin' && std.approvalStatus === 'Pending' && (
                        <button
                          onClick={() => handleApproveStudent(std.id, std.name)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approuver Demande
                        </button>
                      )}

                      {/* Desplegar Ficha Técnica Completa */}
                      <button
                        onClick={() => setExpandedStudentId(isExpanded ? null : std.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? 'Masquer Fiche' : 'Voir Fiche'}
                      </button>
                    </div>

                  </div>

                  {/* ─── FRANJA DIRECTA DE CONTROL DE ASISTENCIA Y FALTA (4 ESTADOS) ─── */}
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shrink-0">
                      <CalendarCheck className="w-4 h-4 text-emerald-400" /> Présence Aujourd'hui ({todayStr}):
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                      
                      {/* Button Presente */}
                      <button
                        onClick={() => handleSetStudentAttendance(std.id, 'present', std.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                          currentAttStatus === 'present'
                            ? 'bg-emerald-500 text-slate-950 font-black shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Présent
                      </button>

                      {/* Button Falta */}
                      <button
                        onClick={() => handleSetStudentAttendance(std.id, 'absent', std.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                          currentAttStatus === 'absent'
                            ? 'bg-red-500 text-white font-black shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Absent
                      </button>

                      {/* Button Justificada */}
                      <button
                        onClick={() => handleSetStudentAttendance(std.id, 'justified', std.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                          currentAttStatus === 'justified'
                            ? 'bg-amber-500 text-slate-950 font-black shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" /> Justifié
                      </button>

                      {/* Button Tardanza */}
                      <button
                        onClick={() => handleSetStudentAttendance(std.id, 'tardy', std.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                          currentAttStatus === 'tardy'
                            ? 'bg-purple-600 text-white font-black shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> Retard
                      </button>

                      {/* Enviar aviso por WhatsApp si inasistencia */}
                      {currentAttStatus === 'absent' && std.isMinor && std.tutorPhone && (
                        <button
                          onClick={() => handleSendAbsenceNotice(std)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-emerald-500/30 ml-auto sm:ml-1"
                          title="Notificar falta al tutor por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Tutor
                        </button>
                      )}

                    </div>
                  </div>

                  {/* ─── FICHA AMPLIADA (DATOS DEL TUTOR + OBJETIVOS PERSONALES) ─── */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
                      
                      {/* Objetivos Personales del Estudiante */}
                      {std.personalGoal && (
                        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                              <Target className="w-4 h-4 text-amber-400" /> {std.personalGoal.title}
                            </span>
                            <span className="text-emerald-400 font-black">{std.personalGoal.progressPercent}% Completado</span>
                          </div>

                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${std.personalGoal.progressPercent}%` }}
                            />
                          </div>

                          <p className="text-[11px] text-slate-300">
                            Milestone Actual: <strong>{std.personalGoal.currentMilestone}</strong> ({std.personalGoal.targetWeeklyHours} horas recomendadas / semana).
                          </p>
                        </div>
                      )}

                      {/* Datos del Tutor Legal si es Menor */}
                      {std.isMinor && std.tutorName && (
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Fiche du Tuteur Légal (Requis par la Loi):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-200">
                            <div><strong>Nom du Tuteur:</strong> {std.tutorName} ({std.tutorRelationship || 'Père'})</div>
                            <div><strong>Téléphone / WhatsApp:</strong> <span className="text-emerald-400 font-bold">{std.tutorPhone}</span></div>
                            <div><strong>Pays / Région:</strong> {std.country}</div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
