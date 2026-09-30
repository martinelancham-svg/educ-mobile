import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  BookOpen,
  Send,
  X,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Tag,
  DollarSign,
  MapPin,
  Laptop,
  Wifi
} from 'lucide-react';

const FORMAT_PRICES = {
  // Opciones Telemáticas vía Plataforma
  'Télématique: Audio Comprimé Low-Bandwidth': '1.500 FCFA (~ 2,50 €)',
  'Télématique: Consultation Écrite Résolue Étape par Étape': '1.000 FCFA (~ 1,50 €)',
  'Télématique: Session Numérique Complète avec Exercices': '2.500 FCFA (~ 3,80 €)',
  // Opciones Presenciales
  'Présentiel: Cours en Centre Éducatif / Classe Rurale': '3.000 FCFA (~ 4,50 €)',
  'Présentiel: Tutorat Individuel Intensif (Domicile)': '4.000 FCFA (~ 6,00 €)',
  'Présentiel: Révision d\'Examens & Cahiers': '2.500 FCFA (~ 3,80 €)'
};

export const PrivateTutoringRequestModal = ({ isOpen, onClose, defaultTeacherName }) => {
  const { user, addTutoringRequest } = useAuth();
  const { isEffectiveOffline } = useOffline();

  const [modality, setModality] = useState('telematica'); // 'presencial' | 'telematica'
  const [teacherName, setTeacherName] = useState(defaultTeacherName || 'Prof. Jean-Paul Mbarga');
  const [studentName, setStudentName] = useState(user?.name || 'Emmanuel Olinga');
  const [studentPhone, setStudentPhone] = useState(user?.phoneNumber || '+240 222 12 34 56');
  const [subject, setSubject] = useState('Mathématiques Secondaire: Équations du Second Degré');
  const [preferredDate, setPreferredDate] = useState('2026-08-22');
  const [preferredTime, setPreferredTime] = useState('16:00');
  const [tutoringFormat, setTutoringFormat] = useState('Télématique: Audio Comprimé Low-Bandwidth');
  const [price, setPrice] = useState('1.500 FCFA (~ 2,50 €)');
  const [notes, setNotes] = useState('');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFormatChange = (newFormat) => {
    setTutoringFormat(newFormat);
    setPrice(FORMAT_PRICES[newFormat] || '1.500 FCFA (~ 2,50 €)');
  };

  const handleModalitySwitch = (newModality) => {
    setModality(newModality);
    if (newModality === 'presencial') {
      const defaultPresencial = 'Présentiel: Cours en Centre Éducatif / Classe Rurale';
      setTutoringFormat(defaultPresencial);
      setPrice(FORMAT_PRICES[defaultPresencial]);
    } else {
      const defaultTelematica = 'Télématique: Audio Comprimé Low-Bandwidth';
      setTutoringFormat(defaultTelematica);
      setPrice(FORMAT_PRICES[defaultTelematica]);
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    const formattedModalityLabel = modality === 'presencial' ? '📍 PRESENCIAL' : '💻 TELEMÁTICA (Vía Plataforma)';
    const fullFormatString = `${formattedModalityLabel} - ${tutoringFormat}`;

    if (addTutoringRequest) {
      addTutoringRequest({
        studentName,
        studentPhone,
        teacherName,
        subject,
        preferredDate,
        preferredTime,
        format: fullFormatString,
        price,
        notes
      });
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative space-y-5 my-8">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-1 inline-block">
              Tutorat Individuel 1 à 1
            </span>
            <h2 className="text-lg font-bold text-white">Demande de Cours Particulier avec Enseignant</h2>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">¡Demande Enregistrée avec Succès!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Votre demande de cours particulier (<span className="text-amber-300 font-bold">{modality === 'presencial' ? '📍 Présentiel' : '💻 Télématique via Plateforme'}</span>) avec <strong>{teacherName}</strong> pour <span className="text-emerald-400 font-bold">{price}</span> a été envoyée.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitRequest} className="space-y-4">

            {/* Selección de Modalidad Principal: PRESENCIAL vs TELEMÁTICA VÍA PLATAFORMA */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Sélectionnez la Modalité du Cours *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Opción 1: PRESENCIAL */}
                <button
                  type="button"
                  onClick={() => handleModalitySwitch('presencial')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    modality === 'presencial'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${modality === 'presencial' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-extrabold text-white">Cours Présentiel</strong>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">En Direct</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                      En Centre Éducatif, Classe Rurale ou Domicile de l'élève.
                    </p>
                  </div>
                </button>

                {/* Opción 2: TELEMÁTICA VÍA PLATAFORMA */}
                <button
                  type="button"
                  onClick={() => handleModalitySwitch('telematica')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    modality === 'telematica'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${modality === 'telematica' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-extrabold text-white">Télématique via Plateforme</strong>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">EDUC-EG</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                      Audio low-bandwidth, consultation écrite ou session interactive.
                    </p>
                  </div>
                </button>

              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Enseignant Souhaité</label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Prof. Jean-Paul Mbarga">Prof. Jean-Paul Mbarga (Maths & Agro)</option>
                  <option value="Prof. Carmen Ruiz">Prof. Carmen Ruiz (Mathématiques Secondaire)</option>
                  <option value="Prof. David Alarcón">Prof. David Alarcón (Physique et Chimie)</option>
                  <option value="Dra. Solange Nguema">Dra. Solange Nguema (Santé & Sciences)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Matière / Sujet de Renforcement *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Équations du Second Degré ou Loi d'Ohm"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Nom du Demandeur *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Téléphone / WhatsApp de Contact *</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+240 222 12 34 56"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Date Préférée *</label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Heure Préférée *</label>
                <input
                  type="time"
                  required
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Sub-formato de Formato Específico según la Modalidad seleccionada */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  Détail du Format ({modality === 'presencial' ? '📍 Présentiel' : '💻 Télématique'}) *
                </label>
                <select
                  value={tutoringFormat}
                  onChange={(e) => handleFormatChange(e.target.value)}
                  className="w-full bg-slate-800 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                >
                  {modality === 'telematica' ? (
                    <>
                      <option value="Télématique: Audio Comprimé Low-Bandwidth">Audio Low-Bandwidth via Plateforme (1.500 FCFA / 2,50 €)</option>
                      <option value="Télématique: Consultation Écrite Résolue Étape par Étape">Consultation Écrite Étape par Étape (1.000 FCFA / 1,50 €)</option>
                      <option value="Télématique: Session Numérique Complète avec Exercices">Session Numérique Guidée sur App (2.500 FCFA / 3,80 €)</option>
                    </>
                  ) : (
                    <>
                      <option value="Présentiel: Cours en Centre Éducatif / Classe Rurale">Cours Présentiel Centre Éducatif (3.000 FCFA / 4,50 €)</option>
                      <option value="Présentiel: Tutorat Individuel Intensif (Domicile)">Tutorat Présentiel 1 à 1 Domicile (4.000 FCFA / 6,00 €)</option>
                      <option value="Présentiel: Révision d'Examens & Cahiers">Révision Présentielle Cahiers (2.500 FCFA / 3,80 €)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-300 block flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tarif Calculé
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Commentaires ou Questions Spécifiques</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indiquez les leçons ou exercices spécifiques sur lesquels vous avez besoin d'aide..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-700"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer hover:bg-amber-400 transition-all"
              >
                <Send className="w-4 h-4" />
                Envoyer Demande ({price})
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

