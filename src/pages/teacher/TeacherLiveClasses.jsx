import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Radio,
  Calendar,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  PlusCircle,
  Play,
  Square,
  Users,
  MessageSquare,
  Send,
  CheckCircle2,
  Share2,
  FileText,
  Sparkles,
  Clock,
  X,
  ExternalLink,
  Cast,
  HelpCircle,
  Activity,
  Wifi,
  BookOpen,
  Award,
  Video,
  Trash2,
  BellRing
} from 'lucide-react';

const INITIAL_VIRTUAL_ROOMS = [
  {
    id: 'room-101',
    title: 'Session Audio en Direct : Résolution d\'Équations du Second Degré & Isolations',
    course: 'Mathématiques 4e Secondaire & Baccalauréat',
    format: 'Audio Compressé Faible Débit MP3',
    scheduledDate: 'Aujourd\'hui - Diffusion Active',
    roomCode: 'SALA-LIVE-8842-GNQ',
    status: 'Scheduled', // 'Live', 'Scheduled', 'Ended'
    teacherName: 'Prof. Baltasar Nsue Ondo',
    listenersCount: 18,
    slides: [
      { id: 's1', title: 'Formule Générale de l\'Équation du Second Degré', content: 'a·x² + b·x + c = 0  =>  x = [ -b ± √(b² - 4ac) ] / 2a' },
      { id: 's2', title: 'Exemple Pratique Guidé', content: 'x² - 5x + 6 = 0  =>  a=1, b=-5, c=6  =>  Discriminant = 25 - 24 = 1' }
    ],
    messages: [
      { id: 'm1', sender: 'Mariano Nsue', text: 'Professeur, le discriminant doit-il toujours être positif ?', time: '16:05' },
      { id: 'm2', sender: 'Esperanza Obono', text: 'Compris pour la formule générale, pouvons-nous faire un exemple avec des racines ?', time: '16:08' }
    ]
  },
  {
    id: 'room-102',
    title: 'Atelier Sonore en Direct : Loi d\'Ohm & Circuits Électriques à la Maison',
    course: 'Physique et Chimie 2e Baccalauréat',
    format: 'Audio Faible Débit & Tableau Interactif',
    scheduledDate: 'Vendredi 10:00 AM',
    roomCode: 'SALA-LIVE-9941-GNQ',
    status: 'Scheduled',
    teacherName: 'Prof. Baltasar Nsue Ondo',
    listenersCount: 12,
    slides: [
      { id: 's10', title: 'Principes de la Loi d\'Ohm', content: 'U = I · R  (Tension = Intensité × Résistance)' }
    ],
    messages: [
      { id: 'm10', sender: 'Pascal Eto\'o', text: 'L\'enregistrement hors-ligne sera-t-il partagé après ?', time: 'Hier' }
    ]
  }
];

export const TeacherLiveClasses = () => {
  const { user, addNotification } = useAuth();

  const [roomsList, setRoomsList] = useState(() => {
    try {
      const saved = localStorage.getItem('educ_live_rooms_data');
      return saved ? JSON.parse(saved) : INITIAL_VIRTUAL_ROOMS;
    } catch (e) {
      return INITIAL_VIRTUAL_ROOMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('educ_live_rooms_data', JSON.stringify(roomsList));
    } catch (e) {
      console.error(e);
    }
  }, [roomsList]);

  const [toastMsg, setToastMsg] = useState('');

  // ─── Estado de la Sala Virtual Activa (Broadcast Studio) ───────────────────
  const [activeBroadcastRoom, setActiveBroadcastRoom] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [livePollAnswered, setLivePollAnswered] = useState(false);

  // ─── Estado del Modal de Creación de Nueva Sala Virtual ────────────────────
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('Mathématiques Secondaire & Baccalauréat');
  const [newFormat, setNewFormat] = useState('Audio Compressé Faible Débit MP3');
  const [newScheduledDate, setNewScheduledDate] = useState('Aujourd\'hui même (Diffusion Immédiate)');
  const [newInitialSlide, setNewInitialSlide] = useState('');

  // Iniciar Transmisión / Abrir Sala Virtual
  const handleStartLiveSession = (room) => {
    const updatedRooms = roomsList.map(r =>
      r.id === room.id ? { ...r, status: 'Live' } : r
    );
    setRoomsList(updatedRooms);
    
    const activeObj = updatedRooms.find(r => r.id === room.id) || { ...room, status: 'Live' };
    setActiveBroadcastRoom(activeObj);
    setIsMicMuted(false);
    setCurrentSlideIndex(0);

    // ── Écrire une notification dans localStorage pour les étudiants ──
    try {
      const liveNotif = {
        id: `live-notif-${room.id}`,
        roomId: room.id,
        type: 'live',
        title: `🔴 Cours en Direct : ${room.title}`,
        text: `${user?.name || 'Votre enseignant'} a démarré une session en direct sur "${room.course}". Code : ${room.roomCode}`,
        roomCode: room.roomCode,
        teacherName: user?.name || 'Enseignant',
        course: room.course,
        startedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'live',
        read: false,
      };
      const existing = JSON.parse(localStorage.getItem('educ_live_notifications') || '[]');
      const filtered = existing.filter(n => n.roomId !== room.id);
      localStorage.setItem('educ_live_notifications', JSON.stringify([liveNotif, ...filtered]));
    } catch (e) { console.error(e); }
    
    if (addNotification) {
      addNotification({
        type: 'live',
        title: '🔴 Cours en Direct en Cours de Diffusion !',
        text: `L'enseignant ${user?.name || 'Enseignant'} a démarré la diffusion du cours en direct : "${room.title}".`,
        author: user?.name || 'Enseignant'
      });
    }

    setToastMsg(`Diffusion en direct DÉMARRÉE ! Salle Virtuelle "${room.title}" en direct.`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  // Finalizar Transmisión
  const handleEndLiveSession = () => {
    if (!activeBroadcastRoom) return;
    const updatedRooms = roomsList.map(r =>
      r.id === activeBroadcastRoom.id ? { ...r, status: 'Ended' } : r
    );
    setRoomsList(updatedRooms);

    // ── Mettre à jour la notification localStorage — session terminée ──
    try {
      const existing = JSON.parse(localStorage.getItem('educ_live_notifications') || '[]');
      const updated = existing.map(n =>
        n.roomId === activeBroadcastRoom.id ? { ...n, status: 'ended', title: `✅ Session Terminée : ${activeBroadcastRoom.title}` } : n
      );
      localStorage.setItem('educ_live_notifications', JSON.stringify(updated));
    } catch (e) { console.error(e); }

    setToastMsg(`Diffusion terminée ! L'enregistrement de la salle "${activeBroadcastRoom.title}" a été sauvegardé pour l'accès hors-ligne.`);
    setTimeout(() => setToastMsg(''), 5000);
    setActiveBroadcastRoom(null);
  };

  // Supprimer une salle virtuelle
  const handleDeleteRoom = (room) => {
    if (!confirm(`Supprimer la salle "${room.title}" ? Cette action est irréversible.`)) return;
    const updatedRooms = roomsList.filter(r => r.id !== room.id);
    setRoomsList(updatedRooms);
    // Retirer aussi la notification
    try {
      const existing = JSON.parse(localStorage.getItem('educ_live_notifications') || '[]');
      localStorage.setItem('educ_live_notifications', JSON.stringify(existing.filter(n => n.roomId !== room.id)));
    } catch (e) { console.error(e); }
    setToastMsg(`Salle "${room.title}" supprimée.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Enviar Mensaje en el Chat de la Sala Virtual
  const handleSendLiveChatMessage = (e) => {
    e.preventDefault();
    if (!liveChatInput.trim() || !activeBroadcastRoom) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: `${user?.name || 'Enseignant'}`,
      text: liveChatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: true
    };

    const updatedRoom = {
      ...activeBroadcastRoom,
      messages: [...(activeBroadcastRoom.messages || []), newMsg]
    };

    setActiveBroadcastRoom(updatedRoom);
    setRoomsList(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    setLiveChatInput('');
  };

  // Crear Nueva Sala Virtual
  const handleCreateVirtualRoom = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRoomObj = {
      id: `room-${Date.now()}`,
      title: newTitle.trim(),
      course: newCourse,
      format: newFormat,
      scheduledDate: newScheduledDate,
      roomCode: `SALA-LIVE-${Math.floor(1000 + Math.random() * 9000)}-GNQ`,
      status: 'Scheduled',
      teacherName: user?.name || 'Prof. Baltasar Nsue Ondo',
      listenersCount: 1,
      slides: [
        {
          id: `s-${Date.now()}`,
          title: 'Résumé & Tableau Numérique',
          content: newInitialSlide.trim() || 'Tableau interactif du cours en direct. Les notes seront mises à jour en direct.'
        }
      ],
      messages: [
        { id: 'm-init', sender: 'Système EDUC-EG', text: 'Salle Virtuelle créée avec succès. Le tchat s\'activera au démarrage de la diffusion.', time: 'À l\'instant' }
      ]
    };

    setRoomsList(prev => [newRoomObj, ...prev]);
    setToastMsg(`Nouvelle Salle Virtuelle "${newRoomObj.title}" créée et prête pour la diffusion !`);
    setTimeout(() => setToastMsg(''), 5000);

    // Resetear formulario
    setNewTitle('');
    setNewInitialSlide('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-20">
      
      {/* Header Clases en Directo */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Radio className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30 mb-1 inline-block">
              Studio de l'Enseignant • Salles Virtuelles En Direct
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white">Cours En Direct & Diffusion Faible Débit</h1>
            <p className="text-xs text-slate-300">Créez et lancez des salles virtuelles vocales, tableau numérique et chat de questions compressé.</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          Créer une Nouvelle Salle Virtuelle
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Lista de Salas Virtuales Programadas y Activas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Cast className="w-4 h-4 text-amber-400" /> Programmation des Salles Virtuelles ({roomsList.length})
          </h3>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            🟢 {roomsList.filter(r => r.status === 'Live').length} En Direct
          </span>
        </div>

        {roomsList.map((item) => {
          const isLive = item.status === 'Live';
          const isEnded = item.status === 'Ended';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl ${
                isLive
                  ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/50'
                  : isEnded
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-900/90 border-slate-700/80 hover:border-amber-500/50'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                    isLive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : isEnded
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {isLive ? '🟢 En Direct' : isEnded ? '📁 Terminée & Enregistrée' : '⏳ Salle Programmée'}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{item.course}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.roomCode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> {item.scheduledDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-indigo-400" /> {item.listenersCount || 10} Élèves Connectés
                  </span>
                  <span className="text-slate-400 font-medium">{item.format}</span>
                </div>
              </div>

              {/* Botones de Acción para el Profesor */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                {isLive ? (
                  <button
                    onClick={() => setActiveBroadcastRoom(item)}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Radio className="w-4 h-4 text-slate-950 animate-pulse" /> Rejoindre le Studio En Direct
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartLiveSession(item)}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Radio className="w-4 h-4 text-slate-950" /> Démarrer la Session En Direct
                  </button>
                )}
                {/* Bouton Supprimer */}
                {!isLive && (
                  <button
                    onClick={() => handleDeleteRoom(item)}
                    title="Supprimer cette salle"
                    className="p-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── ESTUDIO DE TRANSMISIÓN EN DIRECTO (SALA VIRTUAL INTERACTIVA) ────────── */}
      {activeBroadcastRoom && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/50 w-full max-w-5xl rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 relative max-h-[92vh] flex flex-col justify-between overflow-y-auto">
            
            {/* Header del Estudio en Vivo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                  <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      🔴 En Direct
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {activeBroadcastRoom.roomCode}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                      <Wifi className="w-3 h-3 text-emerald-400" /> Audio Low-Bandwidth 12.4 KB/s
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug mt-1">
                    {activeBroadcastRoom.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-emerald-300 font-bold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{activeBroadcastRoom.listenersCount || 18} Élèves dans la Salle</span>
                </span>

                <button
                  onClick={handleEndLiveSession}
                  className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Arrêter la session et sauvegarder l'enregistrement"
                >
                  <Square className="w-3.5 h-3.5 fill-red-400" /> Arrêter la Diffusion
                </button>
              </div>
            </div>

            {/* Layout Principal de la Sala Virtual (Pizarra + Audio + Chat) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
              
              {/* Columna Izquierda / Centro: Pizarra Digital & Controles de Audio */}
              <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
                
                {/* Visualizador de Onda de Voz & Estado del Micrófono */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-emerald-400" /> État d'Émission Vocale (Microphone Enseignant)
                    </span>
                    <button
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                        isMicMuted
                          ? 'bg-red-500/20 border-red-500/40 text-red-400'
                          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {isMicMuted ? (
                        <>
                          <MicOff className="w-4 h-4 text-red-400" /> Microphone Muet
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 text-emerald-400 animate-pulse" /> Microphone en Diffusion
                        </>
                      )}
                    </button>
                  </div>

                  {/* Visualizador Animado de Espectro de Audio */}
                  <div className="h-10 bg-slate-900 rounded-xl p-2 flex items-center justify-center gap-1 border border-slate-800">
                    {!isMicMuted ? (
                      <>
                        <div className="w-1 bg-emerald-400 h-6 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 bg-emerald-400 h-8 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 bg-emerald-400 h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
                        <div className="w-1 bg-emerald-400 h-7 animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <div className="w-1 bg-emerald-400 h-5 animate-bounce" style={{ animationDelay: '0.25s' }} />
                        <span className="text-[11px] text-emerald-300 font-mono font-bold ml-2">Audio en Direct Compressé (MP3 Stream)</span>
                      </>
                    ) : (
                      <span className="text-xs text-red-400 font-bold">Diffusion vocale en pause (Microphone Muet)</span>
                    )}
                  </div>
                </div>

                {/* Pizarra Digital Interactiva del Profesor */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Tableau Numérique & Diapositive en Direct
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Diapositive {currentSlideIndex + 1} sur {activeBroadcastRoom.slides?.length || 1}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 min-h-[140px] flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-white">
                      {activeBroadcastRoom.slides?.[currentSlideIndex]?.title || 'Tableau interactif'}
                    </h4>
                    <p className="text-xs text-amber-200 font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                      {activeBroadcastRoom.slides?.[currentSlideIndex]?.content || 'a·x² + b·x + c = 0 => x = [ -b ± √(b² - 4ac) ] / 2a'}
                    </p>
                  </div>

                  {/* Controles de Diapositiva */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                      ← Diapositive Précédente
                    </button>
                    <button
                      onClick={() => {
                        const newSlideTitle = prompt('Titre du nouveau concept pour le tableau :');
                        const newSlideContent = prompt('Formule ou texte explicite :');
                        if (newSlideTitle && newSlideContent) {
                          const newS = { id: `s-${Date.now()}`, title: newSlideTitle, content: newSlideContent };
                          const updatedSlides = [...(activeBroadcastRoom.slides || []), newS];
                          const updatedR = { ...activeBroadcastRoom, slides: updatedSlides };
                          setActiveBroadcastRoom(updatedR);
                          setCurrentSlideIndex(updatedSlides.length - 1);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 cursor-pointer"
                    >
                      + Écrire sur le Tableau
                    </button>
                    <button
                      disabled={currentSlideIndex >= (activeBroadcastRoom.slides?.length || 1) - 1}
                      onClick={() => setCurrentSlideIndex(prev => Math.min((activeBroadcastRoom.slides?.length || 1) - 1, prev + 1))}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                      Diapositive Suivante →
                    </button>
                  </div>
                </div>

              </div>

              {/* Columna Derecha: Chat de Dudas en Vivo de Alumnos */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3 min-h-[300px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> Tchat & Questions en Direct
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Real-Time</span>
                </div>

                {/* Mensajes del Chat */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-1">
                  {(activeBroadcastRoom.messages || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl text-xs space-y-1 ${
                        msg.isTeacher
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                          : 'bg-slate-900 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white">{msg.sender}</span>
                        <span className="text-slate-400 font-mono">{msg.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Formulario para Responder en el Chat */}
                <form onSubmit={handleSendLiveChatMessage} className="flex gap-1.5 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={liveChatInput}
                    onChange={(e) => setLiveChatInput(e.target.value)}
                    placeholder="Répondre à une question des élèves..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

            {/* Footer Modal Studio */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                À la fin de la session, les notes du tableau et l'audio seront automatiquement empaquetés pour les élèves hors-ligne.
              </span>
              <button
                onClick={() => setActiveBroadcastRoom(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Réduire la Fenêtre
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL DE CREACIÓN DE NUEVA SALA VIRTUAL ─────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-amber-500/20">
                <Radio className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Studio Enseignant • Création de Diffusion
                </span>
                <h2 className="text-xl font-bold text-white">Créer une Nouvelle Salle Virtuelle en Direct</h2>
              </div>
            </div>

            <form onSubmit={handleCreateVirtualRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Titre du Cours en Direct *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Atelier en Direct : Calcul des Réactions Chimiques & Équilibrage"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cours / Matière *</label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Mathématiques Secondaire & Baccalauréat">Mathématiques Secondaire & Baccalauréat</option>
                    <option value="Physique et Chimie 2e Baccalauréat">Physique et Chimie 2e Baccalauréat</option>
                    <option value="Informatique FP Réseaux & Serveurs">Informatique FP Réseaux & Serveurs</option>
                    <option value="Biologie & Santé Communautaire">Biologie & Santé Communautaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Horaire de Diffusion</label>
                  <input
                    type="text"
                    value={newScheduledDate}
                    onChange={(e) => setNewScheduledDate(e.target.value)}
                    placeholder="Ex : Aujourd'hui à 17:00 / Demain 10:00 AM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Format d'Émission Compressé</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Audio Compressé Faible Débit MP3">Audio Compressé Faible Débit MP3 + Tchat + Tableau</option>
                  <option value="Bulletin Texte & Graphiques Interactifs">Bulletin Texte & Graphiques Interactifs (Consommation minimale)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Formule ou Note Initiale pour le Tableau Numérique</label>
                <textarea
                  rows={2}
                  value={newInitialSlide}
                  onChange={(e) => setNewInitialSlide(e.target.value)}
                  placeholder="Ex : Écrire la formule ou l'énoncé de l'exercice à résoudre pendant le direct..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  Créer la Salle Virtuelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
