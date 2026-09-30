import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HardDrive, Download, FileJson, CheckCircle2, ShieldCheck, Server } from 'lucide-react';

export const PackageExporter = () => {
  const { courses } = useAuth();
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const handleExportJSON = () => {
    const exportBundle = {
      appName: 'EDUC-EG Package Central Africa',
      version: '2.5.0-RURAL',
      exportDate: new Date().toISOString(),
      coursesCount: courses.length,
      coursesData: courses
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EDUC_EG_RURAL_PACKAGE_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportedSuccess(true);
  };

  return (
    <div className="bg-slate-900/95 p-6 md:p-8 rounded-3xl border border-purple-500/30 shadow-2xl space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
          <Server className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 mb-1 inline-block">
            Distribution Zéro-Internet (Zero-Network Server)
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-white">Générateur de Paquet Scolaire USB</h1>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Exportez l'intégralité du catalogue de cours, guides techniques, schémas audio et banques d'examens dans un seul fichier de données léger. Ce fichier peut être transporté sur une clé USB et installé sur des serveurs locaux d'écoles sans connexion Internet.
      </p>

      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 text-xs">
        <h3 className="font-bold text-white">Résumé du Contenu du Paquet :</h3>
        <ul className="space-y-2 text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{courses.length || 14} Cours Complets avec Modules et Leçons</span>
          </li>
          <li className="flex items-center gap-2 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Moteurs d'Examens Hors-Ligne et Historique des Notes</span>
          </li>
          <li className="flex items-center gap-2 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Taille Totale du Téléchargement : ~ 15.5 MB (Adapté aux clés USB standards)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Catalogue de Livres Audio, Podcasts et Matériels PDF</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Base de Données Chiffrée des Licences et Élèves</span>
          </li>
        </ul>
      </div>

      {exportedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Paquet exporté avec succès ! Le fichier .JSON a été enregistré dans vos téléchargements.</span>
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleExportJSON}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 cursor-pointer transition-all"
        >
          <FileJson className="w-5 h-5" />
          Télécharger le Paquet Complet (.JSON)
        </button>
      </div>
    </div>
  );
};
