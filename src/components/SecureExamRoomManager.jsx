import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import {
  Lock,
  Unlock,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlusCircle,
  Search,
  ShieldCheck,
  HelpCircle,
  Send,
  Award,
  RotateCcw,
  FileText,
  Sparkles,
  X,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Radio,
  Eye,
  Key,
  Shield,
  AlertCircle,
  UserCheck,
  UserX,
  RefreshCw,
  Edit3,
  Trash2,
  Filter,
  BarChart2
} from 'lucide-react';

/*
  ARQUITECTURA DE ESTADOS DEL MODO EXAMEN SEGURO:
  
  Estado del Estudiante:
    - WAITING: Registrado / Esperando inicio del examen
    - IN_PROGRESS: Examen en curso en Modo Lockdown Seguro
    - COMPLETED: Examen entregado y evaluado
    - LEFT: Abandono o cambio de pestaña detectado
    - INCIDENT_PENDING: Solicitud de reincorporación enviada al profesor
    - DISQUALIFIED: Reingreso rechazado / Descalificado por el docente

  Estado de la Sala:
    - WAITING: Sala abierta y esperando estudiantes
    - EXAM_RUNNING: Examen en curso
    - CLOSED: Sala cerrada manualmente o por regla estricta de abandono
*/

const INITIAL_EXAM_ROOMS = [
  {
    id: 'room-exam-1',
    code: 'EXAM-8F42K',
    title: 'Examen Officiel: Programmation Web & Javascript ES6',
    subject: 'Informatique & Développement Web',
    durationMinutes: 60,
    startTime: '10:00 AM',
    maxParticipants: 30,
    allowAbandonment: false, // Strict lockdown
    strictRoomShutdown: false, // Modo Estándar: Abandono afecta solo al alumno. Modo Estricto: Cierra la sala completa.
    blockAiAndDocs: true,
    teacherName: 'Prof. Baltasar Nsue Ondo',
    status: 'EXAM_RUNNING', // WAITING, EXAM_RUNNING, CLOSED
    questions: [
      {
        id: 'q1',
        text: 'Lequel des mots-clés suivants définit une variable à portée de bloc en JavaScript?',
        options: ['var', 'let', 'global', 'define'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'Quelle méthode d\'Array est utilisée pour transformer tous les éléments en renvoyant un nouveau tableau?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        text: 'Quelle est la fonction de l\'événement DOM `DOMContentLoaded`?',
        options: [
          'Il se déclenche au téléchargement des images',
          'Il s\'exécute lorsque le document HTML a été complètement analysé',
          'Il s\'active lors de la fermeture de l\'onglet du navigateur',
          'Il connecte le serveur à IndexedDB'
        ],
        correctAnswer: 1
      },
      {
        id: 'q4',
        text: 'En architecture Web Hors-Ligne, quel est l\'objectif d\'IndexedDB?',
        options: [
          'Stocker des feuilles de style CSS en mémoire RAM',
          'Base de données structurée locale pour stockage sans connexion',
          'Transmettre de la vidéo en direct à 60 fps',
          'Chiffrer les mots de passe sur le serveur central'
        ],
        correctAnswer: 1
      }
    ],
    enrolledStudents: [
      { id: 's1', name: 'Mariano Nsue Nchama', status: 'COMPLETED', score: 100, submittedAt: '10:42 AM' },
      { id: 's2', name: 'Esperanza Obono', status: 'IN_PROGRESS', score: null },
      { id: 's3', name: 'Pascal Eto\'o Nchama', status: 'IN_PROGRESS', score: null }
    ],
    incidents: [
      {
        id: 'inc-1',
        studentName: 'Juan Pérez',
        reason: 'Perte temporaire de connexion / Changement d\'onglet accidentel',
        timestamp: '10:27 AM',
        status: 'INCIDENT_PENDING' // INCIDENT_PENDING, AUTHORIZED, REJECTED
      }
    ]
  },
  {
    id: 'room-exam-2',
    code: 'EXAM-7251K',
    title: 'Évaluation Diagnostique de Physique et Chimie',
    subject: 'Physique & Chimie',
    durationMinutes: 30,
    startTime: '09:00 AM',
    maxParticipants: 30,
    allowAbandonment: false,
    strictRoomShutdown: true,
    blockAiAndDocs: true,
    teacherName: 'Prof. Baltasar Nsue Ondo',
    status: 'CLOSED',
    questions: [
      {
        id: 'q-201',
        text: 'Quelle est l\'équation mathématique de la Deuxième Loi de Newton?',
        options: ['F = m · a', 'E = m · c²', 'V = I · R', 'P = W / t'],
        correctAnswer: 0
      },
      {
        id: 'q-202',
        text: 'Quelle unité mesure la résistance électrique dans le Système International?',
        options: ['Volt (V)', 'Ampère (A)', 'Ohm (Ω)', 'Watt (W)'],
        correctAnswer: 2
      }
    ],
    enrolledStudents: [],
    incidents: []
  },
  {
    id: 'room-exam-3',
    code: 'EXAM-9942M',
    title: 'Évaluation Partielle: Mathématiques 4ème Secondaire - Équations et Géométrie',
    subject: 'Mathématiques Secondaire',
    durationMinutes: 45,
    startTime: '12:30 PM',
    maxParticipants: 25,
    allowAbandonment: false,
    strictRoomShutdown: true,
    blockAiAndDocs: true,
    teacherName: 'Prof. Baltasar Nsue Ondo',
    status: 'WAITING',
    questions: [
      {
        id: 'qm1',
        text: 'Dans l\'équation du second degré x² - 5x + 6 = 0, quelles sont les racines solutions?',
        options: ['x = 1, x = 6', 'x = 2, x = 3', 'x = -2, x = -3', 'x = 0, x = 5'],
        correctAnswer: 1
      },
      {
        id: 'qm2',
        text: 'Quel théorème établit la relation a² + b² = c² dans les triangles rectangles?',
        options: ['Théorème de Thalès', 'Théorème de Pythagore', 'Théorème de Gauss', 'Loi d\'Ohm'],
        correctAnswer: 1
      }
    ],
    enrolledStudents: [],
    incidents: []
  },
  {
    id: 'room-exam-4',
    code: 'EXAM-3319B',
    title: 'Évaluation de Biologie Cellulaire & Génétique UNGE 2026',
    subject: 'Biologie & Sciences Naturelles',
    durationMinutes: 50,
    startTime: '02:00 PM',
    maxParticipants: 30,
    allowAbandonment: false,
    strictRoomShutdown: false,
    blockAiAndDocs: true,
    teacherName: 'Dra. Solange Nguema Avomo',
    status: 'EXAM_RUNNING',
    questions: [
      {
        id: 'q-401',
        text: 'Quel organite cellulaire est responsable de la respiration cellulaire et de la production d\'ATP?',
        options: ['Noyau', 'Mitochondrie', 'Ribosome', 'Appareil de Golgi'],
        correctAnswer: 1
      },
      {
        id: 'q-402',
        text: 'Quel acide nucléique stocke l\'information génétique héréditaire chez les eucaryotes?',
        options: ['ARNm', 'ADN', 'ARNt', 'Protéine'],
        correctAnswer: 1
      }
    ],
    enrolledStudents: [],
    incidents: []
  },
  {
    id: 'room-exam-5',
    code: 'EXAM-5510H',
    title: 'Examen d\'Histoire Contemporaine & Géographie de Guinée Équatoriale',
    subject: 'Histoire & Géographie',
    durationMinutes: 40,
    startTime: '04:00 PM',
    maxParticipants: 35,
    allowAbandonment: false,
    strictRoomShutdown: false,
    blockAiAndDocs: true,
    teacherName: 'Prof. Carmen Ruiz Nchama',
    status: 'WAITING',
    questions: [
      {
        id: 'q-501',
        text: 'En quelle année a été proclamée l\'Indépendance de la République de Guinée Équatoriale?',
        options: ['1960', '1968 (12 Octobre)', '1975', '1982'],
        correctAnswer: 1
      },
      {
        id: 'q-502',
        text: 'Quel est le sommet montagneux le plus élevé de l\'Île de Bioko (3.011 m)?',
        options: ['Mont Alén', 'Pic Basilé', 'Pic d\'Annobón', 'Chaîne de Cristal'],
        correctAnswer: 1
      }
    ],
    enrolledStudents: [],
    incidents: []
  }
];

export const SecureExamRoomManager = ({ onLockdownStateChange }) => {
  const { user, activeRole, recordQuizResult, addNotification } = useAuth();
  const { isEffectiveOffline } = useOffline();

  const [examRooms, setExamRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('educ_exam_rooms');
      if (saved) {
        if (saved.includes('Physique & Chimie') || saved.includes('Mode Strict') || saved.includes('Mode Standard') || saved.includes('EN COURS') || saved.includes('FERMÉE') || saved.includes('EN ATTENTE') || saved.includes('Informatique & Développement Web') || saved.includes('Mathématiques Secondaire')) {
          localStorage.removeItem('educ_exam_rooms');
          return INITIAL_EXAM_ROOMS;
        }
        return JSON.parse(saved);
      }
      return INITIAL_EXAM_ROOMS;
    } catch (e) {
      return INITIAL_EXAM_ROOMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('educ_exam_rooms', JSON.stringify(examRooms));
    } catch (e) {
      console.error(e);
    }
  }, [examRooms]);

  const [searchCode, setSearchCode] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, EXAM_RUNNING, WAITING, CLOSED

  // ─── Estados de Entrada y Lockdown de Examen para el Estudiante ───────────────
  const [selectedRoomForStudent, setSelectedRoomForStudent] = useState(null);
  const [showPreExamWarningModal, setShowPreExamWarningModal] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);
  const [activeRoomData, setActiveRoomData] = useState(null);

  // Estados de Integridad y Detección de Abandono
  const [hasLeftExamIncident, setHasLeftExamIncident] = useState(false);
  const [incidentStatus, setIncidentStatus] = useState(null); // 'LEFT', 'INCIDENT_PENDING', 'AUTHORIZED', 'DISQUALIFIED'
  const [incidentReasonText, setIncidentReasonText] = useState('');

  // Examen en curso
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScorePercent, setFinalScorePercent] = useState(0);

  // ─── Estados de Creación y Edición de Sala de Examen (Profesor / Admin) ───────
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [newExamTitle, setNewExamTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Informatique & Développement Web');
  const [newRoomCode, setNewRoomCode] = useState(`EXAM-${Math.floor(1000 + Math.random() * 9000)}K`);
  const [newDuration, setNewDuration] = useState(60);
  const [newStartTime, setNewStartTime] = useState('10:00 AM');
  const [newMaxParticipants, setNewMaxParticipants] = useState(30);
  const [newStrictShutdown, setNewStrictShutdown] = useState(false);
  const [newBlockAi, setNewBlockAi] = useState(true);

  // Creador de Preguntas Dinámicas
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [roomQuestions, setRoomQuestions] = useState([]);

  // Temporizador de Examen Lockdown
  useEffect(() => {
    let timer = null;
    if (isExamActive && !isSubmitted && !hasLeftExamIncident && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamActive, isSubmitted, hasLeftExamIncident, secondsRemaining]);

  // Notificar cambios de estado de Lockdown al padre (App.jsx)
  useEffect(() => {
    if (onLockdownStateChange) {
      onLockdownStateChange(isExamActive && !isSubmitted && !hasLeftExamIncident);
    }
  }, [isExamActive, isSubmitted, hasLeftExamIncident, onLockdownStateChange]);

  // ─── DETECCIÓN EN TIEMPO REAL DE ABANDONO / CAMBIO DE PESTAÑA / VISIBILIDAD ──
  useEffect(() => {
    const handleVisibilityOrBlurChange = () => {
      if (isExamActive && !isSubmitted && !hasLeftExamIncident && activeRoomData) {
        if (document.hidden || !document.hasFocus()) {
          triggerExamAbandonmentIncident('Cambio de pestaña o pérdida de foco en la pantalla del examen');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrBlurChange);
    window.addEventListener('blur', handleVisibilityOrBlurChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrBlurChange);
      window.removeEventListener('blur', handleVisibilityOrBlurChange);
    };
  }, [isExamActive, isSubmitted, hasLeftExamIncident, activeRoomData]);

  // Disparar Incidencia de Abandono
  const triggerExamAbandonmentIncident = (reason) => {
    if (!activeRoomData) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const studentName = user?.name || 'Mariano Nsue Nchama';

    setHasLeftExamIncident(true);
    setIncidentStatus('LEFT');
    setIncidentReasonText(reason);

    // Si la sala está en MODO STRICTO ("Cerrar sala al detectar abandono")
    if (activeRoomData.strictRoomShutdown) {
      setExamRooms(prev => prev.map(r => {
        if (r.id === activeRoomData.id) {
          const newIncident = {
            id: `inc-${Date.now()}`,
            studentName,
            reason: `${reason} (Modo Estricto - Sala Cerrada Automáticamente)`,
            timestamp,
            status: 'ROOM_CLOSED'
          };
          return {
            ...r,
            status: 'CLOSED',
            incidents: [newIncident, ...(r.incidents || [])]
          };
        }
        return r;
      }));

      if (addNotification) {
        addNotification({
          type: 'course',
          targetRoles: ['teacher', 'admin'],
          title: `🚨 Salle d'Examen Fermée Automatiquement (${activeRoomData.code})`,
          text: `Abandon de l'élève ${studentName} détecté à ${timestamp}. Salle ${activeRoomData.code} fermée en Mode Strict.`,
          author: 'Système de Sécurité'
        });
      }
    } else {
      // MODO ESTÁNDAR: Cierra la sesión solo de ESTE estudiante y genera incidencia
      const newIncident = {
        id: `inc-${Date.now()}`,
        studentName,
        reason,
        timestamp,
        status: 'INCIDENT_PENDING'
      };

      setExamRooms(prev => prev.map(r => {
        if (r.id === activeRoomData.id) {
          const updatedStudents = (r.enrolledStudents || []).map(s =>
            s.name === studentName ? { ...s, status: 'LEFT' } : s
          );
          return {
            ...r,
            enrolledStudents: updatedStudents,
            incidents: [newIncident, ...(r.incidents || [])]
          };
        }
        return r;
      }));

      if (addNotification) {
        addNotification({
          type: 'course',
          targetRoles: ['teacher', 'admin'],
          title: `⚠️ Abandon d'Examen Détecté (${activeRoomData.code})`,
          text: `L'élève ${studentName} est sorti de l'écran d'examen "${activeRoomData.title}" à ${timestamp}. Motif: ${reason}.`,
          author: 'Système de Sécurité des Examens'
        });
      }
    }
  };

  // Estudiante: Solicitar Reincorporación al Profesor
  const handleRequestReentry = () => {
    setIncidentStatus('INCIDENT_PENDING');
    setToastMsg(`⏳ Solicitud de reincorporación enviada al profesor. Esperando autorización en tiempo real...`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  // Profesor: Autorizar Reingreso del Alumno
  const handleAuthorizeStudentReentry = (roomId, studentName, incidentId) => {
    setExamRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const updatedIncidents = (r.incidents || []).map(inc =>
          inc.id === incidentId ? { ...inc, status: 'AUTHORIZED' } : inc
        );
        const updatedStudents = (r.enrolledStudents || []).map(s =>
          s.name === studentName ? { ...s, status: 'IN_PROGRESS' } : s
        );
        return {
          ...r,
          enrolledStudents: updatedStudents,
          incidents: updatedIncidents
        };
      }
      return r;
    }));

    // Si el alumno autorizado es el usuario logueado en este dispositivo
    if (activeRoomData && activeRoomData.id === roomId) {
      setHasLeftExamIncident(false);
      setIncidentStatus('AUTHORIZED');
    }

    setToastMsg(`🟢 Reingreso autorizado para ${studentName}. El alumno ha vuelto al examen.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Profesor: Rechazar Reingreso / Descalificar
  const handleRejectStudentReentry = (roomId, studentName, incidentId) => {
    setExamRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const updatedIncidents = (r.incidents || []).map(inc =>
          inc.id === incidentId ? { ...inc, status: 'REJECTED' } : inc
        );
        const updatedStudents = (r.enrolledStudents || []).map(s =>
          s.name === studentName ? { ...s, status: 'DISQUALIFIED' } : s
        );
        return {
          ...r,
          enrolledStudents: updatedStudents,
          incidents: updatedIncidents
        };
      }
      return r;
    }));

    if (activeRoomData && activeRoomData.id === roomId) {
      setIncidentStatus('DISQUALIFIED');
    }

    setToastMsg(`🔴 Solicitud rechazada. ${studentName} ha sido descalificado de la evaluación.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // ─── ACCIONES EXCLUSIVAS DE ADMINISTRADOR SOBRE SALAS ──────────────────────
  const handleAdminToggleRoomStatus = (roomId, currentStatus) => {
    const newStatus = currentStatus === 'CLOSED' ? 'EXAM_RUNNING' : 'CLOSED';
    setExamRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    setToastMsg(`🛡️ [ADMIN] Estado de la sala actualizado a: ${newStatus === 'EXAM_RUNNING' ? 'Abierta / En Curso' : 'Cerrada'}.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAdminDeleteRoom = (roomId) => {
    setExamRooms(prev => prev.filter(r => r.id !== roomId));
    setToastMsg('🛡️ [ADMIN] Sala de examen eliminada del sistema.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAdminResetStudentAttempt = (roomId, studentName) => {
    setExamRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const updatedStudents = (r.enrolledStudents || []).filter(s => s.name !== studentName);
        const updatedIncidents = (r.incidents || []).filter(inc => inc.studentName !== studentName);
        return {
          ...r,
          enrolledStudents: updatedStudents,
          incidents: updatedIncidents
        };
      }
      return r;
    }));

    setToastMsg(`🛡️ [ADMIN] Intento e incidencias eliminados para ${studentName}. El estudiante puede volver a conectarse.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Abrir Modal de Edición de Sala (Admin / Profesor)
  const handleOpenEditModal = (room) => {
    setEditingRoomId(room.id);
    setNewExamTitle(room.title || '');
    setNewSubject(room.subject || 'Informatique & Développement Web');
    setNewRoomCode(room.code || '');
    setNewDuration(room.durationMinutes || 60);
    setNewStartTime(room.startTime || '10:00 AM');
    setNewMaxParticipants(room.maxParticipants || 30);
    setNewStrictShutdown(room.strictRoomShutdown || false);
    setNewBlockAi(room.blockAiAndDocs !== false);
    setRoomQuestions(room.questions || []);
    setIsEditModalOpen(true);
  };

  // Guardar Edición de Sala
  const handleSaveEditExamRoom = (e) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !newRoomCode.trim()) return;

    setExamRooms(prev => prev.map(r => {
      if (r.id === editingRoomId) {
        return {
          ...r,
          title: newExamTitle.trim(),
          subject: newSubject,
          code: newRoomCode.trim().toUpperCase(),
          durationMinutes: Number(newDuration) || 60,
          startTime: newStartTime.trim() || '10:00 AM',
          maxParticipants: Number(newMaxParticipants) || 30,
          strictRoomShutdown: newStrictShutdown,
          blockAiAndDocs: newBlockAi,
          questions: roomQuestions.length > 0 ? roomQuestions : r.questions
        };
      }
      return r;
    }));

    setToastMsg(`✅ Sala "${newRoomCode.toUpperCase()}" actualizada exitosamente por el Administrador.`);
    setTimeout(() => setToastMsg(''), 4000);
    setIsEditModalOpen(false);
  };

  // Agregar Pregunta Personalizada en Formulario
  const handleAddQuestionToForm = () => {
    if (!qText.trim() || !qOptA.trim() || !qOptB.trim()) {
      setToastMsg('⚠️ Por favor completa el enunciado y al menos las dos primeras opciones de respuesta.');
      setTimeout(() => setToastMsg(''), 4000);
      return;
    }

    const options = [qOptA.trim(), qOptB.trim()];
    if (qOptC.trim()) options.push(qOptC.trim());
    if (qOptD.trim()) options.push(qOptD.trim());

    const newQ = {
      id: `q-custom-${Date.now()}`,
      text: qText.trim(),
      options,
      correctAnswer: Math.min(qCorrectIdx, options.length - 1)
    };

    setRoomQuestions(prev => [...prev, newQ]);
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrectIdx(0);

    setToastMsg('✨ Pregunta añadida a la evaluación.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Eliminar Pregunta del Formulario
  const handleRemoveQuestionFromForm = (qId) => {
    setRoomQuestions(prev => prev.filter(q => q.id !== qId));
  };

  // Conexión directa del Estudiante por Código PIN
  const handleConnectByCode = (inputCode) => {
    const targetCode = (inputCode || searchCode).trim().toUpperCase();
    if (!targetCode) {
      setToastMsg('⚠️ Ingresa un código de sala válido (ej. EXAM-8F42K).');
      setTimeout(() => setToastMsg(''), 4000);
      return;
    }

    const found = examRooms.find(r => r.code.toUpperCase() === targetCode);
    if (!found) {
      setToastMsg(`⚠️ No existe ninguna sala registrada con el código "${targetCode}". Revisa el código proporcionado.`);
      setTimeout(() => setToastMsg(''), 5000);
      return;
    }

    if (found.status === 'CLOSED') {
      setToastMsg(`🔴 La sala "${found.code}" (${found.title}) está CERRADA por la administración.`);
      setTimeout(() => setToastMsg(''), 5000);
      return;
    }

    handleOpenPreExamModal(found);
  };

  // Abrir Modal Pre-Examen
  const handleOpenPreExamModal = (room) => {
    if (room.status === 'CLOSED') {
      setToastMsg(`🔴 La sala "${room.code}" está CERRADA por el Administrador.`);
      setTimeout(() => setToastMsg(''), 4000);
      return;
    }
    setSelectedRoomForStudent(room);
    setShowPreExamWarningModal(true);
  };

  // Iniciar Examen Lockdown
  const handleStartExamLockdown = () => {
    if (!selectedRoomForStudent) return;

    const studentName = user?.name || 'Mariano Nsue Nchama';
    setExamRooms(prev => prev.map(r => {
      if (r.id === selectedRoomForStudent.id) {
        const existing = r.enrolledStudents || [];
        const alreadyIn = existing.find(s => s.name === studentName);
        if (!alreadyIn) {
          return {
            ...r,
            enrolledStudents: [...existing, { id: `std-${Date.now()}`, name: studentName, status: 'IN_PROGRESS', score: null }]
          };
        }
      }
      return r;
    }));

    setActiveRoomData(selectedRoomForStudent);
    setShowPreExamWarningModal(false);
    setIsExamActive(true);
    setHasLeftExamIncident(false);
    setIncidentStatus('IN_PROGRESS');
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setSecondsRemaining((selectedRoomForStudent.durationMinutes || 60) * 60);

    setToastMsg(`🔒 MODO EXAMEN SEGURO ACTIVADO: Navegación congelada durante la evaluación.`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  // Seleccionar Opción de Respuesta
  const handleSelectAnswer = (qId, optionIdx) => {
    if (isSubmitted || hasLeftExamIncident) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  // Entrega Manual del Examen
  const handleSubmitExam = () => {
    if (!activeRoomData) return;

    const questions = activeRoomData.questions || [];
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    setFinalScorePercent(percent);
    setIsSubmitted(true);

    if (recordQuizResult) {
      recordQuizResult(activeRoomData.id, percent, percent >= 70);
    }

    // Actualizar resultado en la lista de salas para el profesor
    const studentRecord = {
      id: `std-${Date.now()}`,
      name: user?.name || 'Mariano Nsue Nchama',
      status: 'COMPLETED',
      score: percent,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setExamRooms(prev => prev.map(r => {
      if (r.id === activeRoomData.id) {
        const existing = (r.enrolledStudents || []).filter(s => s.name !== studentRecord.name);
        return { ...r, enrolledStudents: [studentRecord, ...existing] };
      }
      return r;
    }));

    if (addNotification) {
      addNotification({
        type: 'course',
        title: `✅ Examen Terminé (${activeRoomData.code})`,
        text: `L'élève ${studentRecord.name} a terminé et remis l'examen "${activeRoomData.title}" à ${studentRecord.submittedAt} avec une note de ${percent}%.`,
        author: studentRecord.name
      });
    }

    setToastMsg(`¡Examen enviado exitosamente! Nota obtenida: ${percent}%. Modo seguro finalizado.`);
    setTimeout(() => setToastMsg(''), 6000);
  };

  // Entrega Automática al expirar el tiempo
  const handleAutoSubmitExam = () => {
    handleSubmitExam();
    setToastMsg(`⏱️ ¡Tiempo agotado! El examen se ha enviado automáticamente.`);
  };

  // Crear Nueva Sala de Examen (Profesor)
  const handleCreateExamRoom = (e) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !newRoomCode.trim()) return;

    const newRoomObj = {
      id: `room-exam-${Date.now()}`,
      code: newRoomCode.trim().toUpperCase(),
      title: newExamTitle.trim(),
      subject: newSubject,
      durationMinutes: Number(newDuration) || 60,
      startTime: newStartTime.trim() || '10:00 AM',
      maxParticipants: Number(newMaxParticipants) || 30,
      allowAbandonment: false,
      strictRoomShutdown: newStrictShutdown,
      blockAiAndDocs: newBlockAi,
      teacherName: user?.name || 'Prof. Baltasar Nsue Ondo',
      status: 'EXAM_RUNNING',
      questions: [
        {
          id: `q-init-1`,
          text: '¿Cuál es el primer principio de diseño en la plataforma EDUC-EG?',
          options: ['Transmisión 4K', 'Resiliencia Offline y Bajo Ancho de Banda', 'Carga continua desde la nube', 'Sin almacenamiento local'],
          correctAnswer: 1
        },
        {
          id: `q-init-2`,
          text: '¿Qué componente asegura que las evaluaciones se guarden de forma persistente?',
          options: ['LocalStorage & IndexedDB', 'Servidor de prueba', 'Memoria volátil', 'Cookies temporales'],
          correctAnswer: 0
        }
      ],
      enrolledStudents: [],
      incidents: []
    };

    setExamRooms(prev => [newRoomObj, ...prev]);

    if (addNotification) {
      addNotification({
        type: 'course',
        title: `🔒 Nouvelle Salle d'Examen Créée (${newRoomObj.code})`,
        text: `L'enseignant ${newRoomObj.teacherName} a ouvert la salle d'examen "${newRoomObj.title}". Code: ${newRoomObj.code}.`,
        author: newRoomObj.teacherName
      });
    }

    setToastMsg(`¡Sala de Examen "${newRoomObj.code}" creada con éxito y lista para los estudiantes!`);
    setTimeout(() => setToastMsg(''), 5000);

    // Resetear formulario
    setNewExamTitle('');
    setNewRoomCode(`EXAM-${Math.floor(1000 + Math.random() * 9000)}K`);
    setIsCreateModalOpen(false);
  };

  // Formatear segundos en MM:SS
  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ─── RENDERS DE LA INTERFAZ DE EXAMEN LOCKDOWN CON DETECCIÓN DE INCIDENCIAS ───
  if (isExamActive && activeRoomData) {
    const questions = activeRoomData.questions || [];
    const currentQ = questions[currentQuestionIdx];

    return (
      <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col justify-between p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none">
        
        {/* BANNER SUPERIOR PERMANENTE DE LOCKDOWN */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border border-red-500/60 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40 shrink-0">
              <Lock className="w-5 h-5 animate-pulse text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase bg-red-500 text-slate-950 px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
                  🔒 MODE EXAMEN SÉCURISÉ ACTIF
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  CODE: {activeRoomData.code}
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeRoomData.teacherName}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-snug mt-0.5">
                {activeRoomData.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-2 rounded-xl border text-xs font-black font-mono flex items-center gap-2 ${
              secondsRemaining < 300
                ? 'bg-red-500/30 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-amber-500/40 text-amber-300'
            }`}>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>TEMPS RESTANT: {formatTimer(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => {
                setIsExamActive(false);
                setHasLeftExamIncident(false);
                setIncidentStatus(null);
                setSelectedRoomForStudent(null);
                setActiveRoomData(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Quitter</span>
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* INCIDENCIA DE ABANDONO DETECTADA EN EL ALUMNO */}
        {hasLeftExamIncident ? (
          <div className="max-w-xl mx-auto my-auto bg-slate-900 border border-red-500/60 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-black text-3xl shadow-xl shadow-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                ⚠️ VOUS AVEZ QUITTÉ LE MODE EXAMEN SÉCURISÉ
              </span>
              <h2 className="text-xl font-bold text-white">Abandon d'Écran Détecté</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sortie de l'évaluation enregistrée: <em>"{incidentReasonText}"</em>.
              </p>
            </div>

            {incidentStatus === 'INCIDENT_PENDING' ? (
              <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-xs text-amber-200 space-y-3">
                <span className="font-extrabold uppercase block text-amber-300 flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-4 h-4 animate-spin" /> En Attente d'Autorisation de l'Enseignant...
                </span>
                <p>Votre demande a été envoyée à la console de <strong>{activeRoomData.teacherName}</strong>. L'écran se déverrouillera une fois autorisé.</p>
                <button
                  onClick={() => {
                    setIsExamActive(false);
                    setHasLeftExamIncident(false);
                    setIncidentStatus(null);
                    setSelectedRoomForStudent(null);
                    setActiveRoomData(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4 text-red-400" />
                  Quitter la Salle et Annuler la Demande
                </button>
              </div>
            ) : incidentStatus === 'DISQUALIFIED' ? (
              <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-xs text-red-300 space-y-2">
                <span className="font-extrabold uppercase block text-red-400">🔴 DEMANDE REFUSÉE - DISQUALIFIÉ</span>
                <p>L'enseignant a refusé la demande de réintégration. La session est terminée.</p>
                <button
                  onClick={() => {
                    setIsExamActive(false);
                    setHasLeftExamIncident(false);
                    setIncidentStatus(null);
                    setSelectedRoomForStudent(null);
                    setActiveRoomData(null);
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Retourner à la Plateforme
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Si vous êtes sorti par erreur ou par panne de connexion, vous pouvez envoyer une demande formelle à votre enseignant:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRequestReentry}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs shadow-xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> [ Demander Réintégration ]
                  </button>
                  <button
                    onClick={() => {
                      setIsExamActive(false);
                      setHasLeftExamIncident(false);
                      setIncidentStatus(null);
                      setSelectedRoomForStudent(null);
                      setActiveRoomData(null);
                    }}
                    className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4 text-red-400" />
                    Quitter la Salle
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : isSubmitted ? (
          /* PANTALLA DE RESULTADOS FINALIZADOS */
          <div className="max-w-xl mx-auto my-auto bg-slate-900 border border-emerald-500/50 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center font-black text-4xl shadow-xl ${
              finalScorePercent >= 70
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {finalScorePercent}%
            </div>

            <div className="space-y-2">
              <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full border ${
                finalScorePercent >= 70
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-500/20 text-red-400 border-red-500/40'
              }`}>
                {finalScorePercent >= 70 ? '🎉 EXAMEN RÉUSSI' : '⚠️ RÉVISION NÉCESSAIRE'}
              </span>
              <h2 className="text-2xl font-bold text-white">Évaluation Terminée avec Succès</h2>
              <p className="text-xs text-slate-300">
                Vos réponses ont été transmises à la console de l'enseignant ({activeRoomData.teacherName}) et enregistrées dans votre historique académique.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-1">
              <p>• <strong>Examen:</strong> {activeRoomData.title}</p>
              <p>• <strong>Code de Salle:</strong> {activeRoomData.code}</p>
              <p>• <strong>Statut de Verrouillage:</strong> Déverrouillé avec succès.</p>
            </div>

            <button
              onClick={() => {
                setIsExamActive(false);
                setSelectedRoomForStudent(null);
                setActiveRoomData(null);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-xl cursor-pointer hover:scale-[1.02] transition-transform"
            >
              🔓 Quitter le Mode Sécurisé et Retourner à la Plateforme
            </button>
          </div>
        ) : (
          /* PREGUNTAS DEL EXAMEN */
          <div className="max-w-3xl mx-auto w-full my-auto space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-amber-300 uppercase tracking-wider">
                Pregunta {currentQuestionIdx + 1} de {questions.length}
              </span>
              <span className="font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                Puntuación por acierto: +{(100 / questions.length).toFixed(0)} pts
              </span>
            </div>

            {currentQ && (
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-6 shadow-2xl">
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.text}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(currentQ.id, idx)}
                        className={`w-full p-4 rounded-2xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/50'
                            : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 border ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navegación y Entrega */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1 border border-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" /> Précédent
                  </button>

                  {currentQuestionIdx < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx(prev => Math.min(questions.length - 1, prev + 1))}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer flex items-center gap-1 shadow"
                    >
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Terminer et Soumettre
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    );
  }

  // Métricas globales para Admin y Profesor
  const totalRoomsCount = examRooms.length;
  const activeRoomsCount = examRooms.filter(r => r.status === 'EXAM_RUNNING').length;
  const waitingRoomsCount = examRooms.filter(r => r.status === 'WAITING').length;
  const closedRoomsCount = examRooms.filter(r => r.status === 'CLOSED').length;
  const totalIncidentsCount = examRooms.reduce((acc, r) => acc + (r.incidents?.length || 0), 0);
  const totalEvaluatedStudentsCount = examRooms.reduce((acc, r) => acc + (r.enrolledStudents?.filter(s => s.status === 'COMPLETED').length || 0), 0);

  // Filtrar salas
  const filteredRooms = examRooms.filter(r => {
    const matchesSearch =
      r.code.toLowerCase().includes(searchCode.toLowerCase()) ||
      r.title.toLowerCase().includes(searchCode.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchCode.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && r.status === statusFilter;
  });

  // ─── RENDERS DE LA LISTA DE SALAS DE EXAMEN (VISTA NORMAL PROFESOR / ESTUDIANTE / ADMIN) ──
  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-16">
      
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-red-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shrink-0">
            <Lock className="w-6 h-6 animate-pulse text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-red-300 bg-red-500/20 px-3 py-0.5 rounded-full border border-red-500/30">
                Évaluations de Haute Sécurité • Lockdown Mode
              </span>
              {(activeRole === 'teacher' || activeRole === 'admin') && (
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {activeRole === 'admin' ? '🛡️ Console de Gestion Administrateur' : '👨‍🏫 Panneau de Gestion Enseignant'}
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Salles d'Examen Sécurisé par Code</h1>
            <p className="text-xs text-slate-300">Environnement blindé pour évaluations en présentiel et à distance avec détection d'incidents.</p>
          </div>
        </div>

        {(activeRole === 'teacher' || activeRole === 'admin') && (
          <button
            onClick={() => {
              setRoomQuestions([]);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            Créer Nouvelle Salle
          </button>
        )}
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* BANNER DE MÉTRICAS GLOBALES DE GESTIÓN PARA ADMIN Y PROFESOR */}
      {(activeRole === 'admin' || activeRole === 'teacher') && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase mb-0.5">Total Salles</span>
            <span className="text-xl font-extrabold text-white">{totalRoomsCount}</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase mb-0.5">En Cours</span>
            <span className="text-xl font-extrabold text-emerald-300">{activeRoomsCount}</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 text-center">
            <span className="text-[10px] text-amber-400 font-bold block uppercase mb-0.5">En Attente</span>
            <span className="text-xl font-extrabold text-amber-300">{waitingRoomsCount}</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-red-500/30 text-center">
            <span className="text-[10px] text-red-400 font-bold block uppercase mb-0.5">Fermées</span>
            <span className="text-xl font-extrabold text-red-300">{closedRoomsCount}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/30 text-center">
            <span className="text-[10px] text-indigo-300 font-bold block uppercase mb-0.5">Évalués</span>
            <span className="text-xl font-extrabold text-indigo-200">{totalEvaluatedStudentsCount}</span>
          </div>
        </div>
      )}

      {/* Banner de Estado para el Estudiante */}
      {activeRole === 'student' && (
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-emerald-500/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-emerald-300 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
              🎓 Portail de l'Étudiant • Connexion à l'Examen
            </span>
            <span className="text-xs text-slate-400 font-medium">Entrez le code officiel fourni par votre enseignant.</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConnectByCode();
                }}
                placeholder="Entrez le Code de Salle (ex. EXAM-8F42K)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono uppercase text-amber-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <button
              onClick={() => handleConnectByCode()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              Rejoindre la Salle d'Examen
            </button>
          </div>
        </div>
      )}

      {/* Buscador y Pestañas de Filtro para Admin / Profesor */}
      {(activeRole === 'teacher' || activeRole === 'admin') && (
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Rechercher par code de salle (ex. EXAM-8F42K) ou matière..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Pestañas de Filtro por Estado */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold shrink-0">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${statusFilter === 'ALL' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                Toutes ({totalRoomsCount})
              </button>
              <button
                onClick={() => setStatusFilter('EXAM_RUNNING')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${statusFilter === 'EXAM_RUNNING' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                En Cours ({activeRoomsCount})
              </button>
              <button
                onClick={() => setStatusFilter('WAITING')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${statusFilter === 'WAITING' ? 'bg-indigo-500 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                En Attente ({waitingRoomsCount})
              </button>
              <button
                onClick={() => setStatusFilter('CLOSED')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${statusFilter === 'CLOSED' ? 'bg-red-500 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                Fermées ({closedRoomsCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Salas de Examen Disponibles */}
      <div className="space-y-4">
        {filteredRooms.length === 0 ? (
          <div className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No se encontraron salas de examen</h3>
            <p className="text-xs text-slate-400">Intenta cambiar los términos de búsqueda o crear una nueva sala desde el panel.</p>
          </div>
        ) : (
          filteredRooms.map(room => {
            const isRunning = room.status === 'EXAM_RUNNING';
            const isClosed = room.status === 'CLOSED';
            const isStrict = room.strictRoomShutdown;
            const roomIncidents = room.incidents || [];
            const pendingIncidents = roomIncidents.filter(inc => inc.status === 'INCIDENT_PENDING');

            return (
              <div
                key={room.id}
                className={`bg-slate-900/90 p-6 rounded-3xl border transition-all space-y-4 shadow-xl ${
                  isRunning
                    ? 'border-emerald-500/80 ring-1 ring-emerald-500/40'
                    : isClosed
                      ? 'border-red-500/40 opacity-90'
                      : 'border-slate-700/80 hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                        isRunning
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isClosed
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        <Lock className="w-3 h-3" /> Salle {room.code} ({room.status === 'EXAM_RUNNING' ? '🟢 EN COURS' : room.status === 'CLOSED' ? '🔴 FERMÉE' : '⏳ EN ATTENTE'})
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{room.subject}</span>
                      
                      {/* Badge de Seguridad */}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        isStrict
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-slate-950 text-amber-300 border-amber-500/40'
                      }`}>
                        {isStrict ? '🔐 Mode Strict (Fermeture sur Abandon)' : '👨‍🏫 Mode Standard'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{room.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Durée: {room.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-indigo-400" /> Max. {room.maxParticipants} Participants ({room.questions?.length || 0} Questions)
                      </span>
                      <span className="text-slate-400 font-medium">Professeur: {room.teacherName}</span>
                    </div>
                  </div>

                  {/* Acciones para Admin / Profesor / Estudiante */}
                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap">
                    {/* Botones de Control de Administrador */}
                    {(activeRole === 'admin' || activeRole === 'teacher') && (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(room)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Modifier les paramètres et questions de la salle"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Éditer</span>
                        </button>

                        <button
                          onClick={() => handleAdminToggleRoomStatus(room.id, room.status)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                            room.status === 'CLOSED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                          }`}
                        >
                          <Shield className="w-3.5 h-3.5 text-amber-400" />
                          <span>{room.status === 'CLOSED' ? 'Rouvrir' : 'Fermer'}</span>
                        </button>

                        <button
                          onClick={() => handleAdminDeleteRoom(room.id)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Supprimer cette salle d'examen"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>Supprimer</span>
                        </button>
                      </>
                    )}

                    <button
                      disabled={room.status === 'CLOSED'}
                      onClick={() => handleOpenPreExamModal(room)}
                      className={`w-full md:w-auto px-5 py-2.5 font-black text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
                        room.status === 'CLOSED'
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
                      }`}
                    >
                      <Key className="w-4 h-4 text-slate-950" /> {room.status === 'CLOSED' ? 'Salle Fermée' : 'Entrer dans la Salle'}
                    </button>
                  </div>
                </div>

              {/* ─── SECCIÓN DE REVISIÓN DE INCIDENCIAS PARA EL PROFESOR Y ADMIN ───── */}
              {(activeRole === 'teacher' || activeRole === 'admin') && roomIncidents.length > 0 && (
                <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                      Incidents & Demandes de Réadmission ({roomIncidents.length})
                    </span>
                    {pendingIncidents.length > 0 && (
                      <span className="text-[10px] font-bold text-red-300 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40 animate-pulse">
                        🚨 {pendingIncidents.length} Demande en Attente
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {roomIncidents.map(inc => (
                      <div key={inc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                        {inc.status === 'INCIDENT_PENDING' ? (
                          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                            {(activeRole === 'teacher' || activeRole === 'admin') ? (
                              <button
                                onClick={() => handleAuthorizeStudentReentry(room.id, inc.studentName, inc.id)}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                                title="Autoriser la réadmission de l'étudiant à l'évaluation"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> 🟢 Autoriser Réadmission
                              </button>
                            ) : (
                              <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30 font-semibold">
                                ⏳ En Attente d'Autorisation Enseignant/Admin
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            ✓ Demande Résolue
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LISTA DE ALUMNOS MATRICULADOS CON ESTADO EN TIEMPO REAL */}
              {(activeRole === 'teacher' || activeRole === 'admin') && room.enrolledStudents?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span>SURVEILLANCE EN TEMPS RÉEL DES PARTICIPANTS ({room.enrolledStudents.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal">Supervision en direct</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {room.enrolledStudents.map((std) => (
                      <div key={std.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{std.name}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                            std.status === 'COMPLETED' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : std.status === 'LEFT'
                                ? 'bg-red-500/20 text-red-400 font-bold'
                                : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {std.status === 'COMPLETED' ? `Note: ${std.score}%` : std.status === 'LEFT' ? 'Abandon' : 'En cours'}
                          </span>
                        </div>

                        {(activeRole === 'teacher' || activeRole === 'admin') && (
                          <button
                            onClick={() => handleAdminResetStudentAttempt(room.id, std.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-700 text-[10px] font-bold cursor-pointer shrink-0 flex items-center gap-1"
                            title="Permitir Readmisión (Solo Profesor)"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400" />
                            <span>Réadmettre</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
      </div>

      {/* ─── MODAL PRE-EXAMEN SEGURO (ADVERTENCIA Y CONFIRMACIÓN DE INICIO) ────── */}
      {showPreExamWarningModal && selectedRoomForStudent && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-red-500/60 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowPreExamWarningModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-red-500/30">
                <Lock className="w-6 h-6 stroke-[2.5] animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
                  🔐 Mode Examen Sécurisé
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">
                  Confirmation d'Accès à la Salle
                </h2>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-red-500/30 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span><strong>Examen:</strong> {selectedRoomForStudent.title}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span><strong>Salle:</strong> <code className="text-amber-300 font-mono font-bold">{selectedRoomForStudent.code}</code></span>
                <span><strong>Durée:</strong> {selectedRoomForStudent.durationMinutes} minutes</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span><strong>Début:</strong> {selectedRoomForStudent.startTime}</span>
                <span><strong>Participants:</strong> {selectedRoomForStudent.maxParticipants}</span>
              </div>
            </div>

            {/* AVISO IMPORTANTE DE NAVEGACIÓN BLOQUEADA */}
            <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-xs text-red-300 space-y-2">
              <div className="font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-red-400">
                <AlertTriangle className="w-4 h-4" /> Avertissement de Sécurité Important :
              </div>
              <p className="leading-relaxed">
                Une fois l'examen commencé, <strong>vous ne pourrez pas accéder aux cours, documents, bibliothèque ni aux autres fonctions de la plateforme</strong>. Tout changement d'onglet enregistrera un incident d'abandon.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreExamWarningModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleStartExamLockdown}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Lock className="w-4 h-4" />
                [ COMMENCER L'EXAMEN ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DE EDICIÓN DE SALA DE EXAMEN (ADMINISTRADOR / PROFESOR) ────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 relative my-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-purple-500/30">
                <Edit3 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Consola Admin • Edición de Sala
                </span>
                <h2 className="text-xl font-bold text-white">Editar Sala de Examen ({newRoomCode})</h2>
              </div>
            </div>

            <form onSubmit={handleSaveEditExamRoom} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Título del Examen *</label>
                  <input
                    type="text"
                    required
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Código Único de Sala *</label>
                  <input
                    type="text"
                    required
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duración (Minutos)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hora de Inicio</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Máx. Participantes</label>
                  <input
                    type="number"
                    value={newMaxParticipants}
                    onChange={(e) => setNewMaxParticipants(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* SECCIÓN DE PREGUNTAS DE LA SALA */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Questions de l'Évaluation ({roomQuestions.length}):
                  </span>
                </div>

                {roomQuestions.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {roomQuestions.map((q, idx) => (
                      <div key={q.id || idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start text-xs">
                        <div className="space-y-1">
                          <p className="font-semibold text-white">{idx + 1}. {q.text}</p>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Réponse Correcte: Option {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestionFromForm(q.id)}
                          className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                          title="Supprimer la question"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario Agregar Pregunta */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">+ Ajouter une Nouvelle Question :</span>
                  <input
                    type="text"
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Énoncé de la question..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={qOptA}
                      onChange={(e) => setQOptA(e.target.value)}
                      placeholder="Option A *"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={qOptB}
                      onChange={(e) => setQOptB(e.target.value)}
                      placeholder="Option B *"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={qOptC}
                      onChange={(e) => setQOptC(e.target.value)}
                      placeholder="Option C (Optionnel)"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={qOptD}
                      onChange={(e) => setQOptD(e.target.value)}
                      placeholder="Option D (Optionnel)"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span>Option Correcte :</span>
                      <select
                        value={qCorrectIdx}
                        onChange={(e) => setQCorrectIdx(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold"
                      >
                        <option value={0}>A</option>
                        <option value={1}>B</option>
                        <option value={2}>C</option>
                        <option value={3}>D</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddQuestionToForm}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                    >
                      + Ajouter la Question
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
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
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL DE CREATION DE SALLE D'EXAMEN SECURISE (PROFESSEURS / ADMIN) ──────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-red-500/40 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-5 relative my-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-red-500/20">
                <Lock className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Studio Enseignant • Configuration de l'Évaluation
                </span>
                <h2 className="text-xl font-bold text-white">Créer une Nouvelle Salle d'Examen Sécurisée</h2>
              </div>
            </div>

            <form onSubmit={handleCreateExamRoom} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Titre de l'Examen *</label>
                  <input
                    type="text"
                    required
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    placeholder="Ex : Programmation Web & JavaScript"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Code Unique de Salle *</label>
                  <input
                    type="text"
                    required
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    placeholder="EXAM-8F42K"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Durée (Minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Heure de Début</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Participants</label>
                  <input
                    type="number"
                    value={newMaxParticipants}
                    onChange={(e) => setNewMaxParticipants(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Opciones de Seguridad Strict Lockdown */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Règles de Sécurité et Niveaux de Sortie :
                </span>
                
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newStrictShutdown}
                    onChange={(e) => setNewStrictShutdown(e.target.checked)}
                    className="rounded text-red-500 focus:ring-red-500"
                  />
                  <span>🔐 <strong>Mode Examen Strict :</strong> Fermer la salle automatiquement si un participant quitte.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={newBlockAi}
                    onChange={(e) => setNewBlockAi(e.target.checked)}
                    className="rounded text-red-500 focus:ring-red-500"
                  />
                  <span>🤖 Bloquer l'Assistant IA, les Cahiers et la Bibliothèque Numérique</span>
                </label>
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
                  <Lock className="w-4 h-4 text-slate-950" />
                  Enregistrer et Ouvrir la Salle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
