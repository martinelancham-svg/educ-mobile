import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_TEACHER_STATS } from '../../data/initialMockData';
import {
  UserCheck,
  BookOpen,
  Users,
  Star,
  DownloadCloud,
  PlusCircle,
  FileCheck2,
  Radio,
  BarChart3,
  Wifi,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Brain,
  Zap,
  ArrowUpRight,
  RefreshCw,
  Send,
  Target,
  Lock
} from 'lucide-react';

export const TeacherDashboard = ({ onCreateCourse, onNavigateToOnlineStudents, onNavigateToProgress, onNavigateToLive, onNavigateToSecureExams }) => {
  const { courses } = useAuth();
  const stats = INITIAL_TEACHER_STATS || {
    activeCourses: 3,
    totalStudents: 148,
    downloadsCount: 520,
    averageRating: '4.9'
  };

  const [toastMsg, setToastMsg] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reinforcementSent, setReinforcementSent] = useState(false);

  const handleRefreshAnalytics = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setToastMsg('Diagnostic IA mis à jour ! Le rendement moyen se maintient à +18 % cette semaine.');
      setTimeout(() => setToastMsg(''), 4000);
    }, 1000);
  };

  const handleSendReinforcement = () => {
    setReinforcementSent(true);
    setToastMsg('Atelier de renforcement pour le Module 4 (42% d\'erreur) envoyé avec succès à 45 étudiants !');
    setTimeout(() => setToastMsg(''), 4500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Profesor */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 mb-2 inline-block">
            Panneau de Création & Gestion Enseignante
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Studio de l'Enseignant: Prof. Jean-Paul Mbarga</h1>
          <p className="text-xs text-slate-300">Créez du contenu éducatif empaqueté pour une distribution hors-ligne dans les écoles rurales.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onNavigateToLive}
            className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center gap-2 hover:shadow-xl transition-all cursor-pointer border border-amber-500/40"
          >
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            Salles Virtuelles En Direct
          </button>

          <button
            onClick={onNavigateToOnlineStudents}
            className="px-4 py-3 rounded-2xl bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 font-extrabold text-xs flex items-center gap-2 hover:shadow-xl transition-all cursor-pointer border border-indigo-500/40"
          >
            <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
            Élèves En Ligne
          </button>

          <button
            onClick={onNavigateToSecureExams}
            className="px-4 py-3 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-200 font-extrabold text-xs flex items-center gap-2 hover:shadow-xl transition-all cursor-pointer border border-red-500/50"
          >
            <Lock className="w-4 h-4 text-red-400 animate-pulse" />
            Créer Salle d'Examen Sécurisée 🔒
          </button>

          <button
            onClick={onCreateCourse}
            className="px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            Créer un Nouveau Cours
          </button>
        </div>
      </div>

      {/* ─── BANNER DE SUPERVISIÓN DOCENTE DE OBJETIVOS PERSONALES ─────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 p-6 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-2xl border border-amber-500/30 shrink-0">
            <Target className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Supervision des Objectifs des Élèves
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">4 Élèves Actifs</span>
            </div>
            <h2 className="text-base font-bold text-white">Objectifs Personnels & Plans Hebdomadaires des Étudiants</h2>
            <p className="text-xs text-slate-300">
              Supervisez les 4 semaines d'étapes, heures recommandées, exercices assignés et retours pédagogiques pour chaque élève.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToProgress}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Target className="w-4 h-4 text-slate-950" /> Superviser Objectifs des Élèves
        </button>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── SECCIÓN DE INTELIGENCIA ANALÍTICA & ALERTAS PEDAGÓGICAS ─────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <Brain className="w-5 h-5 animate-pulse text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Intelligence Analytique de la Classe & Diagnostic IA</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold border border-indigo-500/30 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> IA Éducative
                </span>
              </div>
              <p className="text-xs text-slate-400">Diagnostic automatique des progrès et détection des difficultés des élèves.</p>
            </div>
          </div>

          <button
            onClick={handleRefreshAnalytics}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Recalculer les Analyses</span>
          </button>
        </div>

        {/* Tarjetas de Alerta & Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* INSIGHT 1: Aumento de Rendimiento */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-2 flex flex-col justify-between hover:border-emerald-500/60 transition-all">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Rendement de la Classe
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                  +18% 📈
                </span>
              </div>
              <p className="text-xs font-bold text-white leading-snug">
                Le rendement global de la classe a augmenté de <strong className="text-emerald-400">18 %</strong> lors des évaluations de ce mois-ci.
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Les groupes de 4e et de Baccalauréat ont montré la plus grande amélioration après la distribution des guides audio MP3 et des questionnaires autocorrigés.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-300/80 font-mono flex items-center justify-between">
              <span>État : Excellente progression curriculaire</span>
              <span className="text-emerald-400 font-bold">Tendance Positive</span>
            </div>
          </div>

          {/* INSIGHT 2: Tasa de Errores en Módulo 4 */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-red-500/30 space-y-3 flex flex-col justify-between hover:border-red-500/60 transition-all">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" /> Alerte de Difficulté
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-black border border-red-500/30">
                  42 % d'Erreur ❌
                </span>
              </div>
              <p className="text-xs font-bold text-white leading-snug">
                Le <strong className="text-red-400">Module 4</strong> ("Équations du 2nd Degré & Lois de Newton") présente un taux d'erreur de <strong className="text-red-400">42 %</strong>.
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                45 élèves ont présenté des erreurs récurrentes dans la résolution du discriminant. Il est suggéré de renforcer les concepts avec un court atelier explicatif.
              </p>
            </div>

            {/* Acción Recomendada */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-medium">Recommandation IA : Renforcement actif</span>
              <button
                onClick={handleSendReinforcement}
                disabled={reinforcementSent}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                  reinforcementSent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 hover:scale-105'
                }`}
              >
                {reinforcementSent ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Atelier de Renforcement Envoyé
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-red-400" /> Envoyer l'Atelier de Renforcement
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Cours Publiés</span>
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.activeCourses}</p>
        </div>

        <div
          onClick={onNavigateToOnlineStudents}
          className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-indigo-500/60 cursor-pointer transition-all group shadow-md hover:shadow-indigo-500/10"
          title="Cliquez pour voir la liste complète des étudiants connectés en temps réel"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium group-hover:text-indigo-300">Élèves Inscrits</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-extrabold text-white">{stats.totalStudents}</p>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 3 En Ligne
            </span>
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Téléchargements Hors-Ligne</span>
            <DownloadCloud className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.downloadsCount}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Note Moyenne</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.averageRating} / 5.0</p>
        </div>
      </div>

      {/* Cursos Creados por el Profesor */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          Vos Cours Créés
        </h2>

        <div className="space-y-3">
          {(courses || []).map(course => (
            <div key={course.id} className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                    Approuvé & Au Catalogue
                  </span>
                  <span className="text-xs text-slate-400">{course.sizeMB}</span>
                </div>
                <h3 className="text-base font-bold text-white">{course.title}</h3>
                <p className="text-xs text-slate-400">{course.duration} • {course.modules ? course.modules.length : 0} {course.modules && course.modules.length === 1 ? 'Module' : 'Modules'}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  ⭐ {course.rating} ({course.reviewsCount} évaluations)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
