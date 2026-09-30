import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  DollarSign,
  Tag,
  CheckCircle2,
  Edit,
  Save,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Percent
} from 'lucide-react';

export const AdminTutoringPricing = () => {
  const { tutoringRequests } = useAuth();

  const [pricingTable, setPricingTable] = useState([
    { id: '1', format: 'Audio Comprimé Faible Bande Passante', priceFCFA: '1.500', priceEUR: '2,50', desc: 'Appel vocal à faible consommation pour zones rurales 2G/3G.' },
    { id: '2', format: 'Consultation Écrite Résolue Étape par Étape', priceFCFA: '1.000', priceEUR: '1,50', desc: 'Réponse différée avec développement mathématique complet.' },
    { id: '3', format: 'Cours Présentiel en Centre Rural', priceFCFA: '3.000', priceEUR: '4,50', desc: 'Session présentielle individuelle dans les écoles ou centre local.' },
    { id: '4', format: 'Session Complète avec Exercices Guidés', priceFCFA: '2.500', priceEUR: '3,80', desc: 'Pratique guidée de 60 minutes avec matériel imprimé/PDF.' }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editFCFA, setEditFCFA] = useState('');
  const [editEUR, setEditEUR] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditFCFA(item.priceFCFA);
    setEditEUR(item.priceEUR);
  };

  const handleSavePrice = (id) => {
    setPricingTable(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          priceFCFA: editFCFA,
          priceEUR: editEUR
        };
      }
      return item;
    }));

    setEditingId(null);
    setToastMsg('Tarif de cours particulier mis à jour avec succès !');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-teal-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-300 bg-teal-500/20 px-3 py-0.5 rounded-full border border-teal-500/30 mb-1 inline-block">
              Control Tarifaire Administratif
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white">Contrôle des Prix des Cours Particuliers</h1>
            <p className="text-xs text-slate-300">Configurez les tarifs officiels par modalité de tutorat en Francs CFA (FCFA / EUR).</p>
          </div>
        </div>

        <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center shrink-0">
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Monnaie Officielle</span>
          <strong className="text-base font-extrabold text-teal-300">FCFA (XAF) / EUR (€)</strong>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid de Tarifas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pricingTable.map((item) => {
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3 shadow-xl hover:border-teal-500/40 transition-all"
            >
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-teal-400" />
                  {item.format}
                </h3>
                
                {!isEditing && (
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Éditer
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400">{item.desc}</p>

              {isEditing ? (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block font-bold">Prix FCFA</label>
                      <input
                        type="text"
                        value={editFCFA}
                        onChange={(e) => setEditFCFA(e.target.value)}
                        className="w-full bg-slate-800 border border-teal-500/50 rounded-xl px-3 py-1.5 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-bold">Prix EUR (€)</label>
                      <input
                        type="text"
                        value={editEUR}
                        onChange={(e) => setEditEUR(e.target.value)}
                        className="w-full bg-slate-800 border border-teal-500/50 rounded-xl px-3 py-1.5 text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleSavePrice(item.id)}
                      className="px-4 py-1 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Enregistrer Tarif
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold">Tarif Officiel Configuré :</span>
                  <div className="text-right">
                    <strong className="text-base font-extrabold text-emerald-400 block">{item.priceFCFA} FCFA</strong>
                    <span className="text-[11px] text-slate-400 font-mono">~ {item.priceEUR} €</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen de Solicitudes y Recaudación */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4 shadow-2xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-teal-400" />
          Solicitudes Activas Registradas en la Plataforma
        </h2>

        <div className="space-y-3">
          {(tutoringRequests || []).map(req => (
            <div key={req.id} className="bg-slate-850 p-4 rounded-2xl border border-slate-700 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-white text-sm block">{req.studentName}</span>
                <span className="text-slate-400">{req.subject} • Enseignant : <strong className="text-amber-300">{req.teacherName}</strong></span>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30 block">
                  {req.price || '1.500 FCFA (~ 2,50 €)'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{req.format}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
