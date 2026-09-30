import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Search, Eye, BookOpen } from 'lucide-react';
import { DocumentReaderModal } from '../../components/DocumentReaderModal';

export const DownloadableDocs = () => {
  const [downloadedDocIds, setDownloadedDocIds] = useState([]);
  const [search, setSearch] = useState('');
  const [readingDoc, setReadingDoc] = useState(null);

  const documentsList = [
    { id: 'doc-1', title: 'Guide_Equations_Mathematiques_Secondaire.pdf', category: 'Mathématiques Secondaire', targetLevel: 'Secondaire', size: '1.8 MB', desc: 'Guide de résolution étape par étape des équations du second degré et systèmes d\'équations.' },
    { id: 'doc-2', title: 'Fiches_Lecture_Mathematiques_Primaire.pdf', category: 'Primaire (1ère-6ème)', targetLevel: 'Primaire (1ère à 6ème)', size: '1.2 MB', desc: 'Fiches pédagogiques illustrées pour soutien en arithmétique et lecture au primaire.' },
    { id: 'doc-3', title: 'Resume_Physique_Chimie_Baccalaureat.pdf', category: 'Baccalauréat', targetLevel: 'Baccalauréat', size: '2.5 MB', desc: 'Formulaire et cours complet de cinématique, dynamique et thermodynamique.' },
    { id: 'doc-4', title: 'Manuel_Installations_Solaires_FP.pdf', category: 'Formation Professionnelle (FP)', targetLevel: 'FP Professionnelle', size: '3.4 MB', desc: 'Calculs de charges photovoltaïques et câblage de batteries pour zones isolées.' }
  ];

  const handleDownloadDoc = (id) => {
    if (!downloadedDocIds.includes(id)) {
      setDownloadedDocIds(prev => [...prev, id]);
    }
  };

  const filtered = documentsList.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Bibliothèque de Documents & Lecteur PDF/DOCX</h1>
            <p className="text-xs text-slate-400">Matériels techniques téléchargeables avec lecteur intégré 100% hors-ligne</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou niveau..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(doc => {
          const isSaved = downloadedDocIds.includes(doc.id);

          return (
            <div key={doc.id} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all shadow-xl">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                    {doc.targetLevel}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{doc.size}</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{doc.title}</h3>
                <p className="text-xs text-slate-400">{doc.desc}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setReadingDoc(doc)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  Ouvrir Lecteur PDF
                </button>

                {isSaved ? (
                  <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Enregistré
                  </span>
                ) : (
                  <button
                    onClick={() => handleDownloadDoc(doc.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer hover:shadow-lg shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DocumentReaderModal
        isOpen={Boolean(readingDoc)}
        onClose={() => setReadingDoc(null)}
        document={readingDoc}
      />
    </div>
  );
};
