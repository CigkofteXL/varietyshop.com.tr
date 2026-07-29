import React, { useState, useEffect, useRef } from 'react';

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        scrollObserver.unobserve(entry.target); 
      }
    });
    if (ref.current) scrollObserver.observe(ref.current);
    return () => { if (ref.current) scrollObserver.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
      {children}
    </div>
  );
};

function Linkrouter() {
  const socialLinks = [
    { id: 1, title: "VarietyShop Community", subtitle: "Resmi Discord Sunucusu", image: "/logo/variety2saniye.gif", url: "https://discord.gg/eTAXD554Ab", color: "#0af2ff" },
    { id: 2, title: "VarietyLabs", subtitle: "Yazılım Geliştirme Merkezi", image: "/logo/varietysarianimv3.gif", url: "https://discord.gg/eTAXD554Ab", color: "#ffc300" },
    { id: 3, title: "Revolt Community", subtitle: "Revolt PVP UHC Topluluğu", image: "/logo/revoltv1.gif", url: "https://discord.gg/Ryqbde6JWG", color: "#ff4181" },
    { id: 4, title: "CigkofteXL Github", subtitle: "Açık Kaynak Projeler", image: "/logo/varietyyesilanimv3.gif", url: "https://github.com/CigkofteXL", color: "#10b981" },
    { id: 5, title: "Varietyshop Youtube", subtitle: "Video Rehberler ve Tanıtımlar", image: "/logo/varietypembeanimv3.gif", url: "https://www.youtube.com/@Varietyshoptr", color: "#fb2e00" },
    { id: 6, title: "Varietyshop İnstagram", subtitle: "Günlük Haberler ve Duyurular", image: "/logo/varietygrianimv3.gif", url: "https://www.instagram.com/varietyshopturkiye/", color: "#e4e1e9" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-20 px-6 pb-40 overflow-hidden font-['Space_Grotesk',sans-serif] bg-[#050508]">
      {/* ARKA PLAN GLOWLARI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff4181]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <RevealOnScroll>
        <div className="flex flex-col items-center mb-12">
          {/* Merkezi Logo Animasyonu */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#0af2ff] to-[#ff4181] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <img src="/logo/fedorabörü.png" alt="logo" className="relative w-48 h-48 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
          </div>

          {/* Sosyal İkonlar Bandı (Glass-Pill) - DÜZELTİLDİ */}
          <div className="mt-8 flex items-center gap-4 px-6 py-3 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-full shadow-2xl">
            <a href="https://www.youtube.com/@Varietyshoptr" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <img src="/logo/Youtube.png" alt="youtube" className="w-8 h-8 object-contain" />
            </a>
            <a href="https://www.itemsatis.com/p/VarietyShop" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <img src="/logo/itemsatis.png" alt="itemsatis" className="w-8 h-8 object-contain" />
            </a>
            <a href="https://discord.gg/eTAXD554Ab" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <img src="/logo/discord.png" alt="discord" className="w-8 h-8 object-contain" />
            </a>
            <a href="https://github.com/CigkofteXL" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <img src="/logo/github.png" alt="github" className="w-8 h-8 object-contain" />
            </a>
          </div>

          <h1 className="mt-10 text-5xl font-black text-white tracking-tighter">Bağlantı <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0af2ff] to-[#ff4181]">Üssü.</span></h1>
        </div>
      </RevealOnScroll>

      {/* Linkler Listesi */}
      <div className="w-full max-w-xl space-y-4 relative z-10">
        {socialLinks.map((link, index) => (
          <RevealOnScroll key={link.id} delay={index * 100}>
            <a 
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-[1.5rem] transition-all duration-300"
            >
              {/* Sol Renk Çizgisi (No-Line felsefesine uygun ince dokunuş) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: link.color, boxShadow: `0 0 10px ${link.color}` }}></div>
              
              <div className="flex items-center gap-5 flex-1">
                <div className="w-14 h-14 rounded-full p-[2px] bg-white/5 overflow-hidden shadow-xl">
                  <img src={link.image} alt={link.title} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-lg text-white group-hover:text-white transition-colors">{link.title}</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{link.subtitle}</span>
                </div>
              </div>

              <div className="text-gray-600 group-hover:text-white transition-colors">
                <ArrowBigRight className="w-5 h-5" />
              </div>
            </a>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

const ArrowBigRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>
);

export default Linkrouter;