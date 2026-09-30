import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Calculator,
  FlaskConical,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PlusCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Maximize2,
  Minimize2,
  BookOpen
} from 'lucide-react';

export const INITIAL_EXERCISES_BANK = [
  // MATEMÁTICAS ESO
  {
    id: 'ex-m1',
    subject: 'math',
    title: 'Équations du 1er Degré',
    roleTarget: 'Secondaire',
    question: 'Résolvez pour x l\'équation: 5x - 7 = 18',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswer: 2, // x = 5
    explanation: '5x = 18 + 7 => 5x = 25 => x = 25 / 5 = 5.'
  },
  {
    id: 'ex-m2',
    subject: 'math',
    title: 'Règle de Trois et Pourcentages',
    difficulty: 'Intermédiaire',
    question: 'Un réservoir de 500 Litres d\'eau est rempli à 40% de sa capacité. Combien de Litres d\'eau contient-il?',
    options: ['150 L', '200 L', '250 L', '300 L'],
    correctAnswer: 1, // 200 L
    explanation: '500 × (40 / 100) = 500 × 0.40 = 200 Litres.'
  },

  // QUÍMICA ESO
  {
    id: 'ex-c1',
    subject: 'chem',
    title: 'Symboles du Tableau Périodique',
    difficulty: 'Facile',
    question: 'Quel est le symbole chimique de l\'Oxygène et du Potassium?',
    options: ['O et P', 'Ox et K', 'O et K', 'O et Po'],
    correctAnswer: 2, // O y K
    explanation: 'L\'Oxygène est O et le Potassium est K (du latin Kalium).'
  },
  {
    id: 'ex-c2',
    subject: 'chem',
    title: 'Équilibrage de Réactions Chimiques',
    difficulty: 'Intermédiaire',
    question: 'Dans la combinaison d\'Hydrogène et d\'Oxygène: 2 H₂ + O₂ ──► ?',
    options: ['H₂O', '2 H₂O', '2 H₂O₂', 'HO'],
    correctAnswer: 1, // 2 H2O
    explanation: 'Produit deux molécules d\'eau (2 H₂O).'
  }
];

export const ExerciseWindowModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  // Rol activo dentro de la ventana de ejercicios
  const [activeWindowRole, setActiveWindowRole] = useState(user?.role || 'student');
  const [activeSubject, setActiveSubject] = useState('math'); // 'math' | 'chem'
  
  const [exercisesList, setExercisesList] = useState(INITIAL_EXERCISES_BANK);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluated, setEvaluated] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Campos para profesor al crear ejercicio
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newCorrect, setNewCorrect] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const currentExercises = exercisesList.filter(e => e.subject === activeSubject);

  const handleSelectOption = (exId, optIdx) => {
    if (evaluated || activeWindowRole !== 'student') return;
    setUserAnswers(prev => ({ ...prev, [exId]: optIdx }));
  };

  const handleEvaluate = () => {
    setEvaluated(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setEvaluated(false);
  };

  const handleCreateExerciseByTeacher = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;

    const created = {
      id: `ex-${Date.now()}`,
      subject: activeSubject,
      title: newTitle,
      difficulty: 'Diseñado por Profesor',
      question: newQuestion,
      options: [newOpt1 || 'Opción A', newOpt2 || 'Opción B', 'Opción C', 'Opción D'],
      correctAnswer: Number(newCorrect),
      explanation: newExplanation || 'Solución validada por el profesor.'
    };

    setExercisesList(prev => [...prev, created]);
    setShowAddForm(false);
    setNewTitle('');
    setNewQuestion('');
  };

  // Calcular correctas en modo estudiante
  const correctCount = currentExercises.filter(ex => userAnswers[ex.id] === ex.correctAnswer).length;
  const scorePercent = currentExercises.length > 0 ? Math.round((correctCount / currentExercises.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className={`bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl flex flex-col transition-all overflow-hidden ${
        isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[90vh]'
      }`}>
        
        {/* Barra Superior de la Ventana (Window Header) */}
        <div className="h-14 px-5 bg-slate-850 border-b border-slate-700 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose}></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)}></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                <Calculator className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-extrabold text-white">Ventana Interactiva de Ejercicios ESO</h2>
            </div>
          </div>

          {/* Selector de Rol dentro de la Ventana */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveWindowRole('student')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeWindowRole === 'student' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Estudiante
              </button>

              <button
                onClick={() => setActiveWindowRole('teacher')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeWindowRole === 'teacher' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Profesor
              </button>

              <button
                onClick={() => setActiveWindowRole('admin')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeWindowRole === 'admin' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hidden sm:block"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Header con Pestañas de Asignatura */}
        <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveSubject('math'); handleReset(); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubject === 'math' ? 'bg-blue-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Mathématiques Secondaire
            </button>

            <button
              onClick={() => { setActiveSubject('chem'); handleReset(); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubject === 'chem' ? 'bg-teal-400 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Physique et Chimie
            </button>
          </div>

          <div className="text-xs text-slate-300 flex items-center gap-2">
            <span className="font-semibold">VISTA ACTUAL:</span>
            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
              activeWindowRole === 'teacher' ? 'bg-amber-500/20 text-amber-300' : activeWindowRole === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {activeWindowRole === 'teacher' ? 'Profesor (Creación)' : activeWindowRole === 'admin' ? 'Admin (Moderación)' : 'Estudiante (Resolución)'}
            </span>
          </div>
        </div>

        {/* Contenido de la Ventana */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* MODO ESTUDIANTE: Resolver Ejercicios */}
          {activeWindowRole === 'student' && (
            <div className="space-y-6">
              {evaluated && (
                <div className="bg-slate-850 p-4 rounded-2xl border border-emerald-500/40 text-center space-y-2">
                  <span className="text-2xl font-black text-emerald-400">{scorePercent}%</span>
                  <p className="text-xs text-slate-300">
                    Has acertado {correctCount} de {currentExercises.length} ejercicios. Ganaste <strong className="text-emerald-400">+90 XP</strong>.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Volver a Intentar
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {currentExercises.map((ex, idx) => {
                  const selected = userAnswers[ex.id];

                  return (
                    <div key={ex.id} className="bg-slate-850 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-400">Ejercicio {idx + 1}: {ex.title}</span>
                        <span className="text-[10px] text-slate-400">{ex.roleTarget || ex.difficulty}</span>
                      </div>

                      <p className="text-sm font-bold text-white">{ex.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ex.options.map((opt, oIdx) => {
                          const isSelected = selected === oIdx;
                          let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';

                          if (evaluated) {
                            if (oIdx === ex.correctAnswer) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                            else if (isSelected) btnStyle = 'bg-red-500/20 border-red-500 text-red-300 font-bold';
                          } else if (isSelected) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(ex.id, oIdx)}
                              className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {evaluated && oIdx === ex.correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              {evaluated && isSelected && oIdx !== ex.correctAnswer && <XCircle className="w-4 h-4 text-red-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {evaluated && (
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                          💡 <strong className="text-amber-300">Solución Explicada:</strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!evaluated && (
                <div className="flex justify-end">
                  <button
                    onClick={handleEvaluate}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" /> Comprobar Respuestas
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODO PROFESOR: Diseñar y Añadir Ejercicios */}
          {activeWindowRole === 'teacher' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Estudio Docente: Crear Ejercicios para Estudiantes</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  {showAddForm ? 'Cerrar Formulario' : '+ Añadir Nuevo Ejercicio'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleCreateExerciseByTeacher} className="bg-slate-850 p-5 rounded-2xl border border-amber-500/30 space-y-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase">Formulario de Ejercicio Docente</h4>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">Título del Ejercicio</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ej: Ecuaciones con Paréntesis"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">Pregunta o Enunciado del Problema</label>
                    <textarea
                      required
                      rows={2}
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ej: Resuelve para x: 3(x - 1) = 9"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Opción 1"
                      value={newOpt1}
                      onChange={(e) => setNewOpt1(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Opción 2"
                      value={newOpt2}
                      onChange={(e) => setNewOpt2(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">Explicación Paso a Paso de la Solución</label>
                    <input
                      type="text"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                      placeholder="Ej: 3x - 3 = 9 => 3x = 12 => x = 4"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Guardar Ejercicio en el Banco
                  </button>
                </form>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Ejercicios Existentes en la Plataforma:</h4>
                {currentExercises.map(ex => (
                  <div key={ex.id} className="bg-slate-850 p-4 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{ex.title}</span>
                      <span className="text-[11px] text-slate-400">{ex.question}</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-800 text-amber-300 text-[10px]">Docente Activo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODO ADMINISTRADOR: Moderación General */}
          {activeWindowRole === 'admin' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Consola Admin: Banco Global de Ejercicios Offline</h3>
              <p className="text-xs text-slate-400">Moderación y control de calidad de ejercicios de matemáticas y química.</p>

              <div className="space-y-2">
                {currentExercises.map(ex => (
                  <div key={ex.id} className="bg-slate-850 p-4 rounded-xl border border-purple-500/30 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-purple-300 block">{ex.title}</span>
                      <span className="text-slate-300">{ex.question}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Validado Admin
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
