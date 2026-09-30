import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  Award,
  Search,
  Filter,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Check,
  Star,
  Users,
  Building
} from 'lucide-react';

export const INITIAL_STUDENT_GRADES = [
  {
    id: 'grd-101',
    studentName: 'Mariano Nsue Nchama',
    gradeLevel: '4° ESO',
    schoolName: 'Lycée National Rey Malabo',
    mathGrade: 8.5,
    physicsGrade: 9.0,
    spanishGrade: 8.0,
    average: 8.5,
    status: 'Passed',
    certificateIssued: true,
    term: '3° Trimestre 2026'
  },
  {
    id: 'grd-102',
    studentName: 'Esperanza Obono Nguema',
    gradeLevel: '2° Bachillerato',
    schoolName: 'Instituto Politécnico de Bata',
    mathGrade: 9.5,
    physicsGrade: 9.2,
    spanishGrade: 8.8,
    average: 9.2,
    status: 'Honor',
    certificateIssued: true,
    term: '3° Trimestre 2026'
  },
  {
    id: 'grd-103',
    studentName: 'Pascal Eto\'o Nchama',
    gradeLevel: '3° ESO',
    schoolName: 'Instituto Nacional de Malabo',
    mathGrade: 6.0,
    physicsGrade: 5.5,
    spanishGrade: 6.5,
    average: 6.0,
    status: 'Passed',
    certificateIssued: false,
    term: '3° Trimestre 2026'
  },
  {
    id: 'grd-104',
    studentName: 'Salomé Mangue Avomo',
    gradeLevel: 'FP Grado Superior (Informática)',
    schoolName: 'Centro de Formación Técnica Ebebiyín',
    mathGrade: 9.0,
    physicsGrade: 8.5,
    spanishGrade: 9.2,
    average: 8.9,
    status: 'Passed',
    certificateIssued: true,
    term: '3° Trimestre 2026'
  },
  {
    id: 'grd-105',
    studentName: 'Lucas Ondo Mikue',
    gradeLevel: '6° Primaria',
    schoolName: 'Escuela Primaria Evinayong',
    mathGrade: 7.5,
    physicsGrade: 7.0,
    spanishGrade: 8.0,
    average: 7.5,
    status: 'Passed',
    certificateIssued: false,
    term: '3° Trimestre 2026'
  }
];

export const AdminGradesReport = () => {
  const [gradesList, setGradesList] = useState(INITIAL_STUDENT_GRADES);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  // Filtrado de calificaciones en tiempo real
  const filteredGrades = gradesList.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.studentName.toLowerCase().includes(q) ||
      item.schoolName.toLowerCase().includes(q) ||
      item.gradeLevel.toLowerCase().includes(q)
    );

    const matchesLevel = levelFilter === 'all' || (
      (levelFilter === 'primaria' && item.gradeLevel.includes('Primaria')) ||
      (levelFilter === 'eso' && item.gradeLevel.includes('ESO')) ||
      (levelFilter === 'bach' && item.gradeLevel.includes('Bachillerato')) ||
      (levelFilter === 'fp' && item.gradeLevel.includes('FP'))
    );

    return matchesSearch && matchesLevel;
  });

  const totalEvaluated = filteredGrades.length;
  const averageGlobal = totalEvaluated > 0
    ? (filteredGrades.reduce((acc, curr) => acc + curr.average, 0) / totalEvaluated).toFixed(1)
    : '0.0';
  
  const passedCount = filteredGrades.filter(g => g.average >= 5.0).length;
  const passRate = totalEvaluated > 0 ? Math.round((passedCount / totalEvaluated) * 100) : 0;
  const certificatesCount = filteredGrades.filter(g => g.certificateIssued).length;

  const handleExportGradesReport = () => {
    setToastMsg('¡Informe oficial de calificaciones exportado exitosamente en formato CSV / PDF offline!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ─── Encabezado Principal ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-3 py-0.5 rounded-full border border-indigo-500/30 mb-1 inline-block">
              Console d'Administration Centrale
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Console Centrale de Notes & Bulletins</h1>
            <p className="text-xs text-slate-300">
              Supervision des bulletins académiques, moyenne générale, taux de réussite et émission de certificats.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setToastMsg('📲 Tous les 5 bulletins académiques ont été envoyés par SMS/WhatsApp aux tuteurs légaux des élèves.');
              setTimeout(() => setToastMsg(''), 4500);
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
          >
            📲 Envoyer Tous aux Tuteurs
          </button>

          <button
            onClick={handleExportGradesReport}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Exporter Rapport de Notes
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── TARJETAS METRICAS DE RENDIMIENTO ACADÉMICO ──────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Moyenne Globale</span>
            <span className="text-xl font-black text-amber-400">{averageGlobal} / 10</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Taux de Réussite</span>
            <span className="text-xl font-black text-emerald-400">{passRate}%</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-purple-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Élèves Évalués</span>
            <span className="text-xl font-black text-purple-300">{totalEvaluated}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-teal-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Certificats Émis</span>
            <span className="text-xl font-black text-teal-300">{certificatesCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ─── FILTROS Y BÚSQUEDA DE NOTAS ─────────────────────────────────── */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom d'élève, établissement ou cours..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">🎓 Tous les Niveaux</option>
              <option value="primaria">🏫 Primaire (1ère-6ème)</option>
              <option value="eso">🎓 Secondaire</option>
              <option value="bach">🏅 Baccalauréat & Sélectivité</option>
              <option value="fp">💼 FP Supérieur / Moyen</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── TABLA / TARJETAS DE BOLETÍN DE CALIFICACIONES ───────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Boletines de Calificaciones: <strong className="text-white">{filteredGrades.length}</strong></span>
          <span className="text-emerald-400 font-semibold">🟢 Evaluaciones Trimestrales Sincronizadas</span>
        </div>

        <div className="space-y-3">
          {filteredGrades.map((grd) => (
            <div
              key={grd.id}
              className="bg-slate-900/90 p-5 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl hover:border-indigo-500/50 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-extrabold text-white">{grd.studentName}</h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${
                    grd.status === 'Honor'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {grd.status === 'Honor' ? '⭐ Mención de Honor' : '✅ Aprobado'}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {grd.term}
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <strong className="text-indigo-300">{grd.gradeLevel}</strong> • {grd.schoolName}
                </p>
              </div>

              {/* Desglose de Notas & Botón Enviar a Tutor */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Maths</span>
                  <strong className="text-xs font-black text-white">{grd.mathGrade}</strong>
                </div>

                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Physique</span>
                  <strong className="text-xs font-black text-white">{grd.physicsGrade}</strong>
                </div>

                <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Langue</span>
                  <strong className="text-xs font-black text-white">{grd.spanishGrade}</strong>
                </div>

                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-1.5 rounded-xl border border-amber-500/40 text-center">
                  <span className="text-[9px] text-amber-300 font-extrabold block uppercase">Moyenne</span>
                  <strong className="text-sm font-extrabold text-amber-400">{grd.average} / 10</strong>
                </div>

                <button
                  onClick={() => {
                    setToastMsg(`📲 Bulletin de ${grd.studentName} envoyé par SMS/WhatsApp au tuteur légal.`);
                    setTimeout(() => setToastMsg(''), 4000);
                  }}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  📲 Envoyer au Tuteur
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
