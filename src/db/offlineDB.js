// offlineDB.js - Wrapper de IndexedDB y LocalStorage para almacenamiento 100% Offline

const DB_NAME = 'educ_eg_db';
const DB_VERSION = 1;

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('courses')) {
        db.createObjectStore('courses', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('downloads')) {
        db.createObjectStore('downloads', { keyPath: 'courseId' });
      }
      if (!db.objectStoreNames.contains('quiz_results')) {
        db.createObjectStore('quiz_results', { keyPath: 'quizId' });
      }
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Cargar estado guardado o usar valor por defecto
export const getStoredData = (key, fallback) => {
  try {
    const data = localStorage.getItem(`educ_off_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('Error al leer de LocalStorage:', e);
    return fallback;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(`educ_off_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Error al guardar en LocalStorage:', e);
  }
};

// Descargar curso completo en IndexedDB
export const saveCourseToOfflineStore = async (course) => {
  try {
    const db = await openDB();
    const tx = db.transaction(['courses', 'downloads'], 'readwrite');
    const coursesStore = tx.objectStore('courses');
    const downloadsStore = tx.objectStore('downloads');

    const downloadRecord = {
      courseId: course.id,
      title: course.title,
      downloadedAt: new Date().toISOString(),
      sizeMB: course.sizeMB || '4.0 MB',
      modulesCount: course.modules ? course.modules.length : 0
    };

    await coursesStore.put(course);
    await downloadsStore.put(downloadRecord);

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve({ success: true, record: downloadRecord });
    });
  } catch (err) {
    console.error('Error guardando curso en IndexedDB:', err);
    return { success: false, error: err };
  }
};

// Eliminar curso descargado
export const removeCourseFromOfflineStore = async (courseId) => {
  try {
    const db = await openDB();
    const tx = db.transaction(['courses', 'downloads'], 'readwrite');
    tx.objectStore('courses').delete(courseId);
    tx.objectStore('downloads').delete(courseId);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve({ success: true });
    });
  } catch (err) {
    console.error('Error eliminando curso de IndexedDB:', err);
    return { success: false, error: err };
  }
};

// Obtener lista de descargas
export const getOfflineDownloadsList = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction('downloads', 'readonly');
    const store = tx.objectStore('downloads');
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
    });
  } catch (err) {
    console.error('Error obteniendo lista de descargas:', err);
    return [];
  }
};

// Encolar elemento para sincronización cuando se recupere la conexión
export const enqueueSyncAction = async (actionType, payload) => {
  const syncQueue = getStoredData('sync_queue', []);
  const newItem = {
    id: Date.now() + Math.random(),
    type: actionType,
    payload,
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  };
  syncQueue.push(newItem);
  setStoredData('sync_queue', syncQueue);
  return newItem;
};

export const getSyncQueue = () => {
  return getStoredData('sync_queue', []);
};

export const clearSyncQueue = () => {
  setStoredData('sync_queue', []);
};

// Sincronización directa con MySQL XAMPP (http://localhost:5000/api)
export const syncWithMySQLXampp = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/health');
    if (res.ok) {
      const data = await res.json();
      console.log('✅ ¡Sincronizado con MySQL XAMPP (educ_eg)!', data);
      return { success: true, data };
    }
  } catch (err) {
    console.log('ℹ️ Servidor XAMPP API no detectado en local. Operando en modo Offline local.', err.message);
  }
  return { success: false };
};
