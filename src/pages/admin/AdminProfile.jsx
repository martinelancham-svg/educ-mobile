import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Save,
  Camera,
  Upload,
  Trash2,
  ImagePlus,
  Building,
  CreditCard,
  FileCheck,
  MapPin,
  Phone,
  FileText,
  Award
} from 'lucide-react';

export const AdminProfile = () => {
  const { user, setUser } = useAuth();

  // ─── Campos del Formulario de Registro e Identificación Admin ─────────────
  const [name, setName] = useState(user.name || 'Administrateur Central EDUC-EG GNQ');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '+240 222 00 11 22');
  const [company, setCompany] = useState(user.company || 'Ministère de l\'Éducation, de la Science et des Sports de Guinée Équatoriale');
  const [dipOrPassport, setDipOrPassport] = useState(user.dipOrPassport || 'DIP-GNQ-9847120-B');
  const [civilRegistry, setCivilRegistry] = useState(user.civilRegistry || 'RC-MALABO-2024-8841');
  const [address, setAddress] = useState(user.address || 'Quartier Caracolas, Route de l\'Aéroport, Malabo, Guinée Équatoriale');
  const [country, setCountry] = useState(user.country || 'Guinée Équatoriale (Malabo / Ciudad de la Paz)');
  const [cvFileName, setCvFileName] = useState(user.cvFile || 'Nomination_Officielle_Admin_GNQ.pdf');
  const [bio, setBio] = useState(user.bio || 'Surintendant du Système Éducatif Hors-Ligne et Réseau Régional de Serveurs USB.');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // ─── Foto de Perfil Admin (Base64) ─────────────────────────────────────────
  const [profileImageSrc, setProfileImageSrc] = useState(
    () => user.avatarUrl || localStorage.getItem('admin_profile_photo') || null
  );
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef(null);
  const cvFileInputRef = useRef(null);

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
      localStorage.setItem('admin_profile_photo', base64);
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
    localStorage.removeItem('admin_profile_photo');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUser(prev => ({ ...prev, avatarUrl: null }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      phoneNumber,
      company,
      dipOrPassport,
      civilRegistry,
      address,
      country,
      cvFile: cvFileName,
      bio,
      avatarUrl: profileImageSrc
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      
      {/* ─── Banner Perfil Administrador ───────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-purple-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar con foto de archivo o iniciales */}
          <div className="relative group shrink-0">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt="Foto de Perfil Admin"
                className="w-20 h-20 rounded-3xl object-cover shadow-xl shadow-purple-500/20 border-2 border-purple-500/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-purple-500/20">
                {user.name ? user.name.charAt(0) : 'A'}
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
              <h1 className="text-2xl font-bold text-white">{name || user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                Super Administrateur
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                DIP: {dipOrPassport}
              </span>
            </div>
            <p className="text-xs text-slate-300">{user.email}</p>
            <p className="text-xs text-purple-300 font-semibold mt-1">{company}</p>
          </div>
        </div>

        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700 text-center px-6 shrink-0">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Attestation Officielle</span>
          <strong className="text-lg font-extrabold text-purple-300 flex items-center justify-center gap-1">
            <ShieldCheck className="w-5 h-5 text-purple-400" /> Vérifiée
          </strong>
        </div>
      </div>

      {/* ─── Sección 1: Foto de Perfil del Admin ───────────────────────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-purple-400" />
          Photo de Profil de l'Administrateur
        </h2>
        <p className="text-xs text-slate-400">
          Télécharger ou mettre à jour la photo de profil de l'administrateur pour la carte d'identification.
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
              ? 'border-purple-400 bg-purple-500/10 scale-[1.01]'
              : profileImageSrc
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-600 hover:border-purple-500/60 hover:bg-purple-500/5 bg-slate-800/40'
          }`}
        >
          {profileImageSrc ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <img
                src={profileImageSrc}
                alt="Foto Admin"
                className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-purple-500/40"
              />
              <div className="text-left space-y-1">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Photo de profil gérée localement
                </p>
                <p className="text-[11px] text-slate-400">Cliquez ou glissez un nouveau fichier pour mettre à jour votre photo.</p>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <Upload className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">
                  Sélectionner la photo de profil de l'administrateur
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Formats pris en charge: JPG, PNG, WEBP (Jusqu'à 5 Mo)
                </p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 hover:bg-purple-500/30 transition-colors">
                📁 Parcourir Photo Admin
              </span>
            </div>
          )}
        </div>

        {profileImageSrc && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-red-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer Photo
            </button>
          </div>
        )}
      </div>

      {/* ─── Sección 2: Resumen de Datos de Registro Admin Guardados ────────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Données du Formulario de Registro e Identificación Admin Enregistrées
          </h2>
          <span className="text-[11px] bg-purple-500/20 text-purple-300 font-bold px-3 py-1 rounded-full border border-purple-500/30">
            Enregistrement Officiel GNQ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Entreprise / Ministère</span>
            <p className="font-bold text-white text-sm">{company}</p>
            <p className="text-slate-300">Administrateur : <strong className="text-purple-300">{name}</strong></p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <Phone className="w-3.5 h-3.5" /> {phoneNumber}
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Identification Officielle</span>
            <p className="font-mono font-bold text-emerald-300">DIP / Passeport : {dipOrPassport}</p>
            <p className="text-slate-200">Registre Civil / Commercial : <strong className="text-amber-300">{civilRegistry}</strong></p>
            <p className="text-slate-400">Pays : {country}</p>
          </div>

          <div className="md:col-span-2 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/40 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Domicile & Document d'Accréditation</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div><strong>Domicile Légal :</strong> {address}</div>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Fichier CV / Nomination : {cvFileName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sección 3: Formulario Editar Datos de Registro Admin ─────────────── */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" />
          Éditer le Formulaire d'Enregistrement (Entreprise, DIP, Registre Civil, CV, Domicile)
        </h2>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-emerald-200">Profil Admin Enregistré !</strong>
              <span>Vos données institutionnelles, DIP, Registre Civil et Domicile ont été mises à jour.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Empresa / Ministerio / Institución */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block">Entreprise / Ministère / Institution Gouvernementale *</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex : Ministère de l'Éducation, de la Science et des Sports de Guinée Équatoriale"
                  className="w-full bg-slate-800 border border-purple-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Nom Complet de l'Administrateur *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Email (Disabled) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Adresse E-mail (Enregistrée)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Número de DIP o Pasaporte */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Numéro de DIP ou Passeport *</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  required
                  value={dipOrPassport}
                  onChange={(e) => setDipOrPassport(e.target.value)}
                  placeholder="Ex : DIP-GNQ-9847120-B"
                  className="w-full bg-slate-800 border border-emerald-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Número de Registro Civil / Mercantil */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Numéro de Registre Civil / Officiel *</label>
              <div className="relative">
                <FileCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  required
                  value={civilRegistry}
                  onChange={(e) => setCivilRegistry(e.target.value)}
                  placeholder="Ex : RC-MALABO-2024-8841"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Domicilio / Dirección de Residencia */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block">Domicile / Adresse de Résidence en Guinée Équatoriale *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex : Quartier Caracolas, Route de l'Aéroport, Malabo, Guinée Équatoriale"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Teléfono / WhatsApp */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Téléphone / WhatsApp *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+240 222 00 11 22"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Archivo CV / Acreditación PDF */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Joindre un Fichier (CV / Accréditation PDF)</label>
              <div className="relative">
                <input
                  ref={cvFileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleCvFileChange}
                />
                <button
                  type="button"
                  onClick={() => cvFileInputRef.current?.click()}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-blue-300 flex items-center justify-between hover:bg-slate-750 transition-colors"
                >
                  <span className="truncate">{cvFileName || 'Sélectionner le fichier CV (.pdf)'}</span>
                  <Upload className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
                </button>
              </div>
            </div>

            {/* País / Región */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block">Pays / Emplacement Régional</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Guinée Équatoriale (Malabo / Bata)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-purple-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <Save className="w-4 h-4" />
              Enregistrer Profil Admin & Données Institutionnelles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
