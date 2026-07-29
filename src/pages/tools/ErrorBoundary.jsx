import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Sonraki render'da yedek arayüzü (fallback UI) göstermek için state'i güncelliyoruz.
    return { hasError: true, errorInfo: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    // Burada hatayı alıp kendi backend'ine veya log servisine gönderebilirsin
    console.error("Siber Ağ Kritik Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // SİSTEM ÇÖKÜNCE GÖSTERİLECEK SİBER ARAYÜZ
      return (
        <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 font-['Space_Grotesk',sans-serif] overflow-hidden relative">
          
          {/* Kırmızı Alarm Arka Plan Efekti */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fb2e00]/10 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="w-full max-w-2xl bg-[#0d0d12]/90 border border-[#fb2e00]/30 rounded-3xl p-8 md:p-12 relative z-10 shadow-[0_0_50px_rgba(251,46,0,0.15)] backdrop-blur-2xl">
            <div className="flex flex-col items-center text-center">
              
              <div className="w-24 h-24 bg-[#fb2e00]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#fb2e00]/30 animate-pulse">
                <AlertTriangle className="w-12 h-12 text-[#fb2e00]" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                SİSTEM <span className="text-[#fb2e00]">ÇÖKTÜ.</span>
              </h1>
              
              <p className="text-gray-400 mb-10 max-w-md text-sm md:text-base leading-relaxed">
                Ağda kritik bir arıza tespit edildi. Güvenlik protokolleri devreye girdi ve Börü ekipleri müdahale ediyor. Lütfen bağlantıyı yenileyin.
              </p>

              {/* Terminal Görünümlü Hata Logu */}
              <div className="w-full bg-black/60 rounded-xl p-5 border border-white/5 mb-10 text-left overflow-hidden shadow-inner">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                  <Terminal className="w-4 h-4 text-[#fb2e00]" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fatal Error Log</span>
                </div>
                <p className="text-[#fb2e00] font-mono text-[11px] break-words opacity-90 leading-relaxed">
                  {this.state.errorInfo || "ERR_UNKNOWN: Bağlantı koptu..."}
                </p>
              </div>

              <button 
                onClick={() => window.location.reload()} 
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#fb2e00]/80 to-[#fb2e00] hover:from-[#fb2e00] hover:to-[#fb2e00]/80 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(251,46,0,0.4)]"
              >
                <RefreshCw className="w-5 h-5" /> Sistemi Yeniden Başlat
              </button>
              
            </div>
          </div>
        </div>
      );
    }

    // Hata yoksa normal siteyi (children) göster
    return this.props.children; 
  }
}

export default ErrorBoundary;