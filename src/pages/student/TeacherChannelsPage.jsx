import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Video,
  MessageCircle,
  Send,
  Globe,
  Share2,
  Phone,
  MapPin,
  Award,
  Users,
  Search,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Pencil,
  PlusCircle,
  Save,
  X,
  Trash2
} from 'lucide-react';

const DEFAULT_TEACHERS = [
  {
    id: 'tc-1',
    name: 'Prof. Baltasar Nsue Ondo',
    role: 'Professeur Titulaire de Mathématiques, Physique & Technologie Agroécologique',
    institution: 'UNGE & Institut Polytechnique de Bata',
    location: 'Bata & Malabo (Guinée Équatoriale)',
    avatar: 'B',
    avatarBg: 'from-amber-500 to-orange-600',
    channels: {
      youtube: { handle: '@ProfBaltasarOndo', name: 'Chaîne Pédagogique de Mathématiques & Physique UNGE', subscribers: '4.8K élèves', url: 'https://youtube.com/@ProfBaltasarOndo' },
      tiktok: { handle: '@prof_baltasar_gnq', name: 'TikTok: Astuces d\'Algèbre & Physique', followers: '12.4K abonnés', url: 'https://tiktok.com' },
      instagram: { handle: '@prof.baltasar.oficial', name: 'Instagram Éducatif GNQ', followers: '3.1K abonnés', url: 'https://instagram.com' },
      whatsapp: { handle: '+240 222 88 44 20', name: 'Groupe WhatsApp Questions Secondaire & Baccalauréat', members: '850 étudiants', url: 'https://wa.me/240222884420' },
      telegram: { handle: '@EducEGGNQ', name: 'Chaîne Telegram Matériels & PDF Hors-Ligne', members: '1.2K membres', url: 'https://t.me/EducEGGNQ' },
      facebook: { handle: 'Prof. Baltasar Nsue Ondo', name: 'Page Facebook Cours Ouverts GNQ', url: 'https://facebook.com' }
    },
    featuredVideo: 'Résolution d\'Équations du Second Degré & Théorème de Pythagore Pas à Pas'
  },
  {
    id: 'tc-2',
    name: 'Dra. Solange Nguema Avomo',
    role: 'Enseignante en Sciences Naturelles, Biologie & Santé Communautaire',
    institution: 'Institut National Carlos Lwanga de Bata',
    location: 'Bata (Río Muni)',
    avatar: 'S',
    avatarBg: 'from-emerald-500 to-teal-600',
    channels: {
      youtube: { handle: '@DraSolangeCiencias', name: 'Chaîne de Biologie Rurale & Sciences Naturelles', subscribers: '3.2K élèves', url: 'https://youtube.com' },
      whatsapp: { handle: '+240 222 55 44 33', name: 'Communauté WhatsApp Santé & Botanique', members: '620 étudiants', url: 'https://wa.me/240222554433' },
      telegram: { handle: '@CienciasBiokoRíoMuni', name: 'Chaîne Telegram Fiches d\'Étude PDF', members: '940 membres', url: 'https://t.me' }
    },
    featuredVideo: 'Réactions Chimiques et la Loi de Lavoisier en Cuisine'
  },
  {
    id: 'tc-3',
    name: 'Prof. Carmen Ruiz Nchama',
    role: 'Spécialiste Pédagogique du Primaire (1ère à 6ème)',
    institution: 'Centre de FP de Ebebiyín & Réseau Rural',
    location: 'Ebebiyín (Kié-Ntem)',
    avatar: 'C',
    avatarBg: 'from-purple-500 to-indigo-600',
    channels: {
      youtube: { handle: '@CarmenDidacticaEbebiyin', name: 'Mathématiques Faciles pour Enfants du Primaire', subscribers: '2.5K abonnés', url: 'https://youtube.com' },
      whatsapp: { handle: '+240 222 55 22 11', name: 'Réseau de Mères et Pères Primaire Ebebiyín', members: '410 parents', url: 'https://wa.me/240222552211' },
      facebook: { handle: 'Carmen Ruiz Nchama Edu', name: 'Guides et Histoires Pour Enfants de Guinée', url: 'https://facebook.com' }
    },
    featuredVideo: 'Apprends les Tables de Multiplication en Chantant'
  }
];

export const TeacherChannelsPage = () => {
  const { user, activeRole } = useAuth();
  
  const [teachersList, setTeachersList] = useState(() => {
    try {
      const saved = localStorage.getItem('teacher_channels_list');
      if (saved) {
        const str = saved.toLowerCase();
        if (str.includes('catedrático') || str.includes('alumnos') || str.includes('seguidores') || str.includes('dudas eso') || str.includes('canales y redes') || str.includes('clases abiertas')) {
          localStorage.removeItem('teacher_channels_list');
          return DEFAULT_TEACHERS;
        }
        return JSON.parse(saved);
      }
      return DEFAULT_TEACHERS;
    } catch (e) {
      return DEFAULT_TEACHERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('teacher_channels_list', JSON.stringify(teachersList));
    } catch (e) {
      console.error(e);
    }
  }, [teachersList]);

  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // ─── Estado del Modal de Edición de Canales para el Profesor ─────────────────
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  // Form fields
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editFeaturedVideo, setEditFeaturedVideo] = useState('');

  // Canales
  const [ytName, setYtName] = useState('');
  const [ytHandle, setYtHandle] = useState('');
  const [ytSubs, setYtSubs] = useState('');

  const [waName, setWaName] = useState('');
  const [waHandle, setWaHandle] = useState('');
  const [waMembers, setWaMembers] = useState('');

  const [tgName, setTgName] = useState('');
  const [tgHandle, setTgHandle] = useState('');
  const [tgMembers, setTgMembers] = useState('');

  const [ttName, setTtName] = useState('');
  const [ttHandle, setTtHandle] = useState('');
  const [ttFollowers, setTtFollowers] = useState('');

  const [igName, setIgName] = useState('');
  const [igHandle, setIgHandle] = useState('');

  const [fbName, setFbName] = useState('');
  const [fbHandle, setFbHandle] = useState('');

  const filtered = teachersList.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyLink = (name, type) => {
    setToastMsg(`Lien de la chaîne ${type} de ${name} copié dans le presse-papiers!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleOpenEditModal = (teacher) => {
    setEditingTeacherId(teacher ? teacher.id : `tc-${Date.now()}`);
    setEditName(teacher ? teacher.name : user?.name || 'Prof. Baltasar Nsue Ondo');
    setEditRole(teacher ? teacher.role : user?.specialty || 'Professeur Titulaire de Mathématiques & Sciences');
    setEditInstitution(teacher ? teacher.institution : user?.school || 'Institut Polytechnique de Bata & UNGE');
    setEditLocation(teacher ? teacher.location : user?.country || 'Bata & Malabo (Guinée Équatoriale)');
    setEditFeaturedVideo(teacher ? (teacher.featuredVideo || '') : 'Cours Magistral de Résolution d\'Exercices Secondaire & Baccalauréat');

    // Channels
    const ch = teacher?.channels || {};
    setYtName(ch.youtube?.name || 'Chaîne Pédagogique YouTube');
    setYtHandle(ch.youtube?.handle || '@EnseignantDocentGNQ');
    setYtSubs(ch.youtube?.subscribers || '2.5K abonnés');

    setWaName(ch.whatsapp?.name || 'Groupe WhatsApp Questions & Notes');
    setWaHandle(ch.whatsapp?.handle || user?.phoneNumber || '+240 222 88 44 20');
    setWaMembers(ch.whatsapp?.members || '500 étudiants');

    setTgName(ch.telegram?.name || 'Chaîne Telegram Notes & PDFs');
    setTgHandle(ch.telegram?.handle || '@EducEGOficial');
    setTgMembers(ch.telegram?.members || '850 membres');

    setTtName(ch.tiktok?.name || 'TikTok Astuces & Exercices');
    setTtHandle(ch.tiktok?.handle || '@prof_docente');
    setTtFollowers(ch.tiktok?.followers || '5.0K abonnés');

    setIgName(ch.instagram?.name || 'Instagram Éducatif Officiel');
    setIgHandle(ch.instagram?.handle || '@prof.educativo.gnq');

    setFbName(ch.facebook?.name || 'Page Facebook Cours Ouverts');
    setFbHandle(ch.facebook?.handle || 'Enseignant Éducatif');

    setIsEditModalOpen(true);
  };

  const handleSaveChannels = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updatedChannels = {
      youtube: ytHandle.trim() ? { name: ytName.trim() || 'Chaîne YouTube', handle: ytHandle.trim(), subscribers: ytSubs.trim() || '2.0K élèves', url: 'https://youtube.com' } : null,
      whatsapp: waHandle.trim() ? { name: waName.trim() || 'Groupe WhatsApp', handle: waHandle.trim(), members: waMembers.trim() || '400 membres', url: 'https://wa.me' } : null,
      telegram: tgHandle.trim() ? { name: tgName.trim() || 'Chaîne Telegram', handle: tgHandle.trim(), members: tgMembers.trim() || '600 membres', url: 'https://t.me' } : null,
      tiktok: ttHandle.trim() ? { name: ttName.trim() || 'TikTok Éducatif', handle: ttHandle.trim(), followers: ttFollowers.trim() || '3K abonnés', url: 'https://tiktok.com' } : null,
      instagram: igHandle.trim() ? { name: igName.trim() || 'Instagram Éducatif', handle: igHandle.trim(), followers: '2.5K abonnés', url: 'https://instagram.com' } : null,
      facebook: fbHandle.trim() ? { name: fbName.trim() || 'Page Facebook', handle: fbHandle.trim(), url: 'https://facebook.com' } : null
    };

    setTeachersList(prev => {
      const exists = prev.some(t => t.id === editingTeacherId || t.name.toLowerCase() === editName.toLowerCase());
      if (exists) {
        return prev.map(t => {
          if (t.id === editingTeacherId || t.name.toLowerCase() === editName.toLowerCase()) {
            return {
              ...t,
              name: editName.trim(),
              role: editRole.trim(),
              institution: editInstitution.trim(),
              location: editLocation.trim(),
              featuredVideo: editFeaturedVideo.trim(),
              channels: updatedChannels
            };
          }
          return t;
        });
      } else {
        const newTeacherObj = {
          id: `tc-${Date.now()}`,
          name: editName.trim(),
          role: editRole.trim() || 'Professeur de l\'Enseignement Secondaire & UNGE',
          institution: editInstitution.trim() || 'Institut Polytechnique de Bata',
          location: editLocation.trim() || 'Guinée Équatoriale',
          avatar: editName.charAt(0).toUpperCase(),
          avatarBg: 'from-amber-500 to-orange-600',
          channels: updatedChannels,
          featuredVideo: editFeaturedVideo.trim()
        };
        return [newTeacherObj, ...prev];
      }
    });

    setToastMsg(`Chaînes et réseaux de ${editName} mis à jour avec succès sur la plateforme!`);
    setTimeout(() => setToastMsg(''), 5000);
    setIsEditModalOpen(false);
  };

  // Buscar el registro del profesor logueado si existe
  const myTeacherRecord = teachersList.find(t =>
    t.name.toLowerCase().includes(user?.name?.toLowerCase() || 'baltasar')
  ) || teachersList[0];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Share2 className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30">
                Communauté Numérique Enseignante • Guinée Équatoriale
              </span>
              {(activeRole === 'teacher' || activeRole === 'admin') && (
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Panneau d'Édition Enseignant
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Chaînes & Réseaux Sociaux des Enseignants</h1>
            <p className="text-xs text-slate-300">Suivez les chaînes officielles YouTube, WhatsApp, Telegram et réseaux éducatifs de vos enseignants.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Botón de Edición para Profesores y Administradores */}
          {(activeRole === 'teacher' || activeRole === 'admin') && (
            <button
              onClick={() => handleOpenEditModal(myTeacherRecord)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4 stroke-[2.5]" />
              Modifier Mes Chaînes & Réseaux
            </button>
          )}

          <div className="bg-slate-850 px-4 py-2 rounded-2xl border border-slate-700 text-center shrink-0">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Réseaux Actifs</span>
            <strong className="text-base font-extrabold text-amber-400 flex items-center gap-1.5 justify-center">
              <Users className="w-4 h-4 text-amber-400" /> YouTube, WA & Telegram
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

      {/* Buscador */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom de l'enseignant, matière ou province..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Grid de Canales y Redes */}
      <div className="space-y-6">
        {filtered.map(t => {
          const isMyProfile = user?.name && t.name.toLowerCase().includes(user.name.toLowerCase());

          return (
            <div
              key={t.id}
              className={`bg-slate-900/90 p-6 rounded-3xl border transition-all space-y-4 shadow-xl ${
                isMyProfile
                  ? 'border-amber-500/80 ring-1 ring-amber-500/30'
                  : 'border-slate-700/80 hover:border-amber-500/40'
              }`}
            >
              {/* Perfil del Profesor */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${t.avatarBg || 'from-amber-500 to-orange-600'} text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-lg`}>
                    {t.avatar || t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white leading-snug">{t.name}</h3>
                      {isMyProfile && (
                        <span className="text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                          Mon Profil
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300 font-medium">{t.role}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {t.location} • {t.institution}
                    </p>
                  </div>
                </div>

                {/* Botón de Edición individual para el profesor */}
                {(activeRole === 'teacher' || activeRole === 'admin') && (
                  <button
                    onClick={() => handleOpenEditModal(t)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-amber-400" /> Modifier Mes Chaînes
                  </button>
                )}
              </div>

              {/* Redes Sociales y Canales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                
                {/* YouTube */}
                {t.channels?.youtube && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                        <Video className="w-4 h-4 text-red-400" /> Chaîne YouTube
                      </div>
                      <strong className="text-xs text-white block">{t.channels.youtube.name}</strong>
                      <span className="text-[10px] text-slate-400 block">{t.channels.youtube.subscribers}</span>
                    </div>
                    <button
                      onClick={() => handleCopyLink(t.name, 'YouTube')}
                      className="w-full py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-red-500/30 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3 h-3" /> Voir Chaîne YouTube
                    </button>
                  </div>
                )}

                {/* WhatsApp */}
                {t.channels?.whatsapp && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <MessageCircle className="w-4 h-4 text-emerald-400" /> Groupe WhatsApp
                      </div>
                      <strong className="text-xs text-white block">{t.channels.whatsapp.name}</strong>
                      <span className="text-[10px] text-slate-400 block">{t.channels.whatsapp.members}</span>
                    </div>
                    <button
                      onClick={() => handleCopyLink(t.name, 'WhatsApp')}
                      className="w-full py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-emerald-500/30 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3 h-3" /> Rejoindre WhatsApp
                    </button>
                  </div>
                )}

                {/* Telegram */}
                {t.channels?.telegram && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-sky-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                        <Send className="w-4 h-4 text-sky-400" /> Chaîne Telegram
                      </div>
                      <strong className="text-xs text-white block">{t.channels.telegram.name}</strong>
                      <span className="text-[10px] text-slate-400 block">{t.channels.telegram.members}</span>
                    </div>
                    <button
                      onClick={() => handleCopyLink(t.name, 'Telegram')}
                      className="w-full py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-sky-500/30 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3 h-3" /> Ouvrir Telegram
                    </button>
                  </div>
                )}

                {/* TikTok */}
                {t.channels?.tiktok && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-pink-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-pink-400" /> TikTok Éducatif
                      </div>
                      <strong className="text-xs text-white block">{t.channels.tiktok.name}</strong>
                      <span className="text-[10px] text-slate-400 block">{t.channels.tiktok.followers || t.channels.tiktok.handle}</span>
                    </div>
                    <button
                      onClick={() => handleCopyLink(t.name, 'TikTok')}
                      className="w-full py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-pink-500/30 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3 h-3" /> Ouvrir TikTok
                    </button>
                  </div>
                )}

                {/* Instagram */}
                {t.channels?.instagram && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                        <Award className="w-4 h-4 text-purple-400" /> Instagram Éducatif
                      </div>
                      <strong className="text-xs text-white block">{t.channels.instagram.name}</strong>
                      <span className="text-[10px] text-slate-400 block">{t.channels.instagram.followers || t.channels.instagram.handle}</span>
                    </div>
                    <button
                      onClick={() => handleCopyLink(t.name, 'Instagram')}
                      className="w-full py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-purple-500/30 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3 h-3" /> Voir Instagram
                    </button>
                  </div>
                )}

                {/* Facebook */}
                {t.channels?.facebook && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                        <Globe className="w-4 h-4 text-blue-400" /> Page Facebook
                      </div>
                      <strong className="text-xs text-white block">{t.channels.facebook.name}</strong>
                      <span className="text-[10px] text-slate-400 block">Communauté Ouverte</span>
                    </div>
                    <button
                      onClick={() => handleCopyLink(t.name, 'Facebook')}
                      className="w-full py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-blue-500/30 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3 h-3" /> Aller sur Facebook
                    </button>
                  </div>
                )}

              </div>

              {/* Video Destacado del Canal */}
              {t.featuredVideo && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Vidéo Vedette sur sa Chaîne:
                  </span>
                  <span className="text-amber-300 font-semibold truncate max-w-md">"{t.featuredVideo}"</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── MODAL DE EDICIÓN DE CANALES Y REDES PARA EL PROFESOR ───────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-3xl rounded-3xl p-6 shadow-2xl space-y-6 relative my-8">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-amber-500/20">
                <Pencil className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Configuration de l'Enseignant
                </span>
                <h2 className="text-xl font-bold text-white">Éditer Mes Chaînes & Réseaux Sociaux</h2>
              </div>
            </div>

            <form onSubmit={handleSaveChannels} className="space-y-5">
              {/* Información Personal y Académica */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Données Générales de l'Enseignant
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Nom Complet *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Spécialité / Poste *</label>
                    <input
                      type="text"
                      required
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Établissement Éducatif</label>
                    <input
                      type="text"
                      value={editInstitution}
                      onChange={(e) => setEditInstitution(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Localisation / Ville</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Redes Sociales y Enlaces */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" /> Liens des Chaînes et Groupes Éducatifs
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* YouTube */}
                  <div className="p-3 bg-slate-950 border border-red-500/30 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <Video className="w-4 h-4" /> Chaîne YouTube
                    </span>
                    <input
                      type="text"
                      value={ytName}
                      onChange={(e) => setYtName(e.target.value)}
                      placeholder="Nom de la Chaîne..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={ytHandle}
                      onChange={(e) => setYtHandle(e.target.value)}
                      placeholder="Identifiant ou URL (@EnseignantYouTube)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" /> Groupe WhatsApp
                    </span>
                    <input
                      type="text"
                      value={waName}
                      onChange={(e) => setWaName(e.target.value)}
                      placeholder="Nom du Groupe..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={waHandle}
                      onChange={(e) => setWaHandle(e.target.value)}
                      placeholder="Téléphone ou lien d'invitation"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  {/* Telegram */}
                  <div className="p-3 bg-slate-950 border border-sky-500/30 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Send className="w-4 h-4" /> Chaîne Telegram
                    </span>
                    <input
                      type="text"
                      value={tgName}
                      onChange={(e) => setTgName(e.target.value)}
                      placeholder="Nom de la Chaîne Telegram..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={tgHandle}
                      onChange={(e) => setTgHandle(e.target.value)}
                      placeholder="Identifiant Telegram (@EducTelegram)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="p-3 bg-slate-950 border border-pink-500/30 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> TikTok Éducatif
                    </span>
                    <input
                      type="text"
                      value={ttName}
                      onChange={(e) => setTtName(e.target.value)}
                      placeholder="Nom TikTok..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={ttHandle}
                      onChange={(e) => setTtHandle(e.target.value)}
                      placeholder="@handle_tiktok"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Vídeo Destacado */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Vidéo Vedette de sa Chaîne</label>
                <input
                  type="text"
                  value={editFeaturedVideo}
                  onChange={(e) => setEditFeaturedVideo(e.target.value)}
                  placeholder="Ex. Résolution Complète Examen Sélectivité 2026 Étape par Étape"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer Chaînes & Réseaux
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
