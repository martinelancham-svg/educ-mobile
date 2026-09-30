import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { MessageSquare, Send, User, WifiOff, CheckCircle2, MessageCircle, Plus, Search, Clock, ShieldCheck, X, ThumbsUp, Filter } from 'lucide-react';

const INITIAL_THREADS = [
  {
    id: 'th-1',
    course: 'Mathématiques 4ème Secondaire',
    title: 'Questions sur la Résolution d\'Équations du Second Degré',
    author: 'Prof. Baltasar Nsue Ondo',
    isTeacher: true,
    repliesCount: 6,
    lastActivity: 'Il y a 2 heures',
    status: 'RÉSOLU',
    content: 'Dans ce fil, vous pouvez poser vos questions sur le calcul des racines carrées et l\'utilisation du discriminant.',
    replies: [
      { id: 'r1', author: 'Emmanuel Olinga', text: 'Professeur, que se passe-t-il si le discriminant b² - 4ac est égal à zéro?', time: 'Hier 15:30', isTeacher: false },
      { id: 'r2', author: 'Prof. Baltasar Nsue Ondo', text: 'Si Δ = 0, l\'équation a une seule solution réelle double (x = -b / 2a).', time: 'Hier 16:10', isTeacher: true }
    ]
  },
  {
    id: 'th-2',
    course: 'Physique et Chimie Baccalauréat 2',
    title: 'Matériels de Biologie Cellulaire pour la Sélectivité UNGE 2026',
    author: 'Dra. Solange Nguema Avomo',
    isTeacher: true,
    repliesCount: 12,
    lastActivity: 'Il y a 45 min',
    status: 'ACTIF',
    content: 'Fiches explicatives en PDF pour réviser les mitochondries, chloroplastes et photosynthèse.',
    replies: [
      { id: 'r3', author: 'Carlos Nguema', text: 'Peut-on télécharger les schémas pour étudier hors-ligne?', time: 'Il y a 1 heure', isTeacher: false },
      { id: 'r4', author: 'Dra. Solange Nguema Avomo', text: 'Oui Carlos, les fichiers sont optimisés dans IndexedDB pour la lecture hors-ligne.', time: 'Il y a 45 min', isTeacher: true }
    ]
  },
  {
    id: 'th-3',
    course: 'Agroécologie & Développement Rural',
    title: 'Techniques d\'Irrigation Goutte à Goutte avec Matériaux Recyclés',
    author: 'Prof. Jean-Paul Mbarga',
    isTeacher: true,
    repliesCount: 8,
    lastActivity: 'Hier',
    status: 'ACTIF',
    content: 'Forum ouvert pour discuter des modèles d\'irrigation économique pour les potagers scolaires.',
    replies: [
      { id: 'r5', author: 'Felipe Ondo', text: 'Nous avons installé 4 bouteilles perforées dans l\'école d\'Ebebiyín avec d\'excellents résultats.', time: 'Hier 18:20', isTeacher: false }
    ]
  }
];

export const TeacherChatForum = () => {
  const { user } = useAuth();
  const { isEffectiveOffline } = useOffline();

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'forum'
  const [forumCategoryFilter, setForumCategoryFilter] = useState('ALL');
  const [forumSearch, setForumSearch] = useState('');
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [selectedThreadModal, setSelectedThreadModal] = useState(null);
  const [threadReplyText, setThreadReplyText] = useState('');

  // Modal para crear nuevo hilo
  const [showCreateThreadModal, setShowCreateThreadModal] = useState(false);
  const [newThreadCourse, setNewThreadCourse] = useState('Mathématiques Secondaire');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  // Estado del Chat Directo
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Prof. Jean-Paul Mbarga', text: 'Bonjour Emmanuel! As-tu pu consulter le guide d\'irrigation goutte-à-goutte avec des bouteilles?', time: 'Hier 14:20', isTeacher: true },
    { id: 2, sender: 'Emmanuel Olinga', text: 'Oui professeur, cela a parfaitement fonctionné dans le potager communautaire.', time: 'Hier 15:45', isTeacher: false }
  ]);
  const [newText, setNewText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'Élève',
      text: newText.trim(),
      time: 'À l\'instant ' + (isEffectiveOffline ? '(En file locale)' : ''),
      isTeacher: false
    };

    setMessages(prev => [...prev, newMsg]);
    setNewText('');
  };

  const handleCreateNewThread = (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const newThread = {
      id: `th-${Date.now()}`,
      course: newThreadCourse,
      title: newThreadTitle.trim(),
      author: user?.name || 'Élève',
      isTeacher: false,
      repliesCount: 0,
      lastActivity: 'À l\'instant',
      status: 'ACTIF',
      content: newThreadContent.trim(),
      replies: []
    };

    setThreads(prev => [newThread, ...prev]);
    setNewThreadTitle('');
    setNewThreadContent('');
    setShowCreateThreadModal(false);
  };

  const handleAddThreadReply = (e) => {
    e.preventDefault();
    if (!threadReplyText.trim() || !selectedThreadModal) return;

    const newReply = {
      id: `r-${Date.now()}`,
      author: user?.name || 'Élève',
      text: threadReplyText.trim(),
      time: 'À l\'instant',
      isTeacher: false
    };

    setThreads(prev =>
      prev.map(th => {
        if (th.id === selectedThreadModal.id) {
          return {
            ...th,
            repliesCount: th.repliesCount + 1,
            lastActivity: 'À l\'instant',
            replies: [...th.replies, newReply]
          };
        }
        return th;
      })
    );

    setSelectedThreadModal(prev => ({
      ...prev,
      repliesCount: prev.repliesCount + 1,
      replies: [...prev.replies, newReply]
    }));

    setThreadReplyText('');
  };

  const filteredThreads = threads.filter(th => {
    const matchesCategory = forumCategoryFilter === 'ALL' || th.course.includes(forumCategoryFilter);
    const matchesSearch = !forumSearch || th.title.toLowerCase().includes(forumSearch.toLowerCase()) || th.course.toLowerCase().includes(forumSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* HEADER PRINCIPAL CHAT Y FORO */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Chat & Foro de Consulta con Profesores</h1>
            <p className="text-xs text-slate-400">Messagerie différée et débats collaboratifs par matière sans consommation de données</p>
          </div>
        </div>

        {/* TABS CONMUTADOR CHAT VS FORO */}
        <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat Direct
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'forum' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Forums par Cours ({threads.length})
          </button>
        </div>
      </div>

      {isEffectiveOffline && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Mode Hors-Ligne: Vous pouvez rédiger vos questions librement. Les données seront enregistrées localement et synchronisées lors de la reconnexion.</span>
        </div>
      )}

      {/* VISTA 1: CHAT DIRECTO 1 A 1 CON TUTOR */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-700/80 overflow-hidden flex flex-col h-[480px] shadow-2xl">
          {/* Header Chat */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-black text-sm flex items-center justify-center border border-amber-500/30">
                JP
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Prof. Jean-Paul Mbarga</h3>
                <span className="text-[10px] text-emerald-400 font-semibold block">Tuteur en Agroécologie & Développement Rural</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">🟢 En ligne • Réponse rapide</span>
          </div>

          {/* Cuerpo de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {messages.map(m => (
              <div key={m.id} className={`flex flex-col ${m.isTeacher ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                  m.isTeacher
                    ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                    : 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-md'
                }`}>
                  <div className="flex justify-between items-center gap-4 text-[10px] opacity-80 mb-1">
                    <span className="font-bold">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de Envío */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Écrivez une question pour l'enseignant..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 hover:bg-emerald-400 transition-all cursor-pointer shrink-0 shadow-lg"
            >
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </form>
        </div>
      )}

      {/* VISTA 2: FOROS POR CURSO Y HILOS DE DEBATE */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          
          {/* BARRA DE FILTROS Y BOTÓN NUEVO HILO */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un débat ou un fil par matière..."
                value={forumSearch}
                onChange={(e) => setForumSearch(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={forumCategoryFilter}
                onChange={(e) => setForumCategoryFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">🎓 Tous les Cours</option>
                <option value="Mathématiques">📐 Mathématiques</option>
                <option value="Física">🧪 Physique & Chimie</option>
                <option value="Agroecología">🌱 Agroécologie & Développement</option>
              </select>

              <button
                onClick={() => setShowCreateThreadModal(true)}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shrink-0"
              >
                <Plus className="w-4 h-4" />
                Nouveau Fil
              </button>
            </div>
          </div>

          {/* LISTADO DE HILOS DEL FORO */}
          <div className="space-y-3">
            {filteredThreads.map(th => (
              <div
                key={th.id}
                onClick={() => setSelectedThreadModal(th)}
                className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {th.course}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      th.status === 'RÉSOLU'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {th.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors">{th.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{th.content}</p>

                  <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                    <span>Publié par: <strong className="text-slate-300">{th.author}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {th.lastActivity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 shrink-0 self-start md:self-auto">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">{th.repliesCount} Réponses</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* MODAL DETALLES DEL HILO Y RESPUESTAS */}
      {selectedThreadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-fadeIn">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 inline-block">
                  {selectedThreadModal.course}
                </span>
                <h2 className="text-lg font-extrabold text-white">{selectedThreadModal.title}</h2>
                <p className="text-xs text-slate-400 mt-1">Publié par {selectedThreadModal.author}</p>
              </div>

              <button
                onClick={() => setSelectedThreadModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido principal e Historial de Respuestas */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 text-xs text-slate-200 leading-relaxed">
                {selectedThreadModal.content}
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                Réponses du Forum ({selectedThreadModal.replies.length})
              </h4>

              <div className="space-y-3">
                {selectedThreadModal.replies.map(r => (
                  <div key={r.id} className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className={`font-bold ${r.isTeacher ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {r.author} {r.isTeacher && '👨‍🏫 (Enseignant)'}
                      </span>
                      <span>{r.time}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Responder en Hilo */}
            <form onSubmit={handleAddThreadReply} className="p-4 border-t border-slate-800 bg-slate-900/90 flex gap-2">
              <input
                type="text"
                value={threadReplyText}
                onChange={(e) => setThreadReplyText(e.target.value)}
                placeholder="Ajouter une réponse à ce débat..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer hover:bg-emerald-400"
              >
                Répondre
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVO HILO */}
      {showCreateThreadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-white">Publier un Nouveau Fil sur le Forum</h3>
              <button onClick={() => setShowCreateThreadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewThread} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Sélectionner Cours / Matière</label>
                <select
                  value={newThreadCourse}
                  onChange={(e) => setNewThreadCourse(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Mathématiques Secondaire">📐 Mathématiques Secondaire</option>
                  <option value="Physique et Chimie Baccalauréat 2">🧪 Physique & Chimie Baccalauréat 2</option>
                  <option value="Agroécologie & Développement Rural">🌱 Agroécologie & Développement Rural</option>
                  <option value="Langue & Littérature">📖 Langue & Littérature</option>
                  <option value="Géographie & Histoire">🌍 Géographie & Histoire</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Titre de la Question / Sujet *</label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Ex. Questions sur le calcul du volume des cylindres"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Détails de la Question *</label>
                <textarea
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  rows={4}
                  placeholder="Expliquez en détail sur quelle leçon ou exercice vous avez besoin d'aide..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateThreadModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl hover:bg-emerald-400 cursor-pointer shadow-lg"
                >
                  Publier le Fil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

