import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import {
  Calculator,
  FlaskConical,
  BookMarked,
  Globe,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  Flame
} from 'lucide-react';

export const MATH_EXERCISES = [
  {
    id: 'm1',
    title: 'Équations du 1er Degré',
    difficulty: 'Facile (1ère - 2ème Secondaire)',
    question: 'Résolvez pour x l\'équation: 4x + 8 = 24',
    options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
    correctAnswer: 1, // x = 4
    explanation: 'Étapes: 4x = 24 - 8 => 4x = 16 => x = 16 / 4 = 4.'
  },
  {
    id: 'm2',
    title: 'Calcul de Pourcentages',
    difficulty: 'Facile (1ère - 3ème Secondaire)',
    question: 'Dans une classe il y a 40 élèves. 25% étudient l\'agriculture. Combien d\'élèves sont-ce?',
    options: ['8 élèves', '10 élèves', '12 élèves', '15 élèves'],
    correctAnswer: 1, // 10
    explanation: '40 × (25 / 100) = 40 × 0.25 = 10 élèves.'
  },
  {
    id: 'm3',
    title: 'Opérations sur les Fractions',
    difficulty: 'Intermédiaire (2ème - 4ème Secondaire)',
    question: 'Calculez le résultat de: (3/5) + (4/5) - (2/5)',
    options: ['5/5 (1)', '4/5', '6/5', '7/5'],
    correctAnswer: 0, // 5/5 = 1
    explanation: '(3 + 4 - 2) / 5 = 5/5 = 1.'
  },
  {
    id: 'm4',
    title: 'Géométrie de Base (Aire du Triangle)',
    difficulty: 'Intermédiaire (2ème - 3ème Secondaire)',
    question: 'Un triangle a une base b = 10 cm et une hauteur h = 6 cm. Quelle est son aire?',
    options: ['60 cm²', '30 cm²', '16 cm²', '40 cm²'],
    correctAnswer: 1, // (10 * 6) / 2 = 30
    explanation: 'Aire du triangle = (Base × Hauteur) / 2 = (10 × 6) / 2 = 30 cm².'
  }
];

export const CHEM_EXERCISES = [
  {
    id: 'c1',
    title: 'Table Périodique: Symboles Atomiques',
    difficulty: 'Facile (2ème - 3ème Secondaire)',
    question: 'Quel est le symbole chimique du Fer?',
    options: ['Hi', 'H', 'Fe', 'Ir'],
    correctAnswer: 2, // Fe
    explanation: 'Le symbole du Fer est Fe (provenant du latin Ferrum).'
  },
  {
    id: 'c2',
    title: 'Structure Atomique',
    difficulty: 'Facile (2ème - 3ème Secondaire)',
    question: 'Quelles particules à charge positive se trouvent dans le noyau de l\'atome?',
    options: ['Électrons', 'Protons', 'Neutrons', 'Photons'],
    correctAnswer: 1, // Protons
    explanation: 'Les protons se trouvent dans le noyau et possèdent une charge électrique positive.'
  },
  {
    id: 'c3',
    title: 'Équilibrage de Réactions Chimiques',
    difficulty: 'Intermédiaire (3ème - 4ème Secondaire)',
    question: 'Équilibrez la réaction de formation de l\'ammoniac: N₂ + 3 H₂ ──► ? NH₃',
    options: ['1 NH₃', '2 NH₃', '3 NH₃', '4 NH₃'],
    correctAnswer: 1, // 2 NH3
    explanation: 'N₂ + 3 H₂ ──► 2 NH₃ (2 atomes d\'Azote et 6 d\'Hydrogène des deux côtés).'
  },
  {
    id: 'c4',
    title: 'Concentration des Solutions',
    difficulty: 'Avancé (3ème - 4ème Secondaire)',
    question: 'Nous dissolvons 20g de sel dans 2 Litres d\'eau. Quelle est la concentration en g/L?',
    options: ['5 g/L', '10 g/L', '20 g/L', '40 g/L'],
    correctAnswer: 1, // 10 g/L
    explanation: 'Concentration = Masse soluté (g) / Volume (L) = 20g / 2L = 10 g/L.'
  }
];

export const LANG_EXERCISES = [
  {
    id: 'l1',
    title: 'Analyse Syntaxique (Sujet et Prédicat)',
    difficulty: 'Facile (1ère - 2ème Secondaire)',
    question: 'Dans la phrase: "Les étudiants de Malabo lisent attentivement", quel est le Sujet?',
    options: ['lisent attentivement', 'Les étudiants de Malabo', 'de Malabo', 'attentivement'],
    correctAnswer: 1,
    explanation: 'Le sujet s\'accorde en nombre et en personne avec le verbe ("lisent"): "Les étudiants de Malabo".'
  },
  {
    id: 'l2',
    title: 'Figures de Style: La Métaphore',
    difficulty: 'Intermédiaire (2ème - 3ème Secondaire)',
    question: 'Quelle figure de style consiste à associer un terme réel à un terme imaginaire (ex: "Ses cheveux sont des fils d\'or")?',
    options: ['Hyperbole', 'Métaphore', 'Personnification', 'Anaphore'],
    correctAnswer: 1,
    explanation: 'La Métaphore associe deux éléments par une relation de ressemblance sans utiliser "comme".'
  },
  {
    id: 'l3',
    title: 'Orthographe: Règles d\'Accentuation',
    difficulty: 'Facile (1ère - 3ème Secondaire)',
    question: 'Pourquoi le mot "camión" prend-il un accent graphique en espagnol?',
    options: ['C\'est un mot dactyle', 'C\'est un mot oxyton terminé par "n"', 'C\'est un mot paroxyton', 'Par hiatus de voix'],
    correctAnswer: 1,
    explanation: 'Les mots oxytons prennent un accent quand ils se terminent par n, s ou une voyelle.'
  },
  {
    id: 'l4',
    title: 'Littérature Hispano-Africaine de Guinée Équatoriale',
    difficulty: 'Avancé (3ème - 4ème Secondaire)',
    question: 'Qui a écrit "Cuando los combes luchaban" (1953), considéré comme le premier roman de Guinée Équatoriale?',
    options: ['Donato Ndongo-Bidyogo', 'Leoncio Evita Enoy', 'Juan Tomás Ávila Laurel', 'María Nsué Angüe'],
    correctAnswer: 1,
    explanation: 'Leoncio Evita Enoy a publié "Cuando los combes luchaban" en 1953, jalon fondateur de la littérature équatoguinéenne.'
  }
];

export const GEO_HIST_EXERCISES = [
  {
    id: 'gh1',
    title: 'Géographie Physique de la Guinée Équatoriale',
    difficulty: 'Facile (1ère - 2ème Secondaire)',
    question: 'Quel est le sommet le plus élevé de Guinée Équatoriale (3 011 mètres d\'altitude) situé sur l\'Île de Bioko?',
    options: ['Pic Basilé', 'Mont Alén', 'Pic de Moka', 'Mont Chocolate'],
    correctAnswer: 0,
    explanation: 'Le Pic Basilé (anciennement Pic de Santa Isabel) est le point culminant du pays avec 3 011m.'
  },
  {
    id: 'gh2',
    title: 'Histoire de l\'Indépendance Nationale',
    difficulty: 'Intermédiaire (2ème - 4ème Secondaire)',
    question: 'À quelle date historique la Guinée Équatoriale a-t-elle proclamé son Indépendance Nationale?',
    options: ['12 Octobre 1968', '3 Août 1979', '12 Octobre 1975', '25 Mai 1963'],
    correctAnswer: 0,
    explanation: 'Le 12 Octobre 1968 a été signé l\'acte officiel d\'Indépendance.'
  },
  {
    id: 'gh3',
    title: 'Géographie Politique Universelle',
    difficulty: 'Facile (1ère - 3ème Secondaire)',
    question: 'Quelle est la capitale administrative de la Province du Centre-Sud (Guinée Équatoriale continentale)?',
    options: ['Ebebiyín', 'Evinayong', 'Bata', 'Mongomo'],
    correctAnswer: 1,
    explanation: 'Evinayong est la capitale administrative de la Province du Centre-Sud.'
  },
  {
    id: 'gh4',
    title: 'Histoire Universelle: La Révolution Industrielle',
    difficulty: 'Avancé (3ème - 4ème Secondaire)',
    question: 'Quelle machine à vapeur a révolutionné la production textile et les transports à la fin du XVIIIe siècle?',
    options: ['L\'imprimerie', 'La machine à vapeur de James Watt', 'Le télégraphe optique', 'La boussole magnétique'],
    correctAnswer: 1,
    explanation: 'La machine à vapeur perfectionnée par James Watt a été le moteur principal de la Révolution Industrielle.'
  }
];

export const EsoExercisesWorkshop = () => {
  const { recordQuizResult } = useAuth();
  const { isEffectiveOffline } = useOffline();

  const [subject, setSubject] = useState('math'); // 'math' | 'chem' | 'lang' | 'geohist'
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const getActiveExercises = () => {
    if (subject === 'math') return MATH_EXERCISES;
    if (subject === 'chem') return CHEM_EXERCISES;
    if (subject === 'lang') return LANG_EXERCISES;
    return GEO_HIST_EXERCISES;
  };

  const activeExercises = getActiveExercises();

  const handleSelectOption = (exId, optIdx) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [exId]: optIdx }));
  };

  const handleEvaluate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  // Calcular correctas
  const correctCount = activeExercises.filter(ex => userAnswers[ex.id] === ex.correctAnswer).length;
  const scorePercent = Math.round((correctCount / activeExercises.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header Taller de Ejercicios */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 mb-2 inline-block">
            Atelier Pratique du Secondaire
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Exercices Interactifs de Maths & Chimie</h1>
          <p className="text-xs text-slate-300">Résolvez des problèmes algébriques, équations et réactions chimiques 100% hors-ligne.</p>
        </div>

        {/* Tabs de Asignatura */}
        <div className="flex flex-wrap bg-slate-800 p-1.5 rounded-2xl border border-slate-700 gap-1.5 self-stretch md:self-auto">
          <button
            onClick={() => { setSubject('math'); handleReset(); }}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subject === 'math'
                ? 'bg-blue-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Mathématiques
          </button>

          <button
            onClick={() => { setSubject('chem'); handleReset(); }}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subject === 'chem'
                ? 'bg-emerald-400 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Physique & Chimie
          </button>

          <button
            onClick={() => { setSubject('lang'); handleReset(); }}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subject === 'lang'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            Langue & Littérature
          </button>

          <button
            onClick={() => { setSubject('geohist'); handleReset(); }}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subject === 'geohist'
                ? 'bg-purple-400 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            Géographie & Histoire
          </button>
        </div>
      </div>

      {/* Banner de Calificación de Ejercicios */}
      {showResults && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-indigo-500/40 text-center space-y-3 animate-fadeIn shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-lg">
            {scorePercent}%
          </div>
          <h3 className="text-xl font-bold text-white">
            {scorePercent >= 70 ? '¡Excellent travail sur ce bloc!' : 'Continuez à pratiquer les concepts'}
          </h3>
          <p className="text-xs text-slate-400">
            Vous avez réussi {correctCount} sur {activeExercises.length} exercices de {subject === 'math' ? 'Mathématiques' : 'Chimie'}.
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer hover:bg-indigo-400 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer les Exercices
          </button>
        </div>
      )}

      {/* Lista de Ejercicios */}
      <div className="space-y-6">
        {activeExercises.map((ex, idx) => {
          const selectedOpt = userAnswers[ex.id];
          const isCorrect = selectedOpt === ex.correctAnswer;

          return (
            <div key={ex.id} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-700/80 space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Exercice {idx + 1} • {ex.title}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{ex.difficulty}</span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {ex.question}
              </h3>

              {/* Opciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ex.options.map((optText, optIdx) => {
                  const isSelected = selectedOpt === optIdx;
                  let btnClass = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';

                  if (showResults) {
                    if (optIdx === ex.correctAnswer) {
                      btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnClass = 'bg-red-500/20 border-red-500 text-red-300 font-bold';
                    }
                  } else if (isSelected) {
                    btnClass = 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(ex.id, optIdx)}
                      className={`p-3.5 rounded-xl text-xs text-left border transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                    >
                      <span>{optText}</span>
                      {showResults && optIdx === ex.correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {showResults && isSelected && optIdx !== ex.correctAnswer && <XCircle className="w-4 h-4 text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Explicación paso a paso si ya se evaluó */}
              {showResults && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-300 block">💡 Solution et Explication Étape par Étape:</span>
                  <p className="leading-relaxed text-slate-400">{ex.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón Finalizar Taller */}
      {!showResults && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleEvaluate}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Évaluer les Réponses (+120 XP)
          </button>
        </div>
      )}
    </div>
  );
};
