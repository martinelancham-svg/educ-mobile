import React, { useState } from 'react';
import {
  FlaskConical, Calculator, BookMarked, Globe, PlusCircle,
  Pencil, Trash2, X, Save, CheckCircle2, ChevronDown,
  AlertCircle, Eye, EyeOff
} from 'lucide-react';

// ─────────────────────────────────────────────
//  DONNÉES INITIALES
// ─────────────────────────────────────────────
const INITIAL_EXERCISES = {
  math: [
    {
      id: 'm1', subject: 'math',
      title: 'Équations du 1er Degré',
      difficulty: 'Facile (1ère - 2ème Secondaire)',
      question: "Résolvez pour x l'équation :  4x + 8 = 24",
      options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
      correctAnswer: 1,
      explanation: 'Étapes : 4x = 24 - 8 => 4x = 16 => x = 16 / 4 = 4.',
    },
    {
      id: 'm2', subject: 'math',
      title: 'Calcul de Pourcentages',
      difficulty: 'Facile (1ère - 3ème Secondaire)',
      question: "Dans une classe, il y a 40 élèves. 25% étudient l'agriculture. Combien d'élèves sont-ce ?",
      options: ['8 élèves', '10 élèves', '12 élèves', '15 élèves'],
      correctAnswer: 1,
      explanation: '40 × (25 / 100) = 40 × 0.25 = 10 élèves.',
    },
    {
      id: 'm3', subject: 'math',
      title: 'Opérations sur les Fractions',
      difficulty: 'Intermédiaire (2ème - 4ème Secondaire)',
      question: 'Calculez le résultat de :  (3/5) + (4/5) - (2/5)',
      options: ['5/5 (1)', '4/5', '6/5', '7/5'],
      correctAnswer: 0,
      explanation: '(3 + 4 - 2) / 5 = 5/5 = 1.',
    },
    {
      id: 'm4', subject: 'math',
      title: "Géométrie de Base (Aire d'un Triangle)",
      difficulty: 'Intermédiaire (2ème - 3ème Secondaire)',
      question: 'Un triangle a une base b = 10 cm et une hauteur h = 6 cm. Quelle est son aire ?',
      options: ['60 cm²', '30 cm²', '16 cm²', '40 cm²'],
      correctAnswer: 1,
      explanation: 'Aire du triangle = (Base × Hauteur) / 2 = (10 × 6) / 2 = 30 cm².',
    },
  ],
  chem: [
    {
      id: 'c1', subject: 'chem',
      title: 'Tableau Périodique : Symboles Atomiques',
      difficulty: 'Facile (2ème - 3ème Secondaire)',
      question: 'Quel est le symbole chimique du Fer ?',
      options: ['Hi', 'H', 'Fe', 'Ir'],
      correctAnswer: 2,
      explanation: 'Le symbole du Fer est Fe (provient du latin Ferrum).',
    },
    {
      id: 'c2', subject: 'chem',
      title: 'Structure Atomique',
      difficulty: 'Facile (2ème - 3ème Secondaire)',
      question: "Quelles particules à charge positive se trouvent dans le noyau de l'atome ?",
      options: ['Électrons', 'Protons', 'Neutrons', 'Photons'],
      correctAnswer: 1,
      explanation: 'Les protons se trouvent dans le noyau et possèdent une charge électrique positive.',
    },
    {
      id: 'c3', subject: 'chem',
      title: 'Ajustement de Réactions Chimiques',
      difficulty: 'Intermédiaire (3ème - 4ème Secondaire)',
      question: "Ajustez la réaction de formation de l'ammoniac : N₂ + 3 H₂ ──► ? NH₃",
      options: ['1 NH₃', '2 NH₃', '3 NH₃', '4 NH₃'],
      correctAnswer: 1,
      explanation: "N₂ + 3 H₂ ──► 2 NH₃ (2 atomes d'Azote et 6 d'Hydrogène des deux côtés).",
    },
  ],
  lang: [
    {
      id: 'l1', subject: 'lang',
      title: 'Analyse Syntaxique (Sujet et Prédicat)',
      difficulty: 'Facile (1ère - 2ème Secondaire)',
      question: 'Dans la phrase : "Les étudiants de Malabo lisent attentivement", quel est le Sujet ?',
      options: ['lisent attentivement', 'Les étudiants de Malabo', 'de Malabo', 'attentivement'],
      correctAnswer: 1,
      explanation: 'Le sujet s\'accorde en nombre et en personne avec le verbe : "Les étudiants de Malabo".',
    },
    {
      id: 'l2', subject: 'lang',
      title: 'Figures Littéraires : La Métaphore',
      difficulty: 'Intermédiaire (2ème - 3ème Secondaire)',
      question: 'Quelle figure littéraire associe un terme réel à un terme imaginaire sans utiliser "comme" ?',
      options: ['Hyperbole', 'Métaphore', 'Personnification', 'Anaphore'],
      correctAnswer: 1,
      explanation: 'La Métaphore associe deux éléments par une relation de ressemblance sans utiliser "comme".',
    },
  ],
  geohist: [
    {
      id: 'gh1', subject: 'geohist',
      title: 'Géographie Physique de Guinée Équatoriale',
      difficulty: 'Facile (1ère - 2ème Secondaire)',
      question: "Quel est le sommet le plus élevé de Guinée Équatoriale situé sur l'Île de Bioko ?",
      options: ['Pic Basilé', 'Mont Alén', 'Pic de Moka', 'Mont Chocolate'],
      correctAnswer: 0,
      explanation: 'Le Pic Basilé (anciennement Pic de Santa Isabel) est le point culminant du pays avec 3.011m.',
    },
    {
      id: 'gh2', subject: 'geohist',
      title: "Histoire de l'Indépendance Nationale",
      difficulty: 'Intermédiaire (2ème - 4ème Secondaire)',
      question: 'À quelle date la Guinée Équatoriale a-t-elle proclamé son Indépendance Nationale ?',
      options: ['12 Octobre 1968', '3 Août 1979', '12 Octobre 1975', '25 Mai 1963'],
      correctAnswer: 0,
      explanation: "Le 12 Octobre 1968 a été signé l'acte d'Indépendance officiel.",
    },
  ],
};

const SUBJECTS = [
  { id: 'math',    label: 'Mathématiques',   icon: Calculator,  color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/40', activeBg: 'bg-amber-500', activeText: 'text-slate-950' },
  { id: 'chem',    label: 'Physique & Chimie',icon: FlaskConical,color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', activeBg: 'bg-emerald-500', activeText: 'text-slate-950' },
  { id: 'lang',    label: 'Langue & Litt.',   icon: BookMarked,  color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40', activeBg: 'bg-orange-500', activeText: 'text-slate-950' },
  { id: 'geohist', label: 'Géo & Histoire',   icon: Globe,       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/40', activeBg: 'bg-purple-500', activeText: 'text-white' },
];

const DIFFICULTIES = [
  'Facile (1ère - 2ème Secondaire)',
  'Facile (2ème - 3ème Secondaire)',
  'Intermédiaire (2ème - 4ème Secondaire)',
  'Avancé (3ème - 4ème Secondaire)',
];

const ANSWER_LABELS = ['A', 'B', 'C', 'D'];
const EMPTY_FORM = { subject: 'math', title: '', difficulty: DIFFICULTIES[0], question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' };

// ─────────────────────────────────────────────
//  FORMULAIRE MODAL
// ─────────────────────────────────────────────
const ExerciseFormModal = ({ exercise, onSave, onClose }) => {
  const isEdit = !!exercise;
  const [form, setForm] = useState(isEdit ? { ...exercise, options: [...exercise.options] } : { ...EMPTY_FORM, options: ['', '', '', ''] });
  const [showDiffDrop, setShowDiffDrop] = useState(false);
  const [showSubjectDrop, setShowSubjectDrop] = useState(false);

  const setOption = (idx, val) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  const handleSave = () => {
    if (!form.title.trim()) { alert("Veuillez saisir le titre de l'exercice."); return; }
    if (!form.question.trim()) { alert("Veuillez saisir l'énoncé de la question."); return; }
    if (form.options.some(o => !o.trim())) { alert('Toutes les 4 options de réponse sont obligatoires.'); return; }
    if (!form.explanation.trim()) { alert("Veuillez saisir l'explication de la réponse correcte."); return; }
    onSave({ ...form, id: exercise?.id || `custom-${Date.now()}`, options: form.options.map(o => o.trim()), title: form.title.trim(), question: form.question.trim(), explanation: form.explanation.trim() });
  };

  const activeSubj = SUBJECTS.find(s => s.id === form.subject) || SUBJECTS[0];
  const IconComp = activeSubj.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/85 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[95vh] flex flex-col shadow-2xl">

        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${activeSubj.bg} flex items-center justify-center`}>
              <IconComp className={`w-5 h-5 ${activeSubj.color}`} />
            </div>
            <h2 className="text-base font-extrabold text-white">{isEdit ? '✏️ Modifier l\'Exercice' : '+ Nouvel Exercice'}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps scrollable */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">

          {/* Matière */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">📚 Matière *</label>
            <div className="relative">
              <button onClick={() => { setShowSubjectDrop(!showSubjectDrop); setShowDiffDrop(false); }}
                className="w-full flex items-center justify-between gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white hover:border-slate-600 transition-all cursor-pointer">
                <div className="flex items-center gap-2">
                  <IconComp className={`w-4 h-4 ${activeSubj.color}`} />
                  <span className={activeSubj.color}>{activeSubj.label}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showSubjectDrop && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-10 shadow-xl">
                  {SUBJECTS.map(s => {
                    const SI = s.icon;
                    return (
                      <button key={s.id} onClick={() => { setForm(f => ({ ...f, subject: s.id })); setShowSubjectDrop(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${form.subject === s.id ? 'bg-slate-700 font-extrabold' : 'hover:bg-slate-700/50'}`}>
                        <SI className={`w-4 h-4 ${s.color}`} />
                        <span className={s.color}>{s.label}</span>
                        {form.subject === s.id && <CheckCircle2 className={`w-4 h-4 ml-auto ${s.color}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Titre */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">📝 Titre de l'Exercice *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex : Calcul de Pourcentages"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all" />
          </div>

          {/* Difficulté */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">🎯 Niveau de Difficulté *</label>
            <div className="relative">
              <button onClick={() => { setShowDiffDrop(!showDiffDrop); setShowSubjectDrop(false); }}
                className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:border-slate-600 transition-all cursor-pointer">
                <span className="truncate">{form.difficulty}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>
              {showDiffDrop && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-10 shadow-xl">
                  {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => { setForm(f => ({ ...f, difficulty: d })); setShowDiffDrop(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${form.difficulty === d ? 'bg-amber-500/20 text-amber-300 font-extrabold' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">❓ Énoncé de la Question *</label>
            <textarea value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              placeholder="Rédigez la question pour les élèves..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none" />
          </div>

          {/* Options */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">🔤 Options de Réponse *</label>
            <div className="space-y-2">
              {form.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button onClick={() => setForm(f => ({ ...f, correctAnswer: idx }))}
                    title="Définir comme bonne réponse"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 transition-all cursor-pointer border ${
                      form.correctAnswer === idx
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400'
                    }`}>
                    {ANSWER_LABELS[idx]}
                  </button>
                  <input type="text" value={opt} onChange={e => setOption(idx, e.target.value)}
                    placeholder={`Option ${ANSWER_LABELS[idx]}...`}
                    className={`flex-1 bg-slate-800 border rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                      form.correctAnswer === idx ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-700 focus:border-amber-500'
                    }`} />
                  {form.correctAnswer === idx && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-start gap-1.5 bg-emerald-950/30 rounded-xl p-2.5 border border-emerald-800/40">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400">
                Cliquez sur la lettre <span className="font-extrabold text-emerald-400">(A/B/C/D)</span> pour définir la bonne réponse. Actuellement : <span className="font-extrabold text-emerald-400">{ANSWER_LABELS[form.correctAnswer]}</span>
              </p>
            </div>
          </div>

          {/* Explication */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">💡 Explication Étape par Étape *</label>
            <textarea value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
              placeholder="Expliquez la solution détaillée pour que l'élève comprenne..."
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none" />
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-slate-800 shrink-0">
          <button onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-all cursor-pointer">
            <X className="w-4 h-4" /> Annuler
          </button>
          <button onClick={handleSave}
            className="flex-2 flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 text-sm font-extrabold hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-amber-500/20">
            <Save className="w-4 h-4" /> {isEdit ? 'Enregistrer les Modifications' : "Créer l'Exercice"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  PAGE PRINCIPALE
// ─────────────────────────────────────────────
export const TeacherExercisesWorkshop = () => {
  const [exercises, setExercises] = useState(INITIAL_EXERCISES);
  const [activeSubject, setActiveSubject] = useState('math');
  const [showForm, setShowForm] = useState(false);
  const [editingEx, setEditingEx] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const totalCount = Object.values(exercises).reduce((a, arr) => a + arr.length, 0);
  const activeList = exercises[activeSubject] || [];
  const activeSubjInfo = SUBJECTS.find(s => s.id === activeSubject) || SUBJECTS[0];
  const SubjectIcon = activeSubjInfo.icon;

  const handleSave = (saved) => {
    const subj = saved.subject;
    setExercises(prev => {
      const list = prev[subj] || [];
      const idx = list.findIndex(e => e.id === saved.id);
      const newList = idx >= 0 ? list.map(e => e.id === saved.id ? saved : e) : [saved, ...list];
      return { ...prev, [subj]: newList };
    });
    setShowForm(false);
    setEditingEx(null);
    if (saved.subject !== activeSubject) setActiveSubject(saved.subject);
    showToast(editingEx ? `✅ "${saved.title}" modifié avec succès.` : `✅ "${saved.title}" créé avec succès.`);
  };

  const handleDelete = (ex) => {
    if (!confirm(`Supprimer "${ex.title}" ? Cette action est irréversible.`)) return;
    setExercises(prev => ({ ...prev, [ex.subject]: prev[ex.subject].filter(e => e.id !== ex.id) }));
    if (expandedId === ex.id) setExpandedId(null);
    showToast(`🗑️ "${ex.title}" supprimé.`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-emerald-500/50 text-emerald-300 text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      {/* Formulaire modal */}
      {showForm && (
        <ExerciseFormModal
          exercise={editingEx}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingEx(null); }}
        />
      )}

      {/* En-tête page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-extrabold text-amber-400 tracking-widest uppercase">Studio Exercices Enseignant</span>
          </div>
          <h1 className="text-2xl font-black text-white">Atelier d'Exercices</h1>
          <p className="text-sm text-slate-400 mt-1">Gérez les <span className="text-amber-400 font-bold">{totalCount} exercices</span> auto-correctifs disponibles pour vos élèves hors-ligne.</p>
        </div>
        <button
          onClick={() => { setEditingEx(null); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-extrabold text-sm rounded-2xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-amber-500/20 shrink-0">
          <PlusCircle className="w-4 h-4" />
          Nouvel Exercice
        </button>
      </div>

      {/* Compteurs par matière */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUBJECTS.map(s => {
          const SI = s.icon;
          return (
            <button key={s.id} onClick={() => setActiveSubject(s.id)}
              className={`rounded-2xl p-4 border text-left transition-all cursor-pointer group ${activeSubject === s.id ? `${s.bg} ${s.border} shadow-lg` : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <SI className={`w-5 h-5 ${s.color}`} />
                <span className={`text-2xl font-black ${activeSubject === s.id ? s.color : 'text-white'}`}>{(exercises[s.id] || []).length}</span>
              </div>
              <p className={`text-xs font-bold leading-tight ${activeSubject === s.id ? s.color : 'text-slate-400'}`}>{s.label}</p>
            </button>
          );
        })}
      </div>

      {/* Section exercices */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {/* En-tête section */}
        <div className={`flex items-center justify-between p-4 border-b border-slate-800 ${activeSubjInfo.bg}`}>
          <div className="flex items-center gap-2">
            <SubjectIcon className={`w-5 h-5 ${activeSubjInfo.color}`} />
            <h2 className={`font-extrabold ${activeSubjInfo.color}`}>{activeSubjInfo.label}</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300`}>{activeList.length} exercice{activeList.length !== 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={() => { setEditingEx(null); setShowForm(true); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${activeSubjInfo.border} ${activeSubjInfo.color} bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer`}>
            <PlusCircle className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>

        {/* Liste */}
        {activeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
            <SubjectIcon className={`w-12 h-12 ${activeSubjInfo.color} opacity-40`} />
            <p className="font-extrabold text-white">Aucun exercice en {activeSubjInfo.label}</p>
            <p className="text-sm text-slate-400">Créez le premier exercice pour vos élèves.</p>
            <button onClick={() => { setEditingEx(null); setShowForm(true); }}
              className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold ${activeSubjInfo.bg} ${activeSubjInfo.color} border ${activeSubjInfo.border} cursor-pointer hover:opacity-80 transition-all`}>
              <PlusCircle className="w-4 h-4" /> Créer un Exercice
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {activeList.map((ex, idx) => {
              const isExpanded = expandedId === ex.id;
              return (
                <div key={ex.id} className="group">
                  {/* Ligne principale */}
                  <div className="flex items-center gap-3 p-4 hover:bg-slate-800/40 transition-all">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[11px] font-black text-amber-400 shrink-0">
                      #{idx + 1}
                    </span>
                    <button onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                      className="flex-1 text-left cursor-pointer">
                      <p className="font-bold text-white text-sm leading-tight">{ex.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ex.difficulty}</p>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setExpandedId(isExpanded ? null : ex.id)} title="Aperçu"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all cursor-pointer">
                        {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setEditingEx(ex); setShowForm(true); }} title="Modifier"
                        className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-all cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ex)} title="Supprimer"
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Détails dépliés */}
                  {isExpanded && (
                    <div className="mx-4 mb-4 bg-slate-800/50 rounded-2xl border border-slate-700 p-4 space-y-3 animate-fadeIn">
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">❓ Question</p>
                        <p className="text-sm font-semibold text-white leading-relaxed">{ex.question}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">🔤 Options</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ex.options.map((opt, i) => (
                            <div key={i} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm border ${i === ex.correctAnswer ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300 font-extrabold' : 'bg-slate-900 border-slate-700 text-slate-300 font-semibold'}`}>
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${i === ex.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>{ANSWER_LABELS[i]}</span>
                              {opt}
                              {i === ex.correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">💡 Explication</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{ex.explanation}</p>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => { setEditingEx(ex); setShowForm(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold hover:bg-amber-500/20 transition-all cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" /> Modifier
                        </button>
                        <button onClick={() => handleDelete(ex)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-extrabold hover:bg-red-500/20 transition-all cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </button>
                      </div>
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
