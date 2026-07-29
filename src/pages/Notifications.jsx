import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, CheckCircle2, AlertTriangle, Info, CheckCheck, X, Copy, Terminal, ChevronRight, Star } from 'lucide-react';
// 🚨 DİKKAT: NotificationContext dosyanın nerede olduğuna göre bu yolu düzelt! (Örn: '../context/NotificationContext')
import { useNotifications } from './tools/NotificationContext'; 

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🚨 SIDE PANEL İÇİN STATE'LER
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // 🚨 YENİ: Context'ten modal açma motorunu çağırıyoruz
  const { openReview } = useNotifications();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('vs_token'); 
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Siber bildirimler çekilemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const token = localStorage.getItem('vs_token');
    if (!token) return;

    setNotifications(notifications.map(n => ({ ...n, read: true })));

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Okundu işaretleme hatası:", error);
    }
  };

  // 🚨 TEK BİR BİLDİRİME TIKLANDIĞINDA ÇALIŞACAK MOTOR
  const handleNotifClick = async (notif) => {
    setSelectedNotif(notif);
    setIsPanelOpen(true); // Paneli aç

    // Eğer zaten okunmuşsa bir şey yapma
    if (notif.read) return;

    // Ekranda anında okundu yap
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));

    // Arka planda DB'yi güncelle
    const token = localStorage.getItem('vs_token');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/notifications/${notif.id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Tekli okundu işaretleme hatası:", error);
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedNotif(null), 300); // Animasyon bitince veriyi sil
  };

  const getIcon = (type) => {
    if(type === 'success') return <CheckCircle2 className="w-5 h-5 text-[#10b981]" />;
    if(type === 'warning') return <AlertTriangle className="w-5 h-5 text-[#ffc300]" />;
    return <Info className="w-5 h-5 text-[#0af2ff]" />;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("İçerik siber panoya kopyalandı!");
  };

  return (
    <div className="min-h-screen bg-[#07070a] pt-32 pb-20 px-4 md:px-8 font-['Space_Grotesk'] text-[#e4e1e9] relative overflow-x-hidden">
      
      {/* 🚀 SİBER YAN PANEL (SIDEBAR) */}
      <div className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Karanlık Arka Plan */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePanel}></div>
        
        {/* Panelin Kendisi */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-[#0a0c12] border-l border-[#a855f7]/30 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transform transition-transform duration-300 ease-out flex flex-col ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {selectedNotif && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0d0d12]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#a855f7]/10 rounded-xl border border-[#a855f7]/20">
                    {getIcon(selectedNotif.type)}
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-widest leading-tight">
                    Sinyal Detayı
                  </h3>
                </div>
                <button onClick={closePanel} className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <h4 className="text-xl font-black text-white mb-6 uppercase tracking-wider">{selectedNotif.title}</h4>
                
                <div className="bg-black/50 border border-white/5 rounded-2xl p-5 mb-6 relative group">
                  <div className="text-[10px] text-[#a855f7] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Şifrelenmiş İçerik
                  </div>
                  <p className="text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedNotif.message}
                  </p>
                  
                  <button 
                    onClick={() => copyToClipboard(selectedNotif.message)} 
                    className="absolute top-4 right-4 p-2 bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30 hover:bg-[#a855f7] hover:text-black rounded-lg transition-all"
                    title="Tümünü Kopyala"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* 🚨 YENİ: EĞER BİLDİRİMİN İÇİNDE PRODUCT ID VARSA DEĞERLENDİR BUTONU ÇIKAR */}
                {selectedNotif.productId && (
                  <button 
                    onClick={() => {
                      if (openReview) {
                        openReview(selectedNotif.productId);
                        closePanel(); // Modalı açarken yan paneli kapatır
                      } else {
                        console.error("openReview fonksiyonu bulunamadı, Context'i kontrol et!");
                      }
                    }}
                    className="w-full py-4 mt-2 bg-[#ffc300]/10 text-[#ffc300] hover:bg-[#ffc300] hover:text-black font-black uppercase tracking-widest text-xs rounded-xl border border-[#ffc300]/30 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,195,0,0.1)]"
                  >
                    <Star className="w-4 h-4" /> İstihbarat (Puan) Bırak
                  </button>
                )}

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-[#0d0d12] flex items-center justify-between">
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Teslimat: {new Date(selectedNotif.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-[800px] mx-auto animate-fade-in relative z-10">
        
        {/* BAŞLIK VE KONTROL PANELİ */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Bell className="w-6 h-6 text-[#a855f7]" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-widest text-white">Bildirim <span className="text-[#a855f7]">Merkezi</span></h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-[#10b981]" /> Siber Ağ Uyarıları
              </p>
            </div>
          </div>
          
          {notifications.some(n => !n.read) && (
            <button onClick={markAllAsRead} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all shadow-lg">
              <CheckCheck className="w-4 h-4" /> Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        {/* BİLDİRİM LİSTESİ */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-[#a855f7] font-black uppercase tracking-widest animate-pulse">
               Sinyaller Taranıyor...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleNotifClick(notif)} // 🚨 TIKLANDIĞINDA PANEL AÇILIR VE OKUNDU OLUR
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${notif.read ? 'bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:bg-white/[0.04]' : 'bg-[#0a0c12] border-[#a855f7]/30 shadow-[0_0_20px_rgba(168,85,247,0.05)] hover:border-[#a855f7]/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1'}`}
              >
                <div className="mt-1 shrink-0 transition-transform group-hover:scale-110">
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-sm font-black uppercase tracking-widest truncate pr-4 ${notif.read ? 'text-gray-400 group-hover:text-gray-300' : 'text-white'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap shrink-0">
                      {new Date(notif.createdAt).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 truncate group-hover:text-[#a855f7] transition-colors">
                    Sinyal içeriğini ve şifreleri görüntülemek için tıklayın...
                  </p>
                </div>

                {!notif.read ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_#a855f7] animate-pulse shrink-0"></div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center p-16 border border-dashed border-white/10 rounded-3xl">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-30" />
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Ağ Sessiz</h3>
              <p className="text-xs font-medium text-gray-600 mt-2">Henüz yeni bir siber sinyal alınmadı.</p>
            </div>
          )}
        </div>
        
        {/* MOBİL İÇİN OKUNDU BUTONU */}
        {notifications.some(n => !n.read) && (
          <button onClick={markAllAsRead} className="w-full mt-4 sm:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
              <CheckCheck className="w-4 h-4" /> Tümünü Okundu İşaretle
          </button>
        )}
        
      </div>
    </div>
  );
}