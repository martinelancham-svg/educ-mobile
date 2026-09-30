import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const QuizRunner = ({ quiz, onBack }) => {
  const { recordQuizResult } = useAuth();
  const { isEffectiveOffline } = useOffline();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);

  const questions = quiz.questions || [];
  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    const passed = percent >= quiz.passingScore;

    setScorePercent(percent);
    setSubmitted(true);

    recordQuizResult(quiz.id, percent, passed);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentQuestionIdx(0);
  };

  if (!currentQ && !submitted) {
    return (
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 text-center text-slate-400">
        <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-600" />
        <p className="text-sm">Ce questionnaire n'a pas encore de questions configurées.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 p-6 rounded-2xl border border-amber-500/30 shadow-2xl space-y-6">
      
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Évaluation Hors-Ligne
            </span>
            {isEffectiveOffline && (
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                Note Enregistrée Localement
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-white">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Clock className="w-4 h-4" />
            <span>{quiz.timeLimitMinutes || 10} Min Limit</span>
          </div>
        </div>
      </div>

      {/* Resultados de la Evaluación */}
      {submitted ? (
        <div className="text-center py-8 space-y-6 animate-fadeIn">
          <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl ${
            scorePercent >= quiz.passingScore
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}>
            {scorePercent}%
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white mb-1">
              {scorePercent >= quiz.passingScore ? 'Félicitations! Vous avez Réussi' : 'Vous n\'avez pas atteint la note minimale'}
            </h3>
            <p className="text-xs text-slate-400">
              Note minimale requise pour réussir: {quiz.passingScore}%
            </p>
          </div>

          {/* Revisión de Preguntas con Respuestas Correctas */}
          <div className="space-y-4 text-left max-w-xl mx-auto pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Révision des Réponses:</h4>
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div key={q.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white">{idx + 1}. {q.question}</span>
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Votre réponse: <strong className={isCorrect ? 'text-emerald-300' : 'text-red-300'}>{q.options[userAns] || 'Non répondu'}</strong>
                  </p>
                  {q.explanation && (
                    <p className="text-slate-300 bg-slate-900 p-2 rounded text-[11px] border border-slate-700/50">
                      💡 <em>{q.explanation}</em>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Réessayer l'Examen
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              Retour aux Leçons
            </button>
          </div>
        </div>
      ) : (
        /* Pregunta Actual */
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Question {currentQuestionIdx + 1} sur {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-1.5 rounded-full transition-all ${
                    i === currentQuestionIdx
                      ? 'bg-amber-400'
                      : selectedAnswers[questions[i].id] !== undefined
                        ? 'bg-emerald-500'
                        : 'bg-slate-800'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <h3 className="text-base md:text-lg font-bold text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Opciones */}
          <div className="space-y-3">
            {currentQ.options.map((optText, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>{optText}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-amber-400 bg-amber-400 text-slate-950 font-bold' : 'border-slate-600'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navegación entre preguntas */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              Précédent
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1 cursor-pointer"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Terminer et Évaluer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
