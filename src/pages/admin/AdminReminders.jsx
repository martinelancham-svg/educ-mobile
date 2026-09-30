import React, { useState } from 'react';
import { Clock, PlusCircle, CheckCircle2, Trash2, AlertCircle, Calendar, Sparkles } from 'lucide-react';

export const AdminReminders = () => {
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Réviser les licences d\'enseignant en attente de Bata', targetDate: '2026-08-22', priority: 'Haute', completed: false },
    { id: '2', title: 'Générer le paquet USB de mise à jour pour le Collège Rey Malabo', targetDate: '2026-08-23', priority: 'Haute', completed: false },
    { id: '3', title: 'Auditer les tarifs des cours particuliers en FCFA', targetDate: '2026-08-25', priority: 'Moyenne', completed: true }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-08-24');
  const [newPriority, setNewPriority] = useState('Haute');
  const [toastMsg, setToastMsg] = useState('');

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item = {
      id: Date.now().toString(),
      title: newTitle,
      targetDate: newDate,
      priority: newPriority,
      completed: false
    };

    setReminders(prev => [item, ...prev]);
    setNewTitle('');
    setToastMsg('Rappel ajouté à votre liste de tâches admin !');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleComplete = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-500/40 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Gestionnaire de Rappels & Agenda Admin</h1>
            <p className="text-xs text-slate-300">Organisez les tâches prioritaires pour la révision des licences, audits et paquets USB.</p>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Formulario Nuevo Recordatorio */}
      <form onSubmit={handleAddReminder} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Ajouter un Nouveau Rappel / Tâche Admin :</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Description du Rappel *</label>
            <input
              type="text"
              required
              placeholder="Ex : Vérifier le registre civil de la demande de Malabo"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Date Limite</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/20"
          >
            <PlusCircle className="w-4 h-4" /> Ajouter le Rappel
          </button>
        </div>
      </form>

      {/* Lista de Recordatorios */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rappels Programmés :</h3>
        {reminders.map(r => (
          <div
            key={r.id}
            className={`p-4 rounded-2xl border flex justify-between items-center text-xs transition-all shadow-md ${
              r.completed
                ? 'bg-slate-900/60 border-slate-800 opacity-60'
                : 'bg-slate-850 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={r.completed}
                onChange={() => handleToggleComplete(r.id)}
                className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700 cursor-pointer"
              />
              <span className={`font-bold ${r.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                {r.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> {r.targetDate}
              </span>

              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
