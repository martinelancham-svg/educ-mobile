import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER_PROFILE, INITIAL_COURSES, INITIAL_AUDIOBOOKS } from '../data/initialMockData';
import { getStoredData, setStoredData, enqueueSyncAction } from '../db/offlineDB';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = [
  {
    email: 'estudiante@educ-eg.org',
    password: '123',
    role: 'student',
    name: 'Mariano Nsue Nchama',
    phoneNumber: '+240 222 12 34 56',
    age: '16',
    gradeLevel: '4° ESO',
    school: 'Lycée National Rey Malabo (Île de Bioko)',
    schoolName: 'Lycée National Rey Malabo (Île de Bioko)',
    country: 'Guinée Équatoriale (Malabo)',
    comments: 'Je souhaite me préparer aux examens de Sélectivité et explorer la FP Technique à l\'UNGE.',
    isMinor: true,
    tutorName: 'Santiago Nsue (Père)',
    tutorPhone: '+240 222 77 88 99',
    tutorRelationship: 'Père/Mère',
    approvalStatus: 'Approved',
    xpPoints: 550,
    level: 4,
    studyStreakDays: 7,
    badges: [
      { id: 'b1', name: 'Pionnier Hors-Ligne', desc: 'A téléchargé son premier cours complet en Guinée Équatoriale' },
      { id: 'b2', name: 'Série de 7 Jours', desc: 'A étudié quotidiennement pendant une semaine' }
    ],
    enrolledCourses: ['course-math-master', 'course-physics-master', 'course-101'],
    completedLessons: ['less-m-m1', 'less-p-p1'],
    quizResults: { 'quiz-math-master': { score: 100, passed: true, date: '2026-08-19' } }
  },
  {
    email: 'profesor@educ-eg.org',
    password: '123',
    role: 'teacher',
    name: 'Prof. Baltasar Nsue Ondo',
    phoneNumber: '+240 222 99 88 77',
    school: 'Institut Polytéchnique de Bata & UNGE',
    country: 'Guinée Équatoriale (Bata / Río Muni)',
    approvalStatus: 'Approved',
    licenseNumber: 'LIC-ED-88420-GNQ',
    experienceYears: '12 ans',
    workplaces: 'Lycée National Rey Malabo, Institut Technique de Bata, UNGE',
    specialty: 'Mathématiques, Physique et Technologie Agroécologique',
    cvFile: 'CV_Baltasar_Nsue_Enseignant_GNQ.pdf',
    xpPoints: 1200,
    level: 8,
    badges: [{ id: 'b3', name: 'Éducateur National', desc: 'A publié 3 cours d\'impact pour les étudiants de Guinée Équatoriale' }]
  },
  {
    email: 'admin@educ-eg.org',
    password: '123',
    role: 'admin',
    name: 'Administrateur Central EDUC-EG GNQ',
    school: 'Ministère de l\'Éducation, de la Science et des Sports (Malabo)',
    country: 'Guinée Équatoriale (Malabo & Ciudad de la Paz)',
    approvalStatus: 'Approved',
    xpPoints: 2500,
    level: 15,
    badges: [{ id: 'b4', name: 'Super Administrateur', desc: 'Contrôle de la plateforme et des nœuds USB en Guinée Équatoriale' }]
  }
];

export const INITIAL_PENDING_TEACHERS = [
  {
    id: 'req-t-1',
    name: 'Dra. Solange Nguema Avomo',
    email: 'solange.nguema@educ-eg.org',
    role: 'teacher',
    phoneNumber: '+240 222 55 44 33',
    licenseNumber: 'LIC-ED-99321-GNQ',
    experienceYears: '9 ans',
    workplaces: 'Institut National Carlos Lwanga de Bata, Centre de FP d\'Ebebiyín',
    cvFile: 'CV_Solange_Nguema_Educacion_GNQ.pdf',
    specialty: 'Physique et Chimie Secondaire',
    appliedDate: '2026-08-19',
    approvalStatus: 'Pending'
  }
];

export const INITIAL_TUTORING_REQUESTS = [
  {
    id: 'tut-101',
    studentName: 'Mariano Nsue Nchama',
    studentPhone: '+240 222 12 34 56',
    teacherName: 'Prof. Baltasar Nsue Ondo',
    subject: 'Mathématiques Secondaire: Équations du Second Degré',
    preferredDate: '2026-08-22',
    preferredTime: '16:00',
    format: 'Audio Comprimé Faible-Bande-Passante',
    price: '1.500 FCFA (~ 2,50 €)',
    notes: 'J\'ai besoin de soutien pour résoudre les équations du second degré pour l\'examen.',
    status: 'Pending',
    submittedDate: '2026-08-20'
  },
  {
    id: 'tut-102',
    studentName: 'Esperanza Obono',
    studentPhone: '+240 222 99 11 22',
    teacherName: 'Prof. Baltasar Nsue Ondo',
    subject: 'Physique et Chimie: Réactions et Loi d\'Ohm',
    preferredDate: '2026-08-23',
    preferredTime: '10:30',
    format: 'Consultation Écrite Résolue Étape par Étape',
    price: '1.000 FCFA (~ 1,50 €)',
    notes: 'Renforcement dans l\'équilibrage des réactions chimiques.',
    status: 'Accepted',
    submittedDate: '2026-08-20'
  }
];

export const INITIAL_PENDING_STUDENTS = [
  {
    id: 'req-s-1',
    name: 'Pascal Eto\'o Nchama',
    email: 'pascal.etoo@educ-eg.org',
    phoneNumber: '+240 222 88 44 21',
    role: 'student',
    age: '15',
    gradeLevel: '4ème Secondaire',
    schoolName: 'Lycée National de Malabo (Île de Bioko)',
    country: 'Guinée Équatoriale (Malabo)',
    isMinor: true,
    tutorName: 'Clarisse Nchama (Mère)',
    tutorPhone: '+240 222 33 11 55',
    tutorRelationship: 'Mère',
    comments: 'Je souhaite renforcer les Mathématiques et les Sciences pour l\'examen de fin d\'année.',
    approvalStatus: 'Pending',
    appliedDate: '2026-08-20'
  }
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredData('is_auth', false));
  const [currentUser, setCurrentUser] = useState(() => getStoredData('current_user', null));
  const [courses, setCourses] = useState(() => {
    const stored = getStoredData('courses_list', null);
    if (stored) {
      const storedStr = JSON.stringify(stored);
      if (storedStr.includes('Curso Completo') || storedStr.includes('De Álgebra') || storedStr.includes('Física Fundamentos') || storedStr.includes('Tabla Periódica') || storedStr.includes('Aprende paso a paso')) {
        localStorage.removeItem('educ_courses_list');
        return INITIAL_COURSES;
      }
      const storedIds = new Set(stored.map(c => c.id));
      const missing = INITIAL_COURSES.filter(c => !storedIds.has(c.id));
      return missing.length > 0 ? [...stored, ...missing] : stored;
    }
    return INITIAL_COURSES;
  });
  const [audiobooks, setAudiobooks] = useState(() => {
    const stored = getStoredData('audiobooks_list', null);
    if (stored) {
      const storedStr = JSON.stringify(stored);
      if (storedStr.includes('Historias de la Isla de Bioko') || storedStr.includes('Audiolecciones de Física') || storedStr.includes('Capítulo 1:') || storedStr.includes('Leyendas del Río')) {
        localStorage.removeItem('educ_audiobooks_list');
        return INITIAL_AUDIOBOOKS;
      }
      const storedIds = new Set(stored.map(a => a.id));
      const missing = INITIAL_AUDIOBOOKS.filter(a => !storedIds.has(a.id));
      return missing.length > 0 ? [...stored, ...missing] : stored;
    }
    return INITIAL_AUDIOBOOKS;
  });
  const [pendingTeachers, setPendingTeachers] = useState(() => getStoredData('pending_teachers', INITIAL_PENDING_TEACHERS));
  const [pendingStudents, setPendingStudents] = useState(() => getStoredData('pending_students', INITIAL_PENDING_STUDENTS));
  const [tutoringRequests, setTutoringRequests] = useState(() => getStoredData('tutoring_requests', INITIAL_TUTORING_REQUESTS));
  const [currentUserGoal, setCurrentUserGoal] = useState(() => getStoredData('current_user_goal', null));

  const [notifications, setNotifications] = useState(() => {
    const stored = getStoredData('notifications_list', null);
    if (stored) {
      const storedStr = JSON.stringify(stored);
      if (storedStr.includes('Nueva Sala') || storedStr.includes('ha subido') || storedStr.includes('ha publicado') || storedStr.includes('agregó la guía') || storedStr.includes('Hace ') || storedStr.includes('Ahora mismo')) {
        localStorage.removeItem('educ_notifications_list');
        return [
          { id: 'not-1', type: 'course', title: '📚 Nouveau Cours de Mathématiques Publié', text: 'Prof. Carmen Ruiz a téléversé le cours "Algèbre Avancée & Sélectivité" avec 12 leçons hors-ligne.', time: 'Il y a 15 min', read: false },
          { id: 'not-2', type: 'audiobook', title: '🎧 Nouveau Livre Audio Publié', text: 'Prof. Baltasar Nsue Ondo a publié le livre audio MP3 "Contes et Histoires de l\'Île de Bioko".', time: 'Il y a 1 heure', read: false },
          { id: 'not-3', type: 'teacher', title: '📢 Annonce en Physique et Chimie', text: 'Dra. Solange Nguema a ajouté le guide d\'exercices corrigés du Module 2.', time: 'Il y a 3 heures', read: false }
        ];
      }
      return stored;
    }
    return [
      { id: 'not-1', type: 'course', title: '📚 Nouveau Cours de Mathématiques Publié', text: 'Prof. Carmen Ruiz a téléversé le cours "Algèbre Avancée & Sélectivité" avec 12 leçons hors-ligne.', time: 'Il y a 15 min', read: false },
      { id: 'not-2', type: 'audiobook', title: '🎧 Nouveau Livre Audio Publié', text: 'Prof. Baltasar Nsue Ondo a publié le livre audio MP3 "Contes et Histoires de l\'Île de Bioko".', time: 'Il y a 1 heure', read: false },
      { id: 'not-3', type: 'teacher', title: '📢 Annonce en Physique et Chimie', text: 'Dra. Solange Nguema a ajouté le guide d\'exercices corrigés du Module 2.', time: 'Il y a 3 heures', read: false }
    ];
  });
  const [latestNotificationToast, setLatestNotificationToast] = useState(null);

  useEffect(() => {
    setStoredData('is_auth', isAuthenticated);
    setStoredData('current_user', currentUser);
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    setStoredData('audiobooks_list', audiobooks);
  }, [audiobooks]);

  useEffect(() => {
    setStoredData('current_user_goal', currentUserGoal);
  }, [currentUserGoal]);

  useEffect(() => {
    setStoredData('courses_list', courses);
  }, [courses]);

  useEffect(() => {
    setStoredData('pending_teachers', pendingTeachers);
  }, [pendingTeachers]);

  useEffect(() => {
    setStoredData('pending_students', pendingStudents);
  }, [pendingStudents]);

  useEffect(() => {
    setStoredData('tutoring_requests', tutoringRequests);
  }, [tutoringRequests]);

  useEffect(() => {
    setStoredData('notifications_list', notifications);
  }, [notifications]);

  const saveUserGoal = (goalPlan) => {
    setCurrentUserGoal(goalPlan);
    setCurrentUser(prev => ({ ...prev, savedGoal: goalPlan }));
  };

  // Fonction globale pour enregistrer les notifications en temps réel
  const addNotification = (notifData) => {
    const newNotif = {
      id: `not-${Date.now()}`,
      type: notifData.type || 'content',
      targetRoles: notifData.targetRoles || null,
      title: notifData.title || '📚 Nouveau Contenu Publié par l\'Enseignant',
      text: notifData.text || 'Un enseignant a téléversé une nouvelle ressource éducative sur la plateforme.',
      author: notifData.author || currentUser?.name || 'Enseignant',
      time: 'À l\'instant',
      read: false,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);
    if (!notifData.targetRoles || notifData.targetRoles.includes(currentUser?.role || 'student')) {
      setLatestNotificationToast(newNotif);
    }
    enqueueSyncAction('CREATE_NOTIFICATION', { title: newNotif.title, text: newNotif.text });
    return newNotif;
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearLatestNotificationToast = () => {
    setLatestNotificationToast(null);
  };

  // Se connecter par email/mot de passe
  const login = (email, password, roleOverride = null) => {
    // Vérifier si l'étudiant est en attente d'approbation
    const pendingStudent = pendingStudents.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (pendingStudent && pendingStudent.approvalStatus === 'Pending') {
      return {
        success: false,
        isPendingApproval: true,
        message: `Votre demande d'inscription en tant qu'Étudiant est EN ATTENTE D'APPROBATION PAR L'ADMINISTRATEUR. Vous recevrez l'accès une fois approuvée.`
      };
    }

    // Vérifier dans la liste des enseignants en attente
    const pending = pendingTeachers.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (pending && pending.approvalStatus === 'Pending') {
      return {
        success: false,
        isPendingApproval: true,
        message: `Votre demande en tant qu'Enseignant (Licence N° ${pending.licenseNumber}) est EN ATTENTE D'APPROBATION PAR L'ADMINISTRATEUR.`
      };
    }

    const found = DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (found) {
      const userObj = { ...found, role: roleOverride || found.role };
      setCurrentUser(userObj);
      setIsAuthenticated(true);
      return { success: true, user: userObj };
    }

    // Compte générique inscrit
    const newAcc = {
      email,
      name: email.split('@')[0].toUpperCase(),
      role: roleOverride || 'student',
      school: 'École Rurale Communautaire',
      country: 'Afrique Centrale',
      approvalStatus: 'Approved',
      xpPoints: 100,
      level: 1,
      studyStreakDays: 1,
      badges: [],
      enrolledCourses: ['course-math-master'],
      completedLessons: [],
      quizResults: {}
    };

    setCurrentUser(newAcc);
    setIsAuthenticated(true);
    return { success: true, user: newAcc };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('is_auth');
      localStorage.removeItem('current_user');
      sessionStorage.removeItem('is_auth');
      sessionStorage.removeItem('current_user');
    } catch (e) {
      console.error(e);
    }
  };

  const changePassword = (currentPassword, newPassword) => {
    const expectedPassword = currentUser?.password || '123';
    if (currentPassword !== expectedPassword) {
      return { success: false, error: 'Le mot de passe actuel est incorrect.' };
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'Le nouveau mot de passe doit comporter au moins 4 caractères.' };
    }
    const updatedUser = { ...currentUser, password: newPassword };
    setCurrentUser(updatedUser);
    setStoredData('current_user', updatedUser);
    enqueueSyncAction('UPDATE_PASSWORD', { email: currentUser?.email, newPassword });
    return { success: true, message: 'Mot de passe modifié avec succès!' };
  };

  // Solicitar registro de Profesor (Requiere aprobación de Admin)
  const submitTeacherApplication = (teacherData) => {
    const newApplication = {
      id: `req-t-${Date.now()}`,
      ...teacherData,
      role: 'teacher',
      approvalStatus: 'Pending',
      appliedDate: new Date().toLocaleDateString()
    };

    setPendingTeachers(prev => [newApplication, ...prev]);
    enqueueSyncAction('SUBMIT_TEACHER_APP', { email: teacherData.email, license: teacherData.licenseNumber });
    return newApplication;
  };

  // Aprobar solicitud de profesor por el Admin
  const approveTeacherApplication = (appId) => {
    const targetApp = pendingTeachers.find(p => p.id === appId);
    if (!targetApp) return;

    const approvedAccount = {
      ...targetApp,
      approvalStatus: 'Approved',
      xpPoints: 500,
      level: 5,
      badges: [{ id: 'b-approved', name: 'Licence Vérifiée', desc: 'Enseignant approuvé par l\'administration centrale' }]
    };

    DEMO_ACCOUNTS.push(approvedAccount);
    setPendingTeachers(prev => prev.filter(p => p.id !== appId));
    enqueueSyncAction('APPROVE_TEACHER', { email: targetApp.email, license: targetApp.licenseNumber });
  };

  // Rechazar solicitud de profesor
  const rejectTeacherApplication = (appId) => {
    setPendingTeachers(prev => prev.filter(p => p.id !== appId));
  };

  // Admin: Aprobar TODAS las solicitudes de profesores
  const approveAllPendingTeachers = () => {
    pendingTeachers.forEach(targetApp => {
      const approvedAccount = {
        ...targetApp,
        approvalStatus: 'Approved',
        xpPoints: 500,
        level: 5,
        badges: [{ id: 'b-approved', name: 'Licence Vérifiée', desc: 'Enseignant approuvé par l\'administration centrale' }]
      };
      DEMO_ACCOUNTS.push(approvedAccount);
    });
    setPendingTeachers([]);
    enqueueSyncAction('APPROVE_ALL_TEACHERS', { count: pendingTeachers.length });
  };

  // Solicitud de Registro de Estudiante (requiere aprobación Admin)
  const submitStudentApplication = (studentData) => {
    const newApp = {
      id: `req-s-${Date.now()}`,
      ...studentData,
      role: 'student',
      approvalStatus: 'Pending',
      appliedDate: new Date().toLocaleDateString()
    };
    setPendingStudents(prev => [newApp, ...prev]);
    enqueueSyncAction('SUBMIT_STUDENT_APP', { email: studentData.email, name: studentData.name });
    return newApp;
  };

  // Admin: aprobar solicitud de estudiante
  const approveStudentApplication = (appId) => {
    const app = pendingStudents.find(s => s.id === appId);
    if (!app) return;
    const approvedAcc = {
      ...app,
      approvalStatus: 'Approved',
      xpPoints: 100,
      level: 1,
      studyStreakDays: 1,
      badges: [{ id: 'b-welcome', name: 'Bienvenue', desc: 'Compte approuvé par l\'Administrateur EDUC-EG' }],
      enrolledCourses: ['course-math-master'],
      completedLessons: [],
      quizResults: {}
    };
    DEMO_ACCOUNTS.push(approvedAcc);
    setPendingStudents(prev => prev.filter(s => s.id !== appId));
    enqueueSyncAction('APPROVE_STUDENT', { email: app.email });
  };

  // Admin: rejeter la demande de l'étudiant
  const rejectStudentApplication = (appId) => {
    setPendingStudents(prev => prev.filter(s => s.id !== appId));
  };

  // Admin: Approuver TOUTES les demandes d'étudiants
  const approveAllPendingStudents = () => {
    pendingStudents.forEach(app => {
      const approvedAcc = {
        ...app,
        approvalStatus: 'Approved',
        xpPoints: 100,
        level: 1,
        studyStreakDays: 1,
        badges: [{ id: 'b-welcome', name: 'Bienvenue', desc: 'Compte approuvé par l\'Administrateur EDUC-EG' }],
        enrolledCourses: ['course-math-master'],
        completedLessons: [],
        quizResults: {}
      };
      DEMO_ACCOUNTS.push(approvedAcc);
    });
    setPendingStudents([]);
    enqueueSyncAction('APPROVE_ALL_STUDENTS', { count: pendingStudents.length });
  };

  // Enregistrer un étudiant directement
  const registerUser = (userData) => {
    const newUser = {
      ...userData,
      approvalStatus: 'Approved',
      xpPoints: 100,
      level: 1,
      studyStreakDays: 1,
      badges: [{ id: 'b-welcome', name: 'Bienvenue', desc: 'Vous avez rejoint le réseau EDUC-EG' }],
      enrolledCourses: ['course-math-master'],
      completedLessons: [],
      quizResults: {}
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    enqueueSyncAction('REGISTER_USER', { email: newUser.email, role: newUser.role });
    return newUser;
  };

  // Inscribirse a un curso
  const enrollCourse = (courseId) => {
    if (!currentUser?.enrolledCourses?.includes(courseId)) {
      setCurrentUser(prev => ({
        ...prev,
        enrolledCourses: [...(prev?.enrolledCourses || []), courseId]
      }));
    }
  };

  // Marcar lección como completada
  const markLessonComplete = (lessonId) => {
    const completed = currentUser?.completedLessons || [];
    if (!completed.includes(lessonId)) {
      const updatedLessons = [...completed, lessonId];
      const newXp = (currentUser?.xpPoints || 0) + 50;
      let newLevel = currentUser?.level || 1;
      if (newXp >= newLevel * 200) newLevel += 1;

      setCurrentUser(prev => ({
        ...prev,
        completedLessons: updatedLessons,
        xpPoints: newXp,
        level: newLevel
      }));

      enqueueSyncAction('LESSON_COMPLETE', { lessonId, xpGained: 50 });
    }
  };

  // Registrar resultado de cuestionario
  const recordQuizResult = (quizId, score, passed) => {
    const updatedResults = {
      ...(currentUser?.quizResults || {}),
      [quizId]: { score, passed, date: new Date().toLocaleDateString() }
    };

    let gainedXp = passed ? 100 : 25;
    setCurrentUser(prev => ({
      ...prev,
      quizResults: updatedResults,
      xpPoints: (prev?.xpPoints || 0) + gainedXp
    }));

    enqueueSyncAction('QUIZ_SUBMISSION', { quizId, score, passed });
  };

  // Añadir nueva solicitud de clase particular
  const addTutoringRequest = (requestData) => {
    const newReq = {
      id: `tut-${Date.now()}`,
      ...requestData,
      status: 'Pending',
      submittedDate: new Date().toLocaleDateString()
    };
    setTutoringRequests(prev => [newReq, ...prev]);
    enqueueSyncAction('TUTORING_REQUEST', { student: requestData.studentName, teacher: requestData.teacherName });
    return newReq;
  };

  // Admin / Profesor: aceptar solicitud de clase particular
  const acceptTutoringRequest = (reqId) => {
    setTutoringRequests(prev => prev.map(r =>
      r.id === reqId ? { ...r, status: 'Accepted' } : r
    ));
    enqueueSyncAction('TUTORING_ACCEPT', { reqId });
  };

  // Admin / Profesor: rechazar solicitud
  const rejectTutoringRequest = (reqId) => {
    setTutoringRequests(prev => prev.map(r =>
      r.id === reqId ? { ...r, status: 'Rejected' } : r
    ));
    enqueueSyncAction('TUTORING_REJECT', { reqId });
  };

  // Admin / Profesor: Aceptar TODAS las solicitudes de tutoría
  const acceptAllTutoringRequests = () => {
    setTutoringRequests(prev => prev.map(r => ({ ...r, status: 'Accepted' })));
    enqueueSyncAction('TUTORING_ACCEPT_ALL', {});
  };

  // Admin: Aceptar y Aprobar TODAS las solicitudes pendientes (Profesores, Estudiantes y Tutorías)
  const approveAllPendingRequests = () => {
    approveAllPendingTeachers();
    approveAllPendingStudents();
    acceptAllTutoringRequests();
  };

  // Agregar curso (Profesor)
  const addCourse = (newCourse) => {
    const courseWithId = {
      ...newCourse,
      id: `course-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      isOfflineReady: true,
      modules: newCourse.modules || []
    };
    setCourses(prev => [courseWithId, ...prev]);
    addNotification({
      type: 'course',
      title: '📚 Nouveau Cours Publié par l\'Enseignant !',
      text: `L'enseignant ${currentUser?.name || 'Enseignant'} a publié un nouveau cours : "${courseWithId.title}".`,
      author: currentUser?.name
    });
    enqueueSyncAction('CREATE_COURSE', { courseId: courseWithId.id, title: courseWithId.title });
    return courseWithId;
  };

  // Ajouter un nouveau livre audio ou pod éducatif (Enseignant - Nécessite Approbation Admin)
  const addAudiobook = (newAudiobookData) => {
    const newBook = {
      id: `ab-${Date.now()}`,
      author: currentUser?.name || 'Prof. Baltasar Nsue Ondo',
      narrator: newAudiobookData.narrator || currentUser?.name || 'Prof. Baltasar Nsue Ondo',
      category: newAudiobookData.category || 'Littérature & Légendes',
      duration: newAudiobookData.duration || '30 min (3 Chapitres)',
      sizeMB: newAudiobookData.sizeMB || '6.0 MB',
      coverBg: newAudiobookData.coverBg || 'from-indigo-800 to-slate-950',
      description: newAudiobookData.description || 'Leçon audio pour les étudiants.',
      approvalStatus: 'Pending', // Nécessite Approbation Admin
      submittedDate: new Date().toLocaleDateString(),
      chapters: newAudiobookData.chapters?.length ? newAudiobookData.chapters : [
        { id: `ch-${Date.now()}-1`, title: 'Chapitre 1: Introduction et Fondements', duration: '10:00', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
      ],
      ...newAudiobookData
    };
    setAudiobooks(prev => [newBook, ...prev]);
    addNotification({
      type: 'audiobook',
      title: '🎧 Nouveau Livre Audio / Pod Publié par l\'Enseignant !',
      text: `L'enseignant ${newBook.author} a téléversé un nouveau livre audio : "${newBook.title}".`,
      author: newBook.author
    });
    enqueueSyncAction('CREATE_AUDIOBOOK', { audiobookId: newBook.id, title: newBook.title });
    return newBook;
  };

  // Admin: Accepter / Approuver le livre audio téléversé par l'enseignant
  const approveAudiobook = (audiobookId) => {
    let approvedTitle = '';
    setAudiobooks(prev => prev.map(a => {
      if (a.id === audiobookId) {
        approvedTitle = a.title;
        return { ...a, approvalStatus: 'Approved' };
      }
      return a;
    }));
    addNotification({
      type: 'audiobook',
      title: '✅ Livre Audio Vérifié et Disponible',
      text: `Le livre audio "${approvedTitle || 'Nouveau Livre Audio'}" a été accepté par l'Administrateur et est maintenant disponible pour les étudiants.`,
      author: 'Administration Centrale'
    });
    enqueueSyncAction('APPROVE_AUDIOBOOK', { audiobookId });
  };

  // Admin: Rejeter le livre audio
  const rejectAudiobook = (audiobookId) => {
    setAudiobooks(prev => prev.filter(a => a.id !== audiobookId));
    enqueueSyncAction('REJECT_AUDIOBOOK', { audiobookId });
  };

  // Admin: Approuver TOUS les livres audio en attente
  const approveAllPendingAudiobooks = () => {
    setAudiobooks(prev => prev.map(a => ({ ...a, approvalStatus: 'Approved' })));
    addNotification({
      type: 'audiobook',
      title: '✅ Livres Audio Approuvés par l\'Admin',
      text: 'Tous les livres audio en attente ont été vérifiés et sont disponibles pour le téléchargement et l\'écoute hors-ligne.',
      author: 'Administration Centrale'
    });
    enqueueSyncAction('APPROVE_ALL_AUDIOBOOKS', {});
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user: currentUser,
      setUser: setCurrentUser,
      login,
      logout,
      changePassword,
      registerUser,
      submitTeacherApplication,
      pendingTeachers,
      approveTeacherApplication,
      rejectTeacherApplication,
      approveAllPendingTeachers,
      pendingStudents,
      submitStudentApplication,
      approveStudentApplication,
      rejectStudentApplication,
      approveAllPendingStudents,
      activeRole: currentUser?.role || 'student',
      courses,
      setCourses,
      audiobooks,
      setAudiobooks,
      addAudiobook,
      approveAudiobook,
      rejectAudiobook,
      approveAllPendingAudiobooks,
      notifications,
      addNotification,
      markAllNotificationsRead,
      latestNotificationToast,
      clearLatestNotificationToast,
      enrollCourse,
      markLessonComplete,
      recordQuizResult,
      addCourse,
      tutoringRequests,
      addTutoringRequest,
      acceptTutoringRequest,
      rejectTutoringRequest,
      acceptAllTutoringRequests,
      approveAllPendingRequests,
      currentUserGoal,
      saveUserGoal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
