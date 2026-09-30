import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import {
  Download,
  CheckCircle2,
  HardDrive,
  Clock,
  Star,
  BookOpen,
  PlayCircle,
  Award,
  Trash2
} from 'lucide-react';

export const CourseCard = ({ course, onOpenCourse }) => {
  const { user, enrollCourse } = useAuth();
  const {
    offlineDownloads,
    downloadingCourseId,
    downloadProgress,
    downloadCourse,
    deleteOfflineCourse,
    isEffectiveOffline
  } = useOffline();

  const isDownloaded = offlineDownloads.some(d => d.courseId === course.id);
  const isDownloading = downloadingCourseId === course.id;
  const isEnrolled = user.enrolledCourses.includes(course.id);

  const courseLessons = course.modules
    ? course.modules.flatMap(m => m.lessons.map(l => l.id))
    : [];
  const completedInThisCourse = courseLessons.filter(id => user.completedLessons.includes(id));
  const progressPercent = courseLessons.length > 0
    ? Math.round((completedInThisCourse.length / courseLessons.length) * 100)
    : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group relative border border-slate-700/60 shadow-xl">
      <div>
        <div className={`h-24 bg-gradient-to-r ${course.bannerColor || 'from-emerald-700 to-teal-900'} p-4 flex flex-col justify-between relative overflow-hidden`}>
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-950/60 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              {course.region || 'Afrique Centrale'}
            </span>
            {isDownloaded ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                <CheckCircle2 className="w-3 h-3" />
                Hors-Ligne Prêt ({course.sizeMB})
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 flex items-center gap-1 border border-slate-700">
                <HardDrive className="w-3 h-3 text-amber-400" />
                {course.sizeMB || '4.0 MB'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h4 className="text-xs font-semibold text-white/90">{course.author}</h4>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
              En Ligne
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{course.rating}</span>
            </div>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400">{course.duration}</span>
          </div>

          <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            {course.description}
          </p>

          {isEnrolled && (
            <div className="mb-4 bg-slate-800 p-2.5 rounded-xl border border-slate-700/80">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                <span>Votre Progrès</span>
                <span className="text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center gap-2">
        <button
          onClick={() => {
            if (!isEnrolled) enrollCourse(course.id);
            onOpenCourse(course);
          }}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <PlayCircle className="w-4 h-4" />
          {isEnrolled ? 'Étudier les Leçons' : 'S\'inscrire Gratuitement'}
        </button>

        {isDownloading ? (
          <div className="px-3 py-2 bg-slate-800 border border-amber-500/40 rounded-xl flex items-center gap-2 text-amber-400 text-xs">
            <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-amber-400 border-t-transparent"></span>
            <span className="font-bold">{downloadProgress}%</span>
          </div>
        ) : isDownloaded ? (
          <button
            onClick={() => deleteOfflineCourse(course.id)}
            title="Supprimer du stockage local pour libérer de l'espace"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => downloadCourse(course)}
            title="Enregistrer le cours complet pour consulter hors-ligne"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <Download className="w-4 h-4 text-emerald-400" />
          </button>
        )}
      </div>
    </div>
  );
};
