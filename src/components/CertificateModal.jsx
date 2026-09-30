import React from 'react';
import { Award, Printer, Download, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const CertificateModal = ({ courseTitle, studentName, date, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Layout de Certificado Imprimible */}
        <div id="printable-certificate" className="p-8 md:p-12 bg-slate-900 text-center relative border-8 border-slate-800 m-3 rounded-2xl">
          {/* Adorno de marco dorado/esmeralda */}
          <div className="absolute inset-2 border border-emerald-500/30 rounded-xl pointer-events-none"></div>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <Award className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            REPÚBLICA Y REGIONAL DE ÁFRICA CENTRAL • EDUC-EG
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
            CERTIFICADO DE APROBACIÓN
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Acredita que el estudiante ha completado con éxito la totalidad del programa de estudios teóricos y prácticos evaluados sin conexión.
          </p>

          <div className="my-6 py-4 border-y border-slate-700/60 max-w-lg mx-auto">
            <span className="text-xs text-slate-400 block mb-1">Otorgado oficialmente a:</span>
            <h2 className="text-xl md:text-3xl font-black text-amber-300 tracking-wide font-serif">
              {studentName || 'Emmanuel Olinga'}
            </h2>
          </div>

          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-4">
            Por completar exitosamente el curso especializado:
          </p>
          <h3 className="text-lg md:text-2xl font-bold text-emerald-300 max-w-xl mx-auto mb-6">
            "{courseTitle || 'Agroecología y Cultivos Resilientes al Clima'}"
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto text-left text-xs bg-slate-850 p-4 rounded-xl border border-slate-800 mb-6">
            <div>
              <span className="text-slate-400 block text-[10px]">FECHA DE EMISIÓN</span>
              <strong className="text-slate-200">{date || new Date().toLocaleDateString()}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CÓDIGO DE VERIFICACIÓN</span>
              <strong className="text-slate-200">ED-OFF-{Math.floor(100000 + Math.random() * 900000)}</strong>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold">Firma Digital Validada</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-[11px] text-slate-400 max-w-lg mx-auto">
            <div>
              <p className="font-bold text-slate-300">Prof. Jean-Paul Mbarga</p>
              <p>Director de Programa Educativo</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-300">EDUC-EG Central</p>
              <p>Validez Nacional & Rural</p>
            </div>
          </div>
        </div>

        {/* Acciones del Certificado */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Certificado listo para impresión o descarga local
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
