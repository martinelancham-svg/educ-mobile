import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider, useOffline } from './context/OfflineContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LiveClassAlert } from './components/LiveClassAlert';
import { SyncModal } from './components/SyncModal';
import { StudentSidebar } from './components/StudentSidebar';
import { TeacherSidebar } from './components/TeacherSidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { ExerciseWindowModal } from './components/ExerciseWindowModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Auth Page
import { LoginPage } from './pages/auth/LoginPage';

// Student Pages
import { CourseCatalog } from './pages/student/CourseCatalog';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { CourseViewer } from './pages/student/CourseViewer';
import { MyDownloads } from './pages/student/MyDownloads';
import { StudentBadges } from './pages/student/StudentBadges';
import { StudentProfile } from './pages/student/StudentProfile';
import { DownloadableDocs } from './pages/student/DownloadableDocs';
import { GradesAndResults } from './pages/student/GradesAndResults';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { TeacherChatForum } from './pages/student/TeacherChatForum';
import { QuizRunner } from './pages/student/QuizRunner';
import { EsoExercisesWorkshop } from './pages/student/EsoExercisesWorkshop';
import { StudentLiveClasses } from './pages/student/StudentLiveClasses';
import { TeacherExercisesWorkshop } from './pages/teacher/TeacherExercisesWorkshop';
import { OnlineTeachersPage } from './pages/student/OnlineTeachersPage';
import { RateTeachersPage } from './pages/student/RateTeachersPage';
import { AudiobooksPage } from './pages/student/AudiobooksPage';
import { TeacherChannelsPage } from './pages/student/TeacherChannelsPage';
import { OnlineUsersPage } from './pages/common/OnlineUsersPage';
import { AiTutorHub } from './pages/common/AiTutorHub';
import { StudentPersonalGoals } from './components/StudentPersonalGoals';
import { StudentDigitalNotebook } from './components/StudentDigitalNotebook';
import { DigitalLibrary } from './components/DigitalLibrary';
import { WhatsAppAiAssistantWidget } from './components/WhatsAppAiAssistantWidget';
import { StudentListDirectory } from './components/StudentListDirectory';
import { AttendanceTracker } from './components/AttendanceTracker';
import { TeacherListDirectory } from './components/TeacherListDirectory';
import { AdminGradesReport } from './components/AdminGradesReport';
import { WelcomeToastBanner } from './components/WelcomeToastBanner';
import { ContentNotificationToast } from './components/ContentNotificationToast';
import { SecureExamRoomManager } from './components/SecureExamRoomManager';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { CourseBuilder } from './pages/teacher/CourseBuilder';
import { TeacherProfile } from './pages/teacher/TeacherProfile';
import { TeacherFileUploads } from './pages/teacher/TeacherFileUploads';
import { TeacherSubmissionsGrader } from './pages/teacher/TeacherSubmissionsGrader';
import { TeacherStudentProgress } from './pages/teacher/TeacherStudentProgress';
import { TeacherAnnouncements } from './pages/teacher/TeacherAnnouncements';
import { TeacherLiveClasses } from './pages/teacher/TeacherLiveClasses';
import { TeacherQAResponses } from './pages/teacher/TeacherQAResponses';
import { TeacherPrivateTutoringRequests } from './pages/teacher/TeacherPrivateTutoringRequests';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { PackageExporter } from './pages/admin/PackageExporter';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminStudentRequests } from './pages/admin/AdminStudentRequests';
import { AdminTutoringPricing } from './pages/admin/AdminTutoringPricing';
import { AdminOnlineStudents } from './pages/admin/AdminOnlineStudents';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminReminders } from './pages/admin/AdminReminders';
import { AdminArchived } from './pages/admin/AdminArchived';

import { BookOpen, Menu, HardDrive, WifiOff } from 'lucide-react';

const MainAppContent = () => {
  const { isAuthenticated, activeRole, courses } = useAuth();
  const { isLowBandwidth } = useOffline();
  const { isLightMode } = useTheme();

  const [activeTab, setActiveTabState] = useState('catalog');
  const [tabHistory, setTabHistory] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [isLockdownActive, setIsLockdownActive] = useState(false);

  const setActiveTab = (newTab) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, activeTab]);
      setActiveTabState(newTab);
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(prev => prev.slice(0, -1));
      setActiveTabState(prevTab);
    } else {
      if (activeRole === 'teacher') setActiveTabState('teacher-dash');
      else if (activeRole === 'admin') setActiveTabState('admin-dash');
      else setActiveTabState('catalog');
    }
  };

  useEffect(() => {
    setTabHistory([]);
    if (activeRole === 'teacher') {
      setActiveTabState('teacher-dash');
    } else if (activeRole === 'admin') {
      setActiveTabState('admin-dash');
    } else {
      setActiveTabState('catalog');
    }
  }, [activeRole]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenCourse = (course) => {
    setSelectedCourse(course);
    setActiveTab('classroom');
  };

  const sampleQuiz = courses?.[0]?.modules?.[0]?.quiz;

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 ${
      isLightMode ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Sidebar Desplegable a la Izquierda para Estudiantes */}
      {!isLockdownActive && activeRole === 'student' && (
        <StudentSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}

      {/* Sidebar Desplegable a la Izquierda para Profesores */}
      {!isLockdownActive && activeRole === 'teacher' && (
        <TeacherSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}

      {/* Sidebar Desplegable a la Izquierda para Administradores */}
      {!isLockdownActive && activeRole === 'admin' && (
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}

      {/* Header y Contenido */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        !isLockdownActive && isSidebarOpen ? 'lg:ml-72' : !isLockdownActive ? 'lg:ml-20' : 'ml-0'
      }`}>
        {!isLockdownActive && (
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onBack={handleGoBack} canGoBack={tabHistory.length > 0} />
        )}

        {/* Botón Flotante en Móviles */}
        <div className="lg:hidden px-4 pt-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-xl bg-slate-900 border text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg ${
              activeRole === 'teacher' ? 'border-amber-500/40 text-amber-400' : activeRole === 'admin' ? 'border-purple-500/40 text-purple-300' : 'border-slate-700 text-emerald-400'
            }`}
          >
            <Menu className="w-5 h-5" />
            {activeRole === 'teacher' ? 'Menu Enseignant' : activeRole === 'admin' ? 'Menu Console Admin' : 'Menu & Cours Étudiant'}
          </button>
        </div>

        {/* Modal Ventana Interactiva de Ejercicios por Rol */}
        <ExerciseWindowModal
          isOpen={showExerciseModal}
          onClose={() => setShowExerciseModal(false)}
        />

        {/* Modal de Sincronización */}
        <SyncModal />

        {/* Notificación Flotante de Bienvenida por Rol */}
        <WelcomeToastBanner />

        {/* Contenido Principal por Rol y Pestaña */}
        <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* INTERFAZ Y SECCIONES DEL ESTUDIANTE */}
          {activeRole === 'student' && (
            <>
              {/* ── Alerte Cours en Direct — Visible sur TOUTES les pages étudiants ── */}
              <LiveClassAlert onNavigateToLive={() => setActiveTab('student-live')} />
              {(activeTab === 'catalog' || activeTab === 'primaria-courses' || activeTab === 'eso-courses' || activeTab === 'bachillerato-courses' || activeTab === 'fp-courses' || activeTab === 'math-physics-courses') && (
                <CourseCatalog onOpenCourse={handleOpenCourse} initialTab={activeTab} />
              )}
              {activeTab === 'digital-library' && <DigitalLibrary />}
              {activeTab === 'audiobooks' && <AudiobooksPage />}
              {activeTab === 'teacher-channels' && <TeacherChannelsPage />}
              {activeTab === 'ai-tutor' && <AiTutorHub />}
              {activeTab === 'eso-exercises' && <EsoExercisesWorkshop />}
              {activeTab === 'student-live' && <StudentLiveClasses />}
              {activeTab === 'rate-teachers' && <RateTeachersPage onBack={handleGoBack} />}
              {activeTab === 'online-teachers' && <OnlineUsersPage initialTab="teachers" />}
              {activeTab === 'digital-notebook' && <StudentDigitalNotebook />}
              {activeTab === 'personal-goals' && (
                <StudentPersonalGoals
                  onNavigateToCourse={() => setActiveTab('catalog')}
                  onNavigateToExercises={() => setActiveTab('eso-exercises')}
                />
              )}
              {activeTab === 'profile' && <StudentProfile />}
              {activeTab === 'dashboard' && (
                <StudentDashboard
                  onOpenCourse={handleOpenCourse}
                  onNavigateToAiTutor={() => setActiveTab('ai-tutor')}
                  onNavigateToGoals={() => setActiveTab('personal-goals')}
                  onNavigateToSecureExams={() => setActiveTab('secure-exams')}
                />
              )}
              {activeTab === 'downloadable-docs' && <DownloadableDocs />}
              {activeTab === 'exams-quizzes' && (
                sampleQuiz ? (
                  <QuizRunner quiz={sampleQuiz} onBack={() => setActiveTab('catalog')} />
                ) : (
                  <CourseCatalog onOpenCourse={handleOpenCourse} />
                )
              )}
              {activeTab === 'grades-results' && <GradesAndResults />}
              {activeTab === 'downloads' && <MyDownloads onOpenCourse={handleOpenCourse} />}
              {activeTab === 'history' && <StudentDashboard onOpenCourse={handleOpenCourse} />}
              {activeTab === 'badges' && <StudentBadges />}
              {activeTab === 'notifications' && <NotificationsPage />}
              {activeTab === 'chat-forum' && <TeacherChatForum />}
              {activeTab === 'secure-exams' && <SecureExamRoomManager onLockdownStateChange={setIsLockdownActive} />}
              {activeTab === 'classroom' && selectedCourse && (
                <CourseViewer
                  course={selectedCourse}
                  onBack={() => setActiveTab('catalog')}
                />
              )}
            </>
          )}

          {/* INTERFAZ Y SECCIONES DEL PROFESOR */}
          {activeRole === 'teacher' && (
            <>
              {activeTab === 'attendance-tracker' && <AttendanceTracker />}
              {activeTab === 'student-list' && <StudentListDirectory />}
              {activeTab === 'digital-library' && <DigitalLibrary />}
              {activeTab === 'audiobooks' && <AudiobooksPage />}
              {activeTab === 'teacher-channels' && <TeacherChannelsPage />}
              {activeTab === 'ai-tutor' && <AiTutorHub />}
              {activeTab === 'teacher-profile' && <TeacherProfile />}
              {activeTab === 'teacher-tutoring-requests' && <TeacherPrivateTutoringRequests />}
              {activeTab === 'teacher-online-students' && <OnlineUsersPage initialTab="students" />}
              {activeTab === 'notifications' && <NotificationsPage />}
              {activeTab === 'secure-exams' && <SecureExamRoomManager onLockdownStateChange={setIsLockdownActive} />}
              {(activeTab === 'teacher-dash' || activeTab === 'catalog' || activeTab === 'dashboard') && (
                <TeacherDashboard
                  onCreateCourse={() => setActiveTab('create-course')}
                  onNavigateToOnlineStudents={() => setActiveTab('teacher-online-students')}
                  onNavigateToProgress={() => setActiveTab('teacher-progress')}
                  onNavigateToLive={() => setActiveTab('teacher-live')}
                  onNavigateToSecureExams={() => setActiveTab('secure-exams')}
                />
              )}
              {activeTab === 'create-course' && (
                <CourseBuilder
                  onCancel={() => setActiveTab('teacher-dash')}
                  onSaved={(newCourse) => handleOpenCourse(newCourse)}
                />
              )}
              {activeTab === 'teacher-uploads' && <TeacherFileUploads />}
              {activeTab === 'teacher-grading' && <TeacherSubmissionsGrader />}
              {activeTab === 'teacher-progress' && <TeacherStudentProgress />}
              {activeTab === 'teacher-announcements' && <TeacherAnnouncements />}
              {activeTab === 'teacher-live' && <TeacherLiveClasses />}
              {activeTab === 'teacher-exercises' && <TeacherExercisesWorkshop />}
              {activeTab === 'teacher-qa' && <TeacherQAResponses />}
              {activeTab === 'classroom' && selectedCourse && (
                <CourseViewer
                  course={selectedCourse}
                  onBack={() => setActiveTab('teacher-dash')}
                />
              )}
            </>
          )}

          {/* INTERFAZ Y SECCIONES DEL ADMINISTRADOR */}
          {activeRole === 'admin' && (
            <>
              {activeTab === 'attendance-tracker' && <AttendanceTracker />}
              {activeTab === 'student-list' && <StudentListDirectory />}
              {activeTab === 'teacher-list' && <TeacherListDirectory />}
              {activeTab === 'admin-grades' && <AdminGradesReport />}
              {activeTab === 'digital-library' && <DigitalLibrary />}
              {activeTab === 'audiobooks' && <AudiobooksPage />}
              {activeTab === 'teacher-channels' && <TeacherChannelsPage />}
              {activeTab === 'ai-tutor' && <AiTutorHub />}
              {activeTab === 'secure-exams' && <SecureExamRoomManager onLockdownStateChange={setIsLockdownActive} />}
              {(activeTab === 'admin-dash' || activeTab === 'catalog' || activeTab === 'dashboard') && (
                <AdminDashboard
                  onNavigateToExport={() => setActiveTab('admin-export')}
                  onNavigateToSecureExams={() => setActiveTab('secure-exams')}
                />
              )}
              {activeTab === 'admin-profile' && <AdminProfile />}
              {activeTab === 'admin-student-requests' && <AdminStudentRequests />}
              {activeTab === 'admin-teacher-requests' && <TeacherListDirectory />}
              {activeTab === 'admin-tutoring-pricing' && <AdminTutoringPricing />}
              {activeTab === 'admin-online-students' && <OnlineUsersPage initialTab="students" />}
              {activeTab === 'admin-notifications' && <AdminNotifications />}
              {activeTab === 'admin-reminders' && <AdminReminders />}
              {activeTab === 'admin-archived' && <AdminArchived />}
              {activeTab === 'admin-users' && <UserManagement />}
              {activeTab === 'admin-export' && <PackageExporter />}
            </>
          )}
        </main>

        {/* Pie de Página */}
        <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white">EDUC-EG</span>
              <span>• Plateforme Éducative Autonome Hors-Ligne</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <HardDrive className="w-3.5 h-3.5" /> IndexedDB Active
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5" /> Private Tutoring Ready
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Widget Omnipresente del Asistente IA WhatsApp 24/7 */}
      <WhatsAppAiAssistantWidget />
      
      {/* Toast Flotante de Notificaciones cuando el profesor sube contenido */}
      <ContentNotificationToast />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OfflineProvider>
          <ThemeProvider>
            <MainAppContent />
          </ThemeProvider>
        </OfflineProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default App;
