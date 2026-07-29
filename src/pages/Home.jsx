import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Cpu, Zap, Shield, Star, Users, CheckCircle, Terminal, MessageSquare, ShoppingCart, Crosshair, Server, ChevronDown, Tag, ExternalLink, Cake,ArrowRight } from 'lucide-react';

// --- SCROLL ANİMASYON BİLEŞENİ ---
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
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}>
      {children}
    </div>
  );
};

// --- CANLI TERMİNAL BİLEŞENİ (MODERN YAPI) ---
const TerminalLog = () => {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    const fullLines = [
      { text: "// VarietyShop SaaS Engine Initialized...", class: "text-gray-500" },
      { text: "[SYSTEM] C# Backend bağlantısı stabil (0ms).", class: "text-[#0af2ff]" },
      { text: "[OK] Veritabanı modüler mimarisi aktif.", class: "text-[#10b981]" },
      { text: "[INFO] SaaS Lisans Dağıtımı Hazır.", class: "text-[#ffc300]" },
      { text: "[EXEC] Otomasyon sistemleri devrede...", class: "text-[#ff4181]" }
    ];

    const interval = setInterval(() => {
      setLines(prev => {
        if (prev.length < fullLines.length) {
          return [...prev, fullLines[prev.length]];
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0d0d14]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 font-mono text-[11px] md:text-xs text-left shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0af2ff] to-[#ff4181] opacity-50"></div>
      <div className="flex gap-1.5 mb-4 border-b border-white/5 pb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        <span className="ml-auto text-gray-500 text-[10px] tracking-widest uppercase">vs-core.exe</span>
      </div>
      <div className="space-y-2">
        {lines.map((line, idx) => (
          <p key={idx} className={`${line?.class || ''} animate-fade-in`}>{line?.text || ''}</p>
        ))}
        <p className="text-[#0af2ff] animate-pulse">_</p>
      </div>
    </div>
  );
};

// --- SSS (ACCORDION) BİLEŞENİ ---
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden mb-4 transition-all hover:border-white/10 hover:bg-white/[0.04]">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-white font-bold text-base">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#0af2ff] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="p-6 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5 mt-2">{answer}</p>
      </div>
    </div>
  );
};

// --- ANA SAYFA ---
function Home() {
  const navigate = useNavigate();

  const [yorumlar, setYorumlar] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    setYorumlar([
      { name: "Sistem", comment: "Canlı İtemsatış raporları siber ağdan çekiliyor...", rating: 5 }
    ]);

    Promise.allSettled([
      fetch(`${import.meta.env.VITE_API_URL}/external/itemsatis`).then(res => { if(!res.ok) throw new Error(); return res.json(); }),
      fetch(`${import.meta.env.VITE_API_URL}/market/search`).then(res => { if(!res.ok) throw new Error(); return res.json(); })
    ]).then(([itemsatisRes, marketRes]) => {
      
      let birlesikIlanlar = [];

      if (itemsatisRes.status === 'fulfilled') {
        const data = itemsatisRes.value;
        if (data.ilanlar) {
          const itemsatisIlanlari = data.ilanlar.slice(0, 3).map(ilan => ({
            id: `is-${ilan.id}`,
            title: ilan.title,
            description: "VarietyShop kalitesi ve İtemsatış güvencesiyle anında otomatik teslimat.",
            price: ilan.price,
            category: "İtemsatış Mağazası",
            sellerName: "VarietyShop",
            image: ilan.image, 
            link: ilan.link,
            isExternal: true 
          }));
          birlesikIlanlar = [...birlesikIlanlar, ...itemsatisIlanlari];
        }
        if (data.yorumlar && data.yorumlar.length > 0) {
          setYorumlar(data.yorumlar);
        } else {
          setYorumlar([{ name: "Hata", comment: "Şu an İtemsatış'ta yorum bulunamadı.", rating: 5 }]);
        }
      } else {
        setYorumlar([{ name: "Bağlantı Hatası", comment: "İtemsatış verileri şu an çekilemiyor. Lütfen daha sonra tekrar deneyin.", rating: 4 }]);
      }

      if (marketRes.status === 'fulfilled' && Array.isArray(marketRes.value)) {
        const marketIlanlari = marketRes.value.slice(0, 3).map(ilan => ({
          id: `vs-${ilan.id}`,
          title: ilan.name,
          description: ilan.description || "VarietyShop SaaS Lisansı.",
          price: ilan.price,
          category: "SaaS Market",
          sellerName: "VarietyShop",
          image: ilan.imageUrl || null, 
          link: '/market',
          isExternal: false
        }));
        birlesikIlanlar = [...birlesikIlanlar, ...marketIlanlari];
      }

      setLatestListings(birlesikIlanlar);
      setIsLoadingListings(false);
    });

  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0b10] overflow-x-hidden font-['Space_Grotesk',sans-serif] pb-40 text-gray-200">
      
      {/* GLOBAL ARKA PLAN YUMUŞAK IŞIKLARI */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#0af2ff]/5 blur-[150px] rounded-full mix-blend-screen animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ff4181]/5 blur-[150px] rounded-full mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-10 z-10">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#0d0d14]/80 backdrop-blur-xl border border-[#fb2e00]/20 rounded-full mb-10 shadow-[0_4px_30px_rgba(251,46,0,0.15)] hover:border-[#fb2e00]/50 transition-colors cursor-default">
              <ShoppingCart className="w-3.5 h-3.5 text-[#fb2e00]" />
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em]"><span className="text-[#fb2e00]">Varietyshop</span> Güvencesiyle Anında Teslimat</span>
            </div>

            {/* Yanlardaki Uçan Kartlar */}
            <div className="absolute top-10 -left-10 md:-left-32 hidden lg:flex flex-col gap-1 p-5 bg-[#0d0d14]/50 backdrop-blur-2xl rounded-3xl shadow-2xl animate-[bounce_4s_infinite_alternate_ease-in-out] border border-white/10">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mb-1"><Crosshair className="w-3 h-3 text-[#0af2ff]"/> Otomasyon</div>
              <div className="text-3xl font-black text-white tracking-tighter">7<span className="text-[#0af2ff]">/</span>24</div>
              <div className="text-[10px] text-[#0af2ff] font-bold tracking-wider">KESİNTİSİZ HİZMET</div>
            </div>

            <div className="absolute bottom-20 -right-10 md:-right-32 hidden lg:flex flex-col gap-1 p-5 bg-[#0d0d14]/50 backdrop-blur-2xl rounded-3xl shadow-2xl animate-[bounce_5s_infinite_alternate-reverse_ease-in-out] border border-white/10">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mb-1"><Cpu className="w-3 h-3 text-[#ff4181]"/> Sistem Yanıtı</div>
              <div className="text-3xl font-black text-white tracking-tighter">0<span className="text-[#ff4181]">ms</span></div>
              <div className="text-[10px] text-[#ff4181] font-bold tracking-wider">HIZLI TESLİMAT</div>
            </div>

            <h1 className="text-[4.5rem] md:text-[7.5rem] lg:text-[9rem] font-black tracking-tighter leading-[0.9] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,1)] relative z-20">
              VARIETY<br />
              <span className="relative inline-block mt-2 md:mt-4">
                <span className="absolute -inset-4 bg-gradient-to-r from-[#0af2ff] via-[#ff4181] to-[#ffc300] blur-[40px] opacity-30 animate-pulse"></span>
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300">
                  SHOP
                </span>
              </span>
            </h1>
            
            <p className="mt-10 text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                Dijital dünyada kuralları yeniden yazan <span className="text-[#ff4181] font-bold">Variety</span> SaaS sistemleri ve elit otomasyon araçları tek bir merkezde.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                 onClick={() => navigate('/market')}
                 className="group relative px-10 py-4 md:px-12 md:py-5 bg-white text-black font-black text-xs md:text-sm uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                 Marketimize Göz At
              </button>
              
              <button 
                 onClick={() => window.open('https://itemsatis.com/p/VarietyShop', '_blank')}
                 className="px-10 py-4 md:px-12 md:py-5 bg-[#fb2e00]/5 border border-[#fb2e00]/30 hover:border-[#fb2e00] hover:bg-[#fb2e00]/10 hover:shadow-[0_0_30px_rgba(251,46,0,0.2)] text-[#fb2e00] font-bold text-xs md:text-sm uppercase tracking-[0.2em] rounded-full transition-all flex items-center gap-2 backdrop-blur-md"
              >
                 <ShoppingCart className="w-4 h-4" /> İtemsatış Mağazamız
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 2. CANLI SAYACLAR & TERMİNAL EKRANI */}
      <section className="relative z-20 py-10 bg-[#0d0d14]/50 backdrop-blur-xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 grid grid-cols-2 gap-8 text-left">
              <RevealOnScroll delay={0}>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(10,242,255,0.4)]">400<span className="text-[#0af2ff]">+</span></div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Satılan Toplam Ilan</div>
              </RevealOnScroll>
              <RevealOnScroll delay={100}>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(251,46,0,0.4)]">100<span className="text-[#fb2e00]">%</span></div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Varietyshop Güvenilirlik</div>
              </RevealOnScroll>
              <RevealOnScroll delay={200}>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,65,129,0.4)]"><span className="text-[#ff4181]">+</span>250</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Memnun Müşteri Sayısı</div>
              </RevealOnScroll>
              <RevealOnScroll delay={300}>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,195,0,0.4)]">7<span className="text-[#ffc300]">/</span>24</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Kesintisiz Otomasyon</div>
              </RevealOnScroll>
            </div>
            <div className="lg:col-span-5">
              <RevealOnScroll delay={200}>
                <TerminalLog />
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DİNAMİK VİTRİN */}
      <section className="relative z-20 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-[10px] text-[#0af2ff] font-bold uppercase tracking-[0.3em] mb-4">SaaS Market & Dijital Ürünler</h2>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Sisteme Düşen <br/><span className="text-gray-500">Son İlanlar</span></h3>
              </div>
              <button onClick={() => navigate('/market')} className="group flex items-center gap-2 text-[#0af2ff] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                Tümünü Gör <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingListings ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-[#0af2ff] font-black animate-pulse uppercase tracking-widest">Ağ taranıyor...</div>
            ) : latestListings.length > 0 ? (
              latestListings.map((listing, index) => (
                <RevealOnScroll key={listing.id} delay={index * 150}>
                  <div 
                    onClick={() => listing.isExternal ? window.open(listing.link, '_blank') : navigate(listing.link)}
                    className={`group relative overflow-hidden bg-[#0d0d14]/80 backdrop-blur-xl rounded-[2rem] transition-all duration-500 hover:-translate-y-2 cursor-pointer border ${listing.isExternal ? 'border-[#fb2e00]/20 hover:border-[#fb2e00]/50 hover:shadow-[0_0_30px_rgba(251,46,0,0.15)]' : 'border-[#0af2ff]/20 hover:border-[#0af2ff]/50 hover:shadow-[0_0_30px_rgba(10,242,255,0.15)]'} h-[420px]`}
                  >
                    {listing.image ? (
                      <>
                        <div className="absolute inset-0 z-0">
                          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000 ease-out" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[65%] z-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/90 to-transparent"></div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-white/[0.02] z-0"></div>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 ${listing.isExternal ? 'bg-[#fb2e00]/20' : 'bg-[#0af2ff]/20'}`}></div>
                      </>
                    )}
                    
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                      {!listing.image && (
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${listing.isExternal ? 'bg-[#fb2e00]/10 border-[#fb2e00]/20' : 'bg-[#0af2ff]/10 border-[#0af2ff]/20'}`}>
                          {listing.isExternal ? <ShoppingCart className="w-5 h-5 text-[#fb2e00]" /> : <Tag className="w-5 h-5 text-[#0af2ff]" />}
                        </div>
                      )}
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-md ml-auto ${listing.isExternal ? 'bg-[#fb2e00]/20 text-white border-[#fb2e00]/50 shadow-[0_0_15px_rgba(251,46,0,0.5)]' : 'bg-[#0af2ff]/10 text-[#0af2ff] border-[#0af2ff]/20'}`}>
                        {listing.category}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col justify-end">
                      <h4 className="text-lg font-black text-white mb-1.5 line-clamp-2 drop-shadow-md">{listing.title}</h4>
                      <p className={`text-[11px] font-medium leading-relaxed mb-4 line-clamp-2 ${listing.image ? 'text-gray-300 drop-shadow-md' : 'text-gray-400'}`}>
                        {listing.description}
                      </p>
                      
                      <div className="flex items-end justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1 drop-shadow-md">Satıcı: @{listing.sellerName}</span>
                          <span className={`text-xl font-black drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] ${listing.isExternal ? 'text-[#fb2e00]' : 'text-white'}`}>₺{listing.price}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest group-hover:underline drop-shadow-md ${listing.isExternal ? 'text-white' : 'text-[#0af2ff]'}`}>
                          {listing.isExternal ? 'Satın Al' : 'İncele'}
                          {listing.isExternal && <ExternalLink className="w-3 h-3 ml-0.5" />}
                        </div>
                      </div>
                    </div>

                  </div>
                </RevealOnScroll>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500 py-10 bg-white/[0.01] rounded-[2rem] border border-white/5 border-dashed">
                Ağda şu an güncel bir ilan bulunmuyor
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. NEDEN VARIETYSHOP? */}
      <section className="relative z-20 py-20 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center mb-20">
               <h2 className="text-[10px] text-[#ffc300] font-bold uppercase tracking-[0.3em] mb-4">Core Architecture</h2>
               <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Neden VarietyShop?</h3>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            <RevealOnScroll delay={0}>
              <FeatureItem icon={<CheckCircle className="text-[#0af2ff]"/>} title="7/24 Otomatik Teslimat" desc="Beklemeye ve manuel işlemlere son. Satın aldığınız tüm hizmetler, günün her saati anında ve otomatik olarak teslim edilir." />
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <FeatureItem icon={<ShoppingCart className="text-[#fb2e00]"/>} title="3D Secure Güvencesi" desc="Ödemeleriniz dünya standartlarında 3D Secure koruması altındadır. Güvenliğiniz ve bütçeniz her zaman koruma altında." />
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <FeatureItem icon={<Cake className="text-[#10b981]"/>} title="Sektörel Tecrübe" desc="Sektörde geride bıraktığımız 2 yıl boyunca edindiğimiz derin deneyimle, sizlere en kusursuz ve kararlı hizmeti sunuyoruz." />
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <FeatureItem icon={<Server className="text-[#ff4181]"/>} title="Gelişmiş Altyapı ve Hız" desc="En son teknolojilerle optimize edilmiş sistemlerimiz sayesinde, tüm işlemlerinizi hiçbir kesinti veya yavaşlama yaşamadan gerçekleştirirsiniz." />
            </RevealOnScroll>
            <RevealOnScroll delay={400}>
              <FeatureItem icon={<Users className="text-[#0af2ff]"/>} title="7/24 Kesintisiz Destek" desc="Aktif topluluğumuz ve uzman teknik ekibimizle Discord üzerinden her an yanınızdayız. Sorularınıza saniyeler içinde çözüm buluyoruz." />
            </RevealOnScroll>
            <RevealOnScroll delay={500}>
              <FeatureItem icon={<Star className="text-[#ffc300]"/>} title="Memnuniyet Garantisi" desc="Hizmet kalitemize sonuna kadar güveniyoruz. Olası bir aksilik durumunda, haklarınızı koruyan esnek iade ve iptal politikalarımızdan yararlanabilirsiniz." />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 5. MÜŞTERİ YORUMLARI */}
      <section className="relative z-20 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <RevealOnScroll>
             <h2 className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em] mb-4">Varietyshop Değerlendirmeleri</h2>
             <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Sahadan Raporlar</h3>
          </RevealOnScroll>
        </div>

        <div className="flex gap-6 px-6 overflow-x-auto pb-10 snap-x hide-scrollbar">
          {yorumlar.length > 0 ? (
            yorumlar.map((yorum, index) => (
              <TestimonialCard key={index} name={yorum.name} comment={yorum.comment} rating={yorum.rating} />
            ))
          ) : (
            <div className="text-gray-500 text-center w-full">Raporlar yükleniyor...</div>
          )}
        </div>
      </section>

      {/* 6. SIKÇA SORULAN SORULAR (FAQ) */}
      <section className="relative z-20 py-24 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-[10px] text-[#ff4181] font-bold uppercase tracking-[0.3em] mb-4">Knowledge Base</h2>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Sıkça Sorulan Sorular</h3>
            </div>
            
            <div className="space-y-2">
              <FaqItem question="Börü yazılımını kullanmak ban sebebi mi?" answer="Börü, gelişmiş insan davranışlarını taklit eden özel algoritmalarla donatılmıştır. Bu sayede tespit edilme ve ban riski teorik olarak minimuma indirilmiştir. Ancak dijital dünyada hiçbir sistem %100 risk barındırmaz garantisi veremez; bu bilançoyla Börü, güvenliğinizi her zaman en üst sınırda tutmak için sürekli güncellenir." />
              <FaqItem question="Satın aldığım ürün ne zaman ve nasıl teslim edilir?" answer="VarietyShop altyapısı tamamen otomatizedir. Ödemeniz başarıyla tamamlandığı salise, sistem tarafından üretilen lisans anahtarınız veya ürün verileriniz profilinizdeki 'Kontrol Merkezi' (Dashboard) alanına anında teslim edilir. Bekleme süresi tamamen ortadan kaldırılmıştır." />
              <FaqItem question="Hesabımdaki bakiyeyi nakite çevirebilir miyim?" answer="Şu an için platform içi bakiyeler yalnızca Market üzerindeki alışverişlerde geçerlidir. Kullanıcılarımızın talepleri doğrultusunda, ilerleyen büyük güncellemelerde komisyonlu nakit çekim sistemini de ekosisteme dahil etmeyi planlıyoruz." />
              <FaqItem question="Oyuna büyük bir güncelleme geldiğinde sistem devre dışı kalır mı?" answer="Geliştirme ekibimiz oyun güncellemelerini anlık olarak takip etmektedir. Olası bir yamada yazılımımız hızla optimize edilir ve yeni sürüme yine panelinizden hiçbir veri veya zaman kaybı yaşamadan, kaldığınız yerden erişebilirsiniz." />
              <FaqItem question="Yazılımı arka planda çalıştırabilir miyim? Bilgisayarı yorar mı?" answer="Sistemlerimiz minimum kaynak tüketimi ve maksimum performans odaklı geliştirilmiştir. Hatta SaaS sistemlerimiz tamamen bulut tabanlı çalıştığı için bilgisayarınızı hiçbir şekilde yormaz." />
              <FaqItem question="Sitenizde hangi ödeme yöntemleri geçerlidir?" answer="Kullanıcılarımıza esneklik sağlamak adına tüm banka ve kredi kartları (3D Secure güvencesiyle), Havale/EFT ve güvenli E-Pin yöntemleriyle bakiye yükleme seçenekleri sunuyoruz." />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 7. TOPLULUK & DESTEK TERMINALI */}
      <section className="relative z-20 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <RevealOnScroll>
            <div className="p-10 bg-[#0d0d14]/80 border border-white/10 rounded-[2rem] backdrop-blur-xl text-center relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0af2ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
               <div className="relative z-10">
                 <Terminal className="w-12 h-12 text-gray-500 mx-auto mb-6 opacity-50" />
                 <h2 className="text-3xl font-black text-white mb-4">Hala Bekliyor Musun?</h2>
                 <p className="text-gray-400 mb-8 max-w-lg mx-auto">Varietyshop topluluğumuza katılmak veya sistemlerimizi incelemek için siber ağa bağlan</p>
                 
                 <div className="flex items-center justify-center gap-4">
                   <button onClick={() => navigate('/login')} className="px-8 py-3 bg-[#0af2ff]/10 text-[#0af2ff] border border-[#0af2ff]/20 hover:bg-[#0af2ff] hover:text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(10,242,255,0)] hover:shadow-[0_0_20px_rgba(10,242,255,0.4)] cursor-pointer">
                     Sisteme Giriş Yap
                   </button>
                 </div>
               </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  );
}

// --- YARDIMCI BİLEŞENLER ---

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="w-14 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/[0.08] group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
      {React.cloneElement(icon, { className: `w-6 h-6 ${icon.props.className}` })}
    </div>
    <h4 className="text-lg font-bold text-white mb-3">{title}</h4>
    <p className="text-sm text-gray-500 leading-relaxed max-w-[260px]">{desc}</p>
  </div>
);

const TestimonialCard = ({ name, comment, rating }) => (
  <div className="min-w-[300px] md:min-w-[400px] p-8 bg-[#0d0d14]/80 backdrop-blur-md border border-white/5 rounded-3xl snap-center hover:border-white/10 hover:bg-white/[0.04] transition-colors shadow-xl">
    <div className="flex items-center gap-1 mb-4">
      {[...Array(rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#ffc300] fill-[#ffc300] drop-shadow-[0_0_5px_rgba(255,195,0,0.5)]" />)}
    </div>
    <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{comment}"</p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0af2ff] to-[#ff4181] p-[1px]">
        <div className="w-full h-full bg-[#0d0d12] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
      </div>
      <span className="text-xs font-bold text-gray-400">{name}</span>
    </div>
  </div>
);

export default Home;