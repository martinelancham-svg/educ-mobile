import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const TeacherQAResponses = () => {
  const [qaItems, setQaItems] = useState([
    {
      id: 'qa-1',
      student: 'Pascal M.',
      lesson: '1.1 Arrosage au Goutte-à-Goutte Artisanal',
      question: 'Professeur, peut-on utiliser du fumier de volaille au lieu du fumier de bovin ?',
      answer: 'Oui, mais vous devez le laisser composter au moins 3 semaines pour ne pas brûler les racines.',
      status: 'Answered'
    },
    {
      id: 'qa-2',
      student: 'Emmanuel Olinga',
      lesson: '1.1 Équations du 1er Degré',
      question: 'Que se passe-t-il si le résultat donne une fraction négative ?',
      answer: '',
      status: 'Pending'
    }
  ]);

  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);

  const handleSendReply = (qaId) => {
    if (!replyText.trim()) return;

    setQaItems(prev => prev.map(item => {
      if (item.id === qaId) {
        return {
          ...item,
          answer: replyText,
          status: 'Answered'
        };
      }
      return item;
    }));

    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-700/80 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Répondre aux Questions & Doutes des Étudiants</h1>
            <p className="text-xs text-slate-400">Boîte de réception des questions envoyées par les élèves dans les leçons</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {qaItems.map(item => (
          <div key={item.id} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded border border-slate-700">
                  {item.lesson}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">Question de {item.student} :</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">"{item.question}"</p>
              </div>

              {item.status === 'Answered' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 shrink-0">
                  ✓ Répondu
                </span>
              ) : (
                <button
                  onClick={() => setActiveReplyId(item.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow hover:bg-amber-400 transition-all"
                >
                  Répondre
                </button>
              )}
            </div>

            {item.answer && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 space-y-1">
                <span className="font-bold text-emerald-400 block text-[10px]">Votre Réponse Envoyée :</span>
                <p className="leading-relaxed">{item.answer}</p>
              </div>
            )}

            {activeReplyId === item.id && (
              <div className="p-3 bg-slate-800 rounded-xl border border-amber-500/40 space-y-2 animate-fadeIn">
                <textarea
                  rows={2}
                  placeholder="Rédigez votre explication ou réponse pédagogique..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1 rounded-lg bg-slate-700 text-xs text-slate-300 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSendReply(item.id)}
                    className="px-4 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-emerald-400"
                  >
                    <Send className="w-3.5 h-3.5" /> Envoyer la Réponse
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
