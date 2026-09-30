import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DocumentReaderModal } from '../../components/DocumentReaderModal';
import { ChangePasswordModal } from '../../components/ChangePasswordModal';
import {
  User,
  Mail,
  Building,
  MapPin,
  Award,
  Flame,
  Sparkles,
  CheckCircle2,
  Save,
  Camera,
  Upload,
  Trash2,
  ImagePlus,
  Phone,
  Calendar,
  BookMarked,
  MessageSquare,
  Users,
  ShieldCheck,
  GraduationCap,
  Star,
  Library,
  BookOpen,
  FileText,
  Eye,
  ExternalLink,
  PlayCircle,
  Key
} from 'lucide-react';

const GRADE_OPTIONS = [
  '1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire',
  '1ère Secondaire', '2ème Secondaire', '3ème Secondaire', '4ème Secondaire',
  'Baccalauréat 1', 'Baccalauréat 2',
  'FP Niveau Moyen', 'FP Niveau Supérieur',
  'Université / Formation Adultes'
];

export const StudentProfile = () => {
  const { user, setUser } = useAuth();

  // ─── Estados de Formulario de Registro / Perfil ─────────────────────────────
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [age, setAge] = useState(user?.age || '');
  const [gradeLevel, setGradeLevel] = useState(user?.gradeLevel || 'Secondaire');
  const [school, setSchool] = useState(user?.school || user?.schoolName || '');
  const [country, setCountry] = useState(user?.country || 'Guinée Équatoriale (Malabo / Bata)');
  const [comments, setComments] = useState(user?.comments || '');

  // Datos del tutor (menores de 18)
  const [tutorName, setTutorName] = useState(user?.tutorName || '');
  const [tutorPhone, setTutorPhone] = useState(user?.tutorPhone || '');
  const [tutorRelationship, setTutorRelationship] = useState(user?.tutorRelationship || 'Père/Mère');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // ─── Estado de la foto de perfil (base64 o null) ────────────────────────────
  const [profileImageSrc, setProfileImageSrc] = useState(
    () => user?.avatarUrl || localStorage.getItem('student_profile_photo') || null
  );
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // ─── Estado de Gestión de Favoritos en Perfil Personal ───────────────────────
  const [favSubTab, setFavSubTab] = useState('resources'); // 'resources', 'courses', 'notes'
  
  const [favResources, setFavResources] = useState(() => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('educ_favorite_resource_ids') || '["res-1", "res-2"]');
      const allRes = JSON.parse(localStorage.getItem('educ_library_resources') || '[]');
      if (allRes.length > 0) {
        return allRes.filter(r => savedIds.includes(r.id));
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'res-1',
        title: 'Livre Officiel de Mathématiques 4ème Secondaire & Baccalauréat',
        typeName: 'Livre Numérique',
        level: 'Secondaire Obligatoire',
        author: 'Ministère de l\'Éducation, de la Science et des Sports GNQ',
        sizeMB: '14.2 MB',
        rating: 4.9
      },
      {
        id: 'res-2',
        title: 'Sujets d\'Examens et Corrigés Sélectivité UNGE 2025/2026',
        typeName: 'Document Académique',
        level: 'Baccalauréat & Sélectivité',
        author: 'Commission d\'Évaluation UNGE (Malabo & Bata)',
        sizeMB: '6.5 MB',
        rating: 5.0
      }
    ];
  });

  const [favNotes, setFavNotes] = useState(() => {
    try {
      const savedNotes = JSON.parse(localStorage.getItem('educ_user_notes') || '[]');
      return savedNotes.filter(n => n.isFavorite);
    } catch (e) {
      return [];
    }
  });

  const [readingDoc, setReadingDoc] = useState(null);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const isMinor = Number(age) > 0 && Number(age) < 18;

  // Leer el archivo como base64 y guardarlo
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setProfileImageSrc(base64);
      localStorage.setItem('student_profile_photo', base64);
      setUser(prev => ({
        ...prev,
        avatarUrl: base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file);
  };

  const handleRemovePhoto = () => {
    setProfileImageSrc(null);
    localStorage.removeItem('student_profile_photo');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUser(prev => ({
      ...prev,
      avatarUrl: null
    }));
  };

  const handleRemoveFavResource = (resId) => {
    setFavResources(prev => prev.filter(r => r.id !== resId));
    try {
      const savedIds = JSON.parse(localStorage.getItem('educ_favorite_resource_ids') || '[]');
      const updated = savedIds.filter(id => id !== resId);
      localStorage.setItem('educ_favorite_resource_ids', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedMinor = Number(age) > 0 && Number(age) < 18;
    
    setUser(prev => ({
      ...prev,
      name,
      phoneNumber,
      age,
      gradeLevel,
      school,
      schoolName: school,
      country,
      comments,
      isMinor: updatedMinor,
      tutorName: updatedMinor ? tutorName : '',
      tutorPhone: updatedMinor ? tutorPhone : '',
      tutorRelationship: updatedMinor ? tutorRelationship : '',
      avatarUrl: profileImageSrc
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* ─── Banner Perfil Estudiante ───────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar con foto de archivo o iniciales */}
          <div className="relative group shrink-0">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt="Foto de Perfil Estudiante"
                className="w-20 h-20 rounded-3xl object-cover shadow-xl shadow-emerald-500/20 border-2 border-emerald-500/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-xl shadow-emerald-500/20">
                {user?.name ? user.name.charAt(0) : 'E'}
              </div>
            )}

            {/* Overlay al pasar el cursor */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/70 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer gap-1"
            >
              <Camera className="w-6 h-6 text-white" />
              <span className="text-[9px] text-white font-bold">Cambiar Foto</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                Élève Niveau {user?.level || 1}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                {user?.gradeLevel || 'Secondaire'}
              </span>
            </div>
            <p className="text-xs text-slate-300">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              {user?.school || user?.schoolName || 'École Rurale'} • {user?.country || 'Guinée Équatoriale (Malabo / Bata)'}
            </p>

            <button
              type="button"
              onClick={() => setIsChangePassModalOpen(true)}
              className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Changer le mot de passe
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-700 text-center px-5">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Points XP</span>
            <strong className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" /> {user?.xpPoints || 0}
            </strong>
          </div>
          <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-700 text-center px-5">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Série Quotidienne</span>
            <strong className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" /> {user?.studyStreakDays || 1}j
            </strong>
          </div>
        </div>
      </div>

      {/* ─── SECCIÓN DEDICADA: GESTIÓN DE FAVORITOS EN EL PERFIL PERSONAL ────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-amber-500/40 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Mes Favoris Enregistrés</h2>
              <p className="text-xs text-slate-400">Gérez et consultez vos livres, PDFs et notes enregistrés dans votre profil.</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setFavSubTab('resources')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                favSubTab === 'resources' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              📚 Livres & PDFs ({favResources.length})
            </button>

            <button
              onClick={() => setFavSubTab('notes')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                favSubTab === 'notes' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✍️ Notes ({favNotes.length})
            </button>
          </div>
        </div>

        {/* Lista de Libros & PDFs Favoritos */}
        {favSubTab === 'resources' && (
          <div className="space-y-3">
            {favResources.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
                <Star className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300">Vous n'avez pas encore enregistré de ressources favorites</p>
                <p className="text-[11px] text-slate-500">Explorez la Bibliothèque Numérique pour marquer des livres, PDFs ou examens officiels.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favResources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                          ⭐ {res.typeName || 'PDF'}
                        </span>
                        <button
                          onClick={() => handleRemoveFavResource(res.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Retirer des favoris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 leading-snug">{res.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Par: {res.author}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-semibold">{res.sizeMB || 'PDF'}</span>
                      <button
                        onClick={() => setReadingDoc({ title: res.title, name: `${res.title}.pdf`, author: res.author })}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lista de Apuntes Favoritos */}
        {favSubTab === 'notes' && (
          <div className="space-y-3">
            {favNotes.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
                <BookMarked className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-bold text-slate-300">No hay apuntes marcados como favoritos</p>
                <p className="text-[11px] text-slate-500">Puedes crear notas y marcar la estrella ⭐ en el Cuaderno Digital.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favNotes.map(note => (
                  <div key={note.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                        📁 {note.folder || 'Apuntes'}
                      </span>
                      <span className="text-amber-400 text-xs">⭐ Favorito</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{note.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Sección: Subida de Foto de Perfil (Abre Archivo de Imagen) ──────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-emerald-400" />
          Photo de Profil de l'Élève (Ouvrir Fichier Image)
        </h2>
        <p className="text-xs text-slate-400">
          Sélectionnez ou glissez une photo personnelle de votre appareil pour personnaliser votre carte d'élève hors-ligne.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all select-none ${
            isDraggingOver
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
              : profileImageSrc
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-600 hover:border-emerald-500/60 hover:bg-emerald-500/5 bg-slate-800/40'
          }`}
        >
          {profileImageSrc ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <img
                src={profileImageSrc}
                alt="Foto Seleccionada"
                className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-emerald-500/40"
              />
              <div className="text-left space-y-1">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Image chargée et enregistrée dans le profil
                </p>
                <p className="text-[11px] text-slate-400">Cliquez ou glissez un nouveau fichier pour changer la photo.</p>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <Upload className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">
                  Ouvrir ou sélectionner un fichier image depuis votre ordinateur
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Formats supportés: JPG, PNG, WEBP, GIF (Chargement direct hors-ligne)
                </p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                📁 Chercher Fichier Photo
              </span>
            </div>
          )}
        </div>

        {profileImageSrc && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-red-400 border border-slate-700 hover:border-red-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer Photo de Profil
            </button>
          </div>
        )}
      </div>

      {/* ─── Sección: Formulario Editar Perfil ────────────────────────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" />
          Éditer le Formulaire de Profil et Inscription Académique
        </h2>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-emerald-200">Informations d'Inscription Mises à Jour!</strong>
              <span>Les données de votre formulaire ont été enregistrées avec succès dans la base de données locale.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Nom Complet *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">E-mail (Enregistré)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Téléphone / WhatsApp *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+240 222 12 34 56"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Âge *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  min="5"
                  max="90"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Classe / Niveau Académique *</label>
              <div className="relative">
                <BookMarked className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-slate-800 border border-emerald-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  {GRADE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">École / Établissement Éducatif *</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Ex: Lycée Rey Malabo"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <Save className="w-4 h-4" />
              Enregistrer les Données de Profil
            </button>
          </div>
        </form>
      </div>

      <DocumentReaderModal
        isOpen={Boolean(readingDoc)}
        onClose={() => setReadingDoc(null)}
        document={readingDoc}
      />

      <ChangePasswordModal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
      />
    </div>
  );
};
