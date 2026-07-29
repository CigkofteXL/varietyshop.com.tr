import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050508] text-[#e4e1e9] font-['Space_Grotesk'] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#0af2ff]/30">
      
      {/* İnce Matrix Çizgileri Arka Planı */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,242,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(10,242,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
      
      {/* Işık Süzmesi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-gradient-to-b from-[#0af2ff]/10 to-transparent blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Hata İkonu */}
        <div className="mb-6 relative group">
           <div className="absolute inset-0 bg-[#0af2ff]/20 blur-xl rounded-full scale-150 animate-pulse"></div>
           <AlertOctagon className="w-16 h-16 text-[#0af2ff] relative z-10 animate-[spin_10s_linear_infinite]" />
        </div>

        {/* Glitch 404 */}
        <div className="relative mb-6">
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(10,242,255,0.3)]">
            404
          </h1>
          {/* Glitch Katmanları */}
          <h1 className="text-[120px] md:text-[180px] font-black text-[#ff4181] absolute inset-0 leading-none tracking-tighter opacity-50 mix-blend-screen animate-[glitch_2s_infinite] pointer-events-none -translate-x-1">
            404
          </h1>
          <h1 className="text-[120px] md:text-[180px] font-black text-[#0af2ff] absolute inset-0 leading-none tracking-tighter opacity-50 mix-blend-screen animate-[glitch_3s_infinite_reverse] pointer-events-none translate-x-1">
            404
          </h1>
        </div>

        {/* Başlık ve Açıklama */}
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.4em] mb-6 border-b border-white/10 pb-4 w-full max-w-md">
          Sinyal Kaybedildi
        </h2>
        
        <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest leading-relaxed mb-12 max-w-lg">
          Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir. 
        </p>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => navigate(-1)} 
            className="flex-1 group relative flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all overflow-hidden"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span>Geri Dön</span>
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="flex-1 group relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0af2ff]/10 to-[#0af2ff]/5 border border-[#0af2ff]/30 hover:border-[#0af2ff] rounded-2xl text-xs font-black uppercase tracking-widest text-[#0af2ff] transition-all shadow-[0_0_20px_rgba(10,242,255,0.1)] hover:shadow-[0_0_30px_rgba(10,242,255,0.3)]"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Karargaha Dön</span>
          </button>
        </div>

      </div>

      {/* Glitch CSS Animasyonu için Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glitch {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(2px, -2px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, 2px); }
        }
      `}} />
    </div>
  );
}

export default NotFound;