import React, { useState } from 'react';
import { INITIAL_CATEGORIES } from '../../data/initialMockData';
import { CourseCard } from '../../components/CourseCard';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { Search, Filter, Sprout, HeartPulse, Zap, Calculator, Smartphone, BookOpen, HardDrive, School, GraduationCap, Award, Briefcase } from 'lucide-react';

const ICON_MAP = {
  BookOpen: BookOpen,
  School: School,
  GraduationCap: GraduationCap,
  Award: Award,
  Briefcase: Briefcase,
  Sprout: Sprout,
  HeartPulse: HeartPulse,
  Zap: Zap,
  Calculator: Calculator,
  Smartphone: Smartphone
};

export const CourseCatalog = ({ onOpenCourse, initialTab = 'catalog' }) => {
  const { courses } = useAuth();
  const { offlineDownloads, isEffectiveOffline } = useOffline();

  const getInitialCategory = (tab) => {
    if (tab === 'primaria-courses') return 'primaria';
    if (tab === 'eso-courses') return 'eso';
    if (tab === 'bachillerato-courses') return 'bachillerato';
    if (tab === 'fp-courses') return 'fp';
    if (tab === 'math-physics-courses') return 'math-physics';
    return 'all';
  };

  const [selectedCategory, setSelectedCategory] = useState(() => getInitialCategory(initialTab));
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOfflineDownloaded, setOnlyOfflineDownloaded] = useState(false);

  React.useEffect(() => {
    setSelectedCategory(getInitialCategory(initialTab));
  }, [initialTab]);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isDownloaded = offlineDownloads.some(d => d.courseId === course.id);
    const matchesDownloaded = !onlyOfflineDownloaded || isDownloaded;
    
    return matchesCategory && matchesSearch && matchesDownloaded;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Compacto - Guinea Ecuatorial */}
      <div className="relative rounded-2xl overflow-hidden p-4 md:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Classes Rurales Hors-Ligne
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              100% Hors-Ligne • 2G/3G
            </span>
          </div>

          <h1 className="text-base md:text-xl font-extrabold text-white tracking-tight leading-snug">
            Apprenez sans limites d'internet en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Guinée Équatoriale</span>
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed">
            Téléchargez des leçons complètes pour Malabo, Bata, Oyala, Ebebiyín et les zones rurales. Étudiez sans consommer de données mobiles.
          </p>
        </div>

        {/* Indicadores Compactos */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Accès</span>
            <strong className="text-xs font-black text-emerald-400">100% Hors-Ligne</strong>
          </div>
          <div className="bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Données</span>
            <strong className="text-xs font-black text-amber-300">0 Mégaoctets</strong>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        
        {/* Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {INITIAL_CATEGORIES.map(cat => {
            const IconComponent = ICON_MAP[cat.icon] || BookOpen;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Buscador y Toggle de Descargados */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un cours ou un sujet..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setOnlyOfflineDownloaded(!onlyOfflineDownloaded)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyOfflineDownloaded
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Afficher uniquement les cours enregistrés dans le stockage de l'appareil"
          >
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Enregistrés</span>
          </button>
        </div>
      </div>

      {/* Grid de Cursos */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-slate-700/60">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Aucun cours trouvé</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Essayez de modifier les termes de recherche ou de sélectionner une autre catégorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onOpenCourse={onOpenCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};
