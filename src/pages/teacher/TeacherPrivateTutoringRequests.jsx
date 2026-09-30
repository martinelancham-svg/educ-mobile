import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PrivateTutoringRequestModal } from '../../components/PrivateTutoringRequestModal';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Calendar,
  PlusCircle,
  UserCheck
} from 'lucide-react';

export const TeacherPrivateTutoringRequests = () => {
  const { tutoringRequests, acceptTutoringRequest, rejectTutoringRequest } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAccept = (reqId, studentName) => {
    acceptTutoringRequest(reqId);
    setToastMsg(`Cours particulier accepté pour ${studentName} ! L'étudiant recevra une confirmation.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleReject = (reqId, studentName) => {
    rejectTutoringRequest(reqId);
    setToastMsg(`Demande de ${studentName} refusée.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredRequests = tutoringRequests.filter(r => {
    if (filterStatus === 'pending') return r.status === 'Pending';
    if (filterStatus === 'accepted') return r.status === 'Accepted';
    if (filterStatus === 'rejected') return r.status === 'Rejected';
    return true;
  });

  const pendingCount = tutoringRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 mb-2 inline-block">
            Tutorat & Cours Particuliers 1-à-1
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Demandes de Cours Particuliers</h1>
          <p className="text-xs text-slate-300">
            Boîte de réception des demandes d'aide individuelle soumises par les étudiants.
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                {pendingCount} EN ATTENTE
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filtros */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-[11px]">
            {[['all','Toutes'],['pending','En attente'],['accepted','Acceptées'],['rejected','Refusées']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterStatus(val)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterStatus === val ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Tester le Formulaire
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {filteredRequests.length} demande(s) :
        </h2>

        {filteredRequests.length === 0 && (
          <div className="p-10 text-center bg-slate-900/90 rounded-2xl border border-slate-700 text-slate-400 text-xs">
            <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="font-bold text-slate-300">Aucune demande avec ce statut</p>
          </div>
        )}

        {filteredRequests.map(req => (
          <div key={req.id} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-700/80 space-y-4 shadow-xl hover:border-amber-500/30 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {req.status === 'Accepted' && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ ACCEPTÉE ET PROGRAMMÉE</span>
                  )}
                  {req.status === 'Pending' && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">⏳ EN ATTENTE DE RÉPONSE</span>
                  )}
                  {req.status === 'Rejected' && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">✗ REFUSÉE</span>
                  )}
                  <span className="text-xs text-slate-400">{req.format}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{req.studentName}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {req.studentPhone}
                </p>
              </div>

              {req.status === 'Pending' && (
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => handleAccept(req.id, req.studentName)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accepter le Cours
                  </button>
                  <button
                    onClick={() => handleReject(req.id, req.studentName)}
                    className="px-4 py-2 bg-slate-800 text-red-400 border border-slate-700 hover:bg-red-500/20 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Refuser
                  </button>
                </div>
              )}

              {req.status === 'Accepted' && (
                <span className="px-4 py-2 bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1 border border-slate-700">
                  <CheckCircle2 className="w-4 h-4" /> Confirmée pour {req.preferredDate}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">MATIÈRE / RENFORCEMENT</span>
                <strong className="text-amber-300">{req.subject}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">DATE ET HEURE</span>
                <strong className="text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> {req.preferredDate} à {req.preferredTime}
                </strong>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">MODALITÉ</span>
                <strong className="text-teal-400">{req.format}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">TARIF / PRIX</span>
                <strong className="text-emerald-400 font-extrabold">{req.price || '1.500 FCFA (~ 2,50 €)'}</strong>
              </div>
              {req.notes && (
                <div className="sm:col-span-4 pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">QUESTIONS DE L'ÉTUDIANT</span>
                  <p className="text-slate-300 leading-relaxed">"{req.notes}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <PrivateTutoringRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
};
