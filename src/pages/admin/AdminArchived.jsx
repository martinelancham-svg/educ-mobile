import React, { useState } from 'react';
import { Archive, PauseCircle, CheckCircle2, Trash2, Search, GraduationCap, Award, RefreshCw } from 'lucide-react';

export const AdminArchived = () => {
  const [archivedList, setArchivedList] = useState([
    { id: 'arc-1', name: 'Demande d\'Étudiant: Pascal Eto\'o Nchama', type: 'Étudiant', date: '2026-08-15', status: 'Archived', reason: 'Dossier complet traité à Malabo' },
    { id: 'arc-2', name: 'Licence d\'Enseignant: Prof. Jean-Paul Mbarga', type: 'Professeur', date: '2026-08-10', status: 'Archived', reason: 'Licence vérifiée et inscrite' },
    { id: 'arc-3', name: 'Demande de Tutorat: Esperanza Obono Nsue', type: 'Tutorat', date: '2026-08-18', status: 'OnHold', reason: 'En attente de confirmation d\'horaire avec l’enseignant' }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [toastMsg, setToastMsg] = useState('');

  const handleRestore = (item) => {
    setArchivedList(prev => prev.filter(i => i.id !== item.id));
    setToastMsg(`Demande "${item.name}" restaurée dans la boîte active !`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleDeletePermanent = (id) => {
    setArchivedList(prev => prev.filter(i => i.id !== id));
  };

  const filtered = archivedList.filter(i => {
    if (filterType === 'archived') return i.status === 'Archived';
    if (filterType === 'onhold') return i.status === 'OnHold';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-500/40 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Corbeille des Archives & Demandes en Attente</h1>
            <p className="text-xs text-slate-300">Dossiers gelés ou suspendus pour révision ultérieure.</p>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex justify-between items-center bg-slate-900/90 p-3 rounded-2xl border border-slate-700/80">
        <span className="text-xs text-slate-400 font-bold">Filtrer par État :</span>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs gap-1">
          {[['all', 'Tous'], ['archived', '📁 Archivés'], ['onhold', '⏸️ En Attente']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterType(val)}
              className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                filterType === val ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de archivados */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            <Archive className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-60" />
            <p className="font-bold text-slate-300">Aucun enregistrement archivé ou en attente</p>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="bg-slate-850 p-5 rounded-2xl border border-slate-700 flex justify-between items-center text-xs shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.status === 'Archived' ? (
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-700">
                      📁 ARCHIVÉ
                    </span>
                  ) : (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/30">
                      ⏸️ EN ATTENTE
                    </span>
                  )}
                  <span className="text-slate-400 text-[10px]">{item.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <p className="text-slate-400 italic">Motif : "{item.reason}"</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(item)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="Restaurer la demande vers la boîte active"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Restaurer
                </button>

                <button
                  onClick={() => handleDeletePermanent(item.id)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 cursor-pointer"
                  title="Supprimer définitivement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
