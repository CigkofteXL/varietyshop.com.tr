import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Star, ShieldCheck, Zap, Terminal, Copy, ArrowRight, 
  CheckCircle2, AlertTriangle, ExternalLink, Megaphone, Info, 
  Search, X, Bell, Timer, Percent, ChevronDown, Filter, LayoutGrid, List,
  MessageSquare, User
} from 'lucide-react';

import { useCart } from './tools/CartContext'; 

// Kaydırma Efekti
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
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {children}
    </div>
  );
};

function Market() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('variety');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortOrder, setSortOrder] = useState('default'); 
  const [viewMode, setViewMode] = useState('grid'); 
  
  const { addToCart } = useCart();
  
  // VERİ STATE'LERİ
  const [varietyProducts, setVarietyProducts] = useState([]);
  const [itemsatisProducts, setItemsatisProducts] = useState([]);
  const [announcements, setAnnouncements] = useState([]); 
  const [latestReviews, setLatestReviews] = useState([]); 
  const [storeStats, setStoreStats] = useState({ satis: "...", puan: "..." });
  
  const [purchaseStatus, setPurchaseStatus] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  // CANLI ZAMAN MOTORU
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // SİBER AĞA BAĞLANMA
  useEffect(() => {
    setIsLoading(true);
    
    Promise.allSettled([
      fetch(`${import.meta.env.VITE_API_URL}/market/search`).then(res => res.ok ? res.json() : []),
      fetch(`${import.meta.env.VITE_API_URL}/external/itemsatis`).then(res => res.ok ? res.json() : { ilanlar: [] }),
      fetch(`${import.meta.env.VITE_API_URL}/announcements`).then(res => res.ok ? res.json() : []),
      fetch(`${import.meta.env.VITE_API_URL}/market/reviews/latest`).then(res => res.ok ? res.json() : [])
    ]).then(([varietyRes, itemsatisRes, announcementsRes, reviewsRes]) => {
      
      if (varietyRes.status === 'fulfilled' && Array.isArray(varietyRes.value)) {
        setVarietyProducts(varietyRes.value);
      }

      if (itemsatisRes.status === 'fulfilled' && itemsatisRes.value) {
        const data = itemsatisRes.value;
        if (data.ilanlar) setItemsatisProducts(data.ilanlar);
        if (data.toplamSatis || data.magazaPuani) {
          setStoreStats({ satis: data.toplamSatis || "500+", puan: data.magazaPuani || "5.0" });
        }
      }

      if (announcementsRes.status === 'fulfilled' && Array.isArray(announcementsRes.value)) {
        setAnnouncements(announcementsRes.value);
      }

      if (reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)) {
        setLatestReviews(reviewsRes.value);
      }
      
      setIsLoading(false);
    });
  }, []);

  // ANINDA SATIN ALMA MOTORU
  const handleBuy = async (item, finalPrice) => {
    const token = localStorage.getItem('vs_token');
    if (!token) { alert("Operasyona katılmak için önce sisteme giriş yapmalısın!"); return; }

    const confirmBuy = window.confirm(`"${item.name}" ürününü ${finalPrice} ₺ karşılığında ANINDA satın almak istiyor musunuz?`);
    if (!confirmBuy) return;

    setPurchaseStatus({ type: 'processing', message: 'Merkez bankası onay bekliyor, lisans hazırlanıyor...' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/market/products/${item.id}/buy`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPurchaseStatus({ type: 'success', message: data.message || "Operasyon başarılı! Satın aldığınız ürünün bilgileri siber ağ üzerinden Bildirim kutunuza gönderildi." });
        if (data.newBalance !== undefined) {
          localStorage.setItem('vs_balance', data.newBalance);
          window.dispatchEvent(new Event('storage'));
        }
        setVarietyProducts(prev => prev.map(p => p.id === item.id ? { ...p, stock: p.stock - 1 } : p));
      } else {
        setPurchaseStatus({ type: 'error', message: data.message || 'İşlem reddedildi.' });
      }
    } catch (err) {
      setPurchaseStatus({ type: 'error', message: 'Ana çekirdek ile bağlantı kurulamadı.' });
    }
  };

  const getAnnouncementStyle = (type) => {
    switch(type) {
      case 'Warning': return { icon: <AlertTriangle className="w-5 h-5 text-red-500" />, border: 'border-red-500/30', bg: 'bg-red-500/5', titleColor: 'text-red-500' };
      case 'Update': return { icon: <Zap className="w-5 h-5 text-[#0af2ff]" />, border: 'border-[#0af2ff]/30', bg: 'bg-[#0af2ff]/5', titleColor: 'text-[#0af2ff]' };
      default: return { icon: <Info className="w-5 h-5 text-[#ff4181]" />, border: 'border-[#ff4181]/30', bg: 'bg-[#ff4181]/5', titleColor: 'text-[#ff4181]' };
    }
  };

  // ARAMA VE SIRALAMA (FİLTRELEME) İŞLEMLERİ
  let filteredVariety = varietyProducts.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortOrder === 'price-asc') {
    filteredVariety.sort((a, b) => (a.flashSalePrice || a.price) - (b.flashSalePrice || b.price));
  } else if (sortOrder === 'price-desc') {
    filteredVariety.sort((a, b) => (b.flashSalePrice || b.price) - (a.flashSalePrice || a.price));
  } else if (sortOrder === 'discounted') {
    filteredVariety = filteredVariety.filter(p => p.flashSalePrice && new Date(p.flashSaleEndDate) > now);
  }

  const filteredItemsatis = itemsatisProducts.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAnnouncements = announcements.filter(a => a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.content?.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const filteredReviews = latestReviews.filter(r => 
    r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-40 relative min-h-screen bg-[#050508] font-['Space_Grotesk',sans-serif]">
      
      {/* SİBER SATIN ALMA MODALI */}
      {purchaseStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${purchaseStatus.type === 'success' ? 'border-[#10b981]/50 bg-[#0d0d12]' : purchaseStatus.type === 'processing' ? 'border-[#0af2ff]/50 bg-[#0d0d12]' : 'border-[#fb2e00]/50 bg-[#0d0d12]'}`}>
            <div className="relative z-10">
                <h3 className={`text-2xl font-black mb-4 flex items-center gap-2 ${purchaseStatus.type === 'success' ? 'text-[#10b981]' : purchaseStatus.type === 'processing' ? 'text-[#0af2ff] animate-pulse' : 'text-[#fb2e00]'}`}>
                {purchaseStatus.type === 'success' ? <CheckCircle2 /> : purchaseStatus.type === 'processing' ? <Zap /> : <AlertTriangle />}
                {purchaseStatus.type === 'success' ? 'OPERASYON BAŞARILI' : purchaseStatus.type === 'processing' ? 'İŞLENİYOR...' : 'SİNYAL KESİLDİ'}
                </h3>
                <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">{purchaseStatus.message}</p>
                {purchaseStatus.type === 'success' && (
                    <div className="bg-[#10b981]/10 border border-dashed border-[#10b981]/30 p-5 rounded-2xl mb-8 flex items-center gap-4">
                        <div className="p-3 bg-[#10b981]/20 rounded-xl"><Bell className="w-6 h-6 text-[#10b981] animate-bounce" /></div>
                        <div>
                          <div className="text-[10px] text-[#10b981] font-black uppercase tracking-[0.2em]">TESLİMAT BİLDİRİMLERDE</div>
                          <div className="text-gray-300 text-xs mt-1 font-medium">Sağ üstteki zil ikonuna tıklayarak şifreleri kopyalayabilirsiniz.</div>
                        </div>
                    </div>
                )}
                {purchaseStatus.type !== 'processing' && (
                <button onClick={() => setPurchaseStatus(null)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all uppercase tracking-widest text-xs">
                    Terminali Kapat
                </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* BANNER */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img src="/banner/perfectbanner.png" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105" alt="banner" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050508]"></div>
        <RevealOnScroll>
          <div className="relative z-10 text-center px-6 mt-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fb2e00]/10 border border-[#fb2e00]/20 rounded-full mb-6">
              <ShoppingCart className="w-3.5 h-3.5 text-[#fb2e00]" />
              <span className="text-[10px] font-bold text-[#fb2e00] uppercase tracking-widest">VarietyShop Ekosistemi</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">SİBER <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0af2ff] to-[#ff4181]">MAĞAZA</span></h1>
          </div>
        </RevealOnScroll>
      </section>

      {/* PROFİL PANELİ */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-[#0d0d12]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/5 shadow-inner shrink-0">
              <img src="/logo/varietyv2.png" className="w-full h-full object-cover" alt="logo" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h2 className="text-3xl font-black text-white tracking-tight">VarietyShop</h2>
                <ShieldCheck className="w-6 h-6 text-[#0af2ff] drop-shadow-[0_0_8px_rgba(10,242,255,0.5)]" />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-3">Çeşitli Güvenilir Hesaplı Kaliteli</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 md:mb-0">
                <span className="bg-[#ffc300]/10 text-[#ffc300] text-[10px] font-bold px-3 py-1 rounded-full border border-[#ffc300]/20">RESMİ MAĞAZA</span>
                <span className="bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold px-3 py-1 rounded-full border border-[#10b981]/20">SİSTEM ONAYLI</span>
              </div>
            </div>
          </div>
          <div className="flex gap-6 md:gap-10 md:pl-10 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0">
            <div className="text-center">
              <div className="text-3xl font-black text-[#0af2ff]">{storeStats.satis}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Başarılı İşlem</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#ffc300] flex items-center justify-center gap-1">
                {storeStats.puan} <Star className="w-5 h-5 fill-[#ffc300]" />
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Mağaza Puanı</div>
            </div>
          </div>
        </div>
      </div>

      {/* MARKET NAVİGASYONU, ARAMA VE VİTRİNLER */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        
        {/* REFORM: Mouse tekerleğini kilitleyen ve kaydıran 'overflow-x-auto' temizlendi, yerine 'flex-wrap' mühürlendi kanka! */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 mb-8 pb-4">
          
          <div className="flex flex-wrap gap-4 md:gap-6 w-full lg:w-auto">
            {[
              { id: 'variety', label: 'VarietyShop Ürünleri' },
              { id: 'itemsatis', label: 'İtemsatış İlanları' },
              { id: 'duyurular', label: 'Duyurular' },
              { id: 'reviews', label: 'Son Yorumlar' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-xs font-black uppercase tracking-[0.1em] transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#0af2ff]' : 'text-gray-500 hover:text-white'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-[#0af2ff]"></div>}
              </button>
            ))}
          </div>

          {activeTab === 'variety' && (
            <div className="flex flex-wrap sm:flex-nowrap items-center w-full lg:w-auto gap-2 bg-[#0a0c12] p-1.5 rounded-xl border border border-white/5">
              
              {/* Görünüm Değiştirici */}
              <div className="flex items-center gap-1 border-r border-white/10 pr-2">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#0af2ff]/20 text-[#0af2ff]' : 'text-gray-500 hover:text-white'}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#0af2ff]/20 text-[#0af2ff]' : 'text-gray-500 hover:text-white'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filtreleme */}
              <div className="relative flex items-center border-r border-white/10 pr-2 pl-2">
                <Filter className="w-3 h-3 text-gray-500 mr-2" />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-transparent text-gray-300 hover:text-white text-[10px] font-bold uppercase outline-none cursor-pointer appearance-none pr-4">
                  <option value="default" className="bg-[#0d0d12]">Sırala: Varsayılan</option>
                  <option value="discounted" className="bg-[#0d0d12]">🔥 İndirime Girenler</option>
                  <option value="price-asc" className="bg-[#0d0d12]">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc" className="bg-[#0d0d12]">Fiyat: Yüksekten Düşüğe</option>
                </select>
              </div>

              {/* Arama */}
              <div className="flex items-center pl-2 flex-1 sm:w-48">
                <Search className="w-3 h-3 text-gray-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Ara..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-transparent text-white text-[10px] font-bold uppercase outline-none placeholder-gray-600" 
                />
                {searchQuery && <X onClick={() => setSearchQuery('')} className="w-3 h-3 text-red-500 cursor-pointer ml-2 hover:scale-110" />}
              </div>

            </div>
          )}

          {/* Duyuru ve Yorumlarda Arama Barı */}
          {(activeTab === 'duyurular' || activeTab === 'reviews') && (
             <div className="flex items-center w-full lg:w-auto bg-[#0a0c12] p-1.5 rounded-xl border border-white/5">
                <Search className="w-3 h-3 text-gray-500 ml-2 mr-2" />
                <input 
                  type="text" 
                  placeholder="İçerik Ara..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full sm:w-48 bg-transparent text-white text-[10px] font-bold uppercase outline-none placeholder-gray-600 py-1" 
                />
                {searchQuery && <X onClick={() => setSearchQuery('')} className="w-3 h-3 text-red-500 cursor-pointer mx-2 hover:scale-110" />}
             </div>
          )}

        </div>

        {isLoading ? (
          <div className="text-center py-20 text-[#0af2ff] font-black uppercase tracking-widest animate-pulse">
            Siber Ağ Taranıyor... Lütfen Bekleyin
          </div>
        ) : (
          <>
            {/* SEKMELER - 1. VARIETYSHOP VİTRİNİ */}
            {activeTab === 'variety' && (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                {filteredVariety.length > 0 ? filteredVariety.map((p, i) => {
                  const isOutOfStock = p.stock === 0;

                  const flashEnd = p.flashSaleEndDate ? new Date(p.flashSaleEndDate) : null;
                  const isFlashSaleActive = flashEnd && flashEnd > now && p.flashSalePrice;
                  let timeLeft = "";
                  
                  if (isFlashSaleActive) {
                    const diff = flashEnd - now;
                    const hours24 = 24 * 60 * 60 * 1000;
                    if (diff > hours24) {
                      timeLeft = flashEnd.toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
                    } else {
                      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
                      const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
                      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
                      timeLeft = `${h}:${m}:${s}`;
                    }
                  }

                  const currentPrice = isFlashSaleActive ? p.flashSalePrice : p.price;

                  return (
                    <RevealOnScroll key={p.id} delay={i * 50}>
                      <div className={`group relative bg-[#0d0d12] border ${isFlashSaleActive ? 'border-[#fb2e00]/50 shadow-[0_0_20px_rgba(251,46,0,0.15)]' : 'border-white/5 hover:border-[#0af2ff]/30 hover:shadow-[0_10px_30px_rgba(10,242,255,0.05)]'} rounded-[1.5rem] overflow-hidden transition-all duration-300 flex ${viewMode === 'grid' ? 'flex-col h-full' : 'flex-col sm:flex-row'}`}>
                        
                        {/* ROZETLER */}
                        {isFlashSaleActive && (
                          <div className="absolute top-3 right-3 z-20 bg-[#fb2e00]/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-[#fb2e00]/50 shadow-[0_0_15px_rgba(251,46,0,0.5)]">
                            <Timer className="w-3 h-3 animate-pulse" /> {timeLeft}
                          </div>
                        )}

                        {p.cashbackPercentage > 0 && (
                          <div className={`absolute z-20 bg-[#10b981]/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.3)] ${viewMode === 'list' ? 'bottom-3 left-3' : 'top-3 left-3'}`}>
                            <Percent className="w-3 h-3" /> %{p.cashbackPercentage} İADE
                          </div>
                        )}

                        {/* GÖRSEL ALANI */}
                        <div className={`${viewMode === 'grid' ? 'w-full h-44' : 'w-full sm:w-72 h-44 sm:h-auto'} relative overflow-hidden bg-[#050508] flex items-center justify-center shrink-0 border-b border-white/5`}>
                          {p.imageUrl ? (
                            <img src={p.imageUrl} className={`w-full h-full object-cover transition-transform duration-700 ${isOutOfStock ? 'opacity-30 grayscale' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'}`} alt={p.name} />
                          ) : (
                            <Zap className="w-12 h-12 text-[#ff4181]/20" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                        </div>
                        
                        {/* İÇERİK ALANI */}
                        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-transparent to-[#0a0c12]">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-[#0af2ff] uppercase tracking-widest">{p.category}</span>
                              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-[#10b981]'}`}>
                                {isOutOfStock ? <X className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {isOutOfStock ? 'TÜKENDİ' : `STOK: ${p.stock}`}
                              </div>
                            </div>

                            <div>
                              <h4 className={`text-base font-black mb-1 transition-colors line-clamp-2 leading-tight ${isOutOfStock ? 'text-gray-600' : 'text-white group-hover:text-[#0af2ff]'}`}>{p.name}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{p.description}</p>
                            </div>

                            <div className="flex items-center gap-2 bg-white/[0.02] w-fit px-2.5 py-1.5 rounded-lg border border-white/5">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, index) => (
                                  <Star key={index} className={`w-3 h-3 ${index < Math.round(p.averageRating || 0) ? 'text-[#ffc300] fill-[#ffc300]' : 'text-gray-700'}`} />
                                ))}
                              </div>
                              <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase ml-1">
                                {p.totalReviews > 0 ? `${p.totalReviews} Rapor` : 'İstihbarat Yok'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-5 pt-4 border-t border-white/5 flex items-end justify-between gap-4">
                            <div className="flex flex-col">
                              {isFlashSaleActive && <div className="text-gray-500 line-through text-[10px] font-bold mb-0.5">{p.price} ₺</div>}
                              <div className={`text-2xl font-black leading-none ${isOutOfStock ? 'text-gray-600' : isFlashSaleActive ? 'text-[#fb2e00]' : 'text-white'}`}>
                                {currentPrice} <span className="text-sm">₺</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button 
                                disabled={isOutOfStock} 
                                onClick={() => { addToCart({...p, price: currentPrice}); alert(`${p.name} siber sepete eklendi!`); }} 
                                className={`p-2.5 rounded-xl transition-all font-bold flex items-center justify-center ${isOutOfStock ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-white/5 hover:bg-[#ffc300] text-gray-300 hover:text-black border border-white/10 hover:border-[#ffc300]'}`} 
                                title="Sepete Ekle"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                              <button 
                                disabled={isOutOfStock} 
                                onClick={() => handleBuy(p, currentPrice)} 
                                className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-black text-xs uppercase tracking-widest shadow-lg ${isOutOfStock ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-[#ff4181] hover:bg-white text-white hover:text-black shadow-[#ff4181]/20 hover:shadow-white/20 hover:scale-105'}`}
                              >
                                Satın Al
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                }) : (
                  <div className="col-span-full text-center text-gray-500 py-10 bg-[#0d0d12] border border-dashed border-white/5 rounded-3xl">
                    {searchQuery ? "Aradığınız kriterlere uygun ürün bulunamadı." : "Henüz vitrine resmi ürün eklenmemiş."}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itemsatis' && (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                {filteredItemsatis.length > 0 ? filteredItemsatis.map((p, i) => (
                  <RevealOnScroll key={p.id} delay={i * 50}>
                    <div onClick={() => window.open(p.link, '_blank')} className={`group relative overflow-hidden bg-[#0d0d12] border border-white/5 hover:border-[#fb2e00]/30 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(251,46,0,0.1)] hover:-translate-y-2 flex ${viewMode === 'grid' ? 'flex-col h-full' : 'flex-col sm:flex-row'} cursor-pointer`}>
                      <div className={`${viewMode === 'grid' ? 'w-full h-44' : 'w-full sm:w-72 h-44 sm:h-auto'} relative overflow-hidden bg-black/50 border-b border-white/5 flex items-center justify-center shrink-0`}>
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700" alt={p.title} />
                        ) : (
                          <ShoppingCart className="w-12 h-12 text-[#fb2e00]/50" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-gradient-to-b from-transparent to-[#0a0c12]">
                        <div>
                          <span className="text-[10px] font-black text-[#fb2e00] uppercase tracking-widest">{p.category || 'İtemsatış Mağazası'}</span>
                          <h4 className="text-white font-bold text-base mt-2 mb-2 group-hover:text-[#fb2e00] transition-colors line-clamp-2 leading-tight">{p.title}</h4>
                        </div>
                        <div className={`flex items-end justify-between pt-4 border-t border-white/5 mt-5`}>
                          <span className="text-2xl font-black text-white leading-none">{p.price} </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1 group-hover:text-[#fb2e00] transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group-hover:border-[#fb2e00]/30">
                            İncele <ExternalLink className="w-3 h-3"/>
                          </span>
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                )) : (
                  <div className="col-span-full text-center text-gray-500 py-10 bg-[#0d0d12] border border-dashed border-white/5 rounded-3xl">
                    {searchQuery ? "Eşleşen ilan siber ağda bulunamadı." : "Şu an İtemsatış ilanlarına ulaşılamıyor."}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'duyurular' && (
               <div className="max-w-4xl mx-auto space-y-6">
                 {filteredAnnouncements.length > 0 ? filteredAnnouncements.map((ann, i) => {
                   const style = getAnnouncementStyle(ann.type);
                   return (
                     <RevealOnScroll key={ann.id} delay={i * 100}>
                       <div className={`flex flex-col sm:flex-row gap-6 p-6 md:p-8 rounded-[2rem] border ${style.border} ${style.bg} backdrop-blur-md relative overflow-hidden group hover:scale-[1.01] transition-transform`}>
                         <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors"></div>
                         
                         <div className="shrink-0 pt-1">
                           <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10 shadow-inner">
                             {style.icon}
                           </div>
                         </div>
                         
                         <div className="flex-1 relative z-10">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                             <h3 className={`text-lg font-black tracking-tight ${style.titleColor}`}>{ann.title}</h3>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-black/30 px-3 py-1 rounded-full w-fit border border-white/5">
                               {new Date(ann.createdAt).toLocaleDateString('tr-TR')}
                             </span>
                           </div>
                           <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                         </div>
                       </div>
                     </RevealOnScroll>
                   );
                 }) : (
                   <div className="text-center py-20 bg-[#0a0c12]/50 border border-white/5 rounded-3xl">
                     <Megaphone className="w-16 h-16 text-[#0af2ff]/30 mx-auto mb-4" />
                     <h3 className="text-white font-black text-xl mb-2">Arama Sonucu Yok.</h3>
                     <p className="text-gray-500 text-sm max-w-md mx-auto">Girdiğin kriterlere uygun bir duyuru bulunamadı.</p>
                   </div>
                 )}
               </div>
            )}

            {activeTab === 'reviews' && (
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredReviews.length > 0 ? filteredReviews.map((review, i) => (
                   <RevealOnScroll key={review.id} delay={i * 50}>
                     <div className="bg-[#0a0c12] border border-white/5 hover:border-[#ffc300]/30 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:-translate-y-1 flex flex-col h-full">
                       
                       <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                             {review.avatarUrl ? <img src={review.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-500" />}
                           </div>
                           <div className="flex flex-col justify-center">
                             <h4 className="text-sm font-black text-white flex items-center gap-1.5 leading-none mb-1">
                               {review.username} <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                             </h4>
                             <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase leading-none">{review.date}</span>
                           </div>
                         </div>
                         <div className="flex items-center bg-white/5 px-2 py-1.5 rounded-lg border border-white/5">
                           {[...Array(5)].map((_, index) => (
                             <Star key={index} className={`w-3.5 h-3.5 ${index < review.rating ? 'text-[#ffc300] fill-[#ffc300]' : 'text-gray-700'}`} />
                           ))}
                         </div>
                       </div>

                       <div className="flex-1">
                         <p className="text-sm text-gray-300 leading-relaxed font-medium italic mb-4">
                           "{review.comment}"
                         </p>
                       </div>

                       <div className="mt-auto pt-4 bg-black/30 -mx-6 -mb-6 px-6 py-4 border-t border-white/5 flex items-center gap-2">
                         <ShoppingCart className="w-4 h-4 text-[#0af2ff]" />
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SATIN ALINAN: <span className="text-white group-hover:text-[#0af2ff] transition-colors">{review.productName}</span></span>
                       </div>

                     </div>
                   </RevealOnScroll>
                 )) : (
                   <div className="col-span-full text-center py-20 bg-[#0a0c12]/50 border border-white/5 rounded-3xl">
                     <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                     <h3 className="text-white font-black text-xl mb-2">Henüz Rapor Yok</h3>
                     <p className="text-gray-500 text-sm max-w-md mx-auto">Siber karargaha onaylanmış bir istihbarat raporu ulaşmadı.</p>
                   </div>
                 )}
               </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}

export default Market;