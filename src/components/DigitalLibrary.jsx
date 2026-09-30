import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DocumentReaderModal } from './DocumentReaderModal';
import {
  Library,
  BookOpen,
  FileText,
  Newspaper,
  Presentation,
  Video,
  Headphones,
  GraduationCap,
  Search,
  Filter,
  Download,
  Eye,
  PlayCircle,
  Volume2,
  CheckCircle2,
  Tag,
  Star,
  Sparkles,
  X,
  FileDown,
  PlusCircle,
  Upload,
  UserCheck,
  Award
} from 'lucide-react';

export const RESOURCE_TYPES = [
  { id: 'all', name: 'Toutes les Ressources', icon: Library, color: 'emerald' },
  { id: 'libro', name: 'Livres Numériques', icon: BookOpen, color: 'blue' },
  { id: 'pdf', name: 'Guides PDF', icon: FileText, color: 'teal' },
  { id: 'articulo', name: 'Articles Éducatifs', icon: Newspaper, color: 'indigo' },
  { id: 'presentacion', name: 'Présentations PPT', icon: Presentation, color: 'amber' },
  { id: 'video', name: 'Vidéos Éducatives', icon: Video, color: 'rose' },
  { id: 'audio', name: 'Audio & Livres Audio', icon: Headphones, color: 'purple' },
  { id: 'academico', name: 'Documents Académiques', icon: GraduationCap, color: 'cyan' }
];

export const EDUCATION_LEVELS = [
  'Tous les Niveaux',
  'Primaire (1ère à 6ème)',
  'Secondaire Obligatoire',
  'Baccalauréat & Sélectivité',
  'Formation Professionnelle (FP)',
  'Université UNGE'
];

export const SUBJECTS = [
  'Toutes les Matières',
  'Mathématiques & Algèbre',
  'Physique & Chimie',
  'Biologie & SVT',
  'Technologie & FP Informatique',
  'Langue, Littérature & Histoire'
];

export const INITIAL_LIBRARY_RESOURCES = [
  {
    id: 'res-1',
    title: 'Livre Officiel de Mathématiques 4ème Secondaire & Baccalauréat',
    type: 'libro',
    typeName: 'Livre Numérique',
    level: 'Secondaire Obligatoire',
    subject: 'Mathématiques & Algèbre',
    author: 'Ministère de l\'Éducation, de la Science et des Sports GNQ',
    description: 'Manuel complet avec explications théoriques, exercices résolus et théorèmes d\'algèbre, fonctions et géométrie.',
    sizeMB: '14.2 MB',
    pages: 280,
    downloads: 1420,
    rating: 4.9,
    tags: ['#Mathématiques', '#Secondaire', '#LivreOfficiel'],
    pdfUrl: 'Guia_Matematicas_ESO_UNGE.pdf'
  },
  {
    id: 'res-2',
    title: 'Sujets d\'Examen et Corrigés Sélectivité UNGE 2025/2026',
    type: 'academico',
    typeName: 'Document Académique',
    level: 'Baccalauréat & Sélectivité',
    subject: 'Mathématiques & Algèbre',
    author: 'Commission d\'Évaluation UNGE (Malabo & Bata)',
    description: 'Recueil officiel des examens d\'accès à l\'Université Nationale de Guinée Équatoriale avec corrigés étape par étape.',
    sizeMB: '6.5 MB',
    pages: 45,
    downloads: 2310,
    rating: 5.0,
    tags: ['#Sélectivité', '#UNGE', '#ExamensOfficiels'],
    pdfUrl: 'Selectividad_UNGE_Modelos_Resueltos.pdf'
  },
  {
    id: 'res-3',
    title: 'Physique Moderne: Lois de Newton & Principes de la Thermodynamique',
    type: 'presentacion',
    typeName: 'Présentation PPT',
    level: 'Baccalauréat & Sélectivité',
    subject: 'Physique & Chimie',
    author: 'Prof. Baltasar Nsue Ondo',
    description: 'Diapositives illustrées pour étudier la dynamique, les vecteurs, la vitesse et la conservation de l\'énergie.',
    sizeMB: '8.1 MB',
    pages: 62,
    downloads: 890,
    rating: 4.8,
    tags: ['#Physique', '#Newton', '#Diapositives'],
    pdfUrl: 'Presentacion_Fisica_Newton_UNGE.pdf'
  },
  {
    id: 'res-4',
    title: 'Guide Pratique de Réactions Chimiques & Loi d\'Ohm',
    type: 'pdf',
    typeName: 'Guide PDF',
    level: 'Secondaire Obligatoire',
    subject: 'Physique & Chimie',
    author: 'Dra. Solange Nguema Avomo',
    description: 'Guide résumé au format PDF idéal pour étudier sans connexion avec schémas visuels et tableaux périodiques.',
    sizeMB: '3.8 MB',
    pages: 28,
    downloads: 1150,
    rating: 4.9,
    tags: ['#Chimie', '#Réactions', '#GuidePDF'],
    pdfUrl: 'Guia_Quimica_Reacciones_Ohm.pdf'
  },
  {
    id: 'res-5',
    title: 'Cours Magistral Vidéo: Résolution d\'Équations du 2nd Degré',
    type: 'video',
    typeName: 'Vidéo Éducative',
    level: 'Secondaire Obligatoire',
    subject: 'Mathématiques & Algèbre',
    author: 'Prof. Jean-Paul Mbarga',
    description: 'Tutoriel vidéo haute définition compressé avec exemples pratiques étape par étape pour maîtriser le discriminant.',
    sizeMB: '45.0 MB',
    duration: '18 min',
    downloads: 3100,
    rating: 4.9,
    tags: ['#TutorielVideo', '#Equations', '#EtapeParEtape'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'res-6',
    title: 'Audiolibro Resumen: Historia & Geografía Regional de África Central',
    type: 'audio',
    typeName: 'Audio & Audiolibro',
    level: 'Primaria (1° a 6°)',
    subject: 'Lengua, Literatura & Historia',
    author: 'Prof. Carmen Ruiz Nchama',
    description: 'Resumen narrado en voz clara y comprensible sobre la historia, relieve y biodiversidad de la región de Río Muni y la Isla de Bioko.',
    sizeMB: '12.4 MB',
    duration: '25 min',
    downloads: 1850,
    rating: 4.7,
    tags: ['#Audiobook', '#Historia', '#GuineaEcuatorial'],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'res-7',
    title: 'Artículo de Investigación: Agroecología y Cultivo Sostenible en Guinea Ecuatorial',
    type: 'articulo',
    typeName: 'Artículo Educativo',
    level: 'Formación Profesional (FP)',
    subject: 'Biología & Ciencias Naturales',
    author: 'Instituto Politécnico de Bata & UNGE',
    description: 'Artículo sobre técnicas agroecológicas adaptadas al clima tropical húmedo de África Central para estudiantes de FP Agrícola.',
    sizeMB: '2.1 MB',
    pages: 14,
    downloads: 640,
    rating: 4.8,
    tags: ['#Agroecología', '#Investigación', '#FPAgrícola'],
    pdfUrl: 'Articulo_Agroecologia_GNQ.pdf'
  },
  {
    id: 'res-8',
    title: 'Manual de FP Técnica: Redes de Ordenadores & Mantenimiento Informático',
    type: 'libro',
    typeName: 'Livre Numérique',
    level: 'Formación Profesional (FP)',
    subject: 'Tecnología & FP Informática',
    author: 'Centro de FP Técnica de Ebebiyín',
    description: 'Libro completo sobre arquitectura de redes TCP/IP, montaje de servidores comunitarios y mantenimiento físico de equipos PC.',
    sizeMB: '18.9 MB',
    pages: 310,
    downloads: 980,
    rating: 4.9,
    tags: ['#Redes', '#FPInformática', '#Servidores'],
    pdfUrl: 'Manual_FP_Redes_Sistemas.pdf'
  }
];

export const DigitalLibrary = () => {
  const { user, activeRole } = useAuth();

  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('educ_library_resources');
    return saved ? JSON.parse(saved) : INITIAL_LIBRARY_RESOURCES;
  });

  useEffect(() => {
    localStorage.setItem('educ_library_resources', JSON.stringify(resources));
  }, [resources]);

  // Estados del Buscador Avanzado y Filtros Cruzados
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('Tous les Niveaux');
  const [selectedSubject, setSelectedSubject] = useState('Toutes les Matières');
  const [selectedTag, setSelectedTag] = useState(null);

  // Estado del Modal de Lectura e Inspección Multimedia
  const [readerDoc, setReaderDoc] = useState(null);
  const [activeMediaResource, setActiveMediaResource] = useState(null);
  const [downloadToast, setDownloadToast] = useState('');

  // Estado del Modal de Subida para Profesores / Admin
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('pdf');
  const [newLevel, setNewLevel] = useState('Baccalauréat & Sélectivité');
  const [newSubject, setNewSubject] = useState('Mathématiques & Algèbre');
  const [newAuthor, setNewAuthor] = useState(user?.name || 'Profesor Verificado');
  const [newDescription, setNewDescription] = useState('');
  const [newSize, setNewSize] = useState('4.5 MB');
  const [newPages, setNewPages] = useState('36');
  const [newTagsStr, setNewTagsStr] = useState('#Educacion, #Offline, #UNGE');

  const [favResourceIds, setFavResourceIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('educ_favorite_resource_ids') || '["res-1", "res-2"]');
    } catch (e) {
      return ['res-1', 'res-2'];
    }
  });

  useEffect(() => {
    localStorage.setItem('educ_favorite_resource_ids', JSON.stringify(favResourceIds));
  }, [favResourceIds]);

  const toggleFavoriteResource = (resId) => {
    setFavResourceIds(prev => {
      const isFav = prev.includes(resId);
      const updated = isFav ? prev.filter(id => id !== resId) : [...prev, resId];
      setDownloadToast(isFav ? 'Quitado de favoritos' : '⭐ ¡Añadido a tus Favoritos! Puedes verlo en tu Perfil Personal.');
      setTimeout(() => setDownloadToast(''), 3500);
      return updated;
    });
  };

  // Colección de todos los tags únicos para filtrado rápido
  const allTags = Array.from(new Set(resources.flatMap(r => r.tags || [])));

  // Algoritmo del Buscador Avanzado en Tiempo Real
  const filteredResources = resources.filter(res => {
    const matchesType = selectedType === 'all' || res.type === selectedType;
    const matchesLevel = selectedLevel === 'Todos los Niveles' || res.level === selectedLevel;
    const matchesSubject = selectedSubject === 'Todas las Asignaturas' || res.subject === selectedSubject;
    const matchesTag = !selectedTag || (res.tags && res.tags.includes(selectedTag));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      res.title.toLowerCase().includes(q) ||
      res.author.toLowerCase().includes(q) ||
      res.description.toLowerCase().includes(q) ||
      res.typeName.toLowerCase().includes(q) ||
      (res.tags && res.tags.some(t => t.toLowerCase().includes(q)))
    );

    return matchesType && matchesLevel && matchesSubject && matchesTag && matchesSearch;
  });

  // Abrir lector de PDF/Documento
  const handleOpenReader = (res) => {
    setReaderDoc({
      title: res.title,
      name: res.pdfUrl || `${res.title}.pdf`,
      targetLevel: res.level,
      author: res.author,
      totalPages: res.pages || 32
    });
  };

  // Simulación de Descarga Offline
  const handleDownloadResource = (resTitle) => {
    setDownloadToast(`¡Guardando "${resTitle}" en IndexedDB para acceso offline!`);
    setTimeout(() => setDownloadToast(''), 4000);
  };

  // Publicar Nuevo Recurso por Profesor / Admin
  const handlePublishResource = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const typeObj = RESOURCE_TYPES.find(t => t.id === newType) || RESOURCE_TYPES[2];
    const parsedTags = newTagsStr.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`).filter(Boolean);

    const createdResource = {
      id: `res-${Date.now()}`,
      title: newTitle,
      type: newType,
      typeName: typeObj.name,
      level: newLevel,
      subject: newSubject,
      author: newAuthor || (user?.name ? `${user.name} (Profesor)` : 'Profesor Verificado'),
      description: newDescription || 'Nuevo material educativo publicado para estudio offline.',
      sizeMB: newSize || '3.5 MB',
      pages: Number(newPages) || 24,
      downloads: 1,
      rating: 5.0,
      tags: parsedTags.length > 0 ? parsedTags : ['#Educacion', '#Profesor'],
      pdfUrl: `${newTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    };

    setResources(prev => [createdResource, ...prev]);

    // Resetear modal
    setNewTitle('');
    setNewDescription('');
    setShowUploadModal(false);

    setDownloadToast(`¡Recurso "${newTitle}" publicado exitosamente en la Biblioteca Digital!`);
    setTimeout(() => setDownloadToast(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Encabezado Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 inline-flex items-center gap-1.5">
              <Library className="w-3.5 h-3.5 text-amber-300" /> Dépôt Multimédia Central
            </span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              🟢 {resources.length} Ressources Hors-Ligne
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Bibliothèque Numérique Éducative</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Accédez aux manuels, PDFs, articles, présentations, vidéos, audios et documents académiques officiels sans connexion internet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 self-stretch md:self-auto">
          {/* Botón de Subida para Profesores y Administradores */}
          {(activeRole === 'teacher' || activeRole === 'admin') && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer border border-amber-300/40"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              Publier une Nouvelle Ressource dans la Bibliothèque
            </button>
          )}

          <div className="bg-slate-900/90 p-3 px-4 rounded-2xl border border-indigo-500/30 text-right space-y-0.5 hidden sm:block">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Ressources en Cache</span>
            <span className="text-lg font-black text-amber-400 flex items-center justify-end gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" /> 100% Offline
            </span>
          </div>
        </div>
      </div>

      {downloadToast && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* ─── NAVEGADOR Y FILTRO DE FORMATOS MULTIMEDIA (8 TIPOS) ─────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {RESOURCE_TYPES.map((typeObj) => {
          const IconComp = typeObj.icon;
          const isSelected = selectedType === typeObj.id;
          const count = typeObj.id === 'all'
            ? resources.length
            : resources.filter(r => r.type === typeObj.id).length;

          return (
            <button
              key={typeObj.id}
              onClick={() => setSelectedType(typeObj.id)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2.5 ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-xl scale-[1.03]'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400'
              }`}>
                <IconComp className="w-4 h-4" />
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-bold block line-clamp-1 leading-tight">
                  {typeObj.name}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block ${
                  isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── SECCIÓN DEL BUSCADOR AVANZADO CON FILTROS CRUZADOS ─────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Moteur de Recherche Avancé & Filtres de Contenu</span>
          </div>

          {(searchQuery || selectedType !== 'all' || selectedLevel !== 'Todos los Niveles' || selectedSubject !== 'Todas las Asignaturas' || selectedTag) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedLevel('Todos los Niveles');
                setSelectedSubject('Todas las Asignaturas');
                setSelectedTag(null);
              }}
              className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
            >
              Réinitialiser les Filtres
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Campo de búsqueda principal */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, auteur, sujet, mots-clés..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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

          {/* Filtro de Nivel Educativo */}
          <div className="md:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
            >
              {EDUCATION_LEVELS.map((lvl, idx) => (
                <option key={idx} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Filtro de Asignatura */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
            >
              {SUBJECTS.map((subj, idx) => (
                <option key={idx} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Píldoras de Tags en la Biblioteca */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-400" /> Tags Populaires:
            </span>
            {allTags.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors shrink-0 ${
                  selectedTag === t
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── GRID RESULTADOS DE RECURSOS EDUCATIVOS ─────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Mostrando <strong className="text-white">{filteredResources.length}</strong> recursos educativos encontrados</span>
          <span className="text-emerald-400 font-semibold">🟢 Formato Libre de Conexión</span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
            <Library className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No se encontraron recursos con los criterios especificados</h3>
            <p className="text-xs max-w-md mx-auto">Prueba cambiando los términos de búsqueda o restableciendo los filtros de nivel y asignatura.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedLevel('Todos los Niveles');
                setSelectedSubject('Todas las Asignaturas');
                setSelectedTag(null);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              
              // Icono por Tipo
              let IconComp = BookOpen;
              if (res.type === 'pdf') IconComp = FileText;
              if (res.type === 'articulo') IconComp = Newspaper;
              if (res.type === 'presentacion') IconComp = Presentation;
              if (res.type === 'video') IconComp = Video;
              if (res.type === 'audio') IconComp = Headphones;
              if (res.type === 'academico') IconComp = GraduationCap;

              return (
                <div
                  key={res.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-700/80 p-5 space-y-4 hover:border-indigo-500/60 transition-all flex flex-col justify-between shadow-xl group hover:shadow-indigo-500/10"
                >
                  <div className="space-y-3">
                    
                    {/* Header de la tarjeta con tipo y nivel */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                        <IconComp className="w-3 h-3 text-amber-300" />
                        {res.typeName}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavoriteResource(res.id); }}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            favResourceIds.includes(res.id)
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                          title={favResourceIds.includes(res.id) ? 'Quitar de Favoritos' : 'Guardar en Favoritos de Perfil'}
                        >
                          <Star className={`w-3.5 h-3.5 ${favResourceIds.includes(res.id) ? 'fill-amber-400' : ''}`} />
                        </button>

                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                          {res.sizeMB || res.duration}
                        </span>
                      </div>
                    </div>

                    {/* Título y Autor */}
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                        {res.title}
                      </h3>
                      <p className="text-xs text-amber-300/90 font-semibold flex items-center gap-1">
                        Par: {res.author}
                      </p>
                    </div>

                    {/* Descripción */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {res.description}
                    </p>

                    {/* Tags */}
                    {res.tags && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {res.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Acciones de Lector / Reproducción / Descarga */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Nivel: <strong className="text-slate-200">{res.level}</strong></span>
                      <span className="text-amber-400 font-bold">⭐ {res.rating}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      
                      {/* Botón Lector PDF/Doc o Reproductor de Vídeo/Audio */}
                      {res.type === 'video' || res.type === 'audio' ? (
                        <button
                          onClick={() => setActiveMediaResource(res)}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20 transition-all"
                        >
                          {res.type === 'video' ? <PlayCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          {res.type === 'video' ? 'Reproducir Vídeo' : 'Escuchar Audio'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenReader(res)}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                        >
                          <Eye className="w-4 h-4 text-slate-950" /> Leer Documento
                        </button>
                      )}

                      {/* Botón Guardar Offline */}
                      <button
                        onClick={() => handleDownloadResource(res.title)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold cursor-pointer transition-colors"
                        title="Guardar Offline"
                      >
                        <FileDown className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── MODAL DE SUBIDA DE RECURSOS PARA PROFESORES & ADMIN ─────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Upload className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">Publication Enseignant</span>
                <h3 className="text-base font-bold text-white">Téléverser une Nouvelle Ressource dans la Bibliothèque Numérique</h3>
              </div>
            </div>

            <form onSubmit={handlePublishResource} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Titre de la Ressource Éducative *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Guide Officiel de Sélectivité UNGE 2026 Corrigé"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Format / Type de Ressource *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="libro">📚 Livre Numérique</option>
                    <option value="pdf">📄 Guide PDF</option>
                    <option value="articulo">📰 Article Éducatif</option>
                    <option value="presentacion">📊 Présentation PPT</option>
                    <option value="video">🎥 Vidéo Éducative</option>
                    <option value="audio">🎧 Audio & Livre Audio</option>
                    <option value="academico">🎓 Document Académique</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Niveau Éducatif Destiné *</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Primaria (1° a 6°)">Primaire (1ère à 6ème)</option>
                    <option value="Secundaria Obligatoria (ESO)">Secondaire Obligatoire</option>
                    <option value="Bachillerato & Selectividad">Baccalauréat & Sélectivité</option>
                    <option value="Formación Profesional (FP)">Formation Professionnelle (FP)</option>
                    <option value="Universidad UNGE">Université UNGE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Discipline / Matière *</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Matemáticas & Álgebra">Mathématiques & Algèbre</option>
                    <option value="Física & Química">Physique & Chimie</option>
                    <option value="Biología & Ciencias Naturales">Biologie & Sciences Naturelles</option>
                    <option value="Tecnología & FP Informática">Technologie & Informatique</option>
                    <option value="Lengua, Literatura & Historia">Langue, Littérature & Histoire</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Nom de l'Enseignant / Auteur *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Description et Résumé Éducatif *</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Détaillez le sujet de cette ressource et ce que les élèves apprendront..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Taille (MB)</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Ex : 5.2 MB"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Nbre de Pages</label>
                  <input
                    type="number"
                    value={newPages}
                    onChange={(e) => setNewPages(e.target.value)}
                    placeholder="Ex : 36"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Étiquettes (Mots-clés)</label>
                  <input
                    type="text"
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                    placeholder="Séparées par des virgules"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Carga de Archivo PDF / Documento / Multimedia */}
              <label htmlFor="file-upload-library" className="block p-4 bg-slate-950 hover:bg-slate-900 border border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl text-center space-y-1 cursor-pointer transition-all">
                <input
                  type="file"
                  id="file-upload-library"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.mp3,.mp4"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewTitle(prev => prev || file.name.replace(/\.[^/.]+$/, ""));
                      setNewSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                      setDownloadToast(`📎 Fichier "${file.name}" sélectionné avec succès.`);
                      setTimeout(() => setDownloadToast(''), 4000);
                    }
                  }}
                />
                <Upload className="w-6 h-6 text-amber-400 mx-auto" />
                <p className="text-xs font-bold text-white">📎 Clic ici pour Joindre un Fichier (PDF, PPT, MP3, MP4)</p>
                <p className="text-[10px] text-slate-400">Il sera automatiquement enregistré dans le stockage hors-ligne IndexedDB de la plateforme</p>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" /> Publicar en Biblioteca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL REPRODUCTOR DE VÍDEO / AUDIO ─────────── */}
      {activeMediaResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveMediaResource(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                {activeMediaResource.type === 'video' ? <Video className="w-5 h-5 text-rose-400" /> : <Headphones className="w-5 h-5 text-purple-400" />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300">{activeMediaResource.typeName}</span>
                <h3 className="text-base font-bold text-white">{activeMediaResource.title}</h3>
              </div>
            </div>

            {/* Elemento de Vídeo o Audio */}
            {activeMediaResource.type === 'video' ? (
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
                <video controls className="w-full h-full object-cover">
                  <source src={activeMediaResource.videoUrl} type="video/mp4" />
                  Tu navegador no soporta la reproducción de vídeo offline.
                </video>
              </div>
            ) : (
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 text-center">
                <Headphones className="w-12 h-12 text-purple-400 mx-auto animate-bounce" />
                <audio controls className="w-full">
                  <source src={activeMediaResource.audioUrl} type="audio/mp3" />
                  Tu navegador no soporta el reproductor de audio offline.
                </audio>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
              <span>Autor: <strong className="text-slate-200">{activeMediaResource.author}</strong></span>
              <button
                onClick={() => handleDownloadResource(activeMediaResource.title)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" /> Guardar Offline ({activeMediaResource.sizeMB})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL LECTOR DE DOCUMENTOS PDF ─────────── */}
      <DocumentReaderModal
        isOpen={!!readerDoc}
        onClose={() => setReaderDoc(null)}
        document={readerDoc}
      />

    </div>
  );
};
