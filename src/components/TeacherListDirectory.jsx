import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Search,
  Filter,
  UserCheck,
  Building,
  Phone,
  Mail,
  BookOpen,
  CheckCircle2,
  XCircle,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  MessageCircle,
  FileText
} from 'lucide-react';

export const INITIAL_REGISTERED_TEACHERS = [
  {
    id: 'tch-101',
    name: 'Prof. Baltasar Nsue Ondo',
    email: 'profesor@educ-eg.org',
    phoneNumber: '+240 222 99 88 77',
    licenseNumber: 'LIC-ED-88420-GNQ',
    specialty: 'Mathématiques, Physique et Sciences ESO / ESBA',
    schoolName: 'Institut Polytéchnique de Bata & UNGE',
    country: 'Guinée Équatoriale (Bata / Malabo)',
    experienceYears: '12 ans',
    approvalStatus: 'Approved',
    coursesCount: 4,
    rating: '4.9 ⭐',
    bio: 'Enseignant titulaire de Mathématiques et Physique avec une vaste expérience en formation technique et Sélectivité UNGE.'
  },
  {
    id: 'tch-102',
    name: 'Prof. Isabel Carmen Avomo',
    email: 'isabel.avomo@educ-eg.org',
    phoneNumber: '+240 222 44 33 22',
    licenseNumber: 'LIC-ED-99120-GNQ',
    specialty: 'Langue Espagnole, Littérature & Philologie',
    schoolName: 'Lycée National Rey Malabo',
    country: 'Guinée Équatoriale (Malabo)',
    experienceYears: '8 ans',
    approvalStatus: 'Approved',
    coursesCount: 3,
    rating: '4.8 ⭐',
    bio: 'Spécialiste en Grammaire, Syntaxe et Expression Écrite pour le Secondaire et le Baccalauréat.'
  },
  {
    id: 'tch-103',
    name: 'Prof. Juan Pedro Mangue',
    email: 'juan.mangue@educ-eg.org',
    phoneNumber: '+240 222 11 55 99',
    licenseNumber: 'LIC-ED-77310-GNQ',
    specialty: 'Informatique, FP & Réseaux Locaux',
    schoolName: 'Centre de Formation Technique Ebebiyín',
    country: 'Guinée Équatoriale (Ebebiyín)',
    experienceYears: '5 ans',
    approvalStatus: 'Pending',
    coursesCount: 1,
    rating: '4.7 ⭐',
    bio: 'Instructeur technique de Formation Professionnelle en Réseaux, Systèmes et Maintenance Informatique.'
  },
  {
    id: 'tch-104',
    name: 'Dra. Esperanza Nchama Bikie',
    email: 'esperanza.nchama@educ-eg.org',
    phoneNumber: '+240 222 66 33 00',
    licenseNumber: 'LIC-ED-66200-GNQ',
    specialty: 'Biologie, Sciences Naturelles & Anatomie',
    schoolName: 'Université Nationale de Guinée Équatoriale (UNGE)',
    country: 'Guinée Équatoriale (Malabo)',
    experienceYears: '15 ans',
    approvalStatus: 'Approved',
    coursesCount: 5,
    rating: '5.0 ⭐',
    bio: 'Docteure en Sciences Biologiques dédiée à l\'enseignement universitaire et secondaire supérieur.'
  }
];

export const TeacherListDirectory = () => {
  const { activeRole, approveTeacherApplication, rejectTeacherApplication } = useAuth();

  const [teachers, setTeachers] = useState(INITIAL_REGISTERED_TEACHERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTeacherId, setExpandedTeacherId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Filtrado de profesores en tiempo real
  const filteredTeachers = teachers.filter(tch => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      tch.name.toLowerCase().includes(q) ||
      tch.email.toLowerCase().includes(q) ||
      tch.licenseNumber.toLowerCase().includes(q) ||
      tch.schoolName.toLowerCase().includes(q) ||
      tch.specialty.toLowerCase().includes(q)
    );

    const matchesSpecialty = specialtyFilter === 'all' || (
      (specialtyFilter === 'math' && (tch.specialty.includes('Mathématiques') || tch.specialty.includes('Physique') || tch.specialty.includes('Matemáticas'))) ||
      (specialtyFilter === 'lang' && (tch.specialty.includes('Langue') || tch.specialty.includes('Littérature') || tch.specialty.includes('Lengua'))) ||
      (specialtyFilter === 'tech' && (tch.specialty.includes('Informatique') || tch.specialty.includes('FP'))) ||
      (specialtyFilter === 'bio' && (tch.specialty.includes('Biologie') || tch.specialty.includes('Sciences')))
    );

    const matchesStatus = statusFilter === 'all' || (
      (statusFilter === 'approved' && tch.approvalStatus === 'Approved') ||
      (statusFilter === 'pending' && tch.approvalStatus === 'Pending') ||
      (statusFilter === 'suspended' && tch.approvalStatus === 'Suspended')
    );

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleApproveLicense = (id, name) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, approvalStatus: 'Approved' } : t));
    if (approveTeacherApplication) approveTeacherApplication(id);
    setToastMsg(`Licence de l'enseignant "${name}" approuvée officiellement !`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleToggleSuspendLicense = (id, name, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Suspended' : 'Approved';
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, approvalStatus: newStatus } : t));
    setToastMsg(`Statut de la licence de "${name}" : ${newStatus === 'Approved' ? 'Vérifiée / Active' : 'Suspendue'}`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleContactWhatsApp = (tch) => {
    const text = encodeURIComponent(`Bonjour ${tch.name}, nous vous contactons depuis l'Administration Centrale de EDUC-EG concernant votre Licence Enseignante ${tch.licenseNumber}.`);
    window.open(`https://wa.me/${tch.phoneNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ─── Encabezado Principal ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30 mb-1 inline-block">
              Console d'Administration Centrale
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Annuaire Complet des Enseignants</h1>
            <p className="text-xs text-slate-300">
              Gestion des Licences Enseignantes officielles GNQ, vérification des cartes pédagogiques et supervision des cours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Enseignants</span>
            <strong className="text-lg font-black text-amber-400">{teachers.length} Enseignants</strong>
          </div>
          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Licences Actives</span>
            <strong className="text-lg font-black text-emerald-400">✅ {teachers.filter(t => t.approvalStatus === 'Approved').length}</strong>
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ─── BARRA DE BÚSQUEDA Y FILTROS CRUZADOS DE PROFESORES ──────────── */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Campo de búsqueda */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher enseignant par nom, licence GNQ, matière, établissement..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filtro por Especialidad */}
          <div className="md:col-span-3">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">🎓 Toutes les Spécialités</option>
              <option value="math">📐 Mathématiques & Physique</option>
              <option value="lang">📖 Langue & Littérature</option>
              <option value="tech">💻 Informatique & FP</option>
              <option value="bio">🧬 Biologie & Sciences</option>
            </select>
          </div>

          {/* Filtro por Estado de Licencia */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">⚡ Tous les Statuts</option>
              <option value="approved">✅ Licence Vérifiée / Active</option>
              <option value="pending">🟡 En Attente d'Approbation</option>
              <option value="suspended">⛔ Licence Suspendue</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── LISTADO DE TARJETAS DE PROFESORES ───────────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Affichage de <strong className="text-white">{filteredTeachers.length}</strong> enseignants enregistrés</span>
          <span className="text-amber-400 font-semibold">⭐ Licences Homologuées par le Ministère</span>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
            <Award className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">Aucun enseignant trouvé selon les critères indiqués</h3>
            <p className="text-xs">Essayez de modifier le terme de recherche ou de sélectionner un autre filtre de spécialité.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTeachers.map((tch) => {
              const isExpanded = expandedTeacherId === tch.id;

              return (
                <div
                  key={tch.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-700/80 p-5 space-y-4 hover:border-amber-500/50 transition-all shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Datos del Profesor */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20 shrink-0">
                        {tch.name.charAt(0)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-extrabold text-white">{tch.name}</h3>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${
                            tch.approvalStatus === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : tch.approvalStatus === 'Pending'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {tch.approvalStatus === 'Approved' ? '✅ Licence Active' : tch.approvalStatus === 'Pending' ? '🟡 En Attente de Vérification' : '⛔ Suspendu'}
                          </span>

                          <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                            {tch.licenseNumber}
                          </span>
                        </div>

                        <p className="text-xs text-amber-300 font-semibold">{tch.specialty}</p>

                        <p className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-300"><Mail className="w-3.5 h-3.5" /> {tch.email}</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold"><Phone className="w-3.5 h-3.5" /> {tch.phoneNumber}</span>
                        </p>

                        <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                          <Building className="w-3.5 h-3.5 text-amber-400" />
                          <strong className="text-slate-200">{tch.schoolName}</strong> • {tch.experienceYears} d'expérience
                        </p>
                      </div>
                    </div>

                    {/* Stats & Acciones Admin */}
                    <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                      
                      <div className="text-right hidden sm:block pr-2 border-r border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Publicaciones</span>
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1 justify-end">
                          <BookOpen className="w-3.5 h-3.5" /> {tch.coursesCount} Cours • {tch.rating}
                        </span>
                      </div>

                      {/* Botón WhatsApp Directo */}
                      <button
                        onClick={() => handleContactWhatsApp(tch)}
                        className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                      </button>

                      {/* Acción Aprobar Licencia en Admin */}
                      {tch.approvalStatus === 'Pending' && (
                        <button
                          onClick={() => handleApproveLicense(tch.id, tch.name)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approuver Licence
                        </button>
                      )}

                      {/* Acción Suspender/Reactivar Licencia */}
                      {tch.approvalStatus !== 'Pending' && (
                        <button
                          onClick={() => handleToggleSuspendLicense(tch.id, tch.name, tch.approvalStatus)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            tch.approvalStatus === 'Approved'
                              ? 'bg-slate-800 text-red-400 border-slate-700 hover:bg-red-500/20'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {tch.approvalStatus === 'Approved' ? 'Suspendre' : 'Réactiver'}
                        </button>
                      )}

                      {/* Desplegar Ficha */}
                      <button
                        onClick={() => setExpandedTeacherId(isExpanded ? null : tch.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? 'Masquer Bio' : 'Voir Fiche'}
                      </button>
                    </div>

                  </div>

                  {/* Ficha Ampliada con Biografía y CV */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Biographie et Références Pédagogiques:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">{tch.bio}</p>
                        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Localisation: <strong>{tch.country}</strong></span>
                          <span className="text-emerald-400 font-bold">🟢 Homologation Officielle Approuvée</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
