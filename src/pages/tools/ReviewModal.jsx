import React, { useState } from 'react';
import { Star, X, Send, ShieldAlert } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, productId }) {
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 5) {
      alert("Komutanım, sinyal çok kısa! En az 5 karakter girmelisin.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('vs_token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/market/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        alert("İstihbarat raporu merkeze ulaştı! Onaylandıktan sonra vitrinde görünecek.");
        setComment('');
        setRating(5);
        onClose(); // İşlem bitince modalı kapat
      } else {
        const errText = await res.text();
        alert(`Hata: ${errText}`);
      }
    } catch (err) {
      alert("Ağ bağlantısı koptu. Sinyal gönderilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Arka Plan Karartması */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal İçeriği */}
      <div className="bg-[#0a0c12] border border-[#ff4181]/30 rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-[0_0_50px_rgba(255,65,129,0.15)] animate-fade-in">
        
        {/* Neon Işık */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4181]/20 blur-[50px] pointer-events-none rounded-full"></div>

        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0d0d12]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff4181]/10 rounded-xl flex items-center justify-center border border-[#ff4181]/20">
              <Star className="w-5 h-5 text-[#ff4181]" />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">İstihbarat Bırak</h3>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Ürün Değerlendirmesi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 flex flex-col items-center">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3">Memnuniyet Seviyesi</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-125"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredStar || rating) 
                        ? 'text-[#ffc300] fill-[#ffc300]' 
                        : 'text-gray-700'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <textarea
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#ff4181]/50 transition-all resize-none h-28 font-['Space_Grotesk']"
              placeholder="Ürün hakkındaki detaylı raporunuzu buraya girin..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl mb-6">
            <ShieldAlert className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Yorumlar siber filtreden geçer. Sahte veya küfürlü raporlar anında ban sebebi sayılır.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-[#ff4181]/10 hover:bg-[#ff4181] text-[#ff4181] hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-[#ff4181]/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Gönderiliyor...' : <><Send className="w-4 h-4" /> Raporu Mühürle</>}
          </button>
        </form>
      </div>
    </div>
  );
}