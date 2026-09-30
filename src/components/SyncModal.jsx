import React from 'react';
import { useOffline } from '../context/OfflineContext';
import { RefreshCw, CheckCircle2, Clock, X, CloudUpload, AlertCircle } from 'lucide-react';

export const SyncModal = () => {
  const {
    syncQueue,
    showSyncModal,
    setShowSyncModal,
    triggerSync,
    isSyncing,
    isEffectiveOffline,
    lastSyncTime
  } = useOffline();

  if (!showSyncModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={() => setShowSyncModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <CloudUpload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">File de Synchronisation</h3>
            <p className="text-xs text-slate-400">Dernière synchronisation: {lastSyncTime}</p>
          </div>
        </div>

        {isEffectiveOffline && syncQueue.length > 0 && (
          <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Vous êtes actuellement <strong>hors-ligne</strong>. Vos actions sont enregistrées localement en toute sécurité et seront transmises automatiquement lors du rétablissement de la connexion.
            </span>
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-1">
          {syncQueue.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-300">Tout est synchronisé!</p>
              <p className="text-xs text-slate-500 mt-1">Aucune modification en attente d'envoi.</p>
            </div>
          ) : (
            syncQueue.map((item) => (
              <div key={item.id} className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">{item.type}</span>
                    <span className="text-[11px] text-slate-400">Heure: {item.timestamp}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px]">En attente</span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400">Total: <strong>{syncQueue.length} éléments</strong></span>
          <button
            disabled={isEffectiveOffline || syncQueue.length === 0 || isSyncing}
            onClick={triggerSync}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              isEffectiveOffline || syncQueue.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:shadow-lg shadow-emerald-500/20 cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronisation...' : 'Synchroniser Maintenant'}
          </button>
        </div>
      </div>
    </div>
  );
};
