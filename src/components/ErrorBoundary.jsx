import React from 'react';
import { AlertTriangle, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary atrapó un error de ejecución:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleClearDataAndReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            
            <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Recuperación Autónoma EDUC-EG</h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ocurrió una pequeña interrupción en el renderizado de la interfaz. La plataforma se puede recuperar instantáneamente.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-left text-[11px] font-mono text-red-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-transform hover:scale-102"
              >
                <RefreshCw className="w-4 h-4" /> Recargar Interfaz
              </button>

              <button
                onClick={this.handleClearDataAndReset}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-400" /> Restablecer Caché & Datos Guardados
              </button>
            </div>

            <span className="text-[10px] text-slate-500 block font-semibold">
              Sistema Offline Resiliente • EDUC-EG Guinea Ecuatorial
            </span>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
