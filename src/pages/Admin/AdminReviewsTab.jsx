import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Trash2, Star, User, Package, ShieldCheck } from 'lucide-react';

export default function AdminReviewsTab({ showStatus }) {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('vs_token');

  const fetchPendingReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/reviews/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingReviews(data);
      }
    } catch (err) {
      console.error("Yorumlar çekilemedi:", err);
      showStatus('error', 'Yorumlar çekilirken ağ hatası oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleApprove = async (id) => {
    const confirm = window.confirm("Bu yorumu onaylayıp market vitrinine çıkarmak istediğinize emin misiniz?");
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/reviews/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showStatus('success', 'Rapor onaylandı ve vitrine eklendi.');
        // Listeden sil (Artık pending değil)
        setPendingReviews(prev => prev.filter(r => r.id !== id));
      } else {
        showStatus('error', 'Yorum onaylanamadı.');
      }
    } catch (err) {
      showStatus('error', 'Sunucu ile bağlantı kurulamadı.');
    }
  };

  const handleReject = async (id) => {
    const confirm = window.confirm("Bu yorumu kalıcı olarak silmek (reddetmek) istediğinize emin misiniz?");
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showStatus('success', 'Uygunsuz rapor imha edildi.');
        setPendingReviews(prev => prev.filter(r => r.id !== id));
      } else {
        showStatus('error', 'Yorum silinemedi.');
      }
    } catch (err) {
      showStatus('error', 'Sunucu ile bağlantı kurulamadı.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-white/5 bg-[#0a0c12]/50 rounded-3xl">
        <MessageSquare className="w-10 h-10 text-[#a855f7] animate-pulse mb-4" />
        <div className="text-[#a855f7] font-black uppercase tracking-widest text-xs animate-pulse">
          Siber Filtre Taranıyor...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between bg-[#a855f7]/10 border border-[#a855f7]/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.1)]">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-widest">
            <ShieldCheck className="w-6 h-6 text-[#a855f7]" /> Siber Filtre (Onay Bekleyenler)
          </h2>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
            Vitrine çıkmadan önce incelenmesi gereken {pendingReviews.length} rapor var.
          </p>
        </div>
        <button 
          onClick={fetchPendingReviews} 
          className="px-4 py-2 bg-[#a855f7]/20 hover:bg-[#a855f7] text-[#a855f7] hover:text-white rounded-lg border border-[#a855f7]/30 font-black uppercase text-[10px] tracking-widest transition-all"
        >
          Yenile
        </button>
      </div>

      {pendingReviews.length === 0 ? (
        <div className="text-center py-20 bg-black/40 border border-dashed border-white/10 rounded-3xl">
          <CheckCircle2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Filtre Temiz</h3>
          <p className="text-xs text-gray-600 mt-2">Şu an onay bekleyen herhangi bir rapor bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingReviews.map(review => (
            <div key={review.id} className="bg-[#0d0d12] border border-white/10 hover:border-[#a855f7]/50 p-6 rounded-2xl relative transition-colors shadow-lg flex flex-col justify-between">
              
              {/* Üst Bilgi (Ajan ve Ürün) */}
              <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0af2ff]">
                    <User className="w-3.5 h-3.5" /> Ajan: {review.username}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Package className="w-3 h-3 text-[#ff4181]" /> Ürün: <span className="text-gray-300">{review.productName}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="flex gap-0.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[#ffc300] fill-[#ffc300]' : 'text-gray-700'}`} />
                    ))}
                  </div>
                  <span className="text-[9px] text-gray-600 font-black tracking-widest">{review.date}</span>
                </div>
              </div>

              {/* Yorum İçeriği */}
              <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6 text-sm text-gray-300 leading-relaxed font-medium italic">
                "{review.comment}"
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => handleApprove(review.id)}
                  className="flex-1 py-3 bg-[#10b981]/10 hover:bg-[#10b981] text-[#10b981] hover:text-black font-black uppercase tracking-widest text-[10px] rounded-xl border border-[#10b981]/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Onayla ve Yayınla
                </button>
                <button 
                  onClick={() => handleReject(review.id)}
                  className="px-5 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl border border-red-500/30 transition-all flex items-center justify-center gap-2"
                  title="Reddet ve Sil"
                >
                  <Trash2 className="w-4 h-4" /> İmha Et
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}