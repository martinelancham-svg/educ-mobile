import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import {
  BookOpen,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Upload,
  Award,
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock,
  WifiOff,
  MapPin,
  Calendar,
  BookMarked,
  Users,
  MessageSquare
} from 'lucide-react';

const GRADE_OPTIONS = [
  '1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire',
  '1ère Secondaire', '2ème Secondaire', '3ème Secondaire', '4ème Secondaire',
  'Baccalauréat 1', 'Baccalauréat 2',
  'Université / Formation Professionnelle', 'Éducation des Adultes / Continue'
];

export const LoginPage = () => {
  const { login, submitTeacherApplication, submitStudentApplication } = useAuth();
  const { isEffectiveOffline } = useOffline();

  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('student');

  // Campos generales
  const [email, setEmail] = useState('etudiant@educ-eg.org');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Campos específicos Estudiante
  const [age, setAge] = useState('');
  const [gradeLevel, setGradeLevel] = useState('4ème Secondaire');
  const [schoolName, setSchoolName] = useState('');
  const [country, setCountry] = useState('Afrique Centrale');
  const [comments, setComments] = useState('');
  // Datos del tutor (menores de 18)
  const [tutorName, setTutorName] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');
  const [tutorRelationship, setTutorRelationship] = useState('Père/Mère');

  // Campos específicos Profesor
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('5 ans');
  const [workplaces, setWorkplaces] = useState('');
  const [specialty, setSpecialty] = useState('Mathématiques et Sciences');
  const [cvFileName, setCvFileName] = useState('');
  const [teacherYoutube, setTeacherYoutube] = useState('');
  const [teacherTiktok, setTeacherTiktok] = useState('');
  const [teacherInstagram, setTeacherInstagram] = useState('');
  const [teacherWhatsapp, setTeacherWhatsapp] = useState('');
  const [teacherTelegram, setTeacherTelegram] = useState('');
  const [teacherFacebook, setTeacherFacebook] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [pendingNotice, setPendingNotice] = useState('');

  const isMinor = Number(age) > 0 && Number(age) < 18;

  const handleSelectRoleTab = (role) => {
    setSelectedRole(role);
    setPendingNotice('');
    setErrorMsg('');
    const demo = DEMO_ACCOUNTS.find(a => a.role === role);
    if (demo) setEmail(demo.email);
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCvFileName(file.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setPendingNotice('');

    if (mode === 'login') {
      if (!email.trim()) { setErrorMsg('Veuillez saisir votre adresse e-mail'); return; }
      const res = login(email, password, selectedRole);
      if (res && !res.success && res.isPendingApproval) {
        setPendingNotice(res.message);
      }
      return;
    }

    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
      setErrorMsg('Veuillez remplir votre nom, e-mail et numéro de téléphone.');
      return;
    }

    if (selectedRole === 'student') {
      if (!age || !schoolName.trim()) {
        setErrorMsg('Veuillez remplir l\'âge et l\'établissement fréquenté.');
        return;
      }
      if (isMinor && !tutorName.trim()) {
        setErrorMsg('Pour les mineurs, le nom et le téléphone du parent/tuteur sont obligatoires.');
        return;
      }

      submitStudentApplication({
        name,
        email,
        phoneNumber,
        age,
        gradeLevel,
        schoolName,
        country,
        comments,
        isMinor,
        tutorName: isMinor ? tutorName : '',
        tutorPhone: isMinor ? tutorPhone : '',
        tutorRelationship: isMinor ? tutorRelationship : ''
      });

      setPendingNotice(
        `¡DEMANDE D'INSCRIPTION ENVOYÉE AVEC SUCCÈS! Votre inscription en tant qu'Étudiant (${gradeLevel} - ${schoolName}) est EN ATTENTE D'APPROBATION PAR L'ADMINISTRATEUR. Vous recevrez l'accès une fois validée.`
      );
      setMode('login');

    } else if (selectedRole === 'teacher') {
      if (!licenseNumber.trim() || !workplaces.trim()) {
        setErrorMsg('Veuillez remplir le numéro de licence et les anciens établissements.');
        return;
      }

      submitTeacherApplication({
        name,
        email,
        phoneNumber,
        licenseNumber,
        experienceYears,
        workplaces,
        specialty,
        cvFile: cvFileName || 'Curriculum_Vitae_Enseignant.pdf',
        school: workplaces.split(',')[0],
        country,
        youtube: teacherYoutube,
        tiktok: teacherTiktok,
        instagram: teacherInstagram,
        whatsapp: teacherWhatsapp,
        telegram: teacherTelegram,
        facebook: teacherFacebook
      });

      setPendingNotice(
        `¡DEMANDE ENVOYÉE AVEC SUCCÈS! Votre inscription comme Enseignant avec la Licence Nº ${licenseNumber} a été envoyée. L'ADMINISTRATEUR DEVRA EXAMINER ET VALIDER VOTRE DEMANDE.`
      );
      setMode('login');
    }
  };

  const handleQuickDemoLogin = (acc) => {
    setSelectedRole(acc.role);
    setPendingNotice('');
    setErrorMsg('');
    login(acc.email, acc.password, acc.role);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

        {/* Columna Izquierda */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Système Autonome Hors-Ligne</span>
          </div>

          <div className="flex justify-center lg:justify-start items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <BookOpen className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">EDUC-EG</h1>
              <p className="text-xs text-slate-400">Éducation & Apprentissage Hors-Ligne</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Plateforme éducative hors-ligne pour zones à faible connectivité. L'inscription des étudiants et enseignants est soumise à la validation de l'Administrateur.
          </p>

          {/* Accesos Rápidos Demo */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Accès instantané (Mode Démo):</span>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.role}
                onClick={() => handleQuickDemoLogin(acc)}
                className="w-full text-left p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/40 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${acc.role === 'student' ? 'bg-emerald-500/20 text-emerald-300' : acc.role === 'teacher' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'}`}>
                    {acc.role === 'student' ? <GraduationCap className="w-4 h-4" /> : acc.role === 'teacher' ? <UserCheck className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400">{acc.name}</h4>
                    <p className="text-[10px] text-slate-400">{acc.role === 'student' ? 'Étudiant' : acc.role === 'teacher' ? 'Enseignant Validé' : 'Administrateur'}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-white flex items-center gap-1">Entrer <ArrowRight className="w-3 h-3" /></span>
              </button>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-700/80 shadow-2xl space-y-5">

            {/* Selector de Rol */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
              {[
                { role: 'student', label: 'Étudiant', Icon: GraduationCap, active: 'bg-emerald-500 text-slate-950' },
                { role: 'teacher', label: 'Enseignant', Icon: UserCheck, active: 'bg-amber-500 text-slate-950' },
                { role: 'admin', label: 'Admin', Icon: ShieldCheck, active: 'bg-purple-500 text-white' }
              ].map(({ role, label, Icon, active }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelectRoleTab(role)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${selectedRole === role ? active + ' shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Encabezado */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white">
                  {mode === 'login' ? `Connexion — ${selectedRole === 'student' ? 'Étudiant' : selectedRole === 'teacher' ? 'Enseignant' : 'Administrateur'}` : `Demande d'Inscription — ${selectedRole === 'student' ? 'Étudiant' : 'Enseignant'}`}
                </h2>
                <p className="text-xs text-slate-400">
                  {mode === 'register' ? 'Votre demande sera examinée et validée par l\'Administrateur.' : 'Authentification locale sécurisée'}
                </p>
              </div>
              <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setPendingNotice(''); setErrorMsg(''); }}
                className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer shrink-0">
                {mode === 'login' ? 'Créer un compte ?' : 'Déjà un compte ?'}
              </button>
            </div>

            {/* Alertas */}
            {pendingNotice && (
              <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Clock className="w-4 h-4" /> Statut de la Demande
                </div>
                <p className="leading-relaxed">{pendingNotice}</p>
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 font-semibold">{errorMsg}</div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Nom Complet *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Pascal Eto'o"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
              )}

              <div className={`grid gap-3 ${mode === 'register' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Adresse E-mail *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="utilisateur@educ-eg.org"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Téléphone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+240 222 12 34 56"
                        className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Mot de Passe *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              {mode === 'register' && selectedRole === 'student' && (
                <div className="space-y-4 pt-3 border-t border-slate-800 animate-fadeIn">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    2. Informations Académiques & Établissement:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Âge *</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="number" required min="5" max="80" value={age} onChange={e => setAge(e.target.value)} placeholder="Ex: 15"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                      </div>
                      {isMinor && (
                        <p className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          ⚠ Mineur — Informations du tuteur requises
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Niveau Académique *</label>
                      <div className="relative">
                        <BookMarked className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none">
                          {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Nom de l'Établissement Fréquenté *</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input type="text" required value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Ex: Lycée National Rey Malabo"
                          className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Pays / Région</label>
                      <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Ex: Afrique Centrale"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Commentaires (Optionnel)</label>
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <textarea rows={2} value={comments} onChange={e => setComments(e.target.value)} placeholder="Pourquoi souhaitez-vous rejoindre la plateforme?"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {isMinor && (
                    <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-3 animate-fadeIn">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                        3. Informations du Parent / Tuteur (Obligatoire pour les mineurs):
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 block">Nom Complet du Tuteur *</label>
                          <div className="relative">
                            <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                            <input type="text" required={isMinor} value={tutorName} onChange={e => setTutorName(e.target.value)} placeholder="Ex: Santiago Nsue"
                              className="w-full bg-slate-900 border border-amber-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 block">Téléphone / WhatsApp du Tuteur *</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                            <input type="tel" required={isMinor} value={tutorPhone} onChange={e => setTutorPhone(e.target.value)} placeholder="+240 222 77 88 99"
                              className="w-full bg-slate-900 border border-amber-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 block">Relation avec le Mineur</label>
                          <select value={tutorRelationship} onChange={e => setTutorRelationship(e.target.value)}
                            className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-white">
                            <option>Père/Mère</option>
                            <option>Tuteur Légal</option>
                            <option>Grand-père/Grand-mère</option>
                            <option>Frère/Sœur Aîné(e)</option>
                            <option>Directeur de l'Établissement</option>
                            <option>Autre</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mode === 'register' && selectedRole === 'teacher' && (
                <div className="space-y-3 pt-3 border-t border-slate-800 animate-fadeIn">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">2. Vérification Enseignant:</span>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Numéro de Licence Éducative / Carte *</label>
                    <div className="relative">
                      <Award className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="text" required value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="Ex: LIC-ED-88420-GNQ"
                        className="w-full bg-slate-900 border border-amber-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Années d'Expérience *</label>
                      <input type="text" required value={experienceYears} onChange={e => setExperienceYears(e.target.value)} placeholder="Ex: 8 ans"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">Spécialité / Discipline</label>
                      <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="Ex: Physique et Chimie"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Anciens Établissements / Écoles *</label>
                    <input type="text" required value={workplaces} onChange={e => setWorkplaces(e.target.value)} placeholder="Ex: Lycée Central, Institut Polytechnique"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Joindre le CV (PDF) *</label>
                    <div className="relative border border-dashed border-amber-500/40 rounded-xl p-3 bg-slate-900/60 text-center cursor-pointer">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex items-center justify-center gap-2 text-xs text-amber-300">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>{cvFileName ? `✓ ${cvFileName}` : 'Cliquez pour sélectionner votre CV (.pdf)'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                      3. Réseaux Sociaux Éducatifs (Optionnel):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 block">Chaîne YouTube</label>
                        <input type="text" value={teacherYoutube} onChange={e => setTeacherYoutube(e.target.value)} placeholder="youtube.com/@Professeur"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 block">Compte TikTok Éducatif</label>
                        <input type="text" value={teacherTiktok} onChange={e => setTeacherTiktok(e.target.value)} placeholder="@professeur_education"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 block">Profil Instagram</label>
                        <input type="text" value={teacherInstagram} onChange={e => setTeacherInstagram(e.target.value)} placeholder="@professeur.officiel"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 block">Groupe WhatsApp / Numéro</label>
                        <input type="text" value={teacherWhatsapp} onChange={e => setTeacherWhatsapp(e.target.value)} placeholder="+240 222 88 44 20"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 block">Canal Telegram (PDFs)</label>
                        <input type="text" value={teacherTelegram} onChange={e => setTeacherTelegram(e.target.value)} placeholder="@EducEG"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-300 block">Page Facebook / X</label>
                        <input type="text" value={teacherFacebook} onChange={e => setTeacherFacebook(e.target.value)} placeholder="facebook.com/professeur"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button type="submit"
                  className={`w-full py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'student' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950' :
                    selectedRole === 'teacher' ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950' :
                    'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  }`}>
                  <Lock className="w-4 h-4" />
                  {mode === 'login'
                    ? `Se connecter en tant qu'${selectedRole === 'student' ? 'Étudiant' : selectedRole === 'teacher' ? 'Enseignant' : 'Administrateur'}`
                    : selectedRole === 'student'
                      ? 'Envoyer la Demande d\'Inscription Étudiant'
                      : 'Envoyer la Demande d\'Inscription Enseignant'}
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Les inscriptions des étudiants et des enseignants sont validées par l'Administrateur.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
