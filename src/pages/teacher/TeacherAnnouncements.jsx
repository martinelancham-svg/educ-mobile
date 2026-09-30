import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BellRing, Send, CheckCircle2, Paperclip, FileText, Download, X, GraduationCap, FolderOpen } from 'lucide-react';

export const TeacherAnnouncements = () => {
  const { addNotification, user } = useAuth();
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'Nouvel Atelier d\'Équations du Second Degré & Guide d\'Exercices',
      targetLevel: 'Secondaire',
      text: '4 exercices résolus ont été ajoutés dans le module de Mathématiques. Le guide PDF est téléchargeable.',
      date: 'Hier',
      attachedFile: { name: 'Guide_Exercices_Equations_2026.pdf', size: '1.2 MB' }
    },
    {
      id: '2',
      title: 'Fiches Pédagogiques de Lecture et Chiffres pour le Primaire',
      targetLevel: 'Primaire (1ère à 6ème)',
      text: 'Les fiches téléchargeables en PDF sont disponibles pour que les élèves s\'entraînent hors-ligne.',
      date: 'Il y a 2 jours',
      attachedFile: { name: 'Fiches_Primaire_Mathematiques.pdf', size: '950 KB' }
    }
  ]);

  const [title, setTitle] = useState('');
  const [targetLevel, setTargetLevel] = useState('Secondaire (ESO)');
  const [text, setText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

    setAttachedFile({
      name: file.name,
      size: formattedSize,
      type: file.type || file.name.split('.').pop().toUpperCase(),
      url: fileUrl,
      rawFile: file
    });
  };

  const handleRemoveAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAnn = {
      id: Date.now().toString(),
      title,
      targetLevel,
      text,
      date: 'À l\'instant',
      attachedFile
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    if (addNotification) {
      addNotification({
        type: 'teacher',
        title: `📢 Annonce Enseignante : ${title}`,
        text: text || `L'enseignant ${user?.name || 'Enseignant'} a publié une annonce pour ${targetLevel}.`,
        author: user?.name || 'Enseignant'
      });
    }

    setTitle('');
    setText('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setToastMsg(`Annonce publiée pour ${targetLevel} avec fichier PDF joint !`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Publier des Annonces & Joindre des PDF par Niveau</h1>
            <p className="text-xs text-slate-300">Attribuez des annonces et documents PDF pour le Primaire, Secondaire ou Baccalauréat.</p>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Formulario Redactar Anuncio con Opción de Nivel Educativo y PDF Adjunto */}
      <form onSubmit={handleSendAnnouncement} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Rédiger une Annonce et Joindre un PDF :</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Opción Nivel Educativo (Primaria, Secundaria, Bachillerato, FP) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-300 block flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Niveau Éducatif *
            </label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="w-full bg-slate-800 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer"
            >
              <option value="Primaire (1ère à 6ème)">🏫 Primaire (1ère à 6ème)</option>
              <option value="Secondaire">🎓 Secondaire Obligatoire</option>
              <option value="Baccalauréat">🏅 Baccalauréat</option>
              <option value="Formation Professionnelle (FP)">💼 Formation Professionnelle (FP)</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 block">Titre de l'Annonce *</label>
            <input
              type="text"
              required
              placeholder="Ex : Matériel de Révision PDF pour Examen du Primaire / Secondaire"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <textarea
          required
          rows={3}
          placeholder="Rédigez le contenu du message ou les consignes d'étude pour ce niveau..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
        />

        {/* Zona Adjuntar Archivo (PDF, DOCX, etc.) */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs text-white font-extrabold block">Joindre un PDF / Guide Éducatif :</span>
              <span className="text-[10px] text-slate-400">Formats acceptés : PDF, DOCX, PPTX, TXT, Images</span>
            </div>
          </div>

          <input
            id="announcement-file-picker"
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.pptx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

          {attachedFile ? (
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-2 rounded-xl border border-emerald-500/40 font-bold shadow">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[200px]">{attachedFile.name} ({attachedFile.size})</span>
              <button
                type="button"
                onClick={handleRemoveAttachedFile}
                className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer ml-1"
                title="Supprimer le fichier joint"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="announcement-file-picker"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-amber-300 shrink-0"
            >
              <FolderOpen className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              📁 Parcourir & Importer Fichier PDF...
            </label>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" /> Publier l'Annonce pour {targetLevel.split(' ')[0]}
          </button>
        </div>
      </form>

      {/* Historial de Anuncios */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Historique des Annonces Publiées :</h3>
        {announcements.map(a => (
          <div key={a.id} className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 text-xs space-y-2.5 shadow-md">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  {a.targetLevel || 'Secondaire'}
                </span>
                <span className="font-bold text-white text-sm">{a.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{a.date}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{a.text}</p>

            {/* Si tiene archivo adjunto */}
            {a.attachedFile && (
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white text-xs">{a.attachedFile.name}</span>
                  <span className="text-[10px] text-slate-400">({a.attachedFile.size || 'Fichier PDF Joint'})</span>
                </div>
                {a.attachedFile.url ? (
                  <a
                    href={a.attachedFile.url}
                    download={a.attachedFile.name}
                    className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 cursor-pointer hover:bg-emerald-500/30 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Télécharger PDF
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => alert(`Le fichier ${a.attachedFile.name} est disponible dans le Nœud local.`)}
                    className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 cursor-pointer hover:bg-emerald-500/30 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Télécharger PDF
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
