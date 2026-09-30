import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CertificateModal } from '../../components/CertificateModal';
import { Award, CheckCircle2, XCircle, Printer } from 'lucide-react';

export const GradesAndResults = () => {
  const { user, courses } = useAuth();
  const [selectedCertCourseTitle, setSelectedCertCourseTitle] = useState(null);

  const quizResultsMap = Object.entries(user.quizResults || {}).map(([quizId, result]) => {
    // Buscar curso correspondiente
    const courseObj = courses.find(c =>
      c.modules && c.modules.some(m => m.quiz && m.quiz.id === quizId)
    );
    return {
      quizId,
      score: result.score,
      passed: result.passed,
      date: result.date || '2026-08-18',
      courseTitle: courseObj ? courseObj.title : 'Agroécologie & Cultures Résilientes'
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Notes & Historique des Examens</h1>
            <p className="text-xs text-slate-400">Résultats d'auto-évaluation évalués et enregistrés localement</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-700">
            <tr>
              <th className="p-4">Cours / Examen</th>
              <th className="p-4">Date</th>
              <th className="p-4">Note</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Certificat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {quizResultsMap.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Vous n'avez pas encore passé d'examen. Accédez aux leçons de vos cours pour effectuer vos évaluations.
                </td>
              </tr>
            ) : (
              quizResultsMap.map((res, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{res.courseTitle}</td>
                  <td className="p-4 text-slate-400">{res.date}</td>
                  <td className="p-4">
                    <span className="font-extrabold text-sm text-amber-300">{res.score}%</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                      res.passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {res.passed ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                      {res.passed ? 'Réussi' : 'Échoué'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {res.passed && (
                      <button
                        onClick={() => setSelectedCertCourseTitle(res.courseTitle)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Voir le Certificat
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedCertCourseTitle && (
        <CertificateModal
          courseTitle={selectedCertCourseTitle}
          studentName={user.name}
          onClose={() => setSelectedCertCourseTitle(null)}
        />
      )}
    </div>
  );
};
