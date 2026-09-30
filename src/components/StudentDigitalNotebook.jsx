import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookMarked,
  Folder,
  FolderPlus,
  FileText,
  PlusCircle,
  Search,
  Tag,
  Image as ImageIcon,
  Quote,
  Trash2,
  Edit,
  Save,
  X,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  Paperclip,
  Share2,
  Download
} from 'lucide-react';

export const INITIAL_FOLDERS = [
  { id: 'f-all', name: 'Toutes les Notes', color: 'indigo' },
  { id: 'f-math', name: 'Mathématiques & Algèbre', color: 'blue' },
  { id: 'f-physics', name: 'Physique & Chimie', color: 'amber' },
  { id: 'f-selectividad', name: 'Sélectivité & UNGE 2026', color: 'purple' },
  { id: 'f-fp', name: 'FP Technique & Réseaux', color: 'emerald' }
];

export const INITIAL_NOTES = [
  {
    id: 'n-1',
    title: 'Formules Clés d\'Équations du Second Degré',
    folderId: 'f-math',
    folderName: 'Mathématiques & Algèbre',
    content: 'La formule générale pour résoudre ax² + bx + c = 0 est x = (-b ± √(b² - 4ac)) / (2a). Se rappeler d\'analyser le discriminant Δ = b² - 4ac: si Δ > 0 il y a 2 solutions réelles; si Δ = 0 il y a 1 solution double; si Δ < 0 il n\'y a pas de racines réelles.',
    tags: ['#Formules', '#Examen', '#Mathématiques'],
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    snippets: [
      { id: 's-1', source: 'Master en Mathématiques Secondaire - Leçon 2', text: 'Le discriminant détermine le nombre de solutions réelles de la fonction du second degré.' }
    ],
    isFavorite: true,
    updatedAt: '20 août 2026'
  },
  {
    id: 'n-2',
    title: 'Lois de Newton & Principes de la Dynamique',
    folderId: 'f-physics',
    folderName: 'Physique & Chimie',
    content: '1ère Loi (Inertie): Tout corps demeure au repos ou en mouvement rectiligne uniforme sans force externe. 2ème Loi (Force): F = m·a. 3ème Loi (Action-Réaction): À toute action correspond une réaction égale et opposée.',
    tags: ['#Physique', '#Newton', '#Lois'],
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    snippets: [
      { id: 's-2', source: 'Physique et Chimie: Lois de Newton - Module 1', text: 'La force nette appliquée à un corps est directement proportionnelle à l\'accélération qu\'il acquiert.' }
    ],
    isFavorite: false,
    updatedAt: '19 août 2026'
  },
  {
    id: 'n-3',
    title: 'Notes de Préparation Sélectivité UNGE - Modèle OSI',
    folderId: 'f-selectividad',
    folderName: 'Sélectivité & UNGE 2026',
    content: 'Les 7 couches du Modèle OSI: 7. Application, 6. Présentation, 5. Session, 4. Transport (TCP/UDP), 3. Réseau (IP), 2. Liaison de Données (MAC), 1. Physique (Câbles).',
    tags: ['#Sélectivité', '#Réseaux', '#UNGE'],
    imageUrl: '',
    snippets: [],
    isFavorite: true,
    updatedAt: '18 août 2026'
  }
];

export const StudentDigitalNotebook = () => {
  const { user } = useAuth();

  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem('educ_user_folders');
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('educ_user_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [selectedFolderId, setSelectedFolderId] = useState('f-all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState(notes[0] || null);

  // Estados de Modal para crear carpeta y editar nota
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showEditorModal, setShowEditorModal] = useState(false);
  
  // Estado de edición de nota
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editFolderId, setEditFolderId] = useState('f-math');
  const [editTagsInput, setEditTagsInput] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [newSnippetSource, setNewSnippetSource] = useState('');
  const [newSnippetText, setNewSnippetText] = useState('');
  const [currentSnippets, setCurrentSnippets] = useState([]);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  const [toastMsg, setToastMsg] = useState('');

  // Persistir en LocalStorage
  useEffect(() => {
    localStorage.setItem('educ_user_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('educ_user_notes', JSON.stringify(notes));
  }, [notes]);

  // Lista de todas las etiquetas únicas
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  // Filtrado de Notas por Carpeta, Etiqueta y Búsqueda
  const filteredNotes = notes.filter(note => {
    const matchesFolder = selectedFolderId === 'f-all' || note.folderId === selectedFolderId;
    const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      (note.tags && note.tags.some(t => t.toLowerCase().includes(query))) ||
      (note.folderName && note.folderName.toLowerCase().includes(query)) ||
      (note.snippets && note.snippets.some(s => s.text.toLowerCase().includes(query) || s.source.toLowerCase().includes(query)))
    );

    return matchesFolder && matchesTag && matchesSearch;
  });

  // Abrir Modal para crear nueva nota
  const handleOpenCreateNote = () => {
    setIsEditingExisting(false);
    setEditTitle('');
    setEditContent('');
    setEditFolderId(selectedFolderId !== 'f-all' ? selectedFolderId : (folders[1]?.id || 'f-math'));
    setEditTagsInput('#Apuntes, #Estudio');
    setEditImageUrl('');
    setCurrentSnippets([]);
    setNewSnippetSource('');
    setNewSnippetText('');
    setShowEditorModal(true);
  };

  // Abrir Modal para editar nota existente
  const handleOpenEditNote = (note) => {
    setIsEditingExisting(true);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditFolderId(note.folderId);
    setEditTagsInput((note.tags || []).join(', '));
    setEditImageUrl(note.imageUrl || '');
    setCurrentSnippets(note.snippets || []);
    setNewSnippetSource('');
    setNewSnippetText('');
    setShowEditorModal(true);
  };

  // Guardar Nota
  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    const folderObj = folders.find(f => f.id === editFolderId) || folders[1];

    // Procesar etiquetas ingresadas por comas o espacios
    const parsedTags = editTagsInput
      .split(/[, ]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    if (isEditingExisting && activeNote) {
      const updatedNote = {
        ...activeNote,
        title: editTitle,
        content: editContent,
        folderId: editFolderId,
        folderName: folderObj ? folderObj.name : 'General',
        tags: parsedTags,
        imageUrl: editImageUrl,
        snippets: currentSnippets,
        updatedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      setNotes(prev => prev.map(n => n.id === activeNote.id ? updatedNote : n));
      setActiveNote(updatedNote);
      setToastMsg('¡Note mise à jour avec succès!');
    } else {
      const newNote = {
        id: `n-${Date.now()}`,
        title: editTitle,
        content: editContent,
        folderId: editFolderId,
        folderName: folderObj ? folderObj.name : 'Général',
        tags: parsedTags,
        imageUrl: editImageUrl,
        snippets: currentSnippets,
        isFavorite: false,
        updatedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      setNotes(prev => [newNote, ...prev]);
      setActiveNote(newNote);
      setToastMsg('¡Nouvelle note créée dans votre Cahier Numérique!');
    }

    setShowEditorModal(false);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Añadir fragmento de clase a la nota actual en edición
  const handleAddSnippet = () => {
    if (!newSnippetText.trim()) return;
    const newSnip = {
      id: `snip-${Date.now()}`,
      source: newSnippetSource.trim() || 'Clase / Lección Educativa',
      text: newSnippetText.trim()
    };
    setCurrentSnippets(prev => [...prev, newSnip]);
    setNewSnippetSource('');
    setNewSnippetText('');
  };

  // Eliminar fragmento
  const handleRemoveSnippet = (snippetId) => {
    setCurrentSnippets(prev => prev.filter(s => s.id !== snippetId));
  };

  // Alternar favorita
  const toggleFavoriteNote = (noteId) => {
    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        return { ...n, isFavorite: !n.isFavorite };
      }
      return n;
    }));
    if (activeNote && activeNote.id === noteId) {
      setActiveNote(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  // Eliminar Nota
  const handleDeleteNote = (noteId) => {
    if (window.confirm('¿Estás seguro de eliminar esta nota de tu cuaderno?')) {
      const updated = notes.filter(n => n.id !== noteId);
      setNotes(updated);
      setActiveNote(updated[0] || null);
      setToastMsg('Nota eliminada del cuaderno.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  // Crear Nueva Carpeta
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const colors = ['blue', 'emerald', 'purple', 'amber', 'rose', 'teal'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      color: randomColor
    };

    setFolders(prev => [...prev, newFolder]);
    setSelectedFolderId(newFolder.id);
    setNewFolderName('');
    setShowFolderModal(false);
    setToastMsg(`¡Carpeta "${newFolder.name}" creada exitosamente!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header del Cuaderno Digital */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 inline-flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-amber-300" /> Cahier Numérique d'Étude Hors-Ligne
            </span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              🟢 Enregistré dans IndexedDB
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Mon Cahier Personnel de Notes</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Prenez des notes, organisez vos dossiers, joignez des images et sauvegardez des extraits clés de vos leçons avec recherche en temps réel.
          </p>
        </div>

        <button
          onClick={handleOpenCreateNote}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer transition-transform hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-slate-950" />
          Nouvelle Note / Révision
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── BARRA DE BÚSQUEDA Y ETIQUETAS RÁPIDAS ─────────── */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-700/80 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Buscador Integrado */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les notes, titres, tags, extraits de cours ou dossiers..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFolderModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <FolderPlus className="w-4 h-4 text-amber-400" />
            Nouveau Dossier
          </button>
        </div>

        {/* Filtro por Etiquetas */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-400" /> Filtrer Tag:
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                !selectedTag ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Tous les Tags
            </button>
            {allTags.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                  selectedTag === t
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── CONTENEDOR PRINCIPAL: CARPETAS + LISTA DE NOTAS + VISOR DE NOTA ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: SELECCIÓN DE CARPETAS Y NOTAS (4 columnas) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Selector de Carpetas */}
          <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-700/80 space-y-2 shadow-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Mes Dossiers d'Étude ({folders.length})
            </span>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {folders.map((f) => {
                const isSelected = selectedFolderId === f.id;
                const count = f.id === 'f-all'
                  ? notes.length
                  : notes.filter(n => n.folderId === f.id).length;

                return (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedFolderId(f.id); setSelectedTag(null); }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : 'text-indigo-400'}`} />
                      <span className="truncate">{f.name}</span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LISTA DE NOTAS EN LA CARPETA SELECCIONADA */}
          <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-700/80 space-y-3 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Notes ({filteredNotes.length})
              </span>
              <span className="text-[10px] text-slate-400">
                {selectedFolderId === 'f-all' ? 'Tous les dossiers' : 'Filtré'}
              </span>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-slate-850 text-slate-400 text-xs">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-bold text-slate-300">Aucune note dans ce filtre</p>
                <button
                  onClick={handleOpenCreateNote}
                  className="mt-2 text-xs text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  + Créer la première note
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 no-scrollbar">
                {filteredNotes.map((note) => {
                  const isActive = activeNote?.id === note.id;

                  return (
                    <div
                      key={note.id}
                      onClick={() => setActiveNote(note)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-slate-850 to-indigo-950/50 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30'
                          : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                          {note.title}
                        </h4>

                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavoriteNote(note.id); }}
                          className="text-slate-500 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {note.content}
                      </p>

                      <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500 border-t border-slate-850">
                        <span className="text-indigo-300 font-semibold">{note.folderName}</span>
                        <span>{note.updatedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: DETALLE Y VISOR DE LA NOTA SELECCIONADA (8 columnas) */}
        <div className="lg:col-span-8 space-y-4">
          {activeNote ? (
            <div className="bg-slate-900/90 p-6 md:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 animate-fadeIn">
              
              {/* Encabezado y Acciones de la Nota */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      {activeNote.folderName}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Mis à jour: {activeNote.updatedAt}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleFavoriteNote(activeNote.id)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Star className={`w-4 h-4 ${activeNote.isFavorite ? 'fill-amber-400' : ''}`} />
                    <span className="hidden sm:inline">{activeNote.isFavorite ? 'Favori' : 'Marquer'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditNote(activeNote)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform hover:scale-102"
                  >
                    <Edit className="w-4 h-4" /> Modifier Note
                  </button>

                  <button
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 text-xs font-bold cursor-pointer transition-colors"
                    title="Supprimer Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ETIQUETAS DE LA NOTA */}
              {activeNote.tags && activeNote.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {activeNote.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* IMAGEN ADJUNTA (SI TIENE) */}
              {activeNote.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-700 max-h-72 bg-slate-950 flex items-center justify-center">
                  <img
                    src={activeNote.imageUrl}
                    alt="Imagen adjunta a los apuntes"
                    className="w-full h-auto object-cover max-h-72"
                  />
                </div>
              )}

              {/* CONTENIDO PRINCIPAL DE LOS APUNTES */}
              <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                {activeNote.content}
              </div>

              {/* FRAGMENTOS DE LA CLASE DESTACADOS */}
              {activeNote.snippets && activeNote.snippets.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-amber-300" /> Extraits & Citations de Cours Enregistrés ({activeNote.snippets.length})
                  </h3>

                  <div className="space-y-2">
                    {activeNote.snippets.map((snip) => (
                      <div key={snip.id} className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 block uppercase">
                          Source: {snip.source}
                        </span>
                        <p className="text-xs text-slate-200 italic font-serif">
                          "{snip.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-900/90 p-12 rounded-3xl border border-slate-700/80 text-center space-y-4 text-slate-400 shadow-xl">
              <BookMarked className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">Aucune note sélectionnée</h3>
              <p className="text-xs max-w-sm mx-auto">Sélectionnez une note dans la liste ou créez-en une nouvelle pour commencer.</p>
              <button
                onClick={handleOpenCreateNote}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 shadow-lg"
              >
                <PlusCircle className="w-4 h-4" /> Créer Nouvelle Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL 1: CREAR NUEVA CARPETA ─────────── */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowFolderModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <FolderPlus className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Créer un Nouveau Dossier de Notes</h3>
                <p className="text-xs text-slate-400">Organisez vos matières par dossiers thématiques.</p>
              </div>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 block uppercase">Nom du Dossier:</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ex: Chimie Organique, Histoire de Guinée Équatoriale..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" /> Créer Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: EDITOR DE NOTA (CREAR / EDITAR NOTA CON IMÁGENES & FRAGMENTOS) ─────────── */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setShowEditorModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Edit className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isEditingExisting ? 'Modifier la Note de Révision' : 'Créer une Nouvelle Note de Révision'}
                </h3>
                <p className="text-xs text-slate-400">Écrivez vos résumés, joignez des images et des extraits de cours.</p>
              </div>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
              
              {/* Título y Selección de Carpeta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-300 block uppercase">Titre de la Note:</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Ex: Résumé de Géométrie et Équations..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block uppercase">Dossier Cible:</label>
                  <select
                    value={editFolderId}
                    onChange={(e) => setEditFolderId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none"
                  >
                    {folders.filter(f => f.id !== 'f-all').map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contenido de la Nota */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 block uppercase">Contenu de vos Notes:</label>
                <textarea
                  rows="6"
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Écrivez ici vos notes détaillées, explications, formules et schémas..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              {/* Etiquetas e Imagen Adjunta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block uppercase flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-400" /> Tags (séparés par des virgules):
                  </label>
                  <input
                    type="text"
                    value={editTagsInput}
                    onChange={(e) => setEditTagsInput(e.target.value)}
                    placeholder="#Examen, #Newton, #Important"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 block uppercase flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> URL d'Image Jointe (Optionnel):
                  </label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* FRAGMENTOS DE LA CLASE (CITAS/EXTRACTOS) */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <span className="font-bold text-indigo-300 block uppercase flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-amber-300" /> Enregistrer Extraits / Citations de Leçon
                </span>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={newSnippetSource}
                    onChange={(e) => setNewSnippetSource(e.target.value)}
                    placeholder="Source / Cours (Ex: Leçon 3 - Master en Mathématiques)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  />
                  <textarea
                    rows="2"
                    value={newSnippetText}
                    onChange={(e) => setNewSnippetText(e.target.value)}
                    placeholder="Écrivez la phrase ou formule clé du cours..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSnippet}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    + Ajouter Extrait à la Note
                  </button>
                </div>

                {currentSnippets.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Extraits ajoutés:</span>
                    {currentSnippets.map((snip) => (
                      <div key={snip.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 block">{snip.source}</span>
                          <span className="text-xs text-slate-200 italic">"{snip.text}"</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSnippet(snip.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de Guardar */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-lg cursor-pointer transition-transform hover:scale-102"
                >
                  <Save className="w-4 h-4" /> Enregistrer la Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
