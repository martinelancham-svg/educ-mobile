import React, { useState } from 'react';
import { INITIAL_AUDIOBOOKS } from '../../data/initialMockData';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  DownloadCloud,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  RotateCcw,
  Sparkles,
  Radio,
  Share2,
  PlusCircle,
  Upload,
  X,
  Music,
  FileAudio,
  Plus,
  Trash2,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';

export const AudiobooksPage = () => {
  const { isEffectiveOffline } = useOffline();
  const auth = useAuth();
  
  const audiobooks = auth?.audiobooks || INITIAL_AUDIOBOOKS;
  const addAudiobook = auth?.addAudiobook;
  const approveAudiobook = auth?.approveAudiobook;
  const rejectAudiobook = auth?.rejectAudiobook;
  const approveAllPendingAudiobooks = auth?.approveAllPendingAudiobooks;
  
  const user = auth?.user;
  const activeRole = auth?.activeRole || user?.role || 'student';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Estado del reproductor activo
  const [activeBook, setActiveBook] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [downloadedBooks, setDownloadedBooks] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  // ─── Estado del Modal de Subida de Audiolibros / Pods por Profesores ───────
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Literatura & Leyendas');
  const [narrator, setNarrator] = useState(user?.name || 'Prof. Baltasar Nsue Ondo');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30 min (3 Capítulos)');
  const [sizeMB, setSizeMB] = useState('6.5 MB');
  const [coverBg, setCoverBg] = useState('from-indigo-800 to-slate-950');

  // Capítulos en el formulario
  const [chapters, setChapters] = useState([
    { id: 'ch-1', title: 'Capítulo 1: Introducción & Conceptos Clave', duration: '10:00', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
  ]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDuration, setNewChapterDuration] = useState('10:00');
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);

  const handleSelectBook = (book) => {
    setActiveBook(book);
    setActiveChapterIndex(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownloadBook = (bookId, bookTitle) => {
    if (!downloadedBooks.includes(bookId)) {
      setDownloadedBooks(prev => [...prev, bookId]);
      setToastMsg(`¡Audiolibro "${bookTitle}" guardado 100% offline en tu dispositivo!`);
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSelectedAudioFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: fileUrl
      });
      setSizeMB(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newCh = {
      id: `ch-${Date.now()}`,
      title: newChapterTitle.trim(),
      duration: newChapterDuration || '08:30',
      audioUrl: selectedAudioFile?.url || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
    };
    setChapters(prev => [...prev, newCh]);
    setNewChapterTitle('');
    setSelectedAudioFile(null);
  };

  const handleRemoveChapter = (chId) => {
    setChapters(prev => prev.filter(c => c.id !== chId));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBookData = {
      title: title.trim(),
      author: user?.name || 'Prof. Baltasar Nsue Ondo',
      narrator: narrator.trim() || user?.name || 'Prof. Docente',
      category,
      duration: `${duration}`,
      sizeMB: sizeMB || '6.0 MB',
      coverBg,
      description: description.trim() || 'Livre audio éducatif enregistré par le corps enseignant pour l\'étude hors-ligne.',
      approvalStatus: 'Pending', // Requiert Approbation Admin
      chapters: chapters.length > 0 ? chapters : [
        { id: `ch-${Date.now()}`, title: 'Chapitre 1: Introduction', duration: '10:00', audioUrl: selectedAudioFile?.url || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
      ]
    };

    if (addAudiobook) {
      addAudiobook(newBookData);
    }

    setToastMsg(`Livre Audio / Pod "${title}" envoyé à la Console Admin ! En attente d'approbation et vérification par l'Administrateur.`);
    setTimeout(() => setToastMsg(''), 6000);

    // Reset Form
    setTitle('');
    setDescription('');
    setIsUploadModalOpen(false);
  };

  // Audiolibros pendientes de aprobación (para el Admin)
  const pendingAudiobooks = audiobooks.filter(b => b.approvalStatus === 'Pending');

  // Audiolibros filtrados según el rol y búsqueda
  const filteredAudiobooks = audiobooks.filter(b => {
    // Estudiantes SOLO ven audiolibros APROBADOS
    if (activeRole === 'student') {
      if (b.approvalStatus && b.approvalStatus !== 'Approved') return false;
    }
    const matchesCategory = selectedCategory === 'all' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'literatura', label: 'Littérature & Légendes' },
    { id: 'ciencias', label: 'Sciences & Physique' },
    { id: 'matemáticas', label: 'Mathématiques' },
    { id: 'historia', label: 'Histoire & Géographie' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-24">
      
      {/* Header Audiolibros */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Headphones className="w-6 h-6 text-emerald-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
                Bibliothèque Audio Éducative • Faible Bande Passante
              </span>
              {activeRole === 'teacher' && (
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Studio Enseignant
                </span>
              )}
              {activeRole === 'admin' && (
                <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  Console Admin • Vérification
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Livres Audio & Pods Éducatifs</h1>
            <p className="text-xs text-slate-300">Écoutez des leçons parlées, de la littérature et de l'histoire nationale sans écran allumé.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Botón de Subida ÚNICAMENTE para Profesores (Quitado de Admin) */}
          {activeRole === 'teacher' && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              Publier Livre Audio / Pod
            </button>
          )}

          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center shrink-0">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Format</span>
            <strong className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5 justify-center">
              <Radio className="w-4 h-4 text-emerald-400" /> Audio MP3 Hors-Ligne
            </strong>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── SECCIÓN DE ACEPTACIÓN / VERIFICACIÓN DE AUDIOLIBROS PARA ADMIN ───── */}
      {activeRole === 'admin' && pendingAudiobooks.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-purple-950/90 via-slate-900 to-purple-950/90 rounded-3xl border border-purple-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-purple-500/30 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg border border-purple-500/30 shrink-0">
                <ShieldCheck className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  Console Admin • Vérification du Contenu Enseignant
                </span>
                <h2 className="text-base font-extrabold text-white">
                  Livres Audio & Pods En Attente d'Approbation ({pendingAudiobooks.length})
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                if (approveAllPendingAudiobooks) {
                  approveAllPendingAudiobooks();
                  setToastMsg('Tous les livres audio en attente ont été ACCEPTÉS ET APPROUVÉS avec succès !');
                  setTimeout(() => setToastMsg(''), 5000);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accepter / Approuver Tous
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingAudiobooks.map(book => (
              <div key={book.id} className="p-4 bg-slate-900/90 rounded-2xl border border-purple-500/40 flex flex-col justify-between space-y-3 shadow-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      ⏳ En attente de vérification Admin
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{book.sizeMB}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{book.title}</h4>
                  <p className="text-xs text-amber-300 font-medium">Enseignant Auteur : {book.author}</p>
                  <p className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {book.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (approveAudiobook) {
                        approveAudiobook(book.id);
                        setToastMsg(`Livre audio "${book.title}" ACCEPTÉ et publié pour les étudiants !`);
                        setTimeout(() => setToastMsg(''), 4000);
                      }
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accepter / Approuver
                  </button>
                  <button
                    onClick={() => {
                      if (rejectAudiobook) {
                        rejectAudiobook(book.id);
                        setToastMsg(`Livre audio "${book.title}" refusé.`);
                        setTimeout(() => setToastMsg(''), 4000);
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <X className="w-4 h-4 text-red-400" /> Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
        
        {/* Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un livre audio ou un narrateur..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid de Audiolibros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAudiobooks.map(book => {
          const isDownloaded = downloadedBooks.includes(book.id);
          const isCurrentActive = activeBook?.id === book.id;
          const isPending = book.approvalStatus === 'Pending';

          return (
            <div
              key={book.id}
              className={`bg-slate-900/90 p-5 rounded-2xl border transition-all space-y-4 shadow-xl flex flex-col justify-between ${
                isCurrentActive
                  ? 'border-emerald-500/80 ring-1 ring-emerald-500/50 bg-slate-900'
                  : isPending
                    ? 'border-amber-500/60 bg-slate-900/95'
                    : 'border-slate-700/80 hover:border-indigo-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {book.category}
                    </span>
                    {isPending && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ⏳ En Attente d'Approbation Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {book.duration}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
                      {book.sizeMB}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${book.coverBg || 'from-emerald-600 to-indigo-700'} text-white flex items-center justify-center shrink-0 shadow-lg border border-emerald-400/30`}>
                    <Headphones className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">{book.title}</h3>
                    <p className="text-xs text-amber-300 font-medium">Auteur: {book.author}</p>
                    <p className="text-[11px] text-slate-400">Narrateur: {book.narrator}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {book.description}
                </p>

                {/* Capítulos del Audiolibro */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">CHAPITRES ({book.chapters.length}):</span>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1 no-scrollbar">
                    {book.chapters.map((ch, idx) => (
                      <div
                        key={ch.id || idx}
                        onClick={() => {
                          setActiveBook(book);
                          setActiveChapterIndex(idx);
                          setIsPlaying(true);
                        }}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isCurrentActive && activeChapterIndex === idx
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                            : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="truncate pr-2">{ch.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{ch.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {/* Si es Admin y está pendiente, mostrar botón Aceptar / Aprobar */}
                {activeRole === 'admin' && isPending && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (approveAudiobook) {
                          approveAudiobook(book.id);
                          setToastMsg(`Livre audio "${book.title}" ACCEPTÉ et vérifié !`);
                          setTimeout(() => setToastMsg(''), 4000);
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accepter / Approuver
                    </button>
                    <button
                      onClick={() => {
                        if (rejectAudiobook) {
                          rejectAudiobook(book.id);
                          setToastMsg(`Audiolibro "${book.title}" rechazado.`);
                          setTimeout(() => setToastMsg(''), 4000);
                        }
                      }}
                      className="py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <X className="w-4 h-4 text-red-400" /> Rechazar
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectBook(book)}
                    className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                      isCurrentActive && isPlaying
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {isCurrentActive && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" /> Mettre en Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950" /> Écouter le Livre Audio
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadBook(book.id, book.title)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDownloaded
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title={isDownloaded ? 'Enregistré dans le stockage hors-ligne' : 'Enregistrer le livre audio pour l\'écouter sans internet'}
                  >
                    <DownloadCloud className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">{isDownloaded ? 'Enregistré' : 'Télécharger MP3'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reproductor Flotante Fijo en la Parte Inferior */}
      {activeBook && (
        <div className="fixed bottom-3 left-4 right-4 max-w-4xl mx-auto bg-slate-900/95 border border-emerald-500/50 rounded-3xl p-4 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 truncate">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <Headphones className="w-5 h-5 animate-pulse" />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-extrabold text-white truncate">{activeBook.title}</h4>
                <p className="text-[11px] text-emerald-400 font-semibold truncate">
                  {activeBook.chapters[activeChapterIndex]?.title || 'Capítulo 1'}
                </p>
              </div>
            </div>

            {/* Controles del Reproductor */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setPlaybackSpeed(prev => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1))}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] font-bold text-amber-300 border border-slate-700"
                title="Velocidad de reproducción"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>

              <button
                onClick={() => setActiveBook(null)}
                className="text-slate-400 hover:text-white p-1 font-bold text-xs"
                title="Cerrar reproductor"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Barra de Progreso del Capítulo */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                style={{ width: isPlaying ? '45%' : '10%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>04:20</span>
              <span>{activeBook.chapters[activeChapterIndex]?.duration || '10:00'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DE SUBIDA DE AUDIOLIBROS Y PODS PARA PROFESORES ──────────── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-6 relative my-8">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-amber-500/20">
                <Music className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Studio de l'Enseignant • Chargement du Contenu Sonore
                </span>
                <h2 className="text-xl font-bold text-white">Téléverser un Nouveau Livre Audio ou Pod Éducatif</h2>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Titre du Livre Audio / Pod *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex : Histoire & Géographie Orale de Guinée Équatoriale"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Catégorie / Matière *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Littérature & Légendes">Littérature & Légendes</option>
                    <option value="Sciences & Physique">Sciences & Physique</option>
                    <option value="Mathématiques & Arithmétique">Mathématiques & Arithmétique</option>
                    <option value="Histoire & Géographie">Histoire & Géographie</option>
                    <option value="Savoirs Numériques">Savoirs Numériques</option>
                    <option value="Formation Professionnelle">Formation Professionnelle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Narrateur / Voix *</label>
                  <input
                    type="text"
                    required
                    value={narrator}
                    onChange={(e) => setNarrator(e.target.value)}
                    placeholder="Ex : Prof. Carmen Ruiz Nchama"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Style Visuel de la Couverture</label>
                  <select
                    value={coverBg}
                    onChange={(e) => setCoverBg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="from-emerald-800 to-slate-950">Vert Émeraude (Nature)</option>
                    <option value="from-cyan-800 to-indigo-950">Bleu Cyan (Sciences & Physique)</option>
                    <option value="from-amber-800 to-orange-950">Ambre Chaleureux (Mathématiques)</option>
                    <option value="from-purple-800 to-slate-950">Pourpre Impérial (Histoire)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description Résumée pour les Élèves</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez ce que l'élève apprendra en écoutant ce livre audio ou pod..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Selector de Archivo MP3 Principal */}
              <div className="p-4 bg-slate-950 border border-dashed border-amber-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-amber-400" /> Charger le Fichier Audio MP3 / M4A (Local Hors-Ligne)
                  </span>
                  <label className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer border border-amber-500/30 transition-all flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Sélectionner MP3
                    <input
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav"
                      onChange={handleAudioFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {selectedAudioFile ? (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-between">
                    <span className="truncate">🎵 Fichier Sélectionné : {selectedAudioFile.name} ({selectedAudioFile.size})</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Vous pouvez sélectionner un fichier MP3 depuis votre appareil pour l'incorporer au livre audio ou pod éducatif.
                  </p>
                )}
              </div>

              {/* Lista y Adición de Capítulos */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Chapitres de la Piste Audio ({chapters.length})
                  </span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {chapters.map((ch, idx) => (
                    <div key={ch.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center justify-between">
                      <div className="truncate">
                        <span className="font-bold text-white block truncate">{ch.title}</span>
                        <span className="text-[10px] text-slate-400">Durée : {ch.duration}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveChapter(ch.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Supprimer le chapitre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="Titre du nouveau chapitre..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={newChapterDuration}
                    onChange={(e) => setNewChapterDuration(e.target.value)}
                    placeholder="10:00"
                    className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddChapter}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1 border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Envoyer à la Vérification Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
