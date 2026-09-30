import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Save,
  GraduationCap,
  PlusCircle,
  Trash2,
  Paperclip,
  FileText,
  BookOpen,
  Upload,
  FileUp,
  FolderOpen,
  CheckCircle2
} from 'lucide-react';

export const CourseBuilder = ({ onCancel, onSaved }) => {
  const { addCourse } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('eso');
  const [targetLevel, setTargetLevel] = useState('1° - 4° ESO (Secundaria)');
  const [description, setDescription] = useState('');
  const [sizeMB, setSizeMB] = useState('4.5 MB');
  const [duration, setDuration] = useState('4 heures');
  const [importSuccessToast, setImportSuccessToast] = useState('');

  // ─── Estado de Modules, Leçons & Examens ─────────────────────────────────
  const [modules, setModules] = useState([
    {
      id: `mod-${Date.now()}-1`,
      title: 'Module 1 : Équations du 2nd Degré & Isolement',
      lessons: [
        {
          id: `less-${Date.now()}-1`,
          title: 'Leçon 1.1 : Formule Générale du Discriminant',
          duration: '20 min',
          content: 'Explication initiale de la leçon et consignes d\'étude pour l\'accès hors-ligne...',
          attachment: { name: 'Guide_Equations_2nd_Degre.pdf', size: '1.4 MB', type: 'PDF' }
        }
      ],
      exams: [
        { id: `ex-1`, title: 'Quiz 1 : Évaluation Courte Autocorrigée', type: 'QUIZ', questionsCount: 5 },
        { id: `ex-2`, title: 'Examen Officiel Module 1.pdf', type: 'FILE', size: '1.2 MB' }
      ]
    }
  ]);

  // Modal Intégrer Examen / Quiz / PDF
  const [showExamModal, setShowExamModal] = useState(false);
  const [activeModIdxForExam, setActiveModIdxForExam] = useState(null);
  const [examType, setExamType] = useState('FILE'); // 'FILE' | 'QUIZ'
  const [examTitle, setExamTitle] = useState('');
  const [uploadedExamFile, setUploadedExamFile] = useState(null);

  // Ajouter un Module
  const handleAddModule = () => {
    setModules(prev => [
      ...prev,
      {
        id: `mod-${Date.now()}`,
        title: `Module ${prev.length + 1} : Nouveau Module Thématique`,
        lessons: [
          {
            id: `less-${Date.now()}`,
            title: 'Leçon 1.1 : Cours Théorique',
            duration: '25 min',
            content: 'Développement théorique et exemples pratiques...',
            attachment: null
          }
        ],
        exams: []
      }
    ]);
  };

  // Parcourir & Téléverser Fichier (PDF, DOCX, ZIP, MP4) pour importer ou créer un nouveau Module automatiquement
  const handleBrowseAndImportModule = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const fileExt = file.name.split('.').pop().toUpperCase();
    const fileSizeMB = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const newModuleObj = {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1} : ${fileNameWithoutExt}`,
      lessons: [
        {
          id: `less-${Date.now()}`,
          title: `Leçon 1.1 : Document ${fileNameWithoutExt}`,
          duration: '25 min',
          content: `Support d'étude téléversé à partir du fichier ${file.name} pour la lecture hors-ligne.`,
          attachment: {
            name: file.name,
            size: fileSizeMB,
            type: fileExt,
            uploadedAt: new Date().toLocaleDateString()
          }
        }
      ],
      exams: [
        {
          id: `ex-${Date.now()}`,
          title: file.name,
          type: 'FILE',
          size: fileSizeMB
        }
      ]
    };

    setModules(prev => [...prev, newModuleObj]);
    setImportSuccessToast(`📎 Fichier "${file.name}" (${fileSizeMB}) importé et converti en Module ${modules.length + 1} !`);
    setTimeout(() => setImportSuccessToast(''), 4500);
  };

  // Supprimer un Module
  const handleRemoveModule = (modIdx) => {
    setModules(prev => prev.filter((_, idx) => idx !== modIdx));
  };

  // Ajouter une Leçon
  const handleAddLesson = (modIdx) => {
    setModules(prev => prev.map((m, idx) => {
      if (idx === modIdx) {
        return {
          ...m,
          lessons: [
            ...m.lessons,
            {
              id: `less-${Date.now()}`,
              title: `Leçon 1.${m.lessons.length + 1} : Nouveau Thème`,
              duration: '20 min',
              content: 'Contenu détaillé de la leçon...',
              attachment: null
            }
          ]
        };
      }
      return m;
    }));
  };

  // Supprimer une Leçon
  const handleRemoveLesson = (modIdx, lessIdx) => {
    setModules(prev => prev.map((m, idx) => {
      if (idx === modIdx) {
        return {
          ...m,
          lessons: m.lessons.filter((_, lIdx) => lIdx !== lessIdx)
        };
      }
      return m;
    }));
  };

  // Téléverser Fichier PDF / DOCX pour une Leçon
  const handleFileUpload = (e, modIdx, lessIdx) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileMeta = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.name.split('.').pop().toUpperCase(),
      uploadedAt: new Date().toLocaleDateString()
    };

    setModules(prev => prev.map((m, idx) => {
      if (idx === modIdx) {
        const updatedLessons = m.lessons.map((l, lIdx) => {
          if (lIdx === lessIdx) {
            return { ...l, attachment: fileMeta };
          }
          return l;
        });
        return { ...m, lessons: updatedLessons };
      }
      return m;
    }));
  };

  // Supprimer Fichier Joint
  const handleRemoveFile = (modIdx, lessIdx) => {
    setModules(prev => prev.map((m, idx) => {
      if (idx === modIdx) {
        const updatedLessons = m.lessons.map((l, lIdx) => {
          if (lIdx === lessIdx) {
            return { ...l, attachment: null };
          }
          return l;
        });
        return { ...m, lessons: updatedLessons };
      }
      return m;
    }));
  };

  // Ouvrir Modal Intégration Examen / PDF
  const handleOpenExamModal = (modIdx) => {
    setActiveModIdxForExam(modIdx);
    setExamType('FILE');
    setExamTitle('');
    setUploadedExamFile(null);
    setShowExamModal(true);
  };

  // Valider Intégration Examen / PDF dans le Module
  const handleAddExamSubmit = (e) => {
    e.preventDefault();
    if (activeModIdxForExam === null) return;

    const titleToUse = uploadedExamFile ? uploadedExamFile.name : (examTitle.trim() || 'Examen Officiel du Module.pdf');
    const newExamObj = {
      id: `ex-${Date.now()}`,
      title: titleToUse,
      type: examType,
      questionsCount: examType === 'QUIZ' ? 5 : undefined,
      size: uploadedExamFile ? uploadedExamFile.size : '1.2 MB'
    };

    setModules(prev => prev.map((m, idx) => {
      if (idx === activeModIdxForExam) {
        return { ...m, exams: [...(m.exams || []), newExamObj] };
      }
      return m;
    }));

    setShowExamModal(false);
    setExamTitle('');
    setUploadedExamFile(null);
  };

  // Supprimer un Examen d'un Module
  const handleRemoveExam = (modIdx, examId) => {
    setModules(prev => prev.map((m, idx) => {
      if (idx === modIdx) {
        return { ...m, exams: (m.exams || []).filter(e => e.id !== examId) };
      }
      return m;
    }));
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created = addCourse({
      title,
      category,
      author: 'Prof. Jean-Paul Mbarga',
      region: 'África Central',
      description,
      sizeMB,
      level: targetLevel,
      duration,
      modules
    });

    onSaved(created);
  };

  return (
    <div className="bg-slate-900/95 p-6 md:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 animate-fadeIn max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 mb-2 inline-block">
            Studio de Création de l'Enseignant
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-white">Créer & Éditer Cours : Modules, Leçons & Fichiers PDF</h1>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
        >
          Annuler
        </button>
      </div>

      <form onSubmit={handleSaveCourse} className="space-y-6">
        
        {/* Métadonnées du Cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-300 block">Titre du Cours *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mathématiques et Algèbre pour le Secondaire"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-300 block flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Niveau Éducatif Destiné *
            </label>
            <select
              value={targetLevel}
              onChange={(e) => {
                setTargetLevel(e.target.value);
                if (e.target.value.includes('Primaria')) setCategory('primaria');
                else if (e.target.value.includes('ESO')) setCategory('eso');
                else if (e.target.value.includes('Bachillerato')) setCategory('bachillerato');
                else if (e.target.value.includes('FP')) setCategory('fp');
              }}
              className="w-full bg-slate-800 border border-amber-500/50 rounded-xl px-3 py-2.5 text-xs text-white font-bold cursor-pointer"
            >
              <option value="1° a 6° Primaria">🏫 Primaire (1ère à 6ème)</option>
              <option value="1° - 4° ESO (Secundaria)">🎓 Secondaire Obligatoire</option>
              <option value="1° y 2° Bachillerato">🏅 Baccalauréat</option>
              <option value="FP Grado Medio">💼 Formation Professionnelle (FP)</option>
              <option value="FP Grado Superior">💼 FP Supérieure</option>
              <option value="Educación Adultos / Continua">📚 Éducation des Adultes</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Catégorie du Catalogue</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
            >
              <option value="primaria">Primaire (1ère à 6ème)</option>
              <option value="eso">Secondaire</option>
              <option value="bachillerato">Baccalauréat</option>
              <option value="fp">Formation Professionnelle (FP)</option>
              <option value="math-physics">Mathématiques & Physique</option>
              <option value="agri">Agriculture & Développement Rural</option>
              <option value="health">Santé & Biologie</option>
              <option value="solar">Énergie Solaire</option>
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-300 block">Description du Cours *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rédigez un résumé pédagogique de ce que l'étudiant apprendra..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Taille Paquet MB</label>
            <input
              type="text"
              value={sizeMB}
              onChange={(e) => setSizeMB(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block">Durée Estimée</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* ─── SECCIÓN: ESTRUCTURA DE MÓDULOS & LECCIONES + ADJUNTOS PDF ───────── */}
        <div className="pt-6 border-t border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Structure des Modules, Leçons & PDF ({modules.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Attribuez le niveau éducatif, parcourez vos fichiers locaux ou joignez des questionnaires.
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
              {/* BOTÓN ULTRA VISIBLE PARCOURIR / TÉLÉVERSER CONTENU */}
              <label className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/30 cursor-pointer transition-all hover:scale-105 border border-amber-300/60 active:scale-95">
                <FolderOpen className="w-4.5 h-4.5 text-slate-950 stroke-[2.5]" />
                <span className="tracking-wide">📁 Parcourir & Importer Fichier...</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.mp4,.mp3"
                  className="hidden"
                  onChange={handleBrowseAndImportModule}
                />
              </label>

              <button
                type="button"
                onClick={handleAddModule}
                className="px-4.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0 border border-amber-500/40 shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                + Ajouter Module
              </button>
            </div>
          </div>

          {/* BANNER DE SUCCÈS LORS DE L'IMPORTATION DE FICHIER */}
          {importSuccessToast && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-3 animate-fadeIn shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{importSuccessToast}</span>
            </div>
          )}

          {modules.map((mod, modIdx) => (
            <div key={mod.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              
              {/* En-tête du Module */}
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                    NOM DU MODULE {modIdx + 1}
                  </label>
                  <input
                    type="text"
                    required
                    value={mod.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModules(prev => prev.map((m, i) => i === modIdx ? { ...m, title: val } : m));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(modIdx)}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs cursor-pointer transition-all shrink-0 mt-4"
                    title="Supprimer le module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* BOTÓN INTEG R AR NUEVO EXAMEN / QUIZ / PDF EN ESTE MÓDULO (EXACTO A LA CAPTURA) */}
              <button
                type="button"
                onClick={() => handleOpenExamModal(modIdx)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-600/30 hover:from-amber-600/40 hover:to-amber-600/40 text-amber-300 border border-amber-500/40 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <FileUp className="w-4 h-4 text-amber-400" />
                + Intégrer Examen / Quiz dans ce Module
              </button>

              {/* LISTA DE EXÁMENES Y FICHIERS PDF INTEGRADOS EN EL MÓDULO */}
              {mod.exams && mod.exams.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-[11px] font-extrabold text-slate-400 block">
                    Examens Intégrés ({mod.exams.length}) :
                  </span>
                  <div className="space-y-1.5">
                    {mod.exams.map((ex) => (
                      <div key={ex.id} className="flex items-center justify-between bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center gap-2.5 truncate">
                          {ex.type === 'QUIZ' ? (
                            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <FileUp className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <span className="font-bold text-white truncate">{ex.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {ex.type === 'QUIZ' ? `${ex.questionsCount || 5} Questions` : ex.size || '1.2 MB'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExam(modIdx, ex.id)}
                            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Liste des Leçons du Module */}
              <div className="space-y-3 pt-3 border-t border-slate-900">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">
                    Leçons incluses dans ce module ({mod.lessons.length}) :
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddLesson(modIdx)}
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    + Ajouter une Leçon
                  </button>
                </div>

                {mod.lessons.map((less, lessIdx) => (
                  <div key={less.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Titre de la Leçon *</label>
                        <input
                          type="text"
                          required
                          value={less.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setModules(prev => prev.map((m, i) => {
                              if (i === modIdx) {
                                const newLess = m.lessons.map((l, li) => li === lessIdx ? { ...l, title: val } : l);
                                return { ...m, lessons: newLess };
                              }
                              return m;
                            }));
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                        />
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Durée</label>
                          <input
                            type="text"
                            value={less.duration}
                            onChange={(e) => {
                              const val = e.target.value;
                              setModules(prev => prev.map((m, i) => {
                                if (i === modIdx) {
                                  const newLess = m.lessons.map((l, li) => li === lessIdx ? { ...l, duration: val } : l);
                                  return { ...m, lessons: newLess };
                                }
                                return m;
                              }));
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                          />
                        </div>

                        {mod.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(modIdx, lessIdx)}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs cursor-pointer transition-all mt-4"
                            title="Supprimer la leçon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Contenu / Explications de la Leçon</label>
                      <textarea
                        rows={2}
                        value={less.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          setModules(prev => prev.map((m, i) => {
                            if (i === modIdx) {
                              const newLess = m.lessons.map((l, li) => li === lessIdx ? { ...l, content: val } : l);
                              return { ...m, lessons: newLess };
                            }
                            return m;
                          }));
                        }}
                        placeholder="Rédigez le texte d'étude pour la lecture hors-ligne..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* ─── TÉLÉVERSEMENT DE FICHIERS PDF / DOCX POUR CHAQUE LEÇON ─── */}
                    <div className="pt-2 border-t border-slate-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      {less.attachment ? (
                        <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-emerald-500/40 w-full sm:w-auto">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="truncate text-xs">
                            <span className="font-bold text-white block truncate">{less.attachment.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Fichier {less.attachment.type} • {less.attachment.size}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(modIdx, lessIdx)}
                            className="p-1 text-red-400 hover:text-red-300 cursor-pointer ml-auto"
                            title="Retirer le fichier joint"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all">
                          <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                          Joindre un Fichier (.pdf, .docx, .ppt, .png)
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, modIdx, lessIdx)}
                          />
                        </label>
                      )}

                      <span className="text-[10px] text-slate-500 italic">Format supporté : PDF, DOCX, PPT, Images</span>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Save className="w-4 h-4" />
            Publier le Cours avec Modules & Fichiers PDF
          </button>
        </div>
      </form>

      {/* ─── MODAL D'INTÉGRATION D'EXAMEN / FICHIER PDF DANS LE MODULE ─── */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileUp className="w-5 h-5 text-amber-400" />
                Intégrer Examen ou Fichier PDF
              </h3>
              <button
                type="button"
                onClick={() => setShowExamModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExamSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Type d'Évaluation *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExamType('FILE')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      examType === 'FILE'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    📄 Fichier PDF / DOCX
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamType('QUIZ')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      examType === 'QUIZ'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    ❓ Quiz Interactif (5 Q)
                  </button>
                </div>
              </div>

              {examType === 'FILE' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Sélectionner Fichier PDF / Examen *</label>
                  <label htmlFor="exam-file-input" className="block p-4 bg-slate-950 hover:bg-slate-900 border border-dashed border-amber-500/40 rounded-2xl text-center space-y-1 cursor-pointer transition-all">
                    <input
                      type="file"
                      id="exam-file-input"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedExamFile({
                            name: file.name,
                            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                          });
                          setExamTitle(file.name);
                        }
                      }}
                    />
                    <FileUp className="w-6 h-6 text-amber-400 mx-auto" />
                    <p className="text-xs font-bold text-white">
                      {uploadedExamFile ? `📎 ${uploadedExamFile.name} (${uploadedExamFile.size})` : '📎 Clic pour Choisir un PDF ou Examen'}
                    </p>
                    <p className="text-[10px] text-slate-400">Formats supportés : PDF, DOCX, PPT</p>
                  </label>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Titre du Quiz Interactif *</label>
                  <input
                    type="text"
                    required
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="Ex : Quiz 1 : Évaluation Courte Autocorrigée"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                >
                  Intégrer dans le Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
