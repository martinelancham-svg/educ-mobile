import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { CertificateModal } from '../../components/CertificateModal';
import {
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  TrendingUp,
  PlayCircle,
  Sparkles,
  Wifi,
  MessageSquare,
  DollarSign,
  Bot,
  Brain,
  Target,
  Calendar,
  Lock,
  Key
} from 'lucide-react';

export const StudentDashboard = ({ onOpenCourse, onNavigateToAiTutor, onNavigateToGoals, onNavigateToSecureExams }) => {
  const { user, courses, currentUserGoal } = useAuth();
  const { offlineDownloads } = useOffline();
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);

  const onlineTeachers = [
    {
      id: 't-1',
      name: 'Prof. Baltasar Nsue Ondo',
      title: 'Professeur de Mathématiques & Physique (Secondaire / Baccalauréat)',
      location: 'Bata & UNGE (Río Muni)',
      status: 'Online',
      specialty: 'Équations, Géométrie et Mécanique'
    },
    {
      id: 't-2',
      name: 'Dra. Solange Nguema Avomo',
      title: 'Enseignante en Sciences Naturelles & Biologie',
      location: 'Malabo (Île de Bioko)',
      status: 'Online',
      specialty: 'Botanique et Chimie Organique'
    },
    {
      id: 't-3',
      name: 'Prof. Carmen Ruiz Nchama',
      title: 'Spécialiste Pédagogique du Primaire (1ère à 6ème)',
      location: 'Ebebiyín (Kié-Ntem)',
      status: 'Online',
      specialty: 'Arithmétique de Base et Alphabétisation'
    }
  ];

  const userEnrolled = user?.enrolledCourses || [];
  const userCompleted = user?.completedLessons || [];

  const enrolledCoursesList = (courses || []).filter(c => userEnrolled.includes(c.id));

  // Calcular métricas
  const totalEnrolled = enrolledCoursesList.length;
  
  const courseCompletionMap = enrolledCoursesList.map(course => {
    const courseLessons = course?.modules ? course.modules.flatMap(m => (m.lessons || []).map(l => l.id)) : [];
    const completedCount = courseLessons.filter(id => userCompleted.includes(id)).length;
    const isCompleted = courseLessons.length > 0 && completedCount === courseLessons.length;
    const percent = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;
    return { course, completedCount, totalLessons: courseLessons.length, percent, isCompleted };
  });

  const completedCoursesCount = courseCompletionMap.filter(c => c.isCompleted).length;
  const inProgressCoursesCount = totalEnrolled - completedCoursesCount;
  const overallAvgProgress = totalEnrolled > 0
    ? Math.round(courseCompletionMap.reduce((acc, curr) => acc + curr.percent, 0) / totalEnrolled)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header del Estudiante */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-500/20">
            {user.name ? user.name.charAt(0) : 'E'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">{user?.name || 'Élève'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                Niveau {user?.level || 1}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.school || 'Lycée National Rey Malabo'} • {user?.country || 'Guinée Équatoriale'}</p>
          </div>
        </div>

        {/* Puntos y Racha */}
        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex-1 md:flex-initial text-center px-4">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-sm mb-0.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{user?.studyStreakDays || 1} Jours</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Série d'Étude</span>
          </div>

          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex-1 md:flex-initial text-center px-4">
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-extrabold text-sm mb-0.5">
              <Sparkles className="w-4 h-4" />
              <span>{user?.xpPoints || 100} XP</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Points Obtenus</span>
          </div>
        </div>
      </div>

      {/* ─── BANNER DE SALAS DE EXAMEN SEGURO ───────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950/40 to-slate-900 p-5 rounded-3xl border border-red-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shrink-0">
            <Lock className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
                🔒 Évaluations Présentielles & À Distance
              </span>
            </div>
            <h2 className="text-base font-bold text-white">Vous avez un examen programmé aujourd'hui?</h2>
            <p className="text-xs text-slate-300">Connectez-vous à la salle de votre enseignant en utilisant votre Code PIN officiel.</p>
          </div>
        </div>

        <button
          onClick={onNavigateToSecureExams}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/20 shrink-0 transition-transform hover:scale-105"
        >
          <Key className="w-4 h-4 text-slate-950" />
          Accéder à la Salle d'Examen
        </button>
      </div>

      {/* ─── BANNER DESTACADO DE OBJETIVOS PERSONALES & PLAN SEMANAL ───────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <Target className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Mon Objectif Personnel & Plan d'Étude</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold border border-indigo-500/30 uppercase">
                  Généré Autonomement
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {currentUserGoal?.goalTitle
                  ? `Objectif actif: "${currentUserGoal.goalTitle}"`
                  : 'Définissez votre objectif éducatif. La plateforme créera vos objectifs hebdomadaires, heures, exercices et dates limites.'}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToGoals}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-transform hover:scale-105 shrink-0"
          >
            <Target className="w-4 h-4 text-amber-300" />
            {currentUserGoal ? 'Voir & Marquer les Progrès du Plan' : 'Définir Mon Objectif Personnel'}
          </button>
        </div>

        {/* Resumen del Objetivo Actual si existe */}
        {currentUserGoal && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Heures Recommandées:</span>
              <strong className="text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentUserGoal.weeklyHours || 6}h / semaine
              </strong>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Temps Quotidien:</span>
              <strong className="text-emerald-400 font-bold">
                ~{currentUserGoal.dailyMinutes || 45} min/jour
              </strong>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Prochaine Date Limite:</span>
              <strong className="text-indigo-300 font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {currentUserGoal.weeks?.[0]?.deadline || '7 jours'}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* ─── BANNER DESTACADO DE TUTOR IA 24/7 PARA EL ESTUDIANTE ───────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-amber-300 flex items-center justify-center font-bold text-2xl border border-indigo-500/30 shrink-0">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Intelligence Artificielle 24/7
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">🟢 Disponible Hors-Ligne</span>
            </div>
            <h2 className="text-base font-bold text-white">Vous avez des questions sur vos leçons ou devoirs?</h2>
            <p className="text-xs text-slate-300">Votre Tuteur IA peut vous expliquer des sujets difficiles, générer des exercices résolus et créer des questions à partir de votre PDF.</p>
          </div>
        </div>

        <button
          onClick={onNavigateToAiTutor}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-indigo-500/20 shrink-0"
        >
          <Brain className="w-4 h-4 text-amber-300 animate-pulse" /> Ouvrir Tuteur IA 24/7
        </button>
      </div>

      {/* 🟢 NUEVA SECCIÓN: Profesores Conectados en Línea */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">Enseignants Connectés en Ligne Maintenant</h2>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            3 Enseignants Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {onlineTeachers.map((prof) => (
            <div
              key={prof.id}
              className="bg-slate-850 p-4 rounded-2xl border border-slate-700 space-y-2 hover:border-emerald-500/50 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  EN LIGNE MAINTENANT
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{prof.location}</span>
              </div>

              <h3 className="text-sm font-bold text-white">{prof.name}</h3>
              <p className="text-xs text-amber-300 font-semibold">{prof.title}</p>
              <p className="text-[11px] text-slate-400">Spécialité: {prof.specialty}</p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => alert(`Envoi d'une consultation rapide à ${prof.name}`)}
                  className="w-full py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Consulter Enseignant
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Tarjetas Métricas del Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Inscrits</span>
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalEnrolled}</p>
          <span className="text-[11px] text-slate-500">Cours dans votre compte</span>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Terminés</span>
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{completedCoursesCount}</p>
          <span className="text-[11px] text-slate-500">Examens réussis</span>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">En Cours</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{inProgressCoursesCount}</p>
          <span className="text-[11px] text-slate-500">Leçons en attente</span>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Progrès Général</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{overallAvgProgress}%</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${overallAvgProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Lista de Cursos Inscritos */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Mes Cours et Progrès
        </h2>

        {courseCompletionMap.length === 0 ? (
          <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700 text-center text-slate-400">
            <p className="text-sm">Vous n'êtes inscrit à aucun cours pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courseCompletionMap.map(({ course, completedCount, totalLessons, percent, isCompleted }) => {
              const isDownloaded = offlineDownloads.some(d => d.courseId === course.id);

              return (
                <div
                  key={course.id}
                  className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white">{course.title}</h3>
                        {isDownloaded && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Hors-Ligne Enregistré
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {completedCount} sur {totalLessons} leçons terminées ({percent}%)
                      </p>

                      <div className="w-48 bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {isCompleted ? (
                      <button
                        onClick={() => setSelectedCertCourse(course)}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        Voir Certificat
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenCourse(course)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Continuer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Certificado */}
      {selectedCertCourse && (
        <CertificateModal
          courseTitle={selectedCertCourse.title}
          studentName={user.name}
          onClose={() => setSelectedCertCourse(null)}
        />
      )}
    </div>
  );
};
