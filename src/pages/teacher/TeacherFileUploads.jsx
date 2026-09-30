import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DocumentReaderModal } from '../../components/DocumentReaderModal';
import {
  FileUp,
  FileText,
  Image,
  Presentation,
  CheckCircle2,
  Trash2,
  Upload,
  Download,
  School,
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  X,
  Filter,
  Eye
} from 'lucide-react';

const INITIAL_UPLOADS = [
  {
    id: 'pdf-101',
    name: 'Guide_Exercices_Mathematiques_Secondaire.pdf',
    type: 'PDF',
    size: '1.8 MB',
    targetLevel: 'Secondaire',
    subject: 'Mathématiques: Équations et Géométrie',
    author: 'Prof. Baltasar Nsue Ondo',
    date: 'Hier'
  },
  {
    id: 'pdf-102',
    name: 'Fiches_Lecture_Mathematiques_Primaire.pdf',
    type: 'PDF',
    size: '1.2 MB',
    targetLevel: 'Primaire (1ère à 6ème)',
    subject: 'Mathématiques de Base & Tables',
    author: 'Prof. Baltasar Nsue Ondo',
    date: 'Il y a 2 jours'
  },
  {
    id: 'pdf-103',
    name: 'Resume_Physique_Chimie_Baccalaureat.pdf',
    type: 'PDF',
    size: '2.5 MB',
    targetLevel: 'Baccalauréat',
    subject: 'Physique & Thermodynamique',
    author: 'Prof. Baltasar Nsue Ondo',
    date: 'Il y a 3 jours'
  },
  {
    id: 'pdf-104',
    name: 'Manuel_Installations_Solaires_FP.pdf',
    type: 'PDF',
    size: '3.4 MB',
    targetLevel: 'Formation Professionnelle (FP)',
    subject: 'Énergie Solaire et Électrotechnique',
    author: 'Prof. Baltasar Nsue Ondo',
    date: 'Il y a 4 jours'
  }
];

export const TeacherFileUploads = () => {
  const { addNotification, user } = useAuth();
  const [uploadsList, setUploadsList] = useState(() => {
    const saved = localStorage.getItem('teacher_pdf_uploads');
    return saved ? JSON.parse(saved) : INITIAL_UPLOADS;
  });

  useEffect(() => {
    localStorage.setItem('teacher_pdf_uploads', JSON.stringify(uploadsList));
  }, [uploadsList]);

  // ─── Estados del Formulario de Subida ──────────────────────────────────────
  const [documentTitle, setDocumentTitle] = useState('');
  const [targetLevel, setTargetLevel] = useState('Secundaria (ESO)');
  const [subject, setSubject] = useState('Mathématiques & Sciences');
  const [resourceType, setResourceType] = useState('PDF');
  const [selectedFile, setSelectedFile] = useState(null);

  const [activeFilterLevel, setActiveFilterLevel] = useState('all');
  const [toastMsg, setToastMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [readingDoc, setReadingDoc] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    const fileExt = file.name.split('.').pop().toUpperCase();
    let type = 'PDF';
    if (['JPG', 'PNG', 'WEBP', 'GIF'].includes(fileExt)) type = 'Imagen';
    else if (['PPT', 'PPTX'].includes(fileExt)) type = 'PPT';
    else if (['DOC', 'DOCX'].includes(fileExt)) type = 'Word';
    else if (['MP3', 'M4A', 'WAV', 'OGG', 'AAC'].includes(fileExt)) type = 'Audiolibro / Pod MP3';

    setSelectedFile({
      file,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type
    });

    if (!documentTitle) {
      const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setDocumentTitle(cleanName);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSaveUpload = (e) => {
    e.preventDefault();
    if (!documentTitle.trim()) return;

    const newUpload = {
      id: `pdf-${Date.now()}`,
      name: selectedFile ? selectedFile.name : (documentTitle.endsWith('.pdf') ? documentTitle : `${documentTitle}.pdf`),
      type: selectedFile ? selectedFile.type : resourceType,
      size: selectedFile ? selectedFile.size : '1.5 MB',
      targetLevel,
      subject,
      author: 'Prof. Baltasar Nsue Ondo',
      date: 'Ahora mismo'
    };

    setUploadsList(prev => [newUpload, ...prev]);

    if (addNotification) {
      addNotification({
        type: 'document',
        title: '📄 ¡Nuevo Documento PDF / Guía de Estudio!',
        text: `El profesor ${user?.name || 'Prof. Baltasar Nsue Ondo'} ha subido el recurso: "${documentTitle}".`,
        author: user?.name || 'Prof. Baltasar Nsue Ondo'
      });
    }

    // Publicar automáticamente también en la Biblioteca Digital Multimedia
    try {
      const storedLib = JSON.parse(localStorage.getItem('educ_library_resources') || '[]');
      const libItem = {
        id: `res-${Date.now()}`,
        title: documentTitle,
        type: resourceType.toLowerCase() === 'pdf' ? 'pdf' : resourceType.toLowerCase() === 'ppt' ? 'presentacion' : 'academico',
        typeName: `${resourceType} Docente`,
        level: targetLevel,
        subject,
        author: 'Prof. Baltasar Nsue Ondo',
        description: `Material PDF de estudio publicado por el profesor para ${targetLevel}.`,
        sizeMB: selectedFile ? selectedFile.size : '1.8 MB',
        pages: 20,
        downloads: 1,
        rating: 5.0,
        tags: ['#Profesor', `#${targetLevel.split(' ')[0]}`, '#PDFDocente'],
        pdfUrl: newUpload.name
      };
      localStorage.setItem('educ_library_resources', JSON.stringify([libItem, ...storedLib]));
    } catch (e) {
      console.error(e);
    }

    // Resetear formulario
    setDocumentTitle('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setToastMsg(`¡Documento PDF asignado a ${targetLevel} y publicado en la Biblioteca Digital!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleDeleteUpload = (id) => {
    setUploadsList(prev => prev.filter(item => item.id !== id));
  };

  // Filtrado de lista por nivel educativo
  const filteredUploads = uploadsList.filter(item => {
    if (activeFilterLevel === 'all') return true;
    if (activeFilterLevel === 'primaria') return item.targetLevel.includes('Primaria');
    if (activeFilterLevel === 'eso') return item.targetLevel.includes('Secundaria') || item.targetLevel.includes('ESO');
    if (activeFilterLevel === 'bachillerato') return item.targetLevel.includes('Bachillerato');
    if (activeFilterLevel === 'fp') return item.targetLevel.includes('FP') || item.targetLevel.includes('Formación');
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* ─── Encabezado ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30 mb-1 inline-block">
              Gestionnaire Enseignant de Documents PDF
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white">Téléversement de PDF par Niveau Éducatif</h1>
            <p className="text-xs text-slate-300">Attribuez des fichiers PDF et des guides pour l'étude hors-ligne.</p>
          </div>
        </div>

        <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center shrink-0">
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Fichiers Actifs</span>
          <strong className="text-lg font-extrabold text-amber-400">{uploadsList.length} PDFs</strong>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── Formulario de Subida con Opción de Nivel Educativo ─────────── */}
      <form onSubmit={handleSaveUpload} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            Publier un Nouveau Document / Guide PDF
          </h2>
          <span className="text-[11px] text-slate-400">Étape 1 sur 2 : Sélectionnez le niveau éducatif</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Opción de Selección de Nivel Educativo (Primaria, Secundaria, Bachillerato, FP) */}
          <div className="space-y-1 lg:col-span-1">
            <label className="text-xs font-bold text-amber-300 block flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Option Niveau Éducatif Destiné *
            </label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="w-full bg-slate-800 border-2 border-amber-500/60 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer shadow-inner"
            >
              <option value="Primaire (1ère à 6ème)">🏫 Primaire (1ère à 6ème)</option>
              <option value="Secondaire">🎓 Secondaire Obligatoire</option>
              <option value="Baccalauréat">🏅 Baccalauréat</option>
              <option value="Formation Professionnelle (FP)">💼 Formation Professionnelle (FP)</option>
            </select>
          </div>

          {/* Nombre / Título del Documento */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-bold text-slate-300 block">Titre / Nom du Document PDF *</label>
            <input
              type="text"
              required
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Ex : Guide d'Exercices Corrigés d'Aires et Périmètres"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Asignatura / Tema */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 block">Matière / Discipline de Soutien *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Mathématiques, Physique et Chimie, Sciences Naturelles, Agroécologie..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Tipo de Documento */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Format du Fichier</label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white cursor-pointer"
            >
              <option value="PDF">Document PDF (.pdf)</option>
              <option value="Word">Document Word (.docx / .doc)</option>
              <option value="PPT">Présentation (.pptx)</option>
              <option value="Image">Image / Infographie (.png / .jpg)</option>
              <option value="Livre Audio / Pod MP3">Livre Audio & Pod MP3 (.mp3 / .m4a)</option>
            </select>
          </div>

        </div>

        {/* Archivo Real / Drag & Drop */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">Sélectionner le Fichier (PDF, PPT, Word, MP3) depuis votre appareil</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.pptx,.jpg,.png,.mp3,.m4a,.wav"
            className="hidden"
            onChange={handleInputChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-slate-700 bg-slate-800/40 hover:border-amber-500/60 hover:bg-amber-500/5'
            }`}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-300">{selectedFile.name}</p>
                  <span className="text-[10px] text-slate-400">{selectedFile.type} • {selectedFile.size}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 ml-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-2 space-y-2 flex flex-col items-center justify-center">
                <FileUp className="w-8 h-8 text-amber-400 animate-bounce" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4 text-slate-950" />
                  <span>📁 Parcourir & Téléverser Contenu (PDF, Word, PPT)...</span>
                </button>
                <p className="text-[11px] text-slate-400">Ou glissez-déposez votre fichier directement ici (Jusqu'à 50 Mo)</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <FileUp className="w-4 h-4 text-slate-950" />
            Publier le Fichier PDF pour {targetLevel.split(' ')[0]}
          </button>
        </div>
      </form>

      {/* ─── Lista de Archivos Subidos con Filtros por Nivel Educativo ────── */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        
        {/* Filtros por Nivel Educativo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Fichiers PDF Publiés ({filteredUploads.length})
          </h3>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-[11px] flex-wrap gap-1">
            {[
              ['all', 'Tous les Niveaux'],
              ['primaria', '🏫 Primaire'],
              ['eso', '🎓 Secondaire'],
              ['bachillerato', '🏅 Baccalauréat'],
              ['fp', '💼 Formation Pro']
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setActiveFilterLevel(val)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilterLevel === val
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredUploads.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/80 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-60" />
            <p className="font-bold text-slate-300">Aucun fichier PDF attribué à ce niveau éducatif</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUploads.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-amber-500/40 transition-all shadow-xl"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-500/30">
                    {item.type === 'PDF' ? (
                      <FileText className="w-5 h-5" />
                    ) : item.type === 'Imagen' ? (
                      <Image className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Presentation className="w-5 h-5 text-blue-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${
                        item.targetLevel.includes('Primaria')
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : item.targetLevel.includes('Bachillerato')
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : item.targetLevel.includes('FP')
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {item.targetLevel}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-300">{item.subject} • <span className="text-slate-400">{item.size}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setReadingDoc(item)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> Ouvrir le Lecteur PDF
                  </button>

                  <button
                    onClick={() => alert(`Démarrage du téléchargement hors-ligne de : ${item.name}`)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 border border-slate-700 hover:border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </button>

                  <button
                    onClick={() => handleDeleteUpload(item.id)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/20 border border-slate-700 transition-all cursor-pointer"
                    title="Supprimer le fichier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DocumentReaderModal
        isOpen={Boolean(readingDoc)}
        onClose={() => setReadingDoc(null)}
        document={readingDoc}
      />
    </div>
  );
};
