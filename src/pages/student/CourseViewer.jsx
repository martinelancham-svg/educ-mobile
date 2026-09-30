import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { QuizRunner } from './QuizRunner';
import {
  ChevronLeft,
  CheckCircle2,
  PlayCircle,
  FileText,
  Volume2,
  HelpCircle,
  Download,
  MessageSquare,
  Send,
  Zap,
  HardDrive,
  Award,
  Lock
} from 'lucide-react';

export const CourseViewer = ({ course, onBack }) => {
  const { user, markLessonComplete } = useAuth();
  const { isLowBandwidth, isEffectiveOffline } = useOffline();

  const allModules = course.modules || [];
  const firstLesson = allModules.length > 0 && allModules[0].lessons.length > 0
    ? allModules[0].lessons[0]
    : null;

  const [activeLesson, setActiveLesson] = useState(firstLesson);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [comments, setComments] = useState([
    { id: 1, author: 'Pascal M.', text: 'Excelente explicación sobre el compost con estiércol de ganado local.', date: 'Ayer' },
    { id: 2, author: 'Prof. Jean-Paul', text: 'Recuerden que la botella debe enterrarse al atardecer para evitar la condensación excesiva.', date: 'Hoy' }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleSelectLesson = (lesson) => {
    setActiveQuiz(null);
    setActiveLesson(lesson);
  };

  const handleSelectQuiz = (quiz) => {
    setActiveLesson(null);
    setActiveQuiz(quiz);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: user.name || 'Étudiant',
      text: newCommentText,
      date: 'À l\'instant ' + (isEffectiveOffline ? '(Enregistré Hors-Ligne)' : '')
    };

    setComments(prev => [...prev, newComment]);
    setNewCommentText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header del Aula Virtual */}
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3 text-emerald-400" />
          <span>Retour au Catalogue</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-white font-bold">{course.author || 'Prof. Baltasar Nsue Ondo'}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
              🟢 En Ligne Maintenant
            </span>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
            {course.sizeMB} Paquete
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Barra Lateral: Temario, Módulos y Quizzes */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Contenido del Curso</span>
              <span className="text-xs text-emerald-400 font-normal">{allModules.length} Módulos</span>
            </h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {allModules.map((mod, modIdx) => (
                <div key={mod.id} className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200">{mod.title}</h4>

                  {/* Lecciones */}
                  <div className="space-y-1">
                    {mod.lessons.map(lesson => {
                      const isCompleted = user.completedLessons.includes(lesson.id);
                      const isActive = activeLesson && activeLesson.id === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                              : 'hover:bg-slate-700/60 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {lesson.type === 'audio' ? (
                              <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz del Módulo */}
                  {mod.quiz && (
                    <div className="pt-2 border-t border-slate-700/60">
                      <button
                        onClick={() => handleSelectQuiz(mod.quiz)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          activeQuiz && activeQuiz.id === mod.quiz.id
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span>{mod.quiz.title}</span>
                        </div>
                        <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded">Examen</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Principal: Visor de Lección o Evaluador de Quiz */}
        <div className="lg:col-span-2 space-y-6">

          {activeQuiz ? (
            /* Evaluador de Quiz */
            <QuizRunner
              quiz={activeQuiz}
              onBack={() => {
                setActiveQuiz(null);
                if (firstLesson) setActiveLesson(firstLesson);
              }}
            />
          ) : activeLesson ? (
            /* Lección Actual */
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-700/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 mb-2 inline-block">
                    {activeLesson.type === 'audio' ? 'Guía en Audio (Liviana)' : 'Lectura Técnica'}
                  </span>
                  <h2 className="text-xl font-bold text-white">{activeLesson.title}</h2>
                </div>

                <button
                  onClick={() => markLessonComplete(activeLesson.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    user.completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-500 text-slate-950 hover:shadow-lg shadow-emerald-500/20 cursor-pointer'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {user.completedLessons.includes(activeLesson.id) ? 'Completado ✓' : 'Marcar Leída (+50 XP)'}
                </button>
              </div>

              {/* Contenido de Audio si aplica */}
              {activeLesson.type === 'audio' && (
                <div className="bg-slate-800 p-4 rounded-xl border border-amber-500/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Volume2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">Reproductor Audio Ultra-Comprimido</h4>
                    <p className="text-xs text-slate-300 mt-1">{activeLesson.audioSummary}</p>
                  </div>
                </div>
              )}

              {/* Cuerpo del Texto de la Lección */}
              <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {activeLesson.content}
              </div>

              {/* Archivos Descargables Adjuntos */}
              {activeLesson.resources && activeLesson.resources.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white">Recursos Descargables Adjuntos:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.resources.map((res, i) => (
                      <div key={i} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate text-slate-200 font-medium">{res.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">{res.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Comentarios y Dudas (Funciona Offline) */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Preguntas y Comentarios de la Lección
                </h4>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Escribe una duda para el profesor (se enviará al conectar)..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 hover:shadow-lg cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Enviar
                  </button>
                </form>

                <div className="space-y-3">
                  {comments.map(c => (
                    <div key={c.id} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-300">{c.author}</span>
                        <span className="text-[10px] text-slate-400">{c.date}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 p-12 rounded-2xl border border-slate-700/80 text-center text-slate-400">
              <PlayCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">Selecciona una lección para comenzar</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
