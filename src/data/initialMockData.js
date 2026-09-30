// initialMockData.js - Cours complets de Mathématiques et Physique pour EDUC-EG

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Tous les Cours', icon: 'BookOpen' },
  { id: 'primaria', name: 'Primaire (1ère à 6ème)', icon: 'School' },
  { id: 'eso', name: 'Secondaire', icon: 'GraduationCap' },
  { id: 'bachillerato', name: 'Baccalauréat', icon: 'Award' },
  { id: 'fp', name: 'Formation Professionnelle', icon: 'Briefcase' },
  { id: 'math-physics', name: 'Mathématiques & Physique', icon: 'Calculator' },
  { id: 'agri', name: 'Agriculture & Développement Rural', icon: 'Sprout' },
  { id: 'health', name: 'Santé & Biologie', icon: 'HeartPulse' },
  { id: 'solar', name: 'Énergie Solaire & Métiers', icon: 'Zap' },
  { id: 'tech', name: 'Savoirs Numériques', icon: 'Smartphone' }
];

export const INITIAL_COURSES = [
  // 1. COURS COMPLET DE MATHÉMATIQUES
  {
    id: 'course-math-master',
    title: 'Cours Complet de Mathématiques: De l\'Algèbre à la Géométrie',
    category: 'math-physics',
    author: 'Prof. Carmen Ruiz',
    region: 'Enseignement Secondaire',
    description: 'Apprenez pas à pas la résolution d\'équations, les systèmes linéaires, le Théorème de Pythagore, les aires de figures planes et les graphiques de fonctions.',
    rating: 4.98,
    reviewsCount: 420,
    level: 'Débutant à Avancé',
    duration: '7 heures (12 Leçons)',
    sizeMB: '6.4 MB',
    badgeText: 'Cours Vedette',
    bannerColor: 'from-blue-700 to-indigo-900',
    isOfflineReady: true,
    modules: [
      {
        id: 'mod-m-master-1',
        title: 'Module 1: Équations du 1er et 2nd Degré',
        lessons: [
          {
            id: 'less-m-m1',
            title: '1.1 Méthode de Résolution et Équations du Second Degré',
            type: 'text',
            duration: '30 min',
            downloaded: false,
            content: `
# Équations du Second Degré (Formule Générale)

Une équation du second degré s'écrit sous la forme générale:
\`\`\`text
a·x² + b·x + c = 0
\`\`\`

### Formule Générale de Résolution:
\`\`\`text
x = [ -b ± √(b² - 4·a·c) ] / (2·a)
\`\`\`

---

### Exemple Guidé:
Pour l'équation **x² - 5x + 6 = 0** (avec a = 1, b = -5, c = 6):
1. Calcul du discriminant:  
   \`\`\`text
   b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1
   \`\`\`
2. Application de la formule:  
   \`\`\`text
   x = [ 5 ± √1 ] / 2
   x₁ = (5 + 1) / 2 = 3
   x₂ = (5 - 1) / 2 = 2
   \`\`\`
Les solutions sont **x = 3** et **x = 2**.
            `
          },
          {
            id: 'less-m-m2',
            title: '1.2 Géométrie: Théorème de Pythagore et Aires',
            type: 'text',
            duration: '25 min',
            downloaded: false,
            content: `
# Théorème de Pythagore dans les Triangles Rectangles

Dans tout triangle rectangle, le carré de l'hypoténuse (c) est égal à la somme des carrés des deux autres côtés (a et b):

\`\`\`text
c² = a² + b²
\`\`\`

### Exemple Pratique:
Si un côté mesure **a = 3 cm** et l'autre **b = 4 cm**:
\`\`\`text
c² = 3² + 4² = 9 + 16 = 25
c = √25 = 5 cm
\`\`\`
L'hypoténuse mesure **5 cm**.
            `
          }
        ],
        quiz: {
          id: 'quiz-math-master',
          title: 'Évaluation Finale de Mathématiques',
          passingScore: 70,
          timeLimitMinutes: 15,
          questions: [
            {
              id: 'qmm1',
              type: 'multiple-choice',
              question: 'Soit l\'équation x² - 9 = 0, quelles sont ses solutions?',
              options: ['x = 9 et x = -9', 'x = 3 et x = -3', 'x = 0', 'x = 81'],
              correctAnswer: 1,
              explanation: 'x² = 9 => x = ±√9 => x = 3 et x = -3.'
            },
            {
              id: 'qmm2',
              type: 'multiple-choice',
              question: 'Dans un triangle rectangle dont les côtés mesurent 6 cm et 8 cm, combien mesure l\'hypoténuse?',
              options: ['10 cm', '12 cm', '14 cm', '100 cm'],
              correctAnswer: 0,
              explanation: 'c² = 6² + 8² = 36 + 64 = 100 => c = √100 = 10 cm.'
            }
          ]
        }
      }
    ]
  },

  // 2. COURS COMPLET DE PHYSIQUE
  {
    id: 'course-physics-master',
    title: 'Fondamentaux de la Physique: Cinématique, Dynamique et Électromagnétisme',
    category: 'math-physics',
    author: 'Prof. David Alarcón',
    region: 'Secondaire & Baccalauréat',
    description: 'Maîtrisez les concepts clés de la Physique: mouvement rectiligne (MRU et MRUA), lois de Newton, énergie mécanique et circuits électriques avec la Loi d\'Ohm.',
    rating: 4.95,
    reviewsCount: 380,
    level: 'Débutant à Intermédiaire',
    duration: '6.5 heures (10 Leçons)',
    sizeMB: '5.9 MB',
    badgeText: 'Physique de Base',
    bannerColor: 'from-cyan-700 to-slate-900',
    isOfflineReady: true,
    modules: [
      {
        id: 'mod-p-master-1',
        title: 'Module 1: Cinématique et Mouvement Rectiligne Uniforme (MRU)',
        lessons: [
          {
            id: 'less-p-p1',
            title: '1.1 Mouvement Rectiligne Uniforme (MRU): Vitesse et Distance',
            type: 'text',
            duration: '25 min',
            downloaded: false,
            content: `
# Cinématique: Mouvement Rectiligne Uniforme (MRU)

Un corps effectue un **MRU** lorsqu'il se déplace en ligne droite à **vitesse constante** (sans accélération).

### Formule Principale:
\`\`\`text
v = d / t
\`\`\`
Où:
- **v**: Vitesse en mètres par seconde (m/s) ou km/h.
- **d**: Distance parcourue en mètres (m).
- **t**: Temps écoulé en secondes (s).

---

### Exemple Pratique:
Si un véhicule parcourt **d = 120 km** en **t = 2 heures**:
\`\`\`text
v = 120 km / 2 h = 60 km/h
\`\`\`
En unités du Système International (m/s):
\`\`\`text
60 km/h ÷ 3.6 = 16.67 m/s
\`\`\`
            `
          },
          {
            id: 'less-p-p2',
            title: '1.2 Lois de Newton et Dynamique des Forces',
            type: 'text',
            duration: '30 min',
            downloaded: false,
            content: `
# Les Trois Lois de Newton

### 1ère Loi (Inertie):
Un corps demeure au repos ou en mouvement rectiligne uniforme à moins qu'une force nette n'agisse sur lui.

### 2ème Loi (Principe Fondamental de la Dynamique):
\`\`\`text
F = m · a
\`\`\`
- **F**: Force nette en Newtons (N).
- **m**: Masse en kilogrammes (kg).
- **a**: Accélération en m/s².

---

### Exemple:
Quelle force est nécessaire pour accélérer un objet de **m = 5 kg** avec une accélération de **a = 4 m/s²**?
\`\`\`text
F = 5 kg · 4 m/s² = 20 N
\`\`\`
            `
          },
          {
            id: 'less-p-p3',
            title: '1.3 Électricité: Loi d\'Ohm dans les Circuits',
            type: 'text',
            duration: '25 min',
            downloaded: false,
            content: `
# Loi d'Ohm dans les Circuits Électriques

La Loi d'Ohm relie la Tension (V), l'Intensité du courant (I) et la Résistance (R):

\`\`\`text
V = I · R
\`\`\`
- **V**: Tension en Volts (V).
- **I**: Courant en Ampères (A).
- **R**: Résistance en Ohms (Ω).

### Exemple:
Si une batterie applique **12 Volts** à un circuit ayant une résistance de **4 Ω**:
\`\`\`text
I = V / R = 12V / 4Ω = 3 Ampères
\`\`\`
            `
          }
        ],
        quiz: {
          id: 'quiz-physics-master',
          title: 'Examen de Physique et Cinématique',
          passingScore: 75,
          timeLimitMinutes: 15,
          questions: [
            {
              id: 'qp1',
              type: 'multiple-choice',
              question: 'Une voiture roule à 80 km/h pendant 3 heures. Quelle distance parcourt-elle?',
              options: ['160 km', '240 km', '300 km', '320 km'],
              correctAnswer: 1,
              explanation: 'd = v · t = 80 km/h · 3 h = 240 km.'
            },
            {
              id: 'qp2',
              type: 'multiple-choice',
              question: 'Selon la 2ème Loi de Newton (F = m · a), si m = 10 kg et a = 2 m/s², la force vaut:',
              options: ['5 N', '12 N', '20 N', '50 N'],
              correctAnswer: 2,
              explanation: 'F = 10 kg · 2 m/s² = 20 Newtons.'
            },
            {
              id: 'qp3',
              type: 'multiple-choice',
              question: 'Dans un circuit électrique avec V = 24V et R = 6Ω, quel est le courant (I)?',
              options: ['4 A', '6 A', '18 A', '144 A'],
              correctAnswer: 0,
              explanation: 'I = V / R = 24V / 6Ω = 4 Ampères.'
            }
          ]
        }
      }
    ]
  },

  // 3. COURS PHYSIQUE ET CHIMIE SECONDAIRE REFORCÉ
  {
    id: 'course-eso-chem-101',
    title: 'Physique et Chimie Secondaire: Tableau Périodique et Réactions',
    category: 'eso',
    author: 'Prof. David Alarcón',
    region: 'Programme Secondaire',
    description: 'Apprenez la structure de l\'atome, les éléments du Tableau Périodique, les liaisons chimiques et la pondération des équations avec la Loi de Lavoisier.',
    rating: 4.95,
    reviewsCount: 280,
    level: 'Secondaire',
    duration: '5.5 heures (3 Modules)',
    sizeMB: '6.1 MB',
    badgeText: 'Sciences Secondaire',
    bannerColor: 'from-teal-700 to-emerald-950',
    isOfflineReady: true,
    modules: [
      {
        id: 'mod-eso-chem-1',
        title: 'Module 1: Structure Atomique et Tableau Périodique',
        lessons: [
          {
            id: 'less-eso-c1',
            title: '1.1 L\'Atome: Protons, Neutrons et Électrons',
            type: 'text',
            duration: '30 min',
            downloaded: false,
            content: `
# Structure Atomique

Toute la matière est composée d'**atomes**. Un atome comprend deux régions principales:

1. **Noyau Atomique (Centre):**
   - **Protons (p⁺):** Particules de charge électrique positive.
   - **Neutrons (n⁰):** Particules sans charge (neutres), apportant stabilité et masse.

2. **Nuage Électronique (Extérieur):**
   - **Électrons (e⁻):** Particules de charge négative gravitant autour du noyau.

---

### Concepts Clés:
- **Numéro Atomique (Z):** Nombre de protons d'un atome.
- **Nombre de Masse (A):** Somme des protons et neutrons:
  \`\`\`text
  A = Z + N
  \`\`\`
            `
          }
        ],
        quiz: {
          id: 'quiz-eso-chem',
          title: 'Questionnaire de Structure Atomique',
          passingScore: 70,
          timeLimitMinutes: 12,
          questions: [
            {
              id: 'qec1',
              type: 'multiple-choice',
              question: 'Si un atome neutre a Z = 8 et A = 16, combien de neutrons possède-t-il?',
              options: ['8 neutrons', '16 neutrons', '24 neutrons', '4 neutrons'],
              correctAnswer: 0,
              explanation: 'N = A - Z = 16 - 8 = 8 neutrons.'
            }
          ]
        }
      }
    ]
  },

  // 4. PRIMAIRE: MATHÉMATIQUES DE BASE ET LECTURE
  {
    id: 'course-primaria-math',
    title: 'Mathématiques de Base et Lecture Guidée (1ère à 6ème)',
    category: 'primaria',
    author: 'Prof. María Elena Santos',
    region: 'Éducation Primaire',
    description: 'Bases d\'arithmétique, addition, soustraction, tables de multiplication, calcul mental, géométrie plane et histoires de lecture adaptées.',
    rating: 4.97,
    reviewsCount: 310,
    level: '1ère à 6ème Primaire',
    duration: '4.5 heures (3 Modules)',
    sizeMB: '3.8 MB',
    badgeText: 'Niveau Primaire',
    bannerColor: 'from-amber-600 to-yellow-800',
    isOfflineReady: true,
    modules: [
      {
        id: 'mod-prim-1',
        title: 'Module 1: Tables de Multiplication et Calcul Mental',
        lessons: [
          {
            id: 'less-p1',
            title: '1.1 Multiplication et Stratégies d\'Addition Répétée',
            type: 'text',
            duration: '20 min',
            downloaded: false,
            content: `
# Multiplication et Tables de Base

Multiplier est une **addition répétée**. Par exemple, **4 × 3** signifie additionner 4 trois fois: **4 + 4 + 4 = 12**.
            `
          }
        ]
      }
    ]
  },

  // 5. SECONDAIRE: LANGUE
  {
    id: 'course-eso-lengua',
    title: 'Langue et Littérature: Grammaire et Expression',
    category: 'eso',
    author: 'Prof. Gabriel Ndiaye',
    region: 'Secondaire',
    description: 'Analyse syntaxique, règles d\'accentuation, types de phrases, rédaction de textes argumentatifs et littérature.',
    rating: 4.92,
    reviewsCount: 215,
    level: 'Niveau Secondaire',
    duration: '5 heures (2 Modules)',
    sizeMB: '4.9 MB',
    badgeText: 'Langue & Grammaire',
    bannerColor: 'from-purple-800 to-indigo-950',
    isOfflineReady: true,
    modules: []
  },

  // 6. BACCALAURÉAT: MATHÉMATIQUES
  {
    id: 'course-bach-math',
    title: 'Mathématiques de Baccalauréat: Calcul, Dérivées et Matrices',
    category: 'bachillerato',
    author: 'Prof. Carmen Ruiz',
    region: 'Baccalauréat & Pré-Université',
    description: 'Préparation avancée au Baccalauréat: étude de limites, règles de dérivation, intégrales définies et calcul matriciel.',
    rating: 4.99,
    reviewsCount: 390,
    level: 'Baccalauréat',
    duration: '8 heures (3 Modules)',
    sizeMB: '7.4 MB',
    badgeText: 'Baccalauréat Avancé',
    bannerColor: 'from-blue-900 to-slate-950',
    isOfflineReady: true,
    modules: []
  },

  // 7. FP: ELECTROMECÁNICA Y SOLAR
  {
    id: 'course-fp-solar-electric',
    title: 'Formation Pro: Maintenance Électromécanique et Solaire Photovoltaïque',
    category: 'fp',
    author: 'Ing. Jean-Luc Mbarga',
    region: 'Formation Professionnelle',
    description: 'Formation technique au montage de panneaux solaires, onduleurs, coffrets électriques et pompes à eau photovoltaïques.',
    rating: 4.96,
    reviewsCount: 340,
    level: 'Formation Professionnelle',
    duration: '7.5 heures (2 Modules)',
    sizeMB: '6.9 MB',
    badgeText: 'Diplôme FP',
    bannerColor: 'from-amber-700 to-stone-900',
    isOfflineReady: true,
    modules: []
  },

  // 8. FP: DESARROLLO WEB
  {
    id: 'course-fp-web-dev',
    title: 'Formation Pro: Développement d\'Applications Web et Algo Hors-Ligne',
    category: 'fp',
    author: 'Prof. Amadou Diallo',
    region: 'Formation Professionnelle',
    description: 'Développement Frontend JavaScript ES6+, mise en page moderne, stockage local IndexedDB et applications PWA hors-ligne.',
    rating: 4.98,
    reviewsCount: 510,
    level: 'FP Niveau Supérieur',
    duration: '9 heures (2 Modules)',
    sizeMB: '8.3 MB',
    badgeText: 'FP Niveau Supérieur',
    bannerColor: 'from-teal-800 to-slate-950',
    isOfflineReady: true,
    modules: []
  },

  // 9. FP: ENFERMERÍA Y SALUD RURAL
  {
    id: 'course-fp-health-rural',
    title: 'Formation Pro: Aide-Soignant et Soins Communautaires',
    category: 'fp',
    author: 'Dra. Solange Nguema',
    region: 'Formation Santé',
    description: 'Protocoles de soins primaires, premiers secours en zones isolées, administration de solutés et prise des constantes vitales.',
    rating: 4.95,
    reviewsCount: 290,
    level: 'Formation Professionnelle',
    duration: '6.5 heures (2 Modules)',
    sizeMB: '5.8 MB',
    badgeText: 'FP Santé',
    bannerColor: 'from-rose-800 to-slate-950',
    isOfflineReady: true,
    modules: []
  },

  // 10. AGRICULTURA
  {
    id: 'course-101',
    title: 'Agroécologie et Cultures Résilientes au Climat',
    category: 'agri',
    author: 'Prof. Jean-Paul Mbarga',
    region: 'Zone Rurale',
    description: 'Techniques d\'irrigation efficiente, fertilisation biologique et conservation des cultures en saison sèche.',
    rating: 4.9,
    reviewsCount: 128,
    level: 'Débutant / Intermédiaire',
    duration: '4 heures (2 Modules)',
    sizeMB: '4.5 MB',
    badgeText: 'Recommandé Rural',
    bannerColor: 'from-emerald-700 to-teal-900',
    isOfflineReady: true,
    modules: []
  },

  // 11. HISTORIA Y GEOGRAFÍA
  {
    id: 'course-gnq-history-geo',
    title: 'Histoire, Géographie et Culture Nationale',
    category: 'bachillerato',
    author: 'Dra. Solange Nguema Avomo',
    region: 'Histoire & Géographie',
    description: 'Étude complète sur la géographie physique, la biodiversité, les parcs nationaux et le patrimoine culturel.',
    rating: 4.99,
    reviewsCount: 360,
    level: 'Secondaire & Baccalauréat',
    duration: '6 heures (3 Modules)',
    sizeMB: '5.4 MB',
    badgeText: 'Histoire Nationale',
    bannerColor: 'from-emerald-800 to-slate-950',
    isOfflineReady: true,
    modules: []
  },

  // 12. BIOQUÍMICA
  {
    id: 'course-biochem-master',
    title: 'Chimie Organique et Biochimie Fondamentale',
    category: 'math-physics',
    author: 'Prof. David Alarcón',
    region: 'Baccalauréat & Pré-Université',
    description: 'Introduction aux composés du carbone, groupes fonctionnels, structure des protéines, glucides et lipides chez le vivant.',
    rating: 4.96,
    reviewsCount: 240,
    level: 'Baccalauréat',
    duration: '6.5 heures (2 Modules)',
    sizeMB: '6.2 MB',
    badgeText: 'Chimie Avancée',
    bannerColor: 'from-cyan-800 to-indigo-950',
    isOfflineReady: true,
    modules: []
  },

  // 13. INGLÉS TÉCNICO
  {
    id: 'course-english-tech',
    title: 'Anglais Technique et Communication Globale',
    category: 'tech',
    author: 'Prof. Carmen Ruiz Nchama',
    region: 'Secondaire & FP',
    description: 'Développez un vocabulaire technique en anglais pour la technologie, la science, la lecture de manuels et la rédaction.',
    rating: 4.94,
    reviewsCount: 410,
    level: 'Secondaire & FP',
    duration: '5 heures (2 Modules)',
    sizeMB: '4.2 MB',
    badgeText: 'Anglais Technique',
    bannerColor: 'from-blue-800 to-slate-950',
    isOfflineReady: true,
    modules: []
  },

  // 14. ALFABETIZACIÓN DIGITAL
  {
    id: 'course-digital-literacy',
    title: 'Savoirs Numériques, Bureautique & PWA',
    category: 'tech',
    author: 'Ing. Manuel Obama Esono',
    region: 'Formation Ouverte',
    description: 'Apprenez à utiliser les traitements de texte, tableurs, gestion de fichiers locaux et applications PWA hors-ligne.',
    rating: 4.97,
    reviewsCount: 520,
    level: 'Débutant à Intermédiaire',
    duration: '5.5 heures (3 Modules)',
    sizeMB: '4.8 MB',
    badgeText: 'Savoirs Numériques',
    bannerColor: 'from-teal-700 to-slate-900',
    isOfflineReady: true,
    modules: []
  }
];

export const INITIAL_USER_PROFILE = {
  id: 'user-001',
  name: 'Mariano Nsue Nchama',
  email: 'etudiant@educ-eg.org',
  role: 'student',
  country: 'Afrique Centrale',
  school: 'Lycée National Rey Malabo',
  xpPoints: 680,
  level: 4,
  studyStreakDays: 7,
  badges: [
    { id: 'b1', name: 'Pionnier Hors-Ligne', icon: 'DownloadCloud', desc: 'A téléchargé son premier cours complet hors-ligne' },
    { id: 'b2', name: 'Série de 7 Jours', icon: 'Flame', desc: 'A étudié au moins une leçon chaque jour pendant une semaine' },
    { id: 'b3', name: 'Maître de l\'Algèbre', icon: 'Calculator', desc: 'A réussi l\'examen de Mathématiques avec 100%' },
    { id: 'b4', name: 'Physicien du Futur', icon: 'Zap', desc: 'A terminé les leçons de cinématique et Loi d\'Ohm' }
  ],
  enrolledCourses: ['course-math-master', 'course-physics-master', 'course-101'],
  completedLessons: ['less-m-m1', 'less-p-p1'],
  savedOfflineCourses: ['course-math-master', 'course-physics-master'],
  quizResults: {
    'quiz-math-master': { score: 100, passed: true, date: '2026-08-19' }
  }
};

export const INITIAL_TEACHER_STATS = {
  activeCourses: 5,
  totalStudents: 560,
  averageRating: 4.96,
  downloadsCount: 1340,
  pendingSubmissions: 3
};

export const INITIAL_ADMIN_STATS = {
  totalUsers: 1780,
  studentsCount: 1560,
  teachersCount: 220,
  approvedCourses: 32,
  pendingApprovals: 1,
  totalStorageGB: '6.2 GB',
  offlineDownloadsCount: 4890
};

export const INITIAL_AUDIOBOOKS = [
  {
    id: 'ab-1',
    title: 'Artemio et les Histoires de l\'Île',
    author: 'Prof. Baltasar Nsue Ondo',
    narrator: 'Dra. Solange Nguema',
    category: 'Littérature & Légendes',
    duration: '45 min (4 Chapitres)',
    sizeMB: '8.2 MB',
    coverBg: 'from-emerald-800 to-slate-950',
    description: 'Narration orale interactive sur les contes traditionnels, la géographie et la biodiversité.',
    chapters: [
      { id: 'ch-1', title: 'Chapitre 1: Le Grand Peak et la Brume', duration: '10:15', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-2', title: 'Chapitre 2: Les Secrets de la Forêt', duration: '11:30', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-3', title: 'Chapitre 3: Légendes de la Rivière', duration: '12:00', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-4', title: 'Chapitre 4: L\'Écho des Salles de Classe Rurales', duration: '11:15', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
    ]
  },
  {
    id: 'ab-2',
    title: 'Leçons Audio de Physique & Chimie pour le Secondaire',
    author: 'Prof. David Alarcón',
    narrator: 'Prof. David Alarcón',
    category: 'Sciences & Physique',
    duration: '35 min (3 Chapitres)',
    sizeMB: '6.5 MB',
    coverBg: 'from-cyan-800 to-indigo-950',
    description: 'Résumé sous forme de podcast éducatif des Lois de Newton, de la cinématique et de la Loi d\'Ohm sans besoin d\'écran.',
    chapters: [
      { id: 'ch-201', title: 'Chapitre 1: Explication Orale des Lois de Newton', duration: '12:00', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-202', title: 'Chapitre 2: La Loi d\'Ohm explicée par Analogies', duration: '11:45', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-203', title: 'Chapitre 3: Réactions Chimiques du Quotidien', duration: '11:15', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
    ]
  },
  {
    id: 'ab-3',
    title: 'Guide Oral de Mathématiques: Astuces de Calcul Mental',
    author: 'Prof. Carmen Ruiz Nchama',
    narrator: 'Prof. Carmen Ruiz Nchama',
    category: 'Mathématiques & Arithmétique',
    duration: '40 min (3 Chapitres)',
    sizeMB: '7.1 MB',
    coverBg: 'from-amber-800 to-orange-950',
    description: 'Stratégies orales pour résoudre des équations, calculer des pourcentages et des périmètres sans papier.',
    chapters: [
      { id: 'ch-301', title: 'Chapitre 1: Astuces pour la Table de Multiplication', duration: '13:10', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-302', title: 'Chapitre 2: Résoudre des Équations Mentalement', duration: '14:20', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-303', title: 'Chapitre 3: Géométrie Appliquée sur le Terrain', duration: '12:30', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
    ]
  },
  {
    id: 'ab-4',
    title: 'Histoire & Géographie Régionale',
    author: 'Dra. Solange Nguema Avomo',
    narrator: 'Dra. Solange Nguema Avomo',
    category: 'Histoire & Géographie',
    duration: '50 min (4 Chapitres)',
    sizeMB: '9.0 MB',
    coverBg: 'from-purple-800 to-slate-950',
    description: 'Parcours sonore à travers la géographie, l\'environnement et la richesse culturelle régionale.',
    chapters: [
      { id: 'ch-401', title: 'Chapitre 1: La Région Continentale', duration: '12:40', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-402', title: 'Chapitre 2: La Région Insulaire et Littorale', duration: '13:10', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-403', title: 'Chapitre 3: Les Écosystèmes et les Îles du Golfe', duration: '11:50', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
      { id: 'ch-404', title: 'Chapitre 4: Traditions, Musique et Langues', duration: '12:20', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' }
    ]
  }
];
