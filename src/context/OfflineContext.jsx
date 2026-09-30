import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveCourseToOfflineStore,
  removeCourseFromOfflineStore,
  getOfflineDownloadsList,
  getSyncQueue,
  clearSyncQueue
} from '../db/offlineDB';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  // Estado real de red del navegador
  const [isBrowserOnline, setIsBrowserOnline] = useState(navigator.onLine);
  // Interruptor simulado para testing en la interfaz
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  // Modo de ahorro de ancho de banda (baja velocidad en zonas rurales)
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  // Lista de cursos guardados en IndexedDB
  const [offlineDownloads, setOfflineDownloads] = useState([]);
  const [downloadingCourseId, setDownloadingCourseId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Sincronización
  const [syncQueue, setSyncQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());

  const isEffectiveOffline = isSimulatedOffline || !isBrowserOnline;

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cargar descargas guardadas en IndexedDB al inicio
    refreshDownloads();
    refreshSyncQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Actualizar cola de sincronización periódicamente o al cambiar estado
  const refreshSyncQueue = () => {
    setSyncQueue(getSyncQueue());
  };

  const refreshDownloads = async () => {
    const list = await getOfflineDownloadsList();
    setOfflineDownloads(list);
  };

  // Simular descarga progresiva a IndexedDB
  const downloadCourse = async (course) => {
    if (downloadingCourseId) return;

    setDownloadingCourseId(course.id);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 300);

    setTimeout(async () => {
      clearInterval(interval);
      setDownloadProgress(100);
      await saveCourseToOfflineStore(course);
      await refreshDownloads();
      setDownloadingCourseId(null);
      setDownloadProgress(0);
    }, 1800);
  };

  // Eliminar descarga
  const deleteOfflineCourse = async (courseId) => {
    await removeCourseFromOfflineStore(courseId);
    await refreshDownloads();
  };

  // Ejecutar Sincronización cuando hay conexión
  const triggerSync = async () => {
    if (isEffectiveOffline || syncQueue.length === 0) return;

    setIsSyncing(true);
    setTimeout(() => {
      clearSyncQueue();
      setSyncQueue([]);
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 1500);
  };

  const toggleOfflineSimulation = () => {
    setIsSimulatedOffline(prev => !prev);
    refreshSyncQueue();
  };

  return (
    <OfflineContext.Provider value={{
      isBrowserOnline,
      isSimulatedOffline,
      isEffectiveOffline,
      toggleOfflineSimulation,
      isLowBandwidth,
      setIsLowBandwidth,
      offlineDownloads,
      downloadingCourseId,
      downloadProgress,
      downloadCourse,
      deleteOfflineCourse,
      syncQueue,
      refreshSyncQueue,
      triggerSync,
      isSyncing,
      showSyncModal,
      setShowSyncModal,
      lastSyncTime
    }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
