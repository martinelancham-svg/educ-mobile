import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Target,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  FlaskConical,
  TrendingUp,
  Brain,
  PlusCircle,
  RefreshCw,
  Award,
  ArrowRight,
  Flame
} from 'lucide-react';

export const PRESET_GOALS = [
  {
    id: 'selectividad',
    title: 'Préparation Examen Sélectivité & Épreuves d\'Accès UNGE',
    category: 'Baccalauréat & Accès Université',
    description: 'Axé sur les Mathématiques Avancées, la Physique et la Chimie pour intégrer l\'Université Nationale de Guinée Équatoriale.',
    weeklyHours: 8,
    targetWeeks: 4,
    recommendedCourses: ['Master en Mathématiques Secondaire', 'Physique et Chimie: Lois de Newton & Ohm'],
    exercises: ['Équations du Second Degré', 'Ajustement de Réactions', 'Loi d\'Ohm & Circuits']
  },
  {
    id: 'eso-math-physics',
    title: 'Maîtriser les Mathématiques & la Physique de 4ème Secondaire',
    category: 'Enseignement Secondaire Obligatoire',
    description: 'Renforcement hebdomadaire en résolution d\'équations, géométrie, vecteurs et principes de cinématique.',
    weeklyHours: 6,
    targetWeeks: 4,
    recommendedCourses: ['Master en Mathématiques Secondaire', 'Physique et Chimie: Lois de Newton & Ohm'],
    exercises: ['Équations du Second Degré', 'Factorisation Polynômiale']
  },
  {
    id: 'fp-informática',
    title: 'Formation en FP Technique Réseaux & Systèmes',
    category: 'Formation Professionnelle',
    description: 'Acquérir des compétences pratiques en réseaux locaux, maintenance informatique et support technique hors-ligne.',
    weeklyHours: 7,
    targetWeeks: 4,
    recommendedCourses: ['Introduction à la FP Technique & Réseaux'],
    exercises: ['Configuration Réseaux IP', 'Maintenance préventive PC']
  },
  {
    id: 'primaria-reforzamiento',
    title: 'Renforcement en Arithmétique de Base & Compréhension de Lecture',
    category: 'Primaire (1ère à 6ème)',
    description: 'Améliorer le calcul rapide, les opérations combinées et la lecture autonome.',
    weeklyHours: 4,
    targetWeeks: 4,
    recommendedCourses: ['Mathématiques de Base Primaire'],
    exercises: ['Multiplication et Division', 'Lecture guidée']
  }
];

export const StudentPersonalGoals = ({ onNavigateToCourse, onNavigateToExercises }) => {
  const { user, saveUserGoal, currentUserGoal } = useAuth();
  
  const [goalText, setGoalText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Bachillerato & Acceso Universidad');
  const [customHours, setCustomHours] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlan, setActivePlan] = useState(null);

  // Cargar plan guardado al iniciar
  useEffect(() => {
    if (currentUserGoal) {
      setActivePlan(currentUserGoal);
      setGoalText(currentUserGoal.goalTitle || '');
    } else if (user?.savedGoal) {
      setActivePlan(user.savedGoal);
      setGoalText(user.savedGoal.goalTitle || '');
    }
  }, [currentUserGoal, user]);

  // Generador automático de plan de estudio basado en el objetivo
  const handleGeneratePlan = (preset = null) => {
    setIsGenerating(true);

    const titleToUse = preset ? preset.title : (goalText.trim() || 'Réussir mes matières clés avec des notes excellentes');
    const hoursToUse = preset ? preset.weeklyHours : customHours;
    const coursesToUse = preset ? preset.recommendedCourses : ['Master en Mathématiques Secondaire', 'Physique et Chimie: Lois de Newton & Ohm'];
    const exercisesToUse = preset ? preset.exercises : ['Équations du Second Degré', 'Équilibrage de Réactions'];

    // Calcular fechas límite semanales partiendo de hoy
    const today = new Date();
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const newPlan = {
      id: `goal-${Date.now()}`,
      goalTitle: titleToUse,
      category: preset ? preset.category : selectedCategory,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      weeklyHours: hoursToUse,
      dailyMinutes: Math.round((hoursToUse * 60) / 6),
      recommendedCourses: coursesToUse,
      assignedExercises: exercisesToUse,
      weeks: [
        {
          weekNum: 1,
          title: 'Semaine 1: Fondations & Concepts Clés',
          deadline: addDays(today, 7),
          tasks: [
            { id: 'w1-t1', text: 'Réviser le Module 1 du cours assigné', completed: true },
            { id: 'w1-t2', text: 'Résoudre 5 exercices de pratique initiale', completed: true },
            { id: 'w1-t3', text: 'Compléter 45 min quotidiennes de lecture interactive', completed: false }
          ]
        },
        {
          weekNum: 2,
          title: 'Semaine 2: Application Pratique & Résolution d\'Exercices',
          deadline: addDays(today, 14),
          tasks: [
            { id: 'w2-t1', text: 'Compléter le Module 2 et ses auto-évaluations', completed: false },
            { id: 'w2-t2', text: 'Réaliser l\'Atelier d\'Exercices de Maths & Physique', completed: false },
            { id: 'w2-t3', text: 'Consulter le Tuteur IA pour les questions complexes', completed: false }
          ]
        },
        {
          weekNum: 3,
          title: 'Semaine 3: Consolidation & Examens Blancs',
          deadline: addDays(today, 21),
          tasks: [
            { id: 'w3-t1', text: 'Résoudre un examen blanc sans aide', completed: false },
            { id: 'w3-t2', text: 'Télécharger le résumé PDF pour révision hors-ligne', completed: false },
            { id: 'w3-t3', text: 'Réviser les sujets avec un taux d\'erreur supérieur à 20%', completed: false }
          ]
        },
        {
          weekNum: 4,
          title: 'Semaine 4: Évaluation Finale & Certification de Réussite',
          deadline: addDays(today, 28),
          tasks: [
            { id: 'w4-t1', text: 'Réussir le Questionnaire Final du Cours (Note > 80%)', completed: false },
            { id: 'w4-t2', text: 'Générer le Certificat Officiel de Compétence', completed: false }
          ]
        }
      ]
    };

    setTimeout(() => {
      setActivePlan(newPlan);
      setIsGenerating(false);
      if (saveUserGoal) {
        saveUserGoal(newPlan);
      }
    }, 800);
  };

  // Alternar tarea completada
  const toggleTask = (weekNum, taskId) => {
    if (!activePlan) return;

    const updatedWeeks = activePlan.weeks.map(week => {
      if (week.weekNum === weekNum) {
        const updatedTasks = week.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        return { ...week, tasks: updatedTasks };
      }
      return week;
    });

    const updatedPlan = { ...activePlan, weeks: updatedWeeks };
    setActivePlan(updatedPlan);
    if (saveUserGoal) {
      saveUserGoal(updatedPlan);
    }
  };

  // Métricas de avance
  const calculateProgress = () => {
    if (!activePlan || !activePlan.weeks) return 0;
    let totalTasks = 0;
    let completedTasks = 0;
    activePlan.weeks.forEach(w => {
      w.tasks.forEach(t => {
        totalTasks += 1;
        if (t.completed) completedTasks += 1;
      });
    });
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const progressPercent = calculateProgress();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 inline-flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-300" /> Planificateur Autonome d'Étude
            </span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Générateur IA Actif
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Mes Objectifs Personnels</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Définissez vos objectifs éducatifs. La plateforme créera automatiquement vos objectifs hebdomadaires, heures recommandées, exercices assignés et dates limites de réalisation.
          </p>
        </div>

        {activePlan && (
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/30 text-right space-y-1 self-stretch md:self-auto min-w-[200px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Avance Global del Objetivo</span>
            <div className="text-2xl font-black text-emerald-400 flex items-center justify-end gap-1">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> {progressPercent}%
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── CREAR O MODIFICAR OBJETIVO PERSONAL ─────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Quel est votre Objectif Éducatif Personnel?</h2>
              <p className="text-xs text-slate-400">Écrivez votre propre objectif ou sélectionnez l'un de nos plans optimisés pour la Guinée Équatoriale.</p>
            </div>
          </div>

          {activePlan && (
            <button
              onClick={() => setActivePlan(null)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Changer / Réinitialiser l'Objectif
            </button>
          )}
        </div>

        {/* SI NO HAY PLAN ACTIVO O SE QUIERE CREAR UNO NUEVO */}
        {!activePlan && (
          <div className="space-y-6">
            
            {/* Campo de Entrada Personalizado */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block uppercase tracking-wider">
                Écrivez votre Objectif Personnel:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="Ex: Me préparer pour la Sélectivité en Mathématiques et Physique en 4 semaines..."
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                
                <button
                  onClick={() => handleGeneratePlan()}
                  disabled={isGenerating}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-transform hover:scale-102 shrink-0"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" /> Génération du Plan...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 text-amber-300" /> Générer Mon Plan Automatique
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PRESETS DE METAS POPULARES */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Ou sélectionnez un Objectif Préconçu Recommandé:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_GOALS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleGeneratePlan(preset)}
                    className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 hover:border-indigo-500/60 cursor-pointer transition-all space-y-3 group hover:shadow-indigo-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {preset.category}
                      </span>
                      <span className="text-xs text-amber-400 font-extrabold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {preset.weeklyHours}h / semaine
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {preset.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-bold">
                      <span>Générer ce plan en 1 clic</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── VISTA DEL PLAN ACTIVO GENERADO AUTOMÁTICAMENTE ─────────── */}
        {activePlan && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Tarjeta de Resumen de Metas Generadas */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30 mb-1 inline-block">
                    {activePlan.category}
                  </span>
                  <h2 className="text-xl font-black text-white">{activePlan.goalTitle}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Plan automatique créé le {activePlan.createdAt} • Durée recommandée : 4 Semaines</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">HORAS / SEMANA</span>
                    <span className="text-base font-extrabold text-amber-400 flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" /> {activePlan.weeklyHours}h
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">TEMPS QUOTIDIEN</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      ~{activePlan.dailyMinutes} min/jour
                    </span>
                  </div>
                </div>
              </div>

              {/* Cursos & Ejercicios Asignados Automáticamente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Cours Assignés Automatiquement
                  </span>
                  <ul className="space-y-1">
                    {activePlan.recommendedCourses.map((cName, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
                        <span>{cName}</span>
                        <button
                          onClick={onNavigateToCourse}
                          className="text-[10px] text-emerald-400 font-bold hover:underline cursor-pointer"
                        >
                          Accéder au cours →
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-indigo-400" /> Exercices & Ateliers Assignés
                  </span>
                  <ul className="space-y-1">
                    {activePlan.assignedExercises.map((exName, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
                        <span>{exName}</span>
                        <button
                          onClick={onNavigateToExercises}
                          className="text-[10px] text-indigo-400 font-bold hover:underline cursor-pointer"
                        >
                          Résoudre →
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── DESGLOSE DE OBJETIVOS SEMANALES Y FECHAS LÍMITE ─────────── */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Jalons Hebdomadaires & Dates Limites de Réalisation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePlan.weeks.map((week) => {
                  const weekCompletedTasks = week.tasks.filter(t => t.completed).length;
                  const isWeekComplete = week.tasks.length > 0 && weekCompletedTasks === week.tasks.length;

                  return (
                    <div
                      key={week.weekNum}
                      className={`p-5 rounded-2xl border transition-all space-y-3 ${
                        isWeekComplete
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-850 border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                          {week.title}
                        </span>

                        <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Limite : {week.deadline}
                        </span>
                      </div>

                      {/* Lista de Tareas y Casillas de Verificación */}
                      <div className="space-y-2">
                        {week.tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(week.weekNum, task.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              task.completed
                                ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {task.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                              <span className={`text-xs ${task.completed ? 'line-through text-emerald-300/80' : ''}`}>
                                {task.text}
                              </span>
                            </div>

                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                              {task.completed ? 'Fait' : 'En attente'}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Progression de la semaine:</span>
                        <span className="font-bold text-white">
                          {weekCompletedTasks} sur {week.tasks.length} objectifs ({Math.round((weekCompletedTasks / week.tasks.length) * 100)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
