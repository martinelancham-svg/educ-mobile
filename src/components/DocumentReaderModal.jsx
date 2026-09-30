import React, { useState } from 'react';
import {
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Printer,
  Sun,
  Moon,
  BookOpen,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const DocumentReaderModal = ({ isOpen, onClose, document: docData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [readerTheme, setReaderTheme] = useState('dark');

  if (!isOpen || !docData) return null;

  const totalPages = docData.totalPages || 5;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 180) setZoomLevel(prev => prev + 15);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 60) setZoomLevel(prev => prev - 15);
  };

  const getPageContent = (page) => {
    if (docData.contentPages && docData.contentPages[page - 1]) {
      return docData.contentPages[page - 1];
    }

    return `
# ${docData.title || docData.name || 'Guide Pédagogique PDF'} — Page ${page}
**Matière / Niveau:** ${docData.targetLevel || docData.subject || 'Enseignement Secondaire / Baccalauréat'}
**Auteur / Émetteur:** ${docData.author || 'Prof. Baltasar Nsue Ondo'}

---

## 1. Objectifs Pédagogiques et Cadre Théorique (Page ${page})

Dans cette unité didactique, nous aborderons la résolution systématique de problèmes mathématiques et physiques.

### 1.1 Principes Fondamentaux:
1. **Compréhension du problème:** Identification claire des données d'entrée et variables inconnues.
2. **Modélisation algébrique:** Application de formules standards et équations du 1er et 2nd degré.
3. **Vérification expérimentale:** Contrôle des unités et ordres de grandeur.

\`\`\`text
Formule de résolution: x = [ -b ± √(b² - 4·a·c) ] / (2·a)
\`\`\`

---

## 2. Exercices Guidés et Cas Pratiques

Développement étape par étape recommandé pendant les heures de lecture hors-ligne:

* **Cas A:** Calcul de vitesse moyenne sur des trajets locaux.
* **Cas B:** Conservation des sols et préparation des parcelles agricoles.
* **Cas C:** Bilan d'énergie sur panneaux photovoltaïques isolés.

> *"La lecture méthodique et la pratique d'exercices résolus garantissent la maîtrise des compétences académiques."*
    `;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        <div className="bg-slate-850 p-4 border-b border-slate-800 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-0.5 inline-block">
                Lecteur de Documents PDF & DOCX • EDUC-EG
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">{docData.title || docData.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded-lg transition-all ${readerTheme === 'dark' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Mode Sombre"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded-lg transition-all ${readerTheme === 'sepia' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Mode Sépia"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-lg transition-all ${readerTheme === 'light' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Mode Clair"
              >
                <Sun className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900 p-2.5 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
          
          <div className="flex items-center gap-2 bg-slate-850 px-3 py-1 rounded-xl border border-slate-750">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="font-bold text-white text-xs">
              Page <span className="text-amber-400">{currentPage}</span> sur {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-850 px-3 py-1 rounded-xl border border-slate-750">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="Dézoomer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="font-mono font-bold text-slate-300 w-12 text-center text-xs">
              {zoomLevel}%
            </span>

            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="Zoomer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoomLevel(100)}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 hover:text-white border border-slate-700 ml-1"
            >
              100%
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Téléchargement du document: ${docData.name || docData.title}`)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Télécharger PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-950/60 no-scrollbar">
          <div
            style={{ zoom: `${zoomLevel}%` }}
            className={`w-full max-w-3xl min-h-[650px] p-8 md:p-12 rounded-2xl shadow-2xl border transition-all space-y-6 ${
              readerTheme === 'light'
                ? 'bg-slate-50 text-slate-900 border-slate-300'
                : readerTheme === 'sepia'
                  ? 'bg-[#fbf0d9] text-[#4a3b2c] border-[#e6d5b8]'
                  : 'bg-slate-900 text-slate-100 border-slate-750'
            }`}
          >
            <div className="border-b pb-4 border-current/20 flex justify-between items-center text-xs opacity-75">
              <span>DOCUMENT OFFICIEL EDUC-EG</span>
              <span>PAGE {currentPage} SUR {totalPages}</span>
            </div>

            <div className="space-y-4 text-sm leading-relaxed whitespace-pre-line font-sans">
              {getPageContent(currentPage)}
            </div>

            <div className="pt-8 border-t border-current/20 flex justify-between items-center text-[11px] opacity-60">
              <span>© EDUC-EG</span>
              <span>Mode Lecture Actif</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-850 px-6 py-3 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 shrink-0 gap-2">
          <span className="text-center sm:text-left text-[11px] text-slate-400">Utilisez les flèches pour tourner la page • Lecteur compatible hors-ligne</span>
          
          <div className="flex items-center justify-center gap-2 bg-emerald-500/20 px-3.5 py-1 rounded-full border border-emerald-500/30 shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-300 font-extrabold text-xs tracking-wide">Lecteur Prêt</span>
          </div>
        </div>

      </div>
    </div>
  );
};
