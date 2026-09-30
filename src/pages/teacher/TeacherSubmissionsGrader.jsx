import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Star,
  Send,
  FileText,
  User,
  Award,
  Sliders,
  ShieldCheck,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';

export const TeacherSubmissionsGrader = () => {
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-101',
      student: 'Emmanuel Olinga',
      studentAvatar: 'EO',
      course: 'Mathématiques Secondaire',
      module: 'Module 1: Algèbre et Équations',
      taskName: 'Résolution d\'Équation du Second Degré x² - 5x + 6 = 0',
      submittedDate: '2026-08-19 14:30',
      submittedText: `
# Remise de Devoir: Équation du Second Degré
Professeur, voici mes étapes de résolution:
1. Identification des coefficients: a = 1, b = -5, c = 6.
2. Calcul du discriminant: b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1.
3. Le discriminant étant positif, il y a deux solutions réelles:
   x₁ = (5 + 1) / 2 = 3
   x₂ = (5 - 1) / 2 = 2
      `,
      attachedFile: 'Resolution_Etape_Par_Etape_Emmanuel.pdf',
      plagiarismScore: '0% (Vérifié)',
      rubricScores: { theory: 4, procedure: 4, presentation: 2 },
      totalGrade: 10.0,
      feedback: 'Démonstration impeccable. Vous avez correctement identifié le discriminant.',
      privateTeacherNotes: 'Élève avec d\'excellentes compétences algébriques.',
      status: 'Graded'
    },
    {
      id: 'sub-102',
      student: 'Fatou Ndiaye',
      studentAvatar: 'FN',
      course: 'Physique et Chimie Secondaire',
      module: 'Module 1: Réactions Chimiques',
      taskName: 'Équilibrage de la Réaction d\'Ammoniac N₂ + 3 H₂ -> 2 NH₃',
      submittedDate: '2026-08-19 16:10',
      submittedText: `
Équilibrage des réactifs et produits:
Côté gauche: 2 Azotes et 6 Hydrogènes.
Côté droit: 2 molécules de NH₃ équivalent à 2 N et 6 H. La loi de Lavoisier est respectée.
      `,
      attachedFile: 'Equilibre_Chimique_Fatou.pdf',
      plagiarismScore: '0% (Vérifié)',
      rubricScores: { theory: 3.5, procedure: 4, presentation: 1.5 },
      totalGrade: 9.0,
      feedback: 'Bon équilibrage et bonne compréhension de la conservation de la masse.',
      privateTeacherNotes: 'Revu.',
      status: 'Graded'
    },
    {
      id: 'sub-103',
      student: 'Koffi Mensah',
      studentAvatar: 'KM',
      course: 'Agroécologie et Cultures',
      module: 'Module 1: Irrigation Efficace',
      taskName: 'Conception d\'Irrigation Goutte à Goutte',
      submittedDate: '2026-08-19 18:45',
      submittedText: `
Système conçu avec 3 bouteilles de 2 Litres enterrées à 12 cm de profondeur avec mèche de coton pour irriguer des tomates en saison sèche.
      `,
      attachedFile: 'Projet_Irrigation_Koffi.pdf',
      plagiarismScore: '0% (Vérifié)',
      rubricScores: { theory: 0, procedure: 0, presentation: 0 },
      totalGrade: null,
      feedback: '',
      privateTeacherNotes: '',
      status: 'Pending'
    }
  ]);

  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'pending' | 'graded'
  const [selectedSub, setSelectedSub] = useState(submissions[2]); // Seleccionar por defecto la pendiente

  // Estado Rúbrica de Calificación Profesional
  const [theoryScore, setTheoryScore] = useState(4); // max 4
  const [procedureScore, setProcedureScore] = useState(4); // max 4
  const [presentationScore, setPresentationScore] = useState(2); // max 2
  const [pedagogicalFeedback, setPedagogicalFeedback] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  const [successToast, setSuccessToast] = useState('');

  const computedTotal = (Number(theoryScore) + Number(procedureScore) + Number(presentationScore)).toFixed(1);

  const filteredSubmissions = submissions.filter(s => {
    if (activeTabFilter === 'pending') return s.status === 'Pending';
    if (activeTabFilter === 'graded') return s.status === 'Graded';
    return true;
  });

  const handleOpenGraderStudio = (sub) => {
    setSelectedSub(sub);
    if (sub.status === 'Graded') {
      setTheoryScore(sub.rubricScores?.theory || 4);
      setProcedureScore(sub.rubricScores?.procedure || 4);
      setPresentationScore(sub.rubricScores?.presentation || 2);
      setPedagogicalFeedback(sub.feedback || '');
      setPrivateNotes(sub.privateTeacherNotes || '');
    } else {
      setTheoryScore(3.5);
      setProcedureScore(3.5);
      setPresentationScore(1.5);
      setPedagogicalFeedback('');
      setPrivateNotes('');
    }
  };

  const handleSaveEvaluation = (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    const finalGrade = Number(computedTotal);

    setSubmissions(prev => prev.map(s => {
      if (s.id === selectedSub.id) {
        return {
          ...s,
          totalGrade: finalGrade,
          rubricScores: { theory: theoryScore, procedure: procedureScore, presentation: presentationScore },
          feedback: pedagogicalFeedback || 'Évaluation enregistrée avec grille d\'évaluation de l\'enseignant.',
          privateTeacherNotes: privateNotes,
          status: 'Graded'
        };
      }
      return s;
    }));

    setSelectedSub(prev => ({
      ...prev,
      totalGrade: finalGrade,
      rubricScores: { theory: theoryScore, procedure: procedureScore, presentation: presentationScore },
      feedback: pedagogicalFeedback || 'Évaluation enregistrée avec grille d\'évaluation de l\'enseignant.',
      privateTeacherNotes: privateNotes,
      status: 'Graded'
    }));

    setSuccessToast(`Note de ${finalGrade}/10 attribuée à ${selectedSub.student}!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleApplyPresetFeedback = (snippetText) => {
    setPedagogicalFeedback(prev => (prev ? `${prev} ${snippetText}` : snippetText));
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Encabezado del Estudio de Evaluación Profesional */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 mb-2 inline-block">
            Studio Enseignant d'Évaluation & Barèmes
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Centre Professionnel de Notation</h1>
          <p className="text-xs text-slate-300">Corrigez les devoirs avec des grilles d'évaluation, attribuez des notes et émettez des retours pédagogiques.</p>
        </div>

        {/* Filtros de Estado */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-700 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTabFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Toutes ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTabFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTabFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            En Attente (1)
          </button>
          <button
            onClick={() => setActiveTabFilter('graded')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTabFilter === 'graded' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Notées (2)
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Grid Principal: Lista de Entregas a la Izquierda | Visor & Rúbrica a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Columna Izquierda: Lista de Trabajos Presentados */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Boîte de Réception des Devoirs ({filteredSubmissions.length})</span>
            <span className="text-[10px] text-amber-400">Sélectionnez pour noter</span>
          </h2>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredSubmissions.map(sub => {
              const isSelected = selectedSub && selectedSub.id === sub.id;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleOpenGraderStudio(sub)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-xl'
                      : 'bg-slate-900/90 hover:bg-slate-850 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                        {sub.studentAvatar}
                      </div>
                      <span className="font-bold text-xs text-white">{sub.student}</span>
                    </div>

                    {sub.status === 'Graded' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                        {sub.totalGrade} / 10
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                        En Attente
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-200 line-clamp-1">{sub.taskName}</h3>
                  <p className="text-[11px] text-slate-400">{sub.course} • {sub.submittedDate}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Visor del Trabajo + Estudio de Rúbricas y Calificación */}
        <div className="lg:col-span-7">
          {selectedSub ? (
            <div className="bg-slate-900/95 p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 animate-fadeIn">
              
              {/* Encabezado de la Entrega Seleccionada */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {selectedSub.course}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                      {selectedSub.plagiarismScore}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedSub.taskName}</h2>
                  <p className="text-xs text-slate-400">
                    Élève: <strong className="text-slate-200">{selectedSub.student}</strong> • Remis le: {selectedSub.submittedDate}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Note Attribuée</span>
                  <strong className="text-2xl font-black text-amber-400">
                    {computedTotal} <span className="text-xs font-normal text-slate-500">/ 10</span>
                  </strong>
                </div>
              </div>

              {/* Visor del Trabajo Presentado por el Alumno */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  📄 Travail Présenté par l'Élève:
                </span>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
                  <p className="whitespace-pre-line">{selectedSub.submittedText}</p>

                  {selectedSub.attachedFile && (
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span>{selectedSub.attachedFile}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Pièce Jointe Vérifiée
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* FORMULARIO PROFESIONAL DE EVALUACIÓN CON RÚBRICA DE 3 CRITERIOS */}
              <form onSubmit={handleSaveEvaluation} className="space-y-5 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    Grille d'Évaluation de l'Enseignant (10 Points Max)
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">Total Grille: <strong>{computedTotal} / 10</strong></span>
                </div>

                {/* Criterio 1: Comprensión Teórica (0 a 4 pts) */}
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-200">1. Compréhension Théorique & Concepts (Max. 4.0 pts)</label>
                    <span className="font-extrabold text-amber-400">{theoryScore} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={theoryScore}
                    onChange={(e) => setTheoryScore(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Insuffisant (0 pts)</span>
                    <span>Acceptable (2 pts)</span>
                    <span>Excellent (4 pts)</span>
                  </div>
                </div>

                {/* Criterio 2: Procedimiento Paso a Paso (0 a 4 pts) */}
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-200">2. Précision de la Procédure Étape par Étape (Max. 4.0 pts)</label>
                    <span className="font-extrabold text-amber-400">{procedureScore} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={procedureScore}
                    onChange={(e) => setProcedureScore(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Avec erreurs (0 pts)</span>
                    <span>Partiel (2 pts)</span>
                    <span>Parfait (4 pts)</span>
                  </div>
                </div>

                {/* Criterio 3: Presentación y Claridad (0 a 2 pts) */}
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-200">3. Présentation, Format et Clarté (Max. 2.0 pts)</label>
                    <span className="font-extrabold text-amber-400">{presentationScore} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.5"
                    value={presentationScore}
                    onChange={(e) => setPresentationScore(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Informel (0 pts)</span>
                    <span>Soigné (1 pt)</span>
                    <span>Excellent (2 pts)</span>
                  </div>
                </div>

                {/* Plantillas de Retroalimentación Rápida */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Commentaires Fréquents Rapides:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyPresetFeedback('Excellente démonstration de la procédure!')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 cursor-pointer"
                    >
                      + Excellente procédure
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetFeedback('Vérifiez les signes algébriques dans les étapes intermédiaires.')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 cursor-pointer"
                    >
                      + Vérifier les signes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetFeedback('Bien posé, mais une justification plus approfondie est requise.')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 cursor-pointer"
                    >
                      + Ajouter justification
                    </button>
                  </div>
                </div>

                {/* Retroalimentación Pedagógica Visible para el Alumno */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Retour Pédagogique (Visible pour l'Élève)</label>
                  <textarea
                    rows={3}
                    value={pedagogicalFeedback}
                    onChange={(e) => setPedagogicalFeedback(e.target.value)}
                    placeholder="Rédigez des recommandations spécifiques pour le progrès de l'élève..."
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Notas Privadas del Docente */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">Notes Privées de l'Enseignant (Seulement visibles par les enseignants)</label>
                  <input
                    type="text"
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    placeholder="Ex: Élève avancé, recommander module 2."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300"
                  />
                </div>

                {/* Botón Guardar Evaluación */}
                <div className="pt-3 flex justify-between items-center border-t border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Évaluation validée avec signature de l'enseignant
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Award className="w-4.5 h-4.5" />
                    Enregistrer la Note ({computedTotal}/10)
                  </button>
                </div>

              </form>

            </div>
          ) : (
            <div className="bg-slate-900/90 p-12 rounded-3xl border border-slate-700/80 text-center text-slate-400">
              <FileCheck2 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-bold text-slate-300 text-sm">Sélectionnez un devoir dans la boîte de réception pour ouvrir le studio d'évaluation</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
