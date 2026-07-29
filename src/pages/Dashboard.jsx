import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Terminal, Zap, ShoppingBag, Shield, 
  Clock, ArrowUpRight, Server, ChevronDown, Image 
} from 'lucide-react';

function MainDashboard() {
  const navigate = useNavigate();

  const userData = {
    username: localStorage.getItem('vs_user') || "Ajan",
    plan: "Premium SaaS",
    vsBalance: Number(localStorage.getItem('vs_balance')) || 0 
  };

  // 🎯 SİBER ODAKLANMA: Diğer tüm atıl SaaS'lar hattan düşürüldü, tek şah mühürlendi moruk!
  const activeProcesses = [
    { 
      id: 1, 
      name: "7/24 Canlı Statik/Hareketli Profil Banner Motoru (Live Stats GIF Generator)", 
      status: "Aktif", 
      type: "gaming", 
      uptime: "Render Hazır", 
      icon: <Image className="w-5 h-5 text-[#10b981]" />, 
      color: "#10b981", 
      path: "/saas/live-banner" 
    }
  ];

  // LOG STATE'LERİ
  const [transactions, setTransactions] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  
  // SAYFALAMA STATE
  const [visibleLogCount, setVisibleLogCount] = useState(5); 

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('vs_token');
      if (!token) {
        setIsLoadingLogs(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/economy/wallet/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error("Finansal log hat tüneli çekilemedi kanka:", error);
      } finally {
        setIsLoadingLogs(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleLoadMore = () => {
    setVisibleLogCount(prev => prev + 5); 
  };

  return (
    <div className="min-h-screen bg-[#05060a] font-['Space_Grotesk',sans-serif] text-white p-4 md:p-8 relative selection:bg-[#ffc300]/30 pb-24">
      
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#0af2ff]/5 blur-[180px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10 pt-16">
        
        {/* ÜST BİLGİ PANELİ */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.1em] mb-1 flex items-center gap-3">
              Kontrol <span className="text-[#0af2ff]">Merkezi</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Sistem Çekirdeği Çevrimiçi
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-3 rounded-2xl flex items-center gap-4 shadow-lg">
              <div className="p-2 bg-[#d97706]/10 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-[#d97706]" />
              </div>
              <div className="pr-2">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">VarietyShop</div>
                <div className="text-lg font-black">{userData.vsBalance.toLocaleString('tr-TR')} ₺</div>
              </div>
            </div>

            <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-[#ffc300]/20 p-3 rounded-2xl flex items-center gap-4 shadow-[0_0_20px_rgba(255,195,0,0.1)]">
              <div className="p-2 bg-[#ffc300]/10 rounded-xl">
                <Shield className="w-6 h-6 text-[#ffc300]" />
              </div>
              <div className="pr-4">
                <div className="text-[10px] text-[#ffc300] font-bold uppercase tracking-widest">SaaS Yetkisi</div>
                <div className="text-lg font-black">{userData.plan}</div>
              </div>
            </div>
          </div>
        </header>

        {/* ANA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL VE ORTA KOLON */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0a0c12]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                <Activity className="w-8 h-8 text-[#0af2ff] mb-4" />
                <div className="text-3xl font-black mb-1">{activeProcesses.filter(p => p.status === 'Aktif' || p.status === 'Çevrimiçi' || p.status === 'Senkronize' || p.status === 'İşleniyor').length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Aktif Enjeksiyon</div>
              </div>
              <div className="bg-[#0a0c12]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                <Zap className="w-8 h-8 text-[#ffc300] mb-4" />
                <div className="text-3xl font-black mb-1">{activeProcesses.length} SaaS</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Bulut Otomasyonu</div>
              </div>
              <div className="bg-[#0a0c12]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                <Server className="w-8 h-8 text-[#10b981] mb-4" />
                <div className="text-3xl font-black mb-1">99.9%</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Sunucu Sağlığı</div>
              </div>
            </div>

            <div className="bg-[#0a0c12]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Server className="w-6 h-6 text-gray-400" />
                  SaaS Komuta Paneli Haritası ({activeProcesses.length})
                </h2>
              </div>

              {/* SaaS Süreç Listesi Aracı */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar">
                {activeProcesses.map((proc) => (
                  <div 
                    key={proc.id} 
                    onClick={() => navigate(proc.path)} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 cursor-pointer transition-all gap-4 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/50 border border-white/5 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                        {proc.icon}
                      </div>
                      <div>
                        <div className="font-black tracking-wide text-lg leading-tight group-hover:text-[#0af2ff] transition-colors">{proc.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-2 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: proc.color }}></span>
                          Uptime: {proc.uptime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:w-1/3 justify-end shrink-0" onClick={(e) => e.stopPropagation()}>
                      <div className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border whitespace-nowrap" style={{ color: proc.color, borderColor: `${proc.color}40`, backgroundColor: `${proc.color}10` }}>
                        {proc.status}
                      </div>
                      
                      <button 
                        onClick={() => navigate(proc.path)} 
                        className="text-gray-500 hover:text-white transition-colors p-1"
                        title="Modülü Yönet"
                      >
                        <ArrowUpRight className="w-5 h-5 group-hover:text-[#0af2ff] transition-colors" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAĞ KOLON */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#0a0c12] to-black border border-white/5 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-sm text-gray-500 font-black uppercase tracking-widest mb-6">Hızlı Aksiyonlar</h3>
              
              <div className="space-y-3">
                <button onClick={() => navigate('/market')} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#0af2ff]/50 hover:bg-[#0af2ff]/10 group transition-all">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-gray-400 group-hover:text-[#0af2ff] transition-colors" />
                    <span className="font-bold text-sm tracking-wide group-hover:text-white text-gray-300">Yeni Sipariş (Market)</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#0af2ff]" />
                </button>

                <button onClick={() => navigate('/market')} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/50 hover:bg-white/10 group transition-all">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="font-bold text-sm tracking-wide group-hover:text-white text-gray-300">SaaS Lisansı Satın Al</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                </button>
              </div>
            </div>

            {/* SİSTEM LOGLARI PANELİ */}
            <div className="bg-[#0a0c12]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-sm text-gray-500 font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Sistem Logları
              </h3>
              
              {isLoadingLogs ? (
                <div className="text-center py-8 text-[#0af2ff] font-bold animate-pulse text-sm uppercase tracking-widest">
                  Veriler Çekiliyor...
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-bold text-sm uppercase tracking-widest border border-dashed border-white/10 rounded-2xl">
                  Siber Ağda İz Yok
                </div>
              ) : (
                <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:to-transparent pb-4">
                  
                  {transactions.slice(0, visibleLogCount).map((t, index) => {
                    const isExpense = t.amount < 0;
                    const dotColor = isExpense ? 'bg-[#fb2e00]' : 'bg-[#10b981]';
                    const shadowColor = isExpense ? 'shadow-[0_0_10px_rgba(251,46,0,0.5)]' : 'shadow-[0_0_10px_rgba(16,185,129,0.5)]';
                    const amountColor = isExpense ? 'text-[#fb2e00]' : 'text-[#10b981]';

                    return (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-fade-in">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#0a0c12] ${dotColor} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${shadowColor} z-10`}></div>
                        
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] pl-4 md:pl-0 md:group-odd:pr-4 md:group-even:pl-4">
                          <div className="flex flex-col bg-white/5 border border-white/5 p-3 rounded-2xl hover:bg-white/10 transition-colors">
                            <span className="text-[10px] text-gray-500 font-mono mb-1">
                              {new Date(t.createdAt).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-sm font-bold text-gray-300 leading-tight mb-1">{t.description}</span>
                            <span className={`text-[11px] font-black tracking-widest uppercase ${amountColor}`}>
                              {t.amount > 0 ? '+' : ''}{t.amount} ₺
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {visibleLogCount < transactions.length && (
                    <div className="relative z-10 flex justify-center pt-4 md:!mt-8">
                      <button 
                        onClick={handleLoadMore}
                        className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                      >
                        <ChevronDown className="w-4 h-4" /> Daha Eski Kayıtlar
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;