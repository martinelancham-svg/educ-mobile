import React, { useState, useEffect } from 'react';
import {
  Star,
  Award,
  CheckCircle2,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  ThumbsUp,
  User,
  School,
  GraduationCap,
  Filter,
  ShieldCheck,
  Heart,
  Clock,
  Trash2,
  Edit3,
  ArrowLeft
} from 'lucide-react';

const INITIAL_TEACHERS = [
  {
    id: 't-1',
    name: 'Prof. Baltasar Nsue Ondo',
    title: 'Professeur de Mathématiques & Physique',
    level: 'Secondaire & Baccalauréat',
    location: 'Bata & UNGE (Río Muni)',
    avatarUrl: null,
    avgRating: 4.8,
    totalRatings: 34,
    subjects: ['Mathématiques', 'Physique', 'Algèbre'],
    tags: ['Explication Claire', 'Réponse Rapide', 'Exercices Utiles']
  },
  {
    id: 't-2',
    name: 'Dra. Solange Nguema Avomo',
    title: 'Enseignante en Sciences Naturelles & Biologie',
    level: 'Secondaire & FP',
    location: 'Malabo (Île de Bioko)',
    avatarUrl: null,
    avgRating: 4.9,
    totalRatings: 42,
    subjects: ['Biologie', 'Chimie', 'Écologie'],
    tags: ['Grande Pédagogie', 'Matériel PDF Excellent', 'Très Patient']
  },
  {
    id: 't-3',
    name: 'Prof. Carmen Ruiz Nchama',
    title: 'Spécialiste Pédagogique du Primaire',
    level: 'Primaire (1ère à 6ème)',
    location: 'Ebebiyín (Kié-Ntem)',
    avatarUrl: null,
    avgRating: 4.95,
    totalRatings: 56,
    subjects: ['Arithmétique', 'Lecture', 'Sciences de Base'],
    tags: ['Approche Aimable', 'Fiches Dynamiques', 'Attentif aux Enfants']
  },
  {
    id: 't-4',
    name: 'Ing. Manuel Obama Esono',
    title: 'Professeur de Technologies & Informatique',
    level: 'FP & Baccalauréat',
    location: 'Mongomo (Wele-Nzas)',
    avatarUrl: null,
    avgRating: 4.7,
    totalRatings: 28,
    subjects: ['Programmation', 'Bureautique', 'Électricité'],
    tags: ['Projets Pratiques', 'Grand Soutien', 'Innovant']
  }
];

const PREDEFINED_TAGS = [
  'Explique Très Bien',
  'Répond Rapide aux Questions',
  'Excellent Matériel PDF',
  'Très Patient et Aimable',
  'Ponctuel et Dévoué',
  'Exercices Clairs',
  'Inspirant et Motivant'
];

export const RateTeachersPage = ({ onBack }) => {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [userRatings, setUserRatings] = useState({});
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('rate'); // 'rate' | 'my-reviews'
  
  // Modal de calificación
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [ratingClarity, setRatingClarity] = useState(5);
  const [ratingAvailability, setRatingAvailability] = useState(5);
  const [ratingMaterial, setRatingMaterial] = useState(5);
  const [ratingEmpathy, setRatingEmpathy] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Cargar calificaciones guardadas en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('educ_teacher_ratings');
      if (saved) {
        setUserRatings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error al cargar calificaciones de localStorage', e);
    }
  }, []);

  // Guardar en localStorage
  const saveRatings = (newRatings) => {
    setUserRatings(newRatings);
    try {
      localStorage.setItem('educ_teacher_ratings', JSON.stringify(newRatings));
    } catch (e) {
      console.error('Error al guardar calificaciones en localStorage', e);
    }
  };

  const handleOpenRatingModal = (teacher) => {
    const existing = userRatings[teacher.id];
    setSelectedTeacher(teacher);
    if (existing) {
      setRatingClarity(existing.clarity || 5);
      setRatingAvailability(existing.availability || 5);
      setRatingMaterial(existing.material || 5);
      setRatingEmpathy(existing.empathy || 5);
      setSelectedTags(existing.tags || []);
      setComment(existing.comment || '');
      setIsAnonymous(existing.isAnonymous || false);
    } else {
      setRatingClarity(5);
      setRatingAvailability(5);
      setRatingMaterial(5);
      setRatingEmpathy(5);
      setSelectedTags(['¡Explica Súper Bien!']);
      setComment('');
      setIsAnonymous(false);
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    const overallScore = Number(
      ((ratingClarity + ratingAvailability + ratingMaterial + ratingEmpathy) / 4).toFixed(1)
    );

    const newRatingData = {
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      teacherTitle: selectedTeacher.title,
      overallScore,
      clarity: ratingClarity,
      availability: ratingAvailability,
      material: ratingMaterial,
      empathy: ratingEmpathy,
      tags: selectedTags,
      comment: comment.trim(),
      isAnonymous,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updatedUserRatings = {
      ...userRatings,
      [selectedTeacher.id]: newRatingData
    };

    saveRatings(updatedUserRatings);

    // Actualizar conteo de opiniones locales
    setTeachers(prev => prev.map(t => {
      if (t.id === selectedTeacher.id) {
        const hasPrevious = !!userRatings[t.id];
        const newCount = hasPrevious ? t.totalRatings : t.totalRatings + 1;
        return {
          ...t,
          totalRatings: newCount
        };
      }
      return t;
    }));

    setToastMsg(`¡Tu calificación para ${selectedTeacher.name} ha sido guardada exitosamente!`);
    setSelectedTeacher(null);
    setTimeout(() => setToastMsg(''), 4500);
  };

  const handleDeleteRating = (teacherId) => {
    const updated = { ...userRatings };
    delete updated[teacherId];
    saveRatings(updated);
    setToastMsg('La valoración fue eliminada correctamente.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Filtrar profesores
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesLevel = filterLevel === 'all' || t.level.toLowerCase().includes(filterLevel.toLowerCase());
    return matchesSearch && matchesLevel;
  });

  const ratingsCount = Object.keys(userRatings).length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-16">
      
      {/* BOTÓN DE RETROCEDER / VOLVER */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Retour</span>
          </button>
        </div>
      )}

      {/* BANNER PRINCIPAL */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-400/20 shrink-0 mt-1 md:mt-0">
              <Star className="w-7 h-7 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  Évaluation Enseignante • EDUC-EG
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 100% Confidentiel
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Évaluer mes Enseignants
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                Évaluez la clarté pédagogique, la remise de matériels et l'attention de vos enseignants en Guinée Équatoriale. Vos commentaires aident à élever la qualité éducative.
              </p>
            </div>
          </div>

          {/* Tarjeta de Estadísticas de Calificaciones */}
          <div className="flex items-center gap-4 bg-slate-950/90 p-4 rounded-2xl border border-emerald-500/40 shadow-xl shrink-0 self-stretch md:self-auto min-w-[240px]">
            <div className="text-center flex-1 px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Évalués</span>
              <strong className="text-lg font-black text-emerald-400 block whitespace-nowrap">{ratingsCount} Enseignants</strong>
            </div>
            <div className="text-center flex-1 px-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Moyenne Donnée</span>
              <strong className="text-lg font-black text-amber-400 flex items-center justify-center gap-1 whitespace-nowrap">
                <Star className="w-4.5 h-4.5 fill-amber-400" />
                {ratingsCount > 0
                  ? (Object.values(userRatings).reduce((acc, curr) => acc + curr.overallScore, 0) / ratingsCount).toFixed(1)
                  : '5.0'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST DE NOTIFICACIÓN */}
      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-3 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓN Y FILTROS */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
        
        {/* Pestañas de Vista */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('rate')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'rate'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${activeTab === 'rate' ? 'fill-slate-950' : ''}`} />
            Catalogue des Enseignants
          </button>
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'my-reviews'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            Mes Évaluations ({ratingsCount})
          </button>
        </div>

        {/* Buscador & Filtro por Nivel */}
        {activeTab === 'rate' && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou matière..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full sm:w-auto bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Tous les Niveaux</option>
                <option value="Primaria">Primaire (1ère-6ème)</option>
                <option value="ESO">Secondaire</option>
                <option value="Bachillerato">Baccalauréat</option>
                <option value="FP">Formation Professionnelle (FP)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* CONTENIDO 1: CATÁLOGO DE PROFESORES */}
      {activeTab === 'rate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTeachers.map((teacher) => {
            const hasUserRated = !!userRatings[teacher.id];
            const userRating = userRatings[teacher.id];

            return (
              <div
                key={teacher.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-xl hover:shadow-2xl relative overflow-hidden group"
              >
                {/* Insignia de Calificado */}
                {hasUserRated && (
                  <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Évalué ({userRating.overallScore} ★)
                  </div>
                )}

                <div>
                  {/* Info Docente */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black text-xl flex items-center justify-center border-2 border-emerald-400/40 shadow-lg shrink-0">
                      {teacher.name.charAt(6) || 'P'}
                    </div>

                    <div className="pr-16">
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{teacher.title}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2.5 py-0.5 rounded-lg border border-slate-700/80 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-emerald-400" /> {teacher.level}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-lg border border-slate-700/80">
                          📍 {teacher.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Materias */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Matières Enseignées:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.map((sub, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Puntuación General y Etiquetas Comunidad */}
                  <div className="mt-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-sm font-black ml-1 text-white">{teacher.avgRating}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">({teacher.totalRatings} évaluations)</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>Enseignant Vedette</span>
                    </div>
                  </div>
                </div>

                {/* Botón de Acción */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  {hasUserRated ? (
                    <button
                      onClick={() => handleOpenRatingModal(teacher)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-emerald-400" />
                      Modifier mon Évaluation
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenRatingModal(teacher)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02] cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-slate-950" />
                      Évaluer cet Enseignant
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENIDO 2: MIS VALORACIONES ENVIADAS */}
      {activeTab === 'my-reviews' && (
        <div className="space-y-4">
          {ratingsCount === 0 ? (
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-12 text-center max-w-lg mx-auto">
              <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Vous n'avez pas encore évalué d'enseignant</h3>
              <p className="text-xs text-slate-400 mt-1">
                Explorez la liste des enseignants et partagez votre avis sur leur méthode d'enseignement.
              </p>
              <button
                onClick={() => setActiveTab('rate')}
                className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer hover:bg-emerald-400 transition-colors shadow-lg"
              >
                Voir la Liste des Enseignants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(userRatings).map((rating) => (
                <div
                  key={rating.teacherId}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl relative"
                >
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{rating.teacherName}</h3>
                      <p className="text-xs text-slate-400">{rating.teacherTitle}</p>
                    </div>
                    <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black px-3 py-1 rounded-xl text-sm flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {rating.overallScore} / 5
                    </div>
                  </div>

                  {/* Criterios evaluados */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Clarté Explicative</span>
                      <strong className="text-emerald-400 font-extrabold">{rating.clarity} / 5 ★</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Attentive aux Questions</span>
                      <strong className="text-emerald-400 font-extrabold">{rating.availability} / 5 ★</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Support Pédagogique</span>
                      <strong className="text-emerald-400 font-extrabold">{rating.material} / 5 ★</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Empathie & Contact</span>
                      <strong className="text-emerald-400 font-extrabold">{rating.empathy} / 5 ★</strong>
                    </div>
                  </div>

                  {/* Etiquetas seleccionadas */}
                  {rating.tags && rating.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rating.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comentario escrito */}
                  {rating.comment && (
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs italic text-slate-300">
                      "{rating.comment}"
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                    <span>Évalué le: {rating.date}</span>
                    <button
                      onClick={() => handleDeleteRating(rating.teacherId)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE CALIFICACIÓN INTERACTIVO */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Formulaire d'Évaluation
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedTeacher.name}</h2>
                <p className="text-xs text-slate-400">{selectedTeacher.title}</p>
              </div>

              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-5">
              
              {/* 1. Claridad Explicativa */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300 font-bold">1. Clarté des Explications & Cours:</label>
                  <span className="text-amber-400 font-black">{ratingClarity} / 5 ★</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingClarity(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingClarity
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Atención y Respuesta a Dudas */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300 font-bold">2. Disponibilité et Réponses aux Questions:</label>
                  <span className="text-amber-400 font-black">{ratingAvailability} / 5 ★</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingAvailability(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingAvailability
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Calidad del Material Didáctico */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300 font-bold">3. Qualité des Supports et PDF Pédagogiques:</label>
                  <span className="text-amber-400 font-black">{ratingMaterial} / 5 ★</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingMaterial(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingMaterial
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Trato & Empatía */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300 font-bold">4. Empathie et Respect Pédagogique:</label>
                  <span className="text-amber-400 font-black">{ratingEmpathy} / 5 ★</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingEmpathy(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingEmpathy
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Selección de Etiquetas */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-300 font-bold block">
                  Sélectionnez les qualités remarquables:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PREDEFINED_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow-md'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comentario Adicional */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-bold block">
                  Commentaire ou suggestion constructive (Optionnel):
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Écrivez ici votre avis sur les explications ou l'aide reçue..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Opción Anónima */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-slate-300 cursor-pointer">
                  Envoyer cette évaluation de manière <strong>Anonyme</strong>
                </label>
              </div>

              {/* Botones de Envío */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTeacher(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  Enregistrer l'Évaluation
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default RateTeachersPage;
