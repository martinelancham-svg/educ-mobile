import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  CheckCircle2,
  Edit,
  Save,
  X,
  Sparkles,
  Flame,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Brain,
  Target,
  Calendar,
  Clock,
  BookOpen,
  FlaskConical,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Award
} from 'lucide-react';

export const TeacherStudentProgress = () => {
  const [studentsList, setStudentsList] = useState([
    {
      id: '1',
      name: 'Emmanuel Olinga',
      course: 'Mathématiques & Physique Secondaire',
      progress: 100,
      avgScore: 100,
      level: 4,
      xpPoints: 680,
      lastActive: 'Aujourd\'hui',
      goal: {
        title: 'Préparation Examen Sélectivité & Épreuves d\'Accès UNGE',
        category: 'Baccalauréat & Accès Université',
        weeklyHours: 8,
        dailyMinutes: 60,
        createdAt: '18 août 2026',
        recommendedCourses: ['Master en Mathématiques Secondaire', 'Physique et Chimie: Lois de Newton & Ohm'],
        assignedExercises: ['Équations du Second Degré', 'Loi d\'Ohm & Circuits'],
        teacherFeedback: 'Progrès excellent au Module 1. Recommandé de continuer avec la trigonométrie.',
        weeks: [
          {
            weekNum: 1,
            title: 'Semaine 1: Fondations & Concepts Clés',
            deadline: '25 août 2026',
            tasks: [
              { id: 'w1-1', text: 'Réviser le Module 1 du cours assigné', completed: true },
              { id: 'w1-2', text: 'Résoudre 5 exercices de pratique initiale', completed: true },
              { id: 'w1-3', text: 'Compléter 45 min quotidiennes de lecture interactive', completed: true }
            ]
          },
          {
            weekNum: 2,
            title: 'Semaine 2: Application Pratique & Résolution',
            deadline: '01 sept 2026',
            tasks: [
              { id: 'w2-1', text: 'Compléter le Module 2 et les auto-évaluations', completed: true },
              { id: 'w2-2', text: 'Réaliser l\'Atelier d\'Exercices de Maths', completed: true }
            ]
          },
          {
            weekNum: 3,
            title: 'Semaine 3: Consolidation & Simulation',
            deadline: '08 sept 2026',
            tasks: [
              { id: 'w3-1', text: 'Résoudre l\'examen blanc sans soutien', completed: true },
              { id: 'w3-2', text: 'Télécharger le résumé PDF pour révision hors-ligne', completed: true }
            ]
          },
          {
            weekNum: 4,
            title: 'Semaine 4: Évaluation Finale & Certification',
            deadline: '15 sept 2026',
            tasks: [
              { id: 'w4-1', text: 'Réussir le Quiz Final du Cours', completed: true },
              { id: 'w4-2', text: 'Générer le Certificat Officiel', completed: true }
            ]
          }
        ]
      }
    },
    {
      id: '2',
      name: 'Fatou Ndiaye',
      course: 'Physique et Chimie Secondaire',
      progress: 85,
      avgScore: 92,
      level: 3,
      xpPoints: 450,
      lastActive: 'Hier',
      goal: {
        title: 'Maîtriser les Mathématiques & la Physique',
        category: 'Secondaire Obligatoire',
        weeklyHours: 6,
        dailyMinutes: 45,
        createdAt: '19 août 2026',
        recommendedCourses: ['Physique & Chimie: Lois de Newton & Ohm'],
        assignedExercises: ['Ajustement des Réactions', 'Lois de Newton'],
        teacherFeedback: 'Démontre une bonne maîtrise des équations. Renforcer la manipulation des vecteurs.',
        weeks: [
          {
            weekNum: 1,
            title: 'Semaine 1: Fondations & Concepts Clés',
            deadline: '26 août 2026',
            tasks: [
              { id: 'f1-1', text: 'Réviser le Module 1 de Physique', completed: true },
              { id: 'f1-2', text: 'Résoudre des exercices de vecteurs de base', completed: true }
            ]
          },
          {
            weekNum: 2,
            title: 'Semaine 2: Application Pratique & Résolution',
            deadline: '02 sept 2026',
            tasks: [
              { id: 'f2-1', text: 'Compléter le Module 2 et les auto-évaluations', completed: true },
              { id: 'f2-2', text: 'Réaliser l\'Atelier d\'Exercices de Physique', completed: false }
            ]
          },
          {
            weekNum: 3,
            title: 'Semaine 3: Consolidation & Examens de Pratique',
            deadline: '09 sept 2026',
            tasks: [
              { id: 'f3-1', text: 'Résoudre une simulation d\'examen', completed: false }
            ]
          },
          {
            weekNum: 4,
            title: 'Semaine 4: Évaluation Finale',
            deadline: '16 sept 2026',
            tasks: [
              { id: 'f4-1', text: 'Réussir le Questionnaire Final', completed: false }
            ]
          }
        ]
      }
    },
    {
      id: '3',
      name: 'Koffi Mensah',
      course: 'Agroécologie & Primaire',
      progress: 60,
      avgScore: 78,
      level: 2,
      xpPoints: 280,
      lastActive: 'Il y a 2 jours',
      goal: {
        title: 'Renforcement en Arithmétique de Base & Compréhension de Lecture',
        category: 'Primaire (1ère à 6ème)',
        weeklyHours: 4,
        dailyMinutes: 30,
        createdAt: '20 août 2026',
        recommendedCourses: ['Mathématiques de Base Primaire'],
        assignedExercises: ['Multiplication et Division', 'Lecture guidée'],
        teacherFeedback: 'Il est recommandé de consacrer 15 minutes supplémentaires par jour aux tables de multiplication.',
        weeks: [
          {
            weekNum: 1,
            title: 'Semaine 1: Tables de Multiplication & Calcul Rapide',
            deadline: '27 août 2026',
            tasks: [
              { id: 'k1-1', text: 'Révision des tables de 1 à 10', completed: true },
              { id: 'k1-2', text: 'Résoudre 10 opérations simples', completed: true }
            ]
          },
          {
            weekNum: 2,
            title: 'Semaine 2: Fractions & Divisions',
            deadline: '03 sept 2026',
            tasks: [
              { id: 'k2-1', text: 'Compléter les exercices de division', completed: false }
            ]
          },
          {
            weekNum: 3,
            title: 'Semaine 3: Lecture Interactive',
            deadline: '10 sept 2026',
            tasks: [
              { id: 'k3-1', text: 'Lire 2 livres audio éducatifs', completed: false }
            ]
          },
          {
            weekNum: 4,
            title: 'Semaine 4: Évaluation Générale du Primaire',
            deadline: '17 sept 2026',
            tasks: [
              { id: 'k4-1', text: 'Examen de pratique autocorrigé', completed: false }
            ]
          }
        ]
      }
    },
    {
      id: '4',
      name: 'Amina Diallo',
      course: 'Baccalauréat & Santé',
      progress: 95,
      avgScore: 95,
      level: 5,
      xpPoints: 890,
      lastActive: 'Aujourd\'hui',
      goal: {
        title: 'Formation en FP Technique de Réseaux & Systèmes',
        category: 'Formation Professionnelle',
        weeklyHours: 7,
        dailyMinutes: 50,
        createdAt: '17 août 2026',
        recommendedCourses: ['Introduction à la FP Technique & Réseaux'],
        assignedExercises: ['Configuration Réseaux IP', 'Maintenance PC'],
        teacherFeedback: 'Excellent rendement pratique. Prête pour le projet d\'installation rurale.',
        weeks: [
          {
            weekNum: 1,
            title: 'Semaine 1: Architecture des Réseaux',
            deadline: '24 août 2026',
            tasks: [
              { id: 'a1-1', text: 'Étude des modèles OSI et TCP/IP', completed: true },
              { id: 'a1-2', text: 'Pratique de simulation de réseau', completed: true }
            ]
          },
          {
            weekNum: 2,
            title: 'Semaine 2: Configuration IP & Sous-réseaux',
            deadline: '31 août 2026',
            tasks: [
              { id: 'a2-1', text: 'Exercices d\'adressage IPv4', completed: true }
            ]
          },
          {
            weekNum: 3,
            title: 'Semaine 3: Maintenance Hors-Ligne',
            deadline: '07 sept 2026',
            tasks: [
              { id: 'a3-1', text: 'Configuration de nœud de serveur local', completed: true }
            ]
          },
          {
            weekNum: 4,
            title: 'Semaine 4: Certification FP Technique',
            deadline: '14 sept 2026',
            tasks: [
              { id: 'a4-1', text: 'Évaluation de laboratoire pratique', completed: true }
            ]
          }
        ]
      }
    }
  ]);

  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editProgress, setEditProgress] = useState(0);
  const [editScore, setEditScore] = useState(0);
  const [editLevel, setEditLevel] = useState(1);
  const [editXp, setEditXp] = useState(0);

  const [feedbackInput, setFeedbackInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const toggleExpand = (studentId) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
    } else {
      setExpandedStudentId(studentId);
      const student = studentsList.find(s => s.id === studentId);
      setFeedbackInput(student?.goal?.teacherFeedback || '');
    }
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setEditProgress(student.progress);
    setEditScore(student.avgScore);
    setEditLevel(student.level || 1);
    setEditXp(student.xpPoints || 100);
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    setStudentsList(prev => prev.map(s => {
      if (s.id === editingStudent.id) {
        return {
          ...s,
          progress: Number(editProgress),
          avgScore: Number(editScore),
          level: Number(editLevel),
          xpPoints: Number(editXp),
          lastActive: 'Actualizado por Profesor'
        };
      }
      return s;
    }));

    setToastMsg(`¡Progreso de ${editingStudent.name} actualizado correctamente!`);
    setEditingStudent(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Guardar retroalimentación del profesor para el objetivo personal del estudiante
  const handleSaveFeedback = (studentId) => {
    setStudentsList(prev => prev.map(s => {
      if (s.id === studentId && s.goal) {
        return {
          ...s,
          goal: {
            ...s.goal,
            teacherFeedback: feedbackInput
          }
        };
      }
      return s;
    }));

    setToastMsg('¡Retroalimentación pedagógica guardada y enviada al estudiante!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Alternar tarea del objetivo como revisada/completada por el profesor
  const toggleTeacherTaskCheck = (studentId, weekNum, taskId) => {
    setStudentsList(prev => prev.map(s => {
      if (s.id === studentId && s.goal) {
        const updatedWeeks = s.goal.weeks.map(w => {
          if (w.weekNum === weekNum) {
            const updatedTasks = w.tasks.map(t => {
              if (t.id === taskId) {
                return { ...t, completed: !t.completed };
              }
              return t;
            });
            return { ...w, tasks: updatedTasks };
          }
          return w;
        });

        // Recalcular % de avance del objetivo
        let total = 0;
        let done = 0;
        updatedWeeks.forEach(w => {
          w.tasks.forEach(t => {
            total += 1;
            if (t.completed) done += 1;
          });
        });
        const newProgress = total > 0 ? Math.round((done / total) * 100) : s.progress;

        return {
          ...s,
          progress: newProgress,
          goal: { ...s.goal, weeks: updatedWeeks }
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* Header Docente */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Target className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Supervision Enseignante des Objectifs
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                🟢 Génération Autonome Active
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Objectifs Personnels & Progrès des Étudiants</h1>
            <p className="text-xs text-slate-300">
              Supervisez les objectifs personnels créés automatiquement (objectifs hebdomadaires, heures, cours, exercices, dates limites et % de progression).
            </p>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── TARJETAS DE RESUMEN DOCENTE ─────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Étudiants</span>
          <p className="text-2xl font-extrabold text-white">{studentsList.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">En suivi actif</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">Avec Objectifs Actifs</span>
          <p className="text-2xl font-extrabold text-amber-400">{studentsList.filter(s => s.goal).length}</p>
          <span className="text-[10px] text-amber-300 font-semibold">Plans hebdomadaires actifs</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">Heures Hebdomadaires Moyennes</span>
          <p className="text-2xl font-extrabold text-emerald-400">6.25 h</p>
          <span className="text-[10px] text-slate-400 font-medium">~50 min/jour par élève</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">Taux de Réalisation Global</span>
          <p className="text-2xl font-extrabold text-indigo-400">85%</p>
          <span className="text-[10px] text-indigo-300 font-bold">+18% vs mois dernier</span>
        </div>
      </div>

      {/* ─── LISTA DE ESTUDIANTES CON SUPERVISIÓN DE OBJETIVOS ─────────── */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Planificateur & Objectifs Personnels des Élèves
          </span>
          <span className="text-xs text-slate-400 font-normal">
            Cliquez sur "Superviser l'Objectif & Plan" pour voir ou modifier le plan hebdomadaire
          </span>
        </h2>

        <div className="space-y-3">
          {studentsList.map((st) => {
            const isExpanded = expandedStudentId === st.id;
            const goal = st.goal;

            // Calcular tareas completadas en su objetivo
            let totalTasks = 0;
            let doneTasks = 0;
            if (goal && goal.weeks) {
              goal.weeks.forEach(w => {
                w.tasks.forEach(t => {
                  totalTasks += 1;
                  if (t.completed) doneTasks += 1;
                });
              });
            }
            const goalProgressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : st.progress;

            return (
              <div
                key={st.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl transition-all hover:border-amber-500/40"
              >
                {/* Fila Principal de la Tarjeta del Estudiante */}
                <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-extrabold text-xl shrink-0 shadow-lg shadow-amber-500/20">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold text-white">{st.name}</h3>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                          Niveau {st.level} • {st.xpPoints} XP
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          Dernier accès : {st.lastActive}
                        </span>
                      </div>

                      {goal ? (
                        <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-amber-400" />
                          <span>Objectif : "{goal.title}"</span>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">Aucun objectif personal configuré</p>
                      )}
                    </div>
                  </div>

                  {/* Avance % y Acciones Docentes */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">Progrès de l'Objectif</span>
                      <span className="text-base font-extrabold text-emerald-400">{goalProgressPercent}%</span>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(st)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                      title="Éditer les Métriques de Base"
                    >
                      <Edit className="w-4 h-4 text-amber-400" />
                    </button>

                    <button
                      onClick={() => toggleExpand(st.id)}
                      className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                        isExpanded
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-500/40'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      <span>{isExpanded ? 'Masquer le Plan' : 'Superviser l\'Objectif & Plan'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* ─── DESGLOSE DESPLEGABLE DE LOS 6 COMPONENTES AUTOMÁTICOS DEL ALUMNO ─────────── */}
                {isExpanded && goal && (
                  <div className="p-6 bg-slate-950/90 border-t border-slate-800 space-y-6 animate-fadeIn">
                    
                    {/* Header del Plan del Estudiante */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 p-4 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 inline-block mb-1">
                          {goal.category}
                        </span>
                        <h4 className="text-base font-extrabold text-white">{goal.title}</h4>
                        <span className="text-[11px] text-slate-400">Generado el {goal.createdAt} • Seguimiento por el Profesor</span>
                      </div>

                      {/* 1. HORAS RECOMENDADAS */}
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 font-bold block">HORAS SEMANALES</span>
                          <span className="text-sm font-black text-amber-400 flex items-center justify-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {goal.weeklyHours}h / sem
                          </span>
                        </div>

                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 font-bold block">TIEMPO DIARIO</span>
                          <span className="text-sm font-black text-emerald-400">
                            ~{goal.dailyMinutes} min/día
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2 & 3. CURSOS Y EJERCICIOS ASIGNADOS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-400" /> 2. Cursos Asignados Automáticamente
                        </span>
                        <ul className="space-y-1">
                          {goal.recommendedCourses.map((cName, idx) => (
                            <li key={idx} className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
                              <span>{cName}</span>
                              <span className="text-[10px] text-emerald-400 font-semibold">✓ Vinculado</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FlaskConical className="w-4 h-4 text-indigo-400" /> 3. Ejercicios & Talleres Asignados
                        </span>
                        <ul className="space-y-1">
                          {goal.assignedExercises.map((exName, idx) => (
                            <li key={idx} className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
                              <span>{exName}</span>
                              <span className="text-[10px] text-indigo-400 font-semibold">✓ Asignado</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 4 & 5. OBJETIVOS SEMANALES Y FECHAS LÍMITE */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-400" /> 4 y 5. Objetivos Semanales & Fechas Límite (Supervisión de Tareas)
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {goal.weeks.map((week) => (
                          <div key={week.weekNum} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-xs font-bold text-indigo-300">{week.title}</span>
                              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-amber-400" /> Límite: {week.deadline}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {week.tasks.map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => toggleTeacherTaskCheck(st.id, week.weekNum, task.id)}
                                  className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer border transition-all ${
                                    task.completed
                                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                                      : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className={`w-3.5 h-3.5 ${task.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                                    <span className={task.completed ? 'line-through text-emerald-300/80' : ''}>
                                      {task.text}
                                    </span>
                                  </div>

                                  <span className="text-[9px] font-bold uppercase">
                                    {task.completed ? 'Revu ✓' : 'En attente'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 6. RETROALIMENTACIÓN DOCENTE & SEGUIMIENTO */}
                    <div className="bg-slate-900 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-indigo-400" /> 6. Retour Pédagogique de l'Enseignant
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">L'étudiant pourra voir vos recommandations en temps réel</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          placeholder="Rédigez une observation pédagogique ou recommandation pour l'étudiant..."
                          className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />

                        <button
                          onClick={() => handleSaveFeedback(st.id)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-transform hover:scale-102 shrink-0"
                        >
                          <Save className="w-4 h-4" /> Enregistrer l'Observation
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Edición de Progreso Básico */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Éditer le Progrès de {editingStudent.name}</h3>
                <p className="text-xs text-slate-400">{editingStudent.course}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">Progression du Cours (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editProgress}
                    onChange={(e) => setEditProgress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">Note Moyenne (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">Niveau de l'Étudiant</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block">Puntos XP Acumulados</label>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    required
                    value={editXp}
                    onChange={(e) => setEditXp(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Guardar Cambios de Progreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
