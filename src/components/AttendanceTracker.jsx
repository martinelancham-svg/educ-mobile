import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  Search,
  Filter,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  School,
  GraduationCap,
  Calendar,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const INITIAL_ATTENDANCE_STUDENTS = [
  {
    id: 'std-101',
    name: 'Mariano Nsue Nchama',
    gradeLevel: '4° ESO',
    schoolName: 'Lycée National Rey Malabo',
    isMinor: true,
    tutorName: 'Santiago Nsue',
    tutorPhone: '+240 222 77 88 99'
  },
  {
    id: 'std-102',
    name: 'Esperanza Obono Nguema',
    gradeLevel: '2° Bachillerato',
    schoolName: 'Instituto Politécnico de Bata',
    isMinor: true,
    tutorName: 'Teresa Nguema',
    tutorPhone: '+240 222 55 66 77'
  },
  {
    id: 'std-103',
    name: 'Pascal Eto\'o Nchama',
    gradeLevel: '3° ESO',
    schoolName: 'Instituto Nacional de Malabo',
    isMinor: true,
    tutorName: 'Joseph Eto\'o',
    tutorPhone: '+240 222 33 22 11'
  },
  {
    id: 'std-104',
    name: 'Salomé Mangue Avomo',
    gradeLevel: 'FP Grado Superior (Informática)',
    schoolName: 'Centro de Formación Técnica Ebebiyín',
    isMinor: false
  },
  {
    id: 'std-105',
    name: 'Lucas Ondo Mikue',
    gradeLevel: '6° Primaria',
    schoolName: 'Escuela Primaria Evinayong',
    isMinor: true,
    tutorName: 'Carmen Mikue',
    tutorPhone: '+240 222 11 99 88'
  }
];

export const AttendanceTracker = () => {
  const { activeRole } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Estado de Asistencia por Estudiante ID -> 'present' | 'absent' | 'justified' | 'tardy'
  const [attendanceState, setAttendanceState] = useState(() => {
    try {
      const savedKey = `educ_attendance_${todayStr}`;
      const saved = localStorage.getItem(savedKey);
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

  const [toastMsg, setToastMsg] = useState('');

  // Recargar asistencia si cambia la fecha
  useEffect(() => {
    try {
      const savedKey = `educ_attendance_${selectedDate}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        setAttendanceState(JSON.parse(saved));
      } else {
        // Asistencia por defecto
        setAttendanceState({
          'std-101': 'present',
          'std-102': 'present',
          'std-103': 'present',
          'std-104': 'present',
          'std-105': 'present'
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedDate]);

  // Cambiar estado de un estudiante individual
  const setStudentStatus = (studentId, status) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Marquage Massif : Tous Présents
  const handleMarkAllPresent = () => {
    const updated = {};
    INITIAL_ATTENDANCE_STUDENTS.forEach(s => {
      updated[s.id] = 'present';
    });
    setAttendanceState(updated);
    setToastMsg('Tous les étudiants ont été marqués comme PRÉSENTS !');
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Resetear estados
  const handleResetAttendance = () => {
    const updated = {};
    INITIAL_ATTENDANCE_STUDENTS.forEach(s => {
      updated[s.id] = 'present';
    });
    setAttendanceState(updated);
  };

  // Guardar en caché offline IndexedDB / localStorage
  const handleSaveAttendance = () => {
    try {
      const savedKey = `educ_attendance_${selectedDate}`;
      localStorage.setItem(savedKey, JSON.stringify(attendanceState));
      
      // Guardar también en el registro de historial general
      const historyKey = 'educ_attendance_history_log';
      const historyLog = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const newEntry = {
        date: selectedDate,
        records: attendanceState,
        savedAt: new Date().toLocaleTimeString()
      };
      localStorage.setItem(historyKey, JSON.stringify([newEntry, ...historyLog.filter(h => h.date !== selectedDate)]));
    } catch (e) {
      console.error(e);
    }

    setToastMsg(`¡Control de Asistencia del ${selectedDate} guardado exitosamente offline!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Notificar falta al tutor por WhatsApp
  const handleSendAbsenceNotice = (std) => {
    const text = encodeURIComponent(`Bonjour ${std.tutorName}, nous vous informons depuis la plateforme EDUC-EG qu'aujourd'hui (${selectedDate}) une ABSENCE a été enregistrée pour votre enfant ${std.name}. Nous restons à votre disposition.`);
    window.open(`https://wa.me/${std.tutorPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Estudiantes filtrados por búsqueda y nivel
  const filteredStudents = INITIAL_ATTENDANCE_STUDENTS.filter(std => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || std.name.toLowerCase().includes(q) || std.schoolName.toLowerCase().includes(q) || std.gradeLevel.toLowerCase().includes(q);

    const matchesGrade = selectedGrade === 'all' || (
      (selectedGrade === 'primaria' && std.gradeLevel.includes('Primaria')) ||
      (selectedGrade === 'eso' && std.gradeLevel.includes('ESO')) ||
      (selectedGrade === 'bach' && std.gradeLevel.includes('Bachillerato')) ||
      (selectedGrade === 'fp' && std.gradeLevel.includes('FP'))
    );

    return matchesSearch && matchesGrade;
  });

  // Estadísticas en tiempo real
  const totalCount = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => attendanceState[s.id] === 'present').length;
  const absentCount = filteredStudents.filter(s => attendanceState[s.id] === 'absent').length;
  const justifiedCount = filteredStudents.filter(s => attendanceState[s.id] === 'justified').length;
  const tardyCount = filteredStudents.filter(s => attendanceState[s.id] === 'tardy').length;

  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ─── Encabezado Principal ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 shrink-0">
            <CalendarCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30 mb-1 inline-block">
              {activeRole === 'admin' ? 'Contrôle de Présence Institutionnel' : 'Registre de Présence Enseignant 24/7'}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Contrôle de Présence & Absences</h1>
            <p className="text-xs text-slate-300">
              Enregistrez présences, absences, retards et justifications avec synchronisation hors-ligne dans IndexedDB.
            </p>
          </div>
        </div>

        {/* Indicador Global de Tasa de Asistencia */}
        <div className="bg-slate-900/90 p-3.5 px-5 rounded-2xl border border-emerald-500/40 text-right shrink-0 self-stretch md:self-auto space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Taux de Présence</span>
          <span className="text-xl font-black text-emerald-400 flex items-center justify-end gap-1">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> {attendanceRate}% Présence
          </span>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── CONTROLES DE FECHA, CURSO Y ACCIONES MASIVAS ───────────────────── */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Selector de Fecha */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date d'Enregistrement *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Selector de Nivel Educativo */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Filtrer Niveau / Groupe
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">🎓 Tous les Niveaux</option>
              <option value="primaria">🏫 Primaire (1ère-6ème)</option>
              <option value="eso">🎓 Secondaire</option>
              <option value="bach">🏅 Baccalauréat</option>
              <option value="fp">💼 FP Supérieur / Moyen</option>
            </select>
          </div>

          {/* Campo de búsqueda */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" /> Rechercher Élève
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

        </div>

        {/* Botones de Marcado Rápido y Guardado */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4 text-emerald-400" /> Cocher Tous Présents
            </button>

            <button
              onClick={handleResetAttendance}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          </div>

          <button
            onClick={handleSaveAttendance}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 cursor-pointer transition-transform"
          >
            <Save className="w-4 h-4" /> Enregistrer la Présence Hors-Ligne
          </button>
        </div>
      </div>

      {/* ─── TARJETAS DE RESUMEN ESTADÍSTICO DE LA JORNADA ───────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Présents</span>
            <span className="text-xl font-black text-emerald-400">{presentCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-red-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Absents</span>
            <span className="text-xl font-black text-red-400">{absentCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Justifiés</span>
            <span className="text-xl font-black text-amber-400">{justifiedCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-purple-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Retards</span>
            <span className="text-xl font-black text-purple-400">{tardyCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ─── LISTADO DE ALUMNOS CON OPCIONES DE ASISTENCIA Y FALTA ───────── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Alumnos en lista: <strong className="text-white">{filteredStudents.length}</strong></span>
          <span className="text-emerald-400 font-semibold">🟢 Sincronizado Offline</span>
        </div>

        <div className="space-y-3">
          {filteredStudents.map((std) => {
            const currentStatus = attendanceState[std.id] || 'present';

            return (
              <div
                key={std.id}
                className="bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-600 transition-all shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-base shadow shrink-0">
                    {std.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white">{std.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{std.gradeLevel}</span> • <span className="text-slate-300">{std.schoolName}</span>
                    </p>
                  </div>
                </div>

                {/* OPCIONES DE MARCADO DE ASISTENCIA (4 ESTADOS) */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  
                  {/* Option 1: Presente */}
                  <button
                    onClick={() => setStudentStatus(std.id, 'present')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentStatus === 'present'
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Présent
                  </button>

                  {/* Option 2: Ausente / Falta */}
                  <button
                    onClick={() => setStudentStatus(std.id, 'absent')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentStatus === 'absent'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> Absent
                  </button>

                  {/* Option 3: Falta Justificada */}
                  <button
                    onClick={() => setStudentStatus(std.id, 'justified')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentStatus === 'justified'
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" /> Justifié
                  </button>

                  {/* Option 4: Tardanza */}
                  <button
                    onClick={() => setStudentStatus(std.id, 'tardy')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentStatus === 'tardy'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 scale-105'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Clock className="w-4 h-4" /> Retard
                  </button>

                  {/* Notificación a Tutor si Inasistencia */}
                  {currentStatus === 'absent' && std.isMinor && std.tutorPhone && (
                    <button
                      onClick={() => handleSendAbsenceNotice(std)}
                      className="px-2.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-emerald-500/30 ml-1"
                      title="Enviar aviso de inasistencia por WhatsApp al tutor"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Tutor
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
