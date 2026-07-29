import React from 'react';
import { AlertTriangle, Terminal } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden font-['Space_Grotesk']">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="relative z-10 text-center max-w-2xl border border-[#fb2e00]/20 bg-[#0a0c12]/80 backdrop-blur-md p-12 rounded-[2rem] shadow-[0_0_50px_rgba(251,46,0,0.15)] animate-fade-in">
        <div className="w-24 h-24 bg-[#fb2e00]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertTriangle className="w-12 h-12 text-[#fb2e00]" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">
          SİBER AĞ <span className="text-[#fb2e00]">BAKIMDA</span>
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-[#0af2ff] mb-8 font-mono text-sm">
          <Terminal className="w-4 h-4" />
          <span>SİSTEM_GÜNCELLEMESİ_YÜKLENİYOR...</span>
        </div>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
          Şu anda VarietyShop çekirdek sunucularında büyük bir siber operasyon yürütülüyor. Altyapıyı daha güvenli ve hızlı hale getirmek için kısa bir süreliğine çevrimdışıyız. Ajanlarımız sistemi ayağa kaldırmak üzere.
        </p>
        
        <div className="inline-block px-6 py-3 bg-[#fb2e00]/10 border border-[#fb2e00]/30 rounded-xl text-[#fb2e00] font-black tracking-widest text-xs uppercase">
          Tahmini Dönüş: Çok Yakında
        </div>
      </div>
    </div>
  );
}