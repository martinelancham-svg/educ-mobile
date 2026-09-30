import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DocumentReaderModal } from '../../components/DocumentReaderModal';
import { ChangePasswordModal } from '../../components/ChangePasswordModal';
import {
  User,
  CheckCircle2,
  Save,
  Camera,
  Upload,
  Trash2,
  ImagePlus,
  Award,
  Phone,
  Building,
  MapPin,
  FileText,
  Briefcase,
  ShieldCheck,
  BookOpen,
  Star,
  Library,
  Eye,
  PlusCircle,
  X,
  Sparkles,
  Filter,
  GraduationCap,
  Key
} from 'lucide-react';

export const TeacherProfile = () => {
  const { user, setUser } = useAuth();

  // ─── Campos del Formulario de Registro y Perfil Docente ─────────────────────
  const [name, setName] = useState(user?.name || 'Prof. Baltasar Nsue Ondo');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+240 222 99 88 77');
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || 'LIC-ED-88420-GNQ');
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || '12 ans');
  const [specialty, setSpecialty] = useState(user?.specialty || 'Mathématiques, Physique et Sciences Secondaire');
  const [school, setSchool] = useState(user?.school || user?.workplaces || 'Instituto Politécnico de Bata & UNGE');
  const [country, setCountry] = useState(user?.country || 'Guinée Équatoriale (Bata / Malabo)');
  const [cvFileName, setCvFileName] = useState(user?.cvFile || 'CV_Baltasar_Nsue_Enseignant_GNQ.pdf');
  const [bio, setBio] = useState(user?.bio || 'Professeur de Mathématiques et Physique avec plus de 12 ans d\'expérience en Guinée Équatoriale.');
  const [youtubeUrl, setYoutubeUrl] = useState(user?.youtube || 'https://youtube.com/@ProfBaltasarOndo');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsapp || '+240 222 88 44 20');
  const [telegramChannel, setTelegramChannel] = useState(user?.telegram || '@EducEGGNQ');
  const [facebookPage, setFacebookPage] = useState(user?.facebook || 'facebook.com/prof.baltasar.ondo');
  const [tiktokHandle, setTiktokHandle] = useState(user?.tiktok || '@prof_baltasar_gnq');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // ─── Foto de Perfil Docente (Base64) ───────────────────────────────────────
  const [profileImageSrc, setProfileImageSrc] = useState(
    () => user?.avatarUrl || localStorage.getItem('teacher_profile_photo') || null
  );
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // ─── Estado de Gestión Avanzada de Favoritos del Profesor ────────────────────
  const [favCategoryTab, setFavCategoryTab] = useState('resources'); // 'resources', 'courses', 'exams'
  const [favLevelFilter, setFavLevelFilter] = useState('all');
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

  const [favResources, setFavResources] = useState(() => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('educ_favorite_resource_ids') || '["res-1", "res-2", "res-3"]');
      const allRes = JSON.parse(localStorage.getItem('educ_library_resources') || '[]');
      if (allRes.length > 0) {
        const matched = allRes.filter(r => savedIds.includes(r.id));
        if (matched.length > 0) return matched;
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
        subject: 'Mathématiques & Algèbre',
        author: 'Ministère de l\'Éducation, de la Science et des Sports GNQ',
        sizeMB: '14.2 MB'
      },
      {
        id: 'res-2',
        title: 'Sujets d\'Examens et Corrigés Sélectivité UNGE 2025/2026',
        typeName: 'Document Académique',
        level: 'Baccalauréat & Sélectivité',
        subject: 'Mathématiques & Algèbre',
        author: 'Commission d\'Évaluation UNGE (Malabo & Bata)',
        sizeMB: '6.5 MB'
      },
      {
        id: 'res-3',
        title: 'Physique Moderne: Lois de Newton & Thermodynamique',
        typeName: 'Présentation PPT',
        level: 'Baccalauréat & Sélectivité',
        subject: 'Physique & Chimie',
        author: 'Prof. Baltasar Nsue Ondo',
        sizeMB: '8.1 MB'
      }
    ];
  });

  // Modal para añadir un nuevo favorito docente manualmente
  const [showAddFavModal, setShowAddFavModal] = useState(false);
  const [addFavTitle, setAddFavTitle] = useState('');
  const [addFavType, setAddFavType] = useState('Document Académique');
  const [addFavLevel, setAddFavLevel] = useState('Baccalauréat & Sélectivité');
  const [addFavSubject, setAddFavSubject] = useState('Mathématiques & Algèbre');

  const [readingDoc, setReadingDoc] = useState(null);

  const fileInputRef = useRef(null);
  const cvFileInputRef = useRef(null);

  // Leer la imagen de perfil como base64
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP...)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setProfileImageSrc(base64);
      localStorage.setItem('teacher_profile_photo', base64);
      setUser(prev => ({ ...prev, avatarUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFileName(file.name);
    }
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
    localStorage.removeItem('teacher_profile_photo');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUser(prev => ({ ...prev, avatarUrl: null }));
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

  const handleAddManualFav = (e) => {
    e.preventDefault();
    if (!addFavTitle.trim()) return;

    const newFav = {
      id: `res-${Date.now()}`,
      title: addFavTitle,
      typeName: addFavType,
      level: addFavLevel,
      subject: addFavSubject,
      author: name || 'Profesor Verificado',
      sizeMB: '2.5 MB'
    };

    setFavResources(prev => [newFav, ...prev]);

    try {
      const savedIds = JSON.parse(localStorage.getItem('educ_favorite_resource_ids') || '[]');
      localStorage.setItem('educ_favorite_resource_ids', JSON.stringify([newFav.id, ...savedIds]));
    } catch (e) {
      console.error(e);
    }

    setAddFavTitle('');
    setShowAddFavModal(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      phoneNumber,
      licenseNumber,
      experienceYears,
      specialty,
      school,
      workplaces: school,
      country,
      cvFile: cvFileName,
      bio,
      avatarUrl: profileImageSrc
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Filtrar favoritos del profesor por nivel educativo
  const filteredFavResources = favResources.filter(res => {
    if (favLevelFilter === 'all') return true;
    if (favLevelFilter === 'eso') return res.level.includes('ESO') || res.level.includes('Secundaria');
    if (favLevelFilter === 'bach') return res.level.includes('Bachillerato') || res.level.includes('Selectividad');
    if (favLevelFilter === 'fp') return res.level.includes('FP') || res.level.includes('Formación');
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      
      {/* ─── Banner Perfil Docente ───────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt="Photo de Profil Enseignant"
                className="w-20 h-20 rounded-3xl object-cover shadow-xl shadow-amber-500/20 border-2 border-amber-500/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-xl shadow-amber-500/20">
                {user?.name ? user.name.charAt(0) : 'P'}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/70 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer gap-1"
            >
              <Camera className="w-6 h-6 text-white" />
              <span className="text-[9px] text-white font-bold">Changer photo</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{name || user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                Enseignant Titulaire
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                {licenseNumber}
              </span>
            </div>
            <p className="text-xs text-slate-300">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">{school} • {country}</p>
            
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

        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700 text-center px-6 shrink-0">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Licence Vérifiée</span>
          <strong className="text-xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
            <Award className="w-5 h-5 text-amber-400" /> Approuvée
          </strong>
        </div>
      </div>

      {/* ─── SECCIÓN DEDICADA: GESTIÓN DE FAVORITOS EN EL PERFIL DOCENTE ────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-amber-500/40 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30 shrink-0">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Gestion des Favoris de l'Enseignant</h2>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {favResources.length} Enregistrés
                </span>
              </div>
              <p className="text-xs text-slate-400">Guides pédagogiques, programmes officiels et sujets d'examen enregistrés dans votre profil.</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddFavModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Ajouter Favori Manuel
          </button>
        </div>

        {/* Filtro de Nivel Educativo dentro de Favoritos */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Filtrer Niveau:
          </span>
          <div className="flex gap-1.5">
            {[
              ['all', 'Tous'],
              ['eso', '🎓 Secondaire'],
              ['bach', '🏅 Baccalauréat & UNGE'],
              ['fp', '💼 Formation Pro']
            ].map(([fKey, fLabel]) => (
              <button
                key={fKey}
                onClick={() => setFavLevelFilter(fKey)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  favLevelFilter === fKey
                    ? 'bg-amber-500 text-slate-950 shadow font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {fLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Recurso Favoritos del Profesor */}
        {filteredFavResources.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
            <Star className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-bold text-slate-300">Aucune ressource pédagogique enregistrée dans cette catégorie</p>
            <p className="text-[11px] text-slate-500">Vous pouvez cliquer sur le bouton ⭐ dans la Bibliothèque Numérique pour ajouter des éléments à votre liste.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFavResources.map(res => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3 flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase">
                      ⭐ {res.typeName || 'Guide Pédagogique'}
                    </span>
                    <button
                      onClick={() => handleRemoveFavResource(res.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-extrabold text-white leading-snug">{res.title}</h4>
                  <p className="text-[11px] text-amber-300 font-semibold">Auteur/Enseignant: {res.author}</p>
                  <span className="text-[10px] text-slate-400 block bg-slate-900 px-2 py-0.5 rounded w-fit">
                    Niveau: {res.level}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-semibold">{res.sizeMB || 'PDF'}</span>
                  <button
                    onClick={() => setReadingDoc({ title: res.title, name: `${res.title}.pdf`, author: res.author })}
                    className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold rounded-xl border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lire Document PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── MODAL AÑADIR FAVORITO MANUAL PARA PROFESORES ─────────────────── */}
      {showAddFavModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAddFavModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-bold text-white">Ajouter une Ressource Favorite au Profil Enseignant</h3>
            </div>

            <form onSubmit={handleAddManualFav} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Titre du Matériel *</label>
                <input
                  type="text"
                  required
                  value={addFavTitle}
                  onChange={(e) => setAddFavTitle(e.target.value)}
                  placeholder="Ex : Corrigé Examen Sélectivité Physique UNGE"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Type de Ressource</label>
                <select
                  value={addFavType}
                  onChange={(e) => setAddFavType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Document Académique">🎓 Document Académique</option>
                  <option value="Guide PDF Enseignant">📄 Guide PDF Enseignant</option>
                  <option value="Livre Numérique">📚 Livre Numérique</option>
                  <option value="Présentation PPT">📊 Présentation PPT</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Niveau Éducatif</label>
                <select
                  value={addFavLevel}
                  onChange={(e) => setAddFavLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Secondaire Obligatoire">Secondaire Obligatoire</option>
                  <option value="Baccalauréat & Sélectivité">Baccalauréat & Sélectivité</option>
                  <option value="Formation Professionnelle">Formation Professionnelle</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFavModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow"
                >
                  Enregistrer le Favori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Sección: Subida de Foto de Perfil Docente ───────────────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-amber-400" />
          Photo de Profil Enseignant (Ouvrir Fichier Image)
        </h2>
        <p className="text-xs text-slate-400">
          Téléversez une photo institutionnelle pour votre carte d'enseignant et vos certificats autorisés.
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
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : profileImageSrc
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-600 hover:border-amber-500/60 hover:bg-amber-500/5 bg-slate-800/40'
          }`}
        >
          {profileImageSrc ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <img
                src={profileImageSrc}
                alt="Foto Docente"
                className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-amber-500/30"
              />
              <div className="text-left space-y-1">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Image d'enseignant enregistrée localement
                </p>
                <p className="text-[11px] text-slate-400">Cliquez ou glissez un nouveau fichier pour mettre à jour votre photo.</p>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <Upload className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">
                  Sélectionner una photo de profil depuis votre appareil
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Formats supportés: JPG, PNG, WEBP (Jusqu'à 5 MB)
                </p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                📁 Chercher Photo Enseignant
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
              Supprimer Photo
            </button>
          </div>
        )}
      </div>

      {/* ─── Sección: Formulario Editar Datos Docentes ────────────────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" />
          Éditer el Formulario de Perfil y Licencia Docente
        </h2>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-emerald-200">Profil Enseignant Enregistré!</strong>
              <span>Vos données d'inscription et d'établissement ont été mises à jour dans la base locale.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Nom Complet *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
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
                  placeholder="+240 222 99 88 77"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Numéro de Carte Enseignant / Licence *</label>
              <div className="relative">
                <Award className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="LIC-ED-88420-GNQ"
                  className="w-full bg-slate-800 border border-amber-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <Save className="w-4 h-4" />
              Enregistrer Profil & Données Enseignantes
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
