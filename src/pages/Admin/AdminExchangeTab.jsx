import React, { useState } from 'react';
import { 
  Check, X, Copy, Coins, User, Clock, 
  Terminal, ShieldCheck, HelpCircle, MessageSquare, AlertCircle
} from 'lucide-react';

function AdminExchangeTab({ pendingExchanges, fetchAdminData, showStatus }) {
  const [processingId, setProcessingId] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState({}); // Her satır için bağımsız red sebebi
  const [customAmounts, setCustomAmounts] = useState({}); // Her satır için dinamik bakiye düzenleme

  // --- 📋 E-PIN KODUNU TEK TIKLA SİBER HAFIZAYA ALMA ---
  const handleCopyCode = (code, id) => {
    // Varsa "Ajan Notu:" kısmını ayıklayıp sadece saf kodu kopyalayalım
    const cleanCode = code.split(' (Ajan Notu:')[0];
    navigator.clipboard.writeText(cleanCode);
    showStatus('info', 'E-pin kodu siber hafızaya kopyalandı! Platformda test edin.');
  };

  // ====================================================================
  // 🚀 MERKEZİ AKSİYON: TAKAS TALEBİNİ KARARA BAĞLAMA (APPROVE / REJECT)
  // ====================================================================
  const handleResolveExchange = async (id, action, estimatedValue) => {
    const token = localStorage.getItem('vs_token');
    setProcessingId(id);

    const finalAmount = parseFloat(customAmounts[id]) || estimatedValue;
    const reason = rejectionReasons[id] || "Geçersiz veya kullanılmış e-pin kodu.";

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/economy/exchange/${id}/resolve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Action: action, // "Approve" veya "Reject"
          FinalAmount: finalAmount,
          RejectionReason: action === "Reject" ? reason : null
        })
      });

      if (response.ok) {
        showStatus('success', `Takas talebi mühürlendi! Karar: ${action === "Approve" ? "ONAYLANDI" : "REDDEDİLDİ"}`);
        
        // Temizlik operasyonu
        setRejectionReasons(prev => ({ ...prev, [id]: '' }));
        setCustomAmounts(prev => ({ ...prev, [id]: '' }));
        
        // Üst paneldeki sayaçların ve listelerin anlık güncellenmesi için tetikle
        await fetchAdminData();
      } else {
        const errorText = await response.text();
        showStatus('error', `İşlem başarısız: ${errorText || "Siber ağ hatası."}`);
      }
    } catch (error) {
      showStatus('error', "Merkez üssüyle bağlantı kurulamadı.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-[#0a0c12]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-fade-in relative overflow-hidden">
      
      {/* Üst Fiyakalı Sinyal Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#10b981]" /> E-PIN DARPHANE ODAK NOKTASI
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium">Ajanların nakite çevirmek üzere gönderdiği dijital varlık onay havuzu.</p>
        </div>
        <div className="bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2 rounded-xl text-right">
          <div className="text-[9px] font-black uppercase text-[#10b981] tracking-widest">Bekleyen Sinyal</div>
          <div className="text-xl font-black text-white">{pendingExchanges.length} Adet</div>
        </div>
      </div>

      {/* 🔮 LİSTELEME VE OPERASYON ALANI */}
      {pendingExchanges.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {pendingExchanges.map((req) => {
            // Kodun içindeki ajan notunu ayırıp fiyakalı ekrana basalım
            const hasNote = req.codeOrItem.includes('(Ajan Notu:');
            const pureCode = req.codeOrItem.split(' (Ajan Notu:')[0];
            const agentNote = hasNote ? req.codeOrItem.split('(Ajan Notu:')[1].replace(')', '') : null;

            return (
              <div key={req.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-[#10b981]/30 transition-all flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div>
                  {/* Kart Başlığı */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-white/5 rounded-lg text-gray-400 font-bold text-xs font-mono">
                        {req.platform.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs text-white font-black flex items-center gap-1.5">
                          <User className="w-3 h-3 text-gray-500" /> {req.buyerName}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Tahmini Değer</div>
                      <div className="text-sm font-black text-[#10b981] font-mono">{req.estimatedValue.toFixed(2)} ₺</div>
                    </div>
                  </div>

                  {/* 🔐 E-PIN KOD GÖRÜNTÜLEME VE KOPYALAMA ALANI */}
                  <div className="mb-4">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">İstihbarat Kodu / E-Pin</label>
                    <div className="flex items-center justify-between bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-xs font-black tracking-widest text-[#0af2ff] select-all relative">
                      <span className="truncate pr-8">{pureCode}</span>
                      <button 
                        onClick={() => handleCopyCode(req.codeOrItem, req.id)}
                        className="p-1.5 bg-white/5 hover:bg-[#0af2ff]/20 text-gray-400 hover:text-[#0af2ff] rounded-md transition-colors absolute right-2"
                        title="Kodu Kopyala"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ajan Notu Varsa Göster */}
                  {agentNote && (
                    <div className="mb-4 bg-[#ff4181]/5 border border-dashed border-[#ff4181]/20 p-3 rounded-xl flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#ff4181] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-black text-[#ff4181] uppercase tracking-widest block">Müşteri Operasyon Notu</span>
                        <p className="text-gray-400 text-xs mt-0.5 font-medium leading-relaxed">{agentNote}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🛠️ KARAR VE SEÇENEK ŞALTERLERİ PANELİ */}
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5">
                  
                  {/* ONAYLAMA ALANI (FİYAT DÜZENLEME) */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="col-span-2 relative">
                      <span className="absolute left-3 top-2 text-[10px] font-black text-gray-600 uppercase font-mono">₺ VERİLCEK:</span>
                      <input 
                        type="number"
                        placeholder={req.estimatedValue}
                        value={customAmounts[req.id] || ''}
                        onChange={(e) => setCustomAmounts({ ...customAmounts, [req.id]: e.target.value })}
                        className="w-full bg-black/50 border border-white/5 rounded-xl py-1.5 pl-20 pr-3 text-right text-xs font-mono font-black text-white focus:border-[#10b981] outline-none transition-colors"
                      />
                    </div>
                    <button
                      disabled={processingId !== null}
                      onClick={() => handleResolveExchange(req.id, 'Approve', req.estimatedValue)}
                      className="w-full py-2 bg-[#10b981] hover:bg-[#0d9668] text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <Check className="w-3.5 h-3.5" /> ONAYLA
                    </button>
                  </div>

                  {/* REDDETME ALANI (SEBEP GİRİŞİ) */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="col-span-2 relative">
                      <input 
                        type="text"
                        placeholder="Red sebebi yazın (İsteğe bağlı)..."
                        value={rejectionReasons[req.id] || ''}
                        onChange={(e) => setRejectionReasons({ ...rejectionReasons, [req.id]: e.target.value })}
                        className="w-full bg-black/50 border border-white/5 rounded-xl py-1.5 px-3 text-xs font-medium text-gray-300 placeholder-gray-700 focus:border-[#ff4181] outline-none transition-colors"
                      />
                    </div>
                    <button
                      disabled={processingId !== null}
                      onClick={() => handleResolveExchange(req.id, 'Reject', req.estimatedValue)}
                      className="w-full py-2 bg-[#ff4181] hover:bg-[#d82a63] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <X className="w-3.5 h-3.5" /> REDDET
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Bekleyen kod yoksa fiyakalı boş ekran */
        <div className="text-center py-16 border border-dashed border-white/5 bg-black/10 rounded-2xl flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-500 mb-4 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-[#10b981]" />
          </div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest">Sinyal Temiz kanka!</h4>
          <p className="text-gray-500 text-xs mt-1 font-medium">Şu an havuzda bekleyen veya onaylanmamış hiçbir e-pin kalmadı. Para kasada!</p>
        </div>
      )}

    </div>
  );
}

export default AdminExchangeTab;