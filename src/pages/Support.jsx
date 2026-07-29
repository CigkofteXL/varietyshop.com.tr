import React, { useState, useEffect, useRef } from 'react';
import { 
  LifeBuoy, Plus, MessageSquare, Send, X, 
  AlertCircle, CheckCircle2, Clock, ShieldAlert,
  Terminal, ChevronRight, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form ve Mesaj State'leri
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'Normal', initialMessage: '' }); 
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);

  const chatEndRef = useRef(null);
  
  // SİBER GÜVENLİK: Ajanın Rolü nedir?
  const currentUserRole = localStorage.getItem('vs_role') || 'User';
  const isAdmin = currentUserRole === 'Admin' || currentUserRole === 'Founder';

  // Otomatik aşağı kaydırma
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket]);

  // --- GÜVENLİK PROTOKOLÜ (TOKEN KONTROLÜ) ---
  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('vs_token');
    if (!token) {
      handleUnauthorized();
      return null; 
    }
    const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
    try {
      const response = await fetch(url, { ...options, headers });
      if (response.status === 401) {
        handleUnauthorized();
        return null;
      }
      return response;
    } catch (err) {
      console.error("Fetch Error:", err);
      throw err;
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('vs_token');
    localStorage.removeItem('vs_user');
    localStorage.removeItem('vs_role');
    alert("Siber bağlantınız koptu veya oturum süreniz doldu. Lütfen tekrar yetki alınız.");
    navigate('/'); 
  };

  // --- API 1: LİSTEYİ ÇEK ---
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
     const endpoint = isAdmin ? `${import.meta.env.VITE_API_URL}/admin/support/tickets` : `${import.meta.env.VITE_API_URL}/support/tickets`;

      const response = await apiCall(endpoint);
      if (response && response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (err) {
      console.error("Ağ Hatası:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- API 2: TICKET DETAYLARINI ÇEK (MESAJLAR) ---
  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await apiCall(`${import.meta.env.VITE_API_URL}/support/tickets/${ticketId}`);
      if (response && response.ok) {
        const data = await response.json();
        setSelectedTicket(data);
      }
    } catch (err) {
      console.error("Detay çekilemedi", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [navigate]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket({ ...ticket, replies: [] }); 
    fetchTicketDetails(ticket.id);
  };

  // --- API 3: YENİ TİCKET OLUŞTUR ---
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setActionStatus(null);
    
    const requestData = {
        subject: newTicket.subject,
        initialMessage: newTicket.initialMessage
    };

    try {
     const response = await apiCall(`${import.meta.env.VITE_API_URL}/support/tickets/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response && response.ok) {
        setActionStatus({ type: 'success', msg: 'Destek sinyali merkeze ulaştı.' });
        fetchTickets(); 
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setNewTicket({ subject: '', priority: 'Normal', initialMessage: '' });
          setActionStatus(null);
        }, 1500);
      } else if(response) {
        const err = await response.text();
        setActionStatus({ type: 'error', msg: `Sinyal hatası: ${err}` });
      }
    } catch (err) {
      setActionStatus({ type: 'error', msg: 'Bağlantı koptu.' });
    } finally {
      setIsSending(false);
    }
  };

  // --- API 4: TİCKET'A CEVAP YAZ ---
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const response = await apiCall(`${import.meta.env.VITE_API_URL}/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText })
      });

      if (response && response.ok) {
        setReplyText('');
        fetchTicketDetails(selectedTicket.id);
        if(isAdmin) fetchTickets();
      } else if (response) {
          const err = await response.text();
          alert(`Hata: ${err}`);
      }
    } catch (err) {
      alert("Ağ hatası.");
    }
  };

  // --- API 5: TİCKETI KAPAT (YENİ EKLENDİ) ---
  const handleCloseTicket = async () => {
    if (!selectedTicket || selectedTicket.status === 'Closed') return;
    
    const confirmClose = window.confirm("Bu destek frekansını kapatmak istediğinize emin misiniz? Kapalı biletlere cevap yazılamaz.");
    if(!confirmClose) return;

    setIsClosing(true);
    try {
      const response = await apiCall(`${import.meta.env.VITE_API_URL}/support/tickets/${selectedTicket.id}/close`, {
        method: 'POST'
      });

      if (response && response.ok) {
        // UI'ı güncelle
        setSelectedTicket({...selectedTicket, status: 'Closed'});
        fetchTickets(); // Listede de durumu güncellensin
      } else if (response) {
        const err = await response.text();
        alert(`Hata: ${err}`);
      }
    } catch (err) {
      alert("Ağ hatası.");
    } finally {
      setIsClosing(false);
    }
  };

  // Renk ve Stil Yardımcıları
  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'Yüksek': return 'bg-[#fb2e00]/10 text-[#fb2e00] border-[#fb2e00]/30';
      case 'Normal': return 'bg-[#ffc300]/10 text-[#ffc300] border-[#ffc300]/30';
      default: return 'bg-[#0af2ff]/10 text-[#0af2ff] border-[#0af2ff]/30';
    }
  };

  const getStatusStyle = (status) => {
    if(status === 'Open') return 'bg-[#0af2ff]/10 text-[#0af2ff] border-[#0af2ff]/30';
    if(status === 'Answered') return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30';
    if(status === 'Closed') return 'bg-gray-800 text-gray-500 border-gray-700';
    return 'bg-gray-800 text-gray-500 border-gray-700';
  };
  
  const translateStatus = (status) => {
      if(status === 'Open') return 'Açık';
      if(status === 'Answered') return 'Yanıtlandı';
      if(status === 'Closed') return 'Kapalı';
      return status;
  }

  return (
    <div className="min-h-screen bg-[#05060a] font-['Space_Grotesk',sans-serif] text-white p-4 md:p-8 relative selection:bg-[#ff4181]/30 pb-24">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff4181]/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10 pt-20">
        
        {/* HEADER PANELİ */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <LifeBuoy className="text-[#ff4181] w-8 h-8" /> Destek <span className="text-[#ff4181]">Frekansı</span>
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-1 uppercase tracking-widest">
              {isAdmin ? "ROOT YÖNETİM TERMİNALİ" : "Siber Karargah İletişim Terminali"}
            </p>
          </div>

          {!isAdmin && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full md:w-auto py-3 px-6 bg-[#ff4181]/10 hover:bg-[#ff4181] text-[#ff4181] hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-[#ff4181]/30 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,65,129,0.15)] group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Yeni Sinyal Gönder
            </button>
          )}
        </div>

        {/* ANA PANEL (SOL: LİSTE, SAĞ: DETAY) */}
        <div className="bg-[#0a0c12]/90 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[700px]">
          
          {/* SOL KOLON: TİCKET LİSTESİ */}
          <div className={`w-full md:w-1/3 border-r border-white/5 flex flex-col ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 border-b border-white/5 bg-black/20">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> {isAdmin ? "TÜM SİNYALLER" : "Aktif Kanallar"}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
              {isLoading ? (
                <div className="text-center py-10 text-[#ff4181] animate-pulse font-black uppercase tracking-widest text-xs">Bağlanılıyor...</div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                  <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-xs uppercase font-bold tracking-widest">Aktif destek talebi yok.</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedTicket?.id === ticket.id ? 'bg-[#ff4181]/10 border-[#ff4181]/30' : 'bg-[#05060a] border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      {isAdmin ? (
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-white/20 bg-white/5`}>
                              {ticket.creatorName}
                          </span>
                      ) : (
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getPriorityStyle(ticket.priority || 'Normal')}`}>
                            {ticket.priority || 'Normal'}
                          </span>
                      )}
                      
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(ticket.status)}`}>
                        {translateStatus(ticket.status)}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm line-clamp-1 mb-1">{ticket.subject}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 font-mono mt-2">
                      <Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SAĞ KOLON: TİCKET İÇERİĞİ VE MESAJLAŞMA */}
          <div className={`w-full md:w-2/3 flex flex-col bg-[#05060a]/50 ${!selectedTicket ? 'hidden md:flex' : 'flex'}`}>
            {selectedTicket ? (
              <>
                {/* Detay Başlığı */}
                <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-[#0a0c12]">
                  <button onClick={() => setSelectedTicket(null)} className="md:hidden p-2 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white tracking-widest uppercase">{selectedTicket.subject}</h3>
                    <div className="text-[10px] text-gray-500 font-bold flex items-center gap-2 mt-1">
                      Destek ID: <span className="font-mono text-[#0af2ff]">#{selectedTicket.id?.substring(0,8) || 'BEKLEMEDE'}</span>
                    </div>
                  </div>
                  
                  {/* YENİ: BİLETİ KAPAT BUTONU */}
                  {selectedTicket.status !== 'Closed' && (
                    <button 
                      onClick={handleCloseTicket}
                      disabled={isClosing}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/30 flex items-center gap-2"
                      title="Bu frekansı sonlandır"
                    >
                      {isClosing ? <Terminal className="w-3 h-3 animate-pulse"/> : <Lock className="w-3 h-3"/>}
                      Kapat
                    </button>
                  )}
                </div>

                {/* Mesaj Akışı */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar relative">
                  
                  {selectedTicket.replies?.length > 0 ? (
                      selectedTicket.replies.map((reply, i) => {
                        const isMyMessage = (isAdmin && reply.isAdmin) || (!isAdmin && !reply.isAdmin);
                        
                        return (
                        <div key={i} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} relative z-10`}>
                          <div className={`max-w-[85%] rounded-2xl p-5 border ${isMyMessage ? 'bg-[#ff4181]/10 border-[#ff4181]/20 text-white rounded-tr-sm' : 'bg-white/5 border-white/10 text-white rounded-tl-sm'}`}>
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1 ${isMyMessage ? 'text-[#ff4181]' : 'text-gray-400'}`}>
                               {reply.isAdmin ? 'YÖNETİCİ (ROOT)' : `Ajan: ${reply.senderName}`}
                            </div>
                            <p className="text-sm leading-relaxed">{reply.message}</p>
                          </div>
                        </div>
                      )})
                  ) : (
                      <div className="text-center text-gray-600 text-xs font-bold uppercase tracking-widest py-10 animate-pulse">Sinyal Şifreleri Çözülüyor...</div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Cevap Yazma Alanı (Eğer ticket açıksa) */}
                <div className="p-4 border-t border-white/5 bg-[#0a0c12]">
                  {selectedTicket.status === 'Closed' ? (
                    <div className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest py-3">Bu destek frekansı sonlandırılmıştır.</div>
                  ) : (
                    <form 
                      onSubmit={handleReply}
                      className="flex items-center gap-4 bg-black/50 border border-white/10 p-2 rounded-2xl focus-within:border-[#ff4181]/50 transition-colors"
                    >
                      <input 
                        type="text" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Karargaha yanıtınızı iletin..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white px-4 py-2 placeholder-gray-600"
                      />
                      <button 
                        type="submit"
                        disabled={!replyText.trim()}
                        className="w-12 h-12 rounded-xl bg-[#ff4181]/10 hover:bg-[#ff4181] text-[#ff4181] hover:text-black flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5 ml-1" />
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <LifeBuoy className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Siber Destek Masası</h3>
                <p className="text-sm text-gray-500 max-w-sm">Sol taraftan mevcut bir talebi seçin.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* YENİ TİCKET MODALI (Sadece Userlar için) */}
      {isCreateModalOpen && !isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#0d0d12] border border-[#ff4181]/20 rounded-3xl p-8 relative shadow-[0_0_50px_rgba(255,65,129,0.15)]">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
            
            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#ff4181]"/> Merkezle İletişim
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-mono">
              Aşağıdaki formu doldurarak ROOT ekibiyle direkt bağlantı kurabilirsiniz.
            </p>

            {actionStatus && (
              <div className={`mb-6 p-3 rounded-xl flex items-center gap-3 text-xs font-bold border ${actionStatus.type === 'success' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                {actionStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0"/> : <AlertCircle className="w-4 h-4 shrink-0"/>}
                {actionStatus.msg}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 font-black uppercase mb-1 block">Konu Başlığı</label>
                <input 
                  type="text" required maxLength="100"
                  value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#ff4181]/50 text-sm transition-colors"
                  placeholder="Örn: Havuzdaki param aktarılmadı"
                />
              </div>
              
              <div>
                <label className="text-[10px] text-gray-400 font-black uppercase mb-1 block">Öncelik Derecesi</label>
                <select 
                  value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#ff4181]/50 text-sm transition-colors cursor-pointer"
                >
                  <option value="Düşük">Düşük (Soru/Öneri)</option>
                  <option value="Normal">Normal (Hesap İşlemleri)</option>
                  <option value="Yüksek">Yüksek (Ödeme/Ban Sorunu)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#ff4181] font-black uppercase mb-1 block">Durum İzahı</label>
                <textarea 
                  required rows="4" maxLength="1000"
                  value={newTicket.initialMessage} onChange={e => setNewTicket({...newTicket, initialMessage: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#ff4181]/50 text-sm resize-none transition-colors"
                  placeholder="Detayları buraya yazın..."
                ></textarea>
              </div>

              <button 
                type="submit" disabled={isSending}
                className="w-full mt-2 py-4 bg-[#ff4181]/10 hover:bg-[#ff4181] text-[#ff4181] hover:text-black disabled:opacity-50 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,65,129,0.2)]"
              >
                {isSending ? <Terminal className="w-4 h-4 animate-pulse"/> : 'Frekansı Yolla'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Support;