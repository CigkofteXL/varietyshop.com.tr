import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRight, ShieldCheck, Zap, Info, Clock, Coins, 
  Send, Code, AlertTriangle, CheckCircle2, Bell, RefreshCw,
  Search, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';

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

function Exchange() {
  // FORM VE SEÇİM STATE'LERİ
  const [codeType, setCodeType] = useState('steam');
  const [epinCode, setEpinCode] = useState('');
  const [nominalValue, setNominalValue] = useState('');
  const [userNote, setUserNote] = useState('');
  const [calculatedBalance, setCalculatedBalance] = useState(0);
  
  // ARAMA VE SAYFALAMA STATE'LERİ
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // DURUM VE CANLI VERİ STATE'LERİ
  const [exchangeStatus, setExchangeStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeHistory, setExchangeHistory] = useState([]); // Canlı geçmiş verisi

  // API TABANLI SİBER ADRESİMİZ
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/economy/exchange`;

  const epinTypes = {
    steam: { name: 'Steam Cüzdan Kodu', rate: 0.80 },
    razer: { name: 'Razer Gold PIN', rate: 0.85 },
    valorant: { name: 'Valorant VP (Riot)', rate: 0.82 },
    lol: { name: 'League of Legends RP', rate: 0.82 },
    pubg: { name: 'PUBG Mobile UC', rate: 0.80 },
    roblox: { name: 'Roblox Robux Kartı', rate: 0.75 },
    googleplay: { name: 'Google Play Kodu', rate: 0.75 },
    apple: { name: 'Apple / App Store Kodu', rate: 0.75 },
    psn: { name: 'PlayStation Network (PSN)', rate: 0.78 },
    xbox: { name: 'Xbox Game Pass / Cüzdan', rate: 0.78 },
    nintendo: { name: 'Nintendo eShop Card', rate: 0.70 },
    netflix: { name: 'Netflix Hediye Kartı', rate: 0.75 },
    spotify: { name: 'Spotify Premium Kodu', rate: 0.70 },
    discord: { name: 'Discord Nitro (Gift)', rate: 0.75 },
    amazon: { name: 'Amazon Hediye Kartı', rate: 0.80 },
    trendyol: { name: 'Trendyol Hediye Çeki', rate: 0.75 },
    twitch: { name: 'Twitch Gift Card / Bits', rate: 0.70 },
    eaplay: { name: 'EA Play / FC Points', rate: 0.78 },
    freefire: { name: 'Free Fire Diamonds', rate: 0.75 },
    steamskin: { name: 'Steam Skin / Envanter', rate: 0.70 }
  };

  // ====================================================================
  // 🛰️ API AKSİYONU 1: KULLANICININ TAKAS GEÇMİŞİNİ CANLI ÇEKME
  // ====================================================================
  const fetchExchangeHistory = async () => {
    try {
      const token = localStorage.getItem('vs_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/my-requests`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExchangeHistory(data);
      }
    } catch (error) {
      console.error("Takas istihbaratı çekilemedi:", error);
    }
  };

  // Sayfa açıldığında canlı verileri yükle
  useEffect(() => {
    fetchExchangeHistory();
  }, []);

  const filteredEpinEntries = Object.entries(epinTypes).filter(([key, value]) =>
    value.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sayfalama Hesaplamaları
  const totalPages = Math.ceil(filteredEpinEntries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEpins = filteredEpinEntries.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const val = parseFloat(nominalValue) || 0;
    const currentRate = epinTypes[codeType]?.rate || 0.70;
    setCalculatedBalance((val * currentRate).toFixed(2));
  }, [nominalValue, codeType]);

// ====================================================================
  // 🚀 API AKSİYONU 2: BACKEND HAVUZUNA YENİ TAKAS TALEBİ FIRLATMA
  // ====================================================================
  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    
    if (!epinCode.trim() || !nominalValue || nominalValue <= 0) {
      alert("Lütfen tüm siber verileri eksiksiz ve doğru girin!");
      return;
    }

    setIsLoading(true);
    setExchangeStatus({ type: 'processing', message: 'Verileriniz şifreleniyor ve takas doğrulama havuzuna aktarılıyor...' });

    try {
      const token = localStorage.getItem('vs_token');
      
      // 🚨 SİBER KORUMA: Token yoksa isteği hiç fırlatma, kullanıcıyı uyar!
      if (!token || token === "null" || token === "undefined") {
        setExchangeStatus({ 
          type: 'error', 
          message: 'Siber oturum kartınız bulunamadı! Lütfen karargaha tekrar giriş yapıp takas talebi oluşturun.' 
        });
        setIsLoading(false);
        return;
      }
      
      // Operasyon notu varsa kodun yanına fiyakalı bir ekleme yapıyoruz
      const combinedPayloadCode = userNote.trim() 
        ? `${epinCode.toUpperCase()} (Ajan Notu: ${userNote})` 
        : epinCode.toUpperCase();

      const response = await fetch(`${API_BASE_URL}/request`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Artık kesinlikle dolu gidiyor
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          CodeOrItem: combinedPayloadCode,
          Platform: epinTypes[codeType]?.name || codeType,
          EstimatedValue: parseFloat(calculatedBalance)
        })
      });

      if (response.ok) {
        setExchangeStatus({ 
          type: 'success', 
          message: `Takas talebiniz başarıyla siber kuyruğa alındı. Belirlenen net tutar (${calculatedBalance} ₺), kod doğrulama işlemi biter bitmez cüzdanınıza mühürlenecektir.` 
        });
        
        setEpinCode('');
        setNominalValue('');
        setUserNote('');
        
        fetchExchangeHistory();
      } else {
        const errorText = await response.text();
        setExchangeStatus({ type: 'error', message: `Talep reddedildi: ${errorText || "Siber ağ hatası."}` });
      }
    } catch (error) {
      setExchangeStatus({ type: 'error', message: "Merkez üssüne bağlanılamadı. Siber bağlantınızı kontrol edin." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-40 relative min-h-screen bg-[#050508] font-['Space_Grotesk',sans-serif]">
      
      {/* SİBER TAKAS MODALI */}
      {exchangeStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${exchangeStatus.type === 'success' ? 'border-[#10b981]/50 bg-[#0d0d12]' : 'border-[#ff4181]/50 bg-[#0d0d12]'}`}>
            <div className="relative z-10">
              <h3 className={`text-2xl font-black mb-4 flex items-center gap-2 ${exchangeStatus.type === 'success' ? 'text-[#10b981]' : exchangeStatus.type === 'error' ? 'text-[#ff4181]' : 'text-[#0af2ff] animate-pulse'}`}>
                {exchangeStatus.type === 'success' ? <CheckCircle2 /> : <RefreshCw className={exchangeStatus.type === 'processing' ? "animate-spin" : ""} />}
                {exchangeStatus.type === 'success' ? 'HAVUZA İLETİLDİ' : exchangeStatus.type === 'error' ? 'HATA OLUŞTU' : 'ŞİFRELENİYOR...'}
              </h3>
              <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">{exchangeStatus.message}</p>
              
              {exchangeStatus.type === 'success' && (
                <div className="bg-[#10b981]/10 border border-dashed border-[#10b981]/30 p-5 rounded-2xl mb-8 flex items-center gap-4">
                  <div className="p-3 bg-[#10b981]/20 rounded-xl"><Bell className="w-6 h-6 text-[#10b981]" /></div>
                  <div>
                    <div className="text-[10px] text-[#10b981] font-black uppercase tracking-[0.2em]">MANUEL ONAL SÜRECİ</div>
                    <div className="text-gray-300 text-xs mt-1 font-medium">Yöneticiler kodu doğruladığında işlem geçmişiniz güncellenir.</div>
                  </div>
                </div>
              )}

              {!isLoading && (
                <button onClick={() => setExchangeStatus(null)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all uppercase tracking-widest text-xs">
                  Terminali Kapat
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BANNER */}
      <section className="relative h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050508] z-10"></div>
        <RevealOnScroll>
          <div className="relative z-10 text-center px-6 mt-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0af2ff]/10 border border-[#0af2ff]/20 rounded-full mb-6">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#0af2ff]" />
              <span className="text-[10px] font-bold text-[#0af2ff] uppercase tracking-widest">Siber Takas Çekirdeği</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">E-PIN <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0af2ff] to-[#ff4181]">EXCHANGE</span></h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto font-medium">Kullanmadığın dijital varlıkları ve kodları anında VarietyShop cüzdan bakiyesine dönüştür.</p>
          </div>
        </RevealOnScroll>
      </section>

      {/* ANA PANEL */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL TARAF: TAKAS PROSEDÜRÜ */}
          <div className="space-y-6">
            <div className="bg-[#0d0d12]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 shadow-2xl">
              <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#ff4181]" /> TAKAS PROSEDÜRÜ
              </h3>
              <ul className="space-y-4 text-xs text-gray-400 font-medium">
                <li className="flex gap-3">
                  <span className="text-[#0af2ff] font-bold">01.</span>
                  <span>Gönderdiğiniz kodlar sistem yöneticileri tarafından ilgili platformlarda manuel olarak test edilir.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0af2ff] font-bold">02.</span>
                  <span>Kullanılmış, hatalı veya süresi geçmiş kodların gönderilmesi durumunda hesap siber incelemeye alınabilir.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#0af2ff] font-bold">03.</span>
                  <span>Her kod türünün kendine has takas çarpanı (makas aralığı) mevcuttur. Kazanacağınız bakiye anlık hesaplanır.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0a0c12] border border border-white/5 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Ort. İşlem Süresi</div>
                <div className="text-2xl font-black text-[#ffc300] mt-1 flex items-center gap-1.5"><Clock className="w-5 h-5" /> 15 Dakika</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest font-mono">Güvenlik Seviyesi</div>
                <div className="text-xs font-black text-[#10b981] mt-2 bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> MAKSİMUM
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ TARAF: DETAYLI TAKAS FORMU */}
          <div className="lg:col-span-2">
            <div className="bg-[#0d0d12]/80 backdrop-blur-2xl border border-[#0af2ff]/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0af2ff]/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <form onSubmit={handleExchangeSubmit} className="space-y-6">
                
                {/* 1. KOD TÜRÜ SEÇİMİ VE SİBER ARAMA MOTORU */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Varlık Türünü Seçin ({filteredEpinEntries.length} Eşleşme)</label>
                    
                    <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 text-gray-500 mr-2" />
                      <input 
                        type="text"
                        placeholder="Varlık Ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-white text-[11px] font-bold uppercase outline-none placeholder-gray-600"
                      />
                    </div>
                  </div>

                  {currentEpins.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-white/5 bg-black/20 p-3 rounded-2xl">
                      {currentEpins.map(([key, value]) => (
                        <button
                          type="button"
                          key={key}
                          onClick={() => setCodeType(key)}
                          className={`p-3 rounded-xl border text-center transition-all ${codeType === key ? 'border-[#0af2ff] bg-[#0af2ff]/10 text-[#0af2ff]' : 'border-white/5 bg-white/[0.01] text-gray-400 hover:text-white hover:border-white/10'}`}
                        >
                          <Coins className="w-4 h-4 mx-auto mb-1.5 opacity-80" />
                          <div className="text-[11px] font-black tracking-tight line-clamp-1 leading-tight">{value.name}</div>
                          <div className="text-[9px] text-gray-500 font-bold mt-0.5">%{value.rate * 100} Bakiye</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-600 font-bold text-xs py-10 border border-dashed border-white/5 rounded-2xl bg-black/10">
                      Aradığınız kriterde bir siber varlık bulunamadı.
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2 mt-3 pr-1">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={`p-1.5 rounded-lg border transition-all ${currentPage === 1 ? 'border-white/5 text-gray-700 cursor-not-allowed' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">
                        SAYFA {currentPage} / {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={`p-1.5 rounded-lg border transition-all ${currentPage === totalPages ? 'border-white/5 text-gray-700 cursor-not-allowed' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. KOD DEĞERİ VE KODUN KENDİSİ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Kodun Değeri (TL)</label>
                    <input 
                      type="number" 
                      placeholder="Örn: 100"
                      value={nominalValue}
                      onChange={(e) => setNominalValue(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white font-bold text-sm outline-none focus:border-[#0af2ff] transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">E-pin / Lisans Kodu</label>
                    <div className="relative flex items-center">
                      <Code className="w-4 h-4 text-gray-500 absolute left-4" />
                      <input 
                        type="text" 
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={epinCode}
                        onChange={(e) => setEpinCode(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white font-mono text-sm tracking-widest outline-none focus:border-[#0af2ff] transition-colors uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* OPERASYON NOTU / AÇIKLAMA ALANI */}
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Operasyon Notu / Özel Açıklama (İsteğe Bağlı)</label>
                  <div className="relative flex items-start">
                    <MessageSquare className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                    <textarea 
                      rows="2"
                      placeholder="Geliştiriciye veya yöneticiye iletmek istediğiniz ek detaylar varsa yazın..."
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs outline-none focus:border-[#0af2ff] transition-colors resize-none font-medium leading-relaxed placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* BAKİYE HESAPLAMA PANELİ */}
                <div className="bg-black/60 border border-dashed border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Hesaplanacak Site Bakiyesi</div>
                    <p className="text-xs text-gray-400 mt-1">Seçtiğiniz varlığın anlık cüzdan karşılığı.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#10b981] tracking-tight">{calculatedBalance} <span className="text-sm">₺</span></span>
                  </div>
                </div>

                {/* GÖNDER BUTONU */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#ff4181] hover:bg-white text-white hover:text-black shadow-lg shadow-[#ff4181]/10 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" /> {isLoading ? 'İşleniyor...' : 'Takas Talebi Oluştur'}
                </button>

              </form>
            </div>
          </div>

        </div>

        {/* ALT KISIM: CANLI TAKAS GEÇMİŞİ */}
        <div className="mt-16">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Takas Talepleriniz</h3>
            <span className="bg-white/5 text-gray-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-white/10 font-mono">ARŞİV</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0d0d12]/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-gray-500 text-[10px] font-black uppercase tracking-widest font-mono">
                  <th className="p-4">Talep ID</th>
                  <th className="p-4">Tarih</th>
                  <th className="p-4">Varlık Türü</th>
                  <th className="p-4">Kazanılacak Bakiye</th>
                  <th className="p-4 text-right">Siber Durum</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-gray-300 divide-y divide-white/[0.02]">
                {exchangeHistory.length > 0 ? (
                  exchangeHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-mono text-[#0af2ff] text-[11px]">{row.id.substring(0, 8).toUpperCase()}...</td>
                      <td className="p-4 text-gray-500">{new Date(row.createdAt).toLocaleDateString('tr-TR')}</td>
                      <td className="p-4 text-white font-bold">{row.platform}</td>
                      <td className="p-4 font-black text-[#10b981]">{row.estimatedValue.toFixed(2)} ₺</td>
                      <td className="p-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          row.status === 'Approved' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' :
                          row.status === 'Pending' ? 'bg-[#ffc300]/10 text-[#ffc300] border border-[#ffc300]/20 animate-pulse' :
                          'bg-[#ff4181]/10 text-[#ff4181] border border-[#ff4181]/20'
                        }`}>
                          {row.status === 'Approved' ? 'Onaylandı' : row.status === 'Pending' ? 'İncelemede' : 'Reddedildi'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-600 font-bold">
                      Henüz geçmiş bir takas aktiviteniz bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Exchange;