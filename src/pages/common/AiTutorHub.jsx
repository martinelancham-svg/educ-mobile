import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Bot,
  Send,
  BookOpen,
  Calendar,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Zap,
  RefreshCw,
  Upload,
  Layers,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  Flame,
  FileSearch,
  BookMarked,
  Sliders,
  Check,
  X
} from 'lucide-react';

export const AiTutorHub = ({ initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // ─── TAB 1: CHAT IA ESPECIALIZADO POR ASIGNATURA (24/7) ─────────────────────
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: 'Bonjour! Je suis votre Tuteur IA de Mathématiques & Physique 24/7. Sur quel sujet avez-vous des questions aujourd\'hui? Je peux expliquer des théorèmes, résoudre des équations ou générer des exercices.',
      timestamp: 'Maintenant'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const SUBJECT_BOTS = [
    { id: 'math', name: 'Tuteur de Mathématiques', icon: '📐', color: 'from-blue-500 to-indigo-600', description: 'Algèbre, Géométrie, Équations du Second Degré, Fonctions et Calcul.' },
    { id: 'physics', name: 'Tuteur de Physique & Chimie', icon: '⚡', color: 'from-amber-500 to-orange-600', description: 'Cinématique, Lois de Newton, Réactions Chimiques et Stœchiométrie.' },
    { id: 'biology', name: 'Tuteur de Biologie & SVT', icon: '🌿', color: 'from-emerald-500 to-teal-600', description: 'Cellule, Génétique Mendélienne, Botanique et Santé Communautaire.' },
    { id: 'history', name: 'Tuteur d\'Histoire & Géographie', icon: '🌍', color: 'from-purple-500 to-pink-600', description: 'Histoire de la Guinée Équatoriale, Géographie Physique et Continentale.' }
  ];

  const PREDEFINED_PROMPTS = {
    math: [
      'Explique-moi la formule quadratique ax² + bx + c = 0 étape par étape',
      'Comment calculer le volume d\'un cylindre?',
      'Génère 3 exercices résolus sur les nombres entiers'
    ],
    physics: [
      'Explique-moi la 2ème Loi de Newton F = m · a avec un exemple pratique',
      'Quelle est la différence entre masse et poids?',
      'Comment équilibrer la réaction de photosynthèse 6CO2 + 6H2O?'
    ],
    biology: [
      'Résume les Lois de Mendel en 4 points clés',
      'Explique-moi la différence entre cellule procaryote et eucaryote',
      'Comment fonctionne la photosynthèse chez les plantes tropicales?'
    ],
    history: [
      'Résumé historique de l\'indépendance de la Guinée Équatoriale (1968)',
      'Quels sont les reliefs principaux de l\'Île de Bioko et du Río Muni?',
      'Explication rapide du climat équatorial humide'
    ]
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAiThinking(true);

    setTimeout(() => {
      let responseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('fórmula cuadrática') || lower.includes('ecuaciones')) {
        responseText = `📐 **Explicación Paso a Paso de la Fórmula Cuadrática:**\n\n` +
          `Para resolver una ecuación cuadrática del tipo **ax² + bx + c = 0**:\n\n` +
          `1️⃣ **Fórmula Principal:**\n` +
          `   x = [-b ± √(b² - 4ac)] / (2a)\n\n` +
          `2️⃣ **Ejemplo:** Para **x² - 5x + 6 = 0** (a=1, b=-5, c=6):\n` +
          `   • Discriminante: (-5)² - 4(1)(6) = 25 - 24 = 1\n` +
          `   • Solución 1: (5 + 1) / 2 = **3**\n` +
          `   • Solución 2: (5 - 1) / 2 = **2**\n\n` +
          `💡 *Consejo de IA:* Recuerda que si el discriminante (b²-4ac) es negativo, no hay soluciones reales.`;
      } else if (lower.includes('newton') || lower.includes('fuerza')) {
        responseText = `⚡ **Explicación Didáctica de la 2ª Ley de Newton:**\n\n` +
          `La fórmula fundamental es **Fuerza = Masa × Aceleración (F = m · a)**.\n\n` +
          `📌 **Ejemplo Cotidiano:**\n` +
          `Si empujas un carrito vacío (masa pequeña), acelera rápidamente. Si el carrito está lleno de sacos (mucha masa), necesitarás mucha más **Fuerza** para conseguir la misma aceleración.\n\n` +
          `• **Fuerza (F):** Se mide en Newtons (N)\n` +
          `• **Masa (m):** Se mide en Kilogramos (kg)\n` +
          `• **Aceleración (a):** Se mide en m/s²`;
      } else if (lower.includes('mendel') || lower.includes('genética')) {
        responseText = `🌿 **Resumen Didáctico de las Leyes de Mendel:**\n\n` +
          `1️⃣ **Primera Ley (Uniformidad):** Al cruzar dos razas puras, la descendencia (F1) es 100% idéntica y manifiesta el carácter dominante (Ej: Guisantes Amarillos AA × Verdes aa → 100% Amarillos Aa).\n\n` +
          `2️⃣ **Segunda Ley (Segregación):** En la F2 reaparece el gen recesivo en una proporción 3:1 (75% Amarillos, 25% Verdes).\n\n` +
          `3️⃣ **Troisième Loi (Indépendance):** Les différents caractères s'héritent de manière indépendante.`;
      } else if (lower.includes('independencia') || lower.includes('guinea')) {
        responseText = `🌍 **Resumen Histórico de Guinea Ecuatorial:**\n\n` +
          `• **12 de Octubre de 1968:** Proclamación de la Independencia Nacional.\n` +
          `• **Territorios:** Unión de la Región Insular (Isla de Bioko y Annobón) y la Región Continental (Río Muni).\n` +
          `• **Capital:** Malabo (Bioko Norte).\n` +
          `• **Importancia Cultural:** Único país de habla hispana en África Subsahariana.`;
      } else {
        responseText = `🤖 **Respuesta Generada por IA Educativa:**\n\n` +
          `Has preguntado sobre: *"${query}"*.\n\n` +
          `**Explicación Resumida:**\n` +
          `Este concepto es clave para tu nivel académico. Para dominarlo:\n` +
          `1. Revisa la definición teórica fundamental.\n` +
          `2. Aplica la regla paso a paso sin saltarte operaciones intermedias.\n` +
          `3. Practica con los ejercicios interactivos del taller.\n\n` +
          `💡 *¿Quieres que te genere un ejercicio práctico de 3 preguntas para poner a prueba lo aprendido?*`;
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiThinking(false);
    }, 900);
  };

  // ─── TAB 2: EXPLICACIÓN DE TEMAS DIFICILES Y RESÚMENES ──────────────────────
  const [topicInput, setTopicInput] = useState('');
  const [summaryMode, setSummaryMode] = useState('simplify'); // simplify | summary | step_by_step
  const [generatedExplanation, setGeneratedExplanation] = useState(null);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  const handleGenerateTopicExplanation = (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsGeneratingExplanation(true);
    setTimeout(() => {
      setIsGeneratingExplanation(false);
      setGeneratedExplanation({
        title: topicInput,
        mode: summaryMode,
        points: [
          'Concepto Principal: Explicado en lenguaje claro sin modismos complejos.',
          'Regla de Oro: Paso 1 (Definición), Paso 2 (Aplicación), Paso 3 (Comprobación).',
          'Ejemplo Práctico: Aplicación directa a la vida cotidiana o exámenes escolares.',
          'Errores Frecuentes a Evitar: Confundir signos o saltarse el orden de prioridad de operaciones.'
        ],
        summary: `Resumen automático generado por IA para "${topicInput}": Este tema sintetiza los fundamentos principales del currículo oficial de Guinea Ecuatorial.`
      });
    }, 1000);
  };

  // ─── TAB 3: GENERADOR DE PREGUNTAS DESDE PDF ────────────────────────────────
  const [selectedPdfDoc, setSelectedPdfDoc] = useState('Guia_Estudio_General_2026.pdf');
  const [generatedQuizFromPdf, setGeneratedQuizFromPdf] = useState(null);
  const [isGeneratingPdfQuiz, setIsGeneratingPdfQuiz] = useState(false);

  const handleGenerateQuizFromPdf = () => {
    setIsGeneratingPdfQuiz(true);
    setTimeout(() => {
      setIsGeneratingPdfQuiz(false);
      setGeneratedQuizFromPdf([
        {
          id: 1,
          question: '¿Cuál es el valor del discriminante en una ecuación cuadrática ax² + bx + c = 0?',
          options: ['b² - 4ac', '2a + b', 'a² + b²', 'b / 2a'],
          correct: 0,
          explanation: 'El discriminante es Δ = b² - 4ac. Si Δ > 0 hay dos soluciones reales distintas.'
        },
        {
          id: 2,
          question: 'Según la 2ª Ley de Newton, si la masa se duplica manteniendo la fuerza constante, ¿qué sucede con la aceleración?',
          options: ['Se reduce a la mitad', 'Se duplica', 'Se quadruplica', 'Permanece igual'],
          correct: 0,
          explanation: 'Como a = F / m, al duplicar la masa la aceleración disminuye a la mitad (inversamente proporcional).'
        },
        {
          id: 3,
          question: '¿En qué año se proclamó la independencia de Guinea Ecuatorial?',
          options: ['12 de Octubre de 1968', '12 de Octubre de 1975', '3 de Agosto de 1979', '25 de Mayo de 1960'],
          correct: 0,
          explanation: 'La Independencia de Guinea Ecuatorial fue oficialmente proclamada el 12 de Octubre de 1968.'
        }
      ]);
    }, 1100);
  };

  // ─── TAB 4: GENERADOR DE EJERCICIOS ADAPTATIVO & CORRECCIÓN ─────────────────
  const [exerciseLevel, setExerciseLevel] = useState('4° ESO');
  const [exerciseDifficulty, setExerciseDifficulty] = useState('Intermedio');
  const [generatedExercise, setGeneratedExercise] = useState(null);
  const [studentAnswerChoice, setStudentAnswerChoice] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const handleGenerateExercise = () => {
    setIsAnswerChecked(false);
    setStudentAnswerChoice(null);
    setGeneratedExercise({
      question: `[Nivel ${exerciseLevel} • Dificultad ${exerciseDifficulty}] Resuelve la siguiente ecuación: 2x + 8 = 20. ¿Cuál es el valor de x?`,
      options: ['x = 4', 'x = 6', 'x = 8', 'x = 10'],
      correctIndex: 1,
      explanation: 'Paso 1: Restamos 8 en ambos lados: 2x = 20 - 8 → 2x = 12. Paso 2: Dividimos entre 2: x = 12 / 2 → x = 6.'
    });
  };

  // ─── TAB 5: PLAN DE ESTUDIO PERSONALIZADO & RECOMENDACIONES ────────────────
  const [studyPlan] = useState({
    studentLevel: '4° ESO (Secundaria)',
    weeklyTargetHours: 6,
    completedHoursThisWeek: 4.5,
    streakDays: 5,
    dailyGoals: [
      { id: 'g1', subject: 'Mathématiques Secondaire', task: 'Compléter 15 min d\'Équations du Second Degré', done: true },
      { id: 'g2', subject: 'Física & Química', task: 'Escuchar Audiolección Leyes de Newton (MP3)', done: true },
      { id: 'g3', subject: 'Biología', task: 'Realizar Quiz de Genética Mendeligana', done: false }
    ],
    recommendedCourses: [
      { id: 'rec-1', title: 'Taller Intensivo de Física & Química 4° ESO', reason: 'Detectamos 42% de errores en el Módulo 4 de física.', match: '98% Relevante' },
      { id: 'rec-2', title: 'Guía de Literatura & Historia de Guinea Ecuatorial', reason: 'Recomendado para reforzar conocimientos culturales.', match: '92% Relevante' }
    ]
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ─── Encabezado Principal de la Suite de IA ─────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Brain className="w-8 h-8 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-3 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Suite d'Intelligence Artificielle Éducative
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
                🟢 24/7 Disponible Hors-Ligne
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Tuteur IA & Assistant Pédagogique Personnel</h1>
            <p className="text-xs text-slate-300">Explications, génération d'exercices, résumés, quiz depuis PDF et plans d'étude.</p>
          </div>
        </div>

        <div className="bg-slate-850 p-3 rounded-2xl border border-slate-700 flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Série d'Étude IA</span>
            <strong className="text-sm font-extrabold text-amber-400 flex items-center justify-end gap-1">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" /> {studyPlan.streakDays} Jours Ininterrompus
            </strong>
          </div>
        </div>
      </div>

      {/* ─── Navegación por Pestañas ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'chat', label: 'Chat IA 24/7', icon: Bot, badge: '4 Matières' },
          { id: 'explain', label: 'Sujets & Résumés', icon: Lightbulb, badge: 'Étape par Étape' },
          { id: 'pdf-quiz', label: 'Questions depuis PDF', icon: FileSearch, badge: 'Auto-Quiz' },
          { id: 'exercises', label: 'Exercices & Corrections', icon: Zap, badge: 'Adaptatif' },
          { id: 'study-plan', label: 'Plan & Recommandations', icon: Calendar, badge: 'Personnel' }
        ].map(t => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-indigo-400'}`} />
                <span>{t.label}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PESTAÑA 1: CHAT IA ESPECIALIZADO POR ASIGNATURA (24/7)
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'chat' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Selector de Asignatura */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {SUBJECT_BOTS.map(bot => (
              <button
                key={bot.id}
                onClick={() => {
                  setSelectedSubject(bot.id);
                  setChatMessages([
                    {
                      id: Date.now().toString(),
                      sender: 'ai',
                      text: `¡Hola! Soy tu ${bot.name} 24/7. ${bot.description} ¿Qué duda quieres consultar ahora?`,
                      timestamp: 'Ahora'
                    }
                  ]);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedSubject === bot.id
                    ? 'bg-slate-800 border-indigo-500 shadow-lg ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/80 border-slate-700/80 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{bot.icon}</span>
                  <strong className="text-xs font-bold text-white block truncate">{bot.name}</strong>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2">{bot.description}</p>
              </button>
            ))}
          </div>

          {/* Ventana de Chat */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl flex flex-col h-[520px]">
            
            {/* Header Chat */}
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    {SUBJECT_BOTS.find(b => b.id === selectedSubject)?.name}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> IA 24/7 Conectada & Disponible Offline
                  </span>
                </div>
              </div>

              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-1 rounded-full border border-indigo-500/30">
                Modelo Escolar Pro
              </span>
            </div>

            {/* Mensajes del Chat */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-indigo-600 text-white font-bold'
                  }`}>
                    {msg.sender === 'user' ? 'Tú' : 'IA'}
                  </div>

                  <div className={`p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed border ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/40 rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                    <span className="block text-[9px] text-slate-400 mt-1 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    IA
                  </div>
                  <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-xs text-indigo-300 font-semibold flex items-center gap-2 animate-pulse">
                    <Brain className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Razonando paso a paso...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompts Sugeridos Rápidos */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Preguntar:</span>
              {PREDEFINED_PROMPTS[selectedSubject]?.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-500/20 text-[11px] text-indigo-300 border border-slate-700 hover:border-indigo-500/40 shrink-0 cursor-pointer transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Escribe tu pregunta o ejercicio para el Tutor IA..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PESTAÑA 2: EXPLICACIÓN DE TEMAS DIFICILES & RESÚMENES DE CLASE
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'explain' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Explicación Automática de Temas Difíciles & Generación de Resúmenes
              </h2>
              <p className="text-xs text-slate-400">
                Introduce cualquier tema, fórmula o lección compleja para que la IA la simplifique paso a paso en lenguaje claro.
              </p>
            </div>

            <form onSubmit={handleGenerateTopicExplanation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Tema o Concepto a Explicar *</label>
                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Ej: Teorema de Pitágoras, Fotosíntesis, Leyes de Newton, Ecuaciones de 2º Grado..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modo de Explicación */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'simplify', label: 'Simplificación Paso a Paso', desc: 'Explicación sencilla con ejemplos' },
                  { id: 'summary', label: 'Resumen en Puntos Clave', desc: 'Ideal para repasar antes del examen' },
                  { id: 'step_by_step', label: 'Fórmulas & Resolución', desc: 'Demostración paso a paso' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSummaryMode(m.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      summaryMode === m.id
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <strong className="block text-xs font-bold text-white mb-0.5">{m.label}</strong>
                    <span className="text-[10px] block opacity-80">{m.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isGeneratingExplanation}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGeneratingExplanation ? 'Sintetizando con IA...' : 'Generar Explicación / Resumen'}
                </button>
              </div>
            </form>
          </div>

          {/* Resultado Generado */}
          {generatedExplanation && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-amber-500/40 space-y-4 animate-fadeIn shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <h3 className="text-base font-bold text-white">Explicación IA: {generatedExplanation.title}</h3>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                  Resumen Listo para Estudio
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {generatedExplanation.summary}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Desglose Didáctico en Puntos Clave:</h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {generatedExplanation.points.map((pt, i) => (
                    <li key={i} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PESTAÑA 3: CREACIÓN AUTOMÁTICA DE PREGUNTAS DESDE UN PDF
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pdf-quiz' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-indigo-400" />
                Creación Automática de Preguntas a partir de un Documento PDF
              </h2>
              <p className="text-xs text-slate-400">
                La IA analiza el contenido de tus documentos o guías didácticas y extrae un cuestionario de evaluación interactivo en segundos.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-xs font-bold text-white block">Documento Seleccionado: Guia_Estudio_General_2026.pdf</strong>
                    <span className="text-[10px] text-slate-400">4 Pages • Contenu: Mathématiques, Physique, Biologie & Histoire GNQ</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateQuizFromPdf}
                  disabled={isGeneratingPdfQuiz}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform shrink-0"
                >
                  <Brain className={`w-4 h-4 ${isGeneratingPdfQuiz ? 'animate-spin' : ''}`} />
                  {isGeneratingPdfQuiz ? 'Analizando PDF con IA...' : 'Generar Quiz de 3 Preguntas'}
                </button>
              </div>
            </div>
          </div>

          {/* Cuestionario Generado desde PDF */}
          {generatedQuizFromPdf && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-indigo-500/40 space-y-5 animate-fadeIn shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Cuestionario de Evaluación Generado por IA desde PDF
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  3 Preguntas Listas
                </span>
              </div>

              <div className="space-y-4">
                {generatedQuizFromPdf.map((q, idx) => (
                  <div key={q.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <strong className="text-xs font-bold text-white block">
                      Pregunta {idx + 1}: {q.question}
                    </strong>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            optIdx === q.correct
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {optIdx === q.correct && <span className="text-[10px] text-emerald-400 font-bold">✓ Respuesta Correcta</span>}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      💡 <strong>Explicación de IA:</strong> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PESTAÑA 4: GENERACIÓN DE EJERCICIOS SEGÚN EL NIVEL & CORRECCIÓN
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'exercises' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Generador Adaptativo de Ejercicios & Corrección Inteligente
              </h2>
              <p className="text-xs text-slate-400">
                Genera problemas matemáticos y científicos ajustados exactamente a tu nivel académico y recibe la corrección explicada en vivo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Nivel Escolar</label>
                <select
                  value={exerciseLevel}
                  onChange={(e) => setExerciseLevel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option>Primaria (1° a 6°)</option>
                  <option>4° ESO</option>
                  <option>1° Bachillerato</option>
                  <option>2° Bachillerato</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Dificultad Adaptativa</label>
                <select
                  value={exerciseDifficulty}
                  onChange={(e) => setExerciseDifficulty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option>Fácil (Refuerzo Básico)</option>
                  <option>Intermedio</option>
                  <option>Avanzado (Examen Oficial)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateExercise}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer hover:scale-105 transition-transform"
              >
                <Sparkles className="w-4 h-4" /> Generar Nuevo Ejercicio
              </button>
            </div>
          </div>

          {/* Ejercicio Generado e Interactivo */}
          {generatedExercise && (
            <div className="bg-slate-900 p-6 rounded-3xl border border-amber-500/40 space-y-4 animate-fadeIn shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Ejercicio Práctico IA</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                  {exerciseLevel} • {exerciseDifficulty}
                </span>
              </div>

              <p className="text-sm font-bold text-slate-100 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {generatedExercise.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {generatedExercise.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setStudentAnswerChoice(idx);
                      setIsAnswerChecked(true);
                    }}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                      studentAnswerChoice === idx
                        ? idx === generatedExercise.correctIndex
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                          : 'bg-red-500/20 border-red-500 text-red-200'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500/40'
                    }`}
                  >
                    <span>{opt}</span>
                    {studentAnswerChoice === idx && (
                      idx === generatedExercise.correctIndex ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Corrección y Explicación */}
              {isAnswerChecked && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                  studentAnswerChoice === generatedExercise.correctIndex
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                }`}>
                  <strong className="text-sm font-extrabold block">
                    {studentAnswerChoice === generatedExercise.correctIndex ? '¡Respuesta Correcta! 🎉' : 'Respuesta Incorrecta — Revisa la solución:'}
                  </strong>
                  <p className="leading-relaxed">{generatedExercise.explanation}</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PESTAÑA 5: PLAN DE ESTUDIO PERSONALIZADO & RECOMENDACIONES DE CURSOS
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'study-plan' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Plan de Estudio Diario */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Plan de Estudio Personalizado por IA
                </h2>
                <p className="text-xs text-slate-400">Metas diarias adaptadas a tu nivel: {studyPlan.studentLevel}</p>
              </div>

              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                4.5h / 6h Objetivo Semanal
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Metas Recomendadas para Hoy:</h3>
              <div className="space-y-2">
                {studyPlan.dailyGoals.map(g => (
                  <div key={g.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${g.done ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                        {g.done ? '✓' : '○'}
                      </div>
                      <div>
                        <strong className="text-white block">{g.task}</strong>
                        <span className="text-[10px] text-amber-300 font-semibold">{g.subject}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${g.done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {g.done ? 'Complété' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cursos Recomendados según Perfil */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-indigo-500/40 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              Recomendación de Cursos según tu Perfil Académico
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studyPlan.recommendedCourses.map(c => (
                <div key={c.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded border border-indigo-500/30">
                        {c.match}
                      </span>
                    </div>
                    <strong className="text-xs font-bold text-white block leading-snug">{c.title}</strong>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{c.reason}</p>
                  </div>

                  <button className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition-colors mt-2">
                    Comenzar Curso Recomendado
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
