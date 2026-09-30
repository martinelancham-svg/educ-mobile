import React from 'react';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';
import { Download, HardDrive, Trash2, PlayCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const MyDownloads = ({ onOpenCourse }) => {
  const { offlineDownloads, deleteOfflineCourse } = useOffline();
  const { courses } = useAuth();

  // Calcular peso total descargado
  const totalMB = offlineDownloads.reduce((acc, curr) => {
    const val = parseFloat(curr.sizeMB) || 4.0;
    return acc + val;
  }, 0).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Memoria Dispositivo */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <HardDrive className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bibliothèque dans le Stockage Local</h1>
            <p className="text-xs text-slate-400">Cours prêts à étudier dans IndexedDB sans consommer de données mobiles</p>
          </div>
        </div>

        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center px-5 self-stretch sm:self-auto">
          <span className="text-xs text-slate-400 block">Espace Occupé</span>
          <strong className="text-xl font-extrabold text-emerald-400">{totalMB} MB</strong>
        </div>
      </div>

      {/* Lista de Cursos Descargados */}
      {offlineDownloads.length === 0 ? (
        <div className="bg-slate-800/40 p-12 rounded-3xl border border-slate-700 text-center text-slate-400 space-y-3">
          <Download className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Vous n'avez aucun cours téléchargé</h3>
          <p className="text-xs max-w-sm mx-auto">
            Accédez au catalogue de cours et appuyez sur le bouton de téléchargement pour enregistrer les leçons et évaluations sur votre téléphone ou ordinateur.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offlineDownloads.map(item => {
            const courseObj = courses.find(c => c.id === item.courseId);

            return (
              <div key={item.courseId} className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 flex justify-between items-center gap-4 hover:border-emerald-500/50 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
                      Hors-Ligne Disponible
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{item.sizeMB}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-400">Téléchargé le: {new Date(item.downloadedAt).toLocaleDateString('fr-FR')}</p>
                </div>

                <div className="flex items-center gap-2">
                  {courseObj && (
                    <button
                      onClick={() => onOpenCourse(courseObj)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Étudier
                    </button>
                  )}

                  <button
                    onClick={() => deleteOfflineCourse(item.courseId)}
                    title="Supprimer du stockage local"
                    className="p-2 rounded-xl bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
