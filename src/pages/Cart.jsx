import React, { useState } from 'react'; 
import { useCart } from './tools/CartContext';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; // 🚨 Link EKLENDİ

export default function Cart() {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); 
  const [legalAccepted, setLegalAccepted] = useState(false); // 🚨 YASAL ONAY STATE'İ EKLENDİ

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Sepetin bomboş komutanım!");
    if (!legalAccepted) return alert("İşleme devam etmek için yasal sözleşmeleri onaylamanız gerekmektedir.");
    
    if (!window.confirm(`Toplam ${getCartTotal()} ₺ cüzdanınızdan kesilecek. Onaylıyor musunuz?`)) return;

    setIsProcessing(true);
    const token = localStorage.getItem('vs_token');

    try {
      const orderPayload = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/market/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ items: orderPayload }) 
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); 
        clearCart(); 
        window.dispatchEvent(new Event('storage')); 
        navigate('/profile'); 
      } else {
        const errorText = await response.text();
        alert(`Sipariş Başarısız: ${errorText}`);
      }
    } catch (error) {
      console.error("Ödeme hatası:", error);
      alert("Sinyal koptu. Sunucuya ulaşılamıyor.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] pt-32 pb-20 px-4 md:px-8 font-['Space_Grotesk'] text-[#e4e1e9] selection:bg-[#ffc300]/30">
      <div className="max-w-[1200px] mx-auto animate-fade-in">
        
        {/* BAŞLIK */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-[#ffc300]/10 border border-[#ffc300]/30 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-[#ffc300]" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white">Siber <span className="text-[#ffc300]">Sepetim</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-[#10b981]" /> Varietyshop Güvencesiyle Anında Teslimat
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          /* BOŞ SEPET DURUMU */
          <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 rounded-3xl p-16 text-center shadow-xl flex flex-col items-center">
            <ShoppingCart className="w-20 h-20 text-gray-600 mb-6 opacity-20" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Sepetin Bomboş Komutanım</h2>
            <p className="text-sm text-gray-500 mb-8 font-medium">Cephaneliğini doldurmak için markete göz at.</p>
            <button onClick={() => navigate('/market')} className="px-8 py-4 bg-[#ffc300]/10 border border-[#ffc300]/30 text-[#ffc300] hover:bg-[#ffc300] hover:text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center gap-2">
              <Zap className="w-4 h-4" /> Markete Dön
            </button>
          </div>
        ) : (
          /* DOLU SEPET DURUMU */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ÜRÜN LİSTESİ */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg hover:border-[#ffc300]/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl || '/logo/gozlukluborucuk.png'} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-black/50 border border-white/5" />
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">{item.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Kategori: {item.category || 'Dijital Ürün'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Miktar</span>
                      <span className="text-sm font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">{item.quantity}</span>
                    </div>
                    <div className="text-right w-24">
                      <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Fiyat</span>
                      <span className="text-lg font-black text-[#10b981]">{item.price * item.quantity} ₺</span>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="Sepetten Çıkar">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                 <button onClick={clearCart} className="text-[10px] text-gray-500 hover:text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3 h-3" /> Tümünü Temizle
                 </button>
              </div>
            </div>

            {/* ÖDEME ÖZETİ (CHECKOUT PANEL) */}
            <div className="lg:col-span-1">
              <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-[#ffc300]/20 rounded-3xl p-6 shadow-[0_10px_40px_rgba(255,195,0,0.05)] sticky top-28">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Sipariş Özeti</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Ara Toplam</span>
                    <span className="font-mono text-white">{getCartTotal()} ₺</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Siber Vergi / İşlem</span>
                    <span className="font-mono text-[#10b981]">0 ₺</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mb-6 flex justify-between items-end">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ödenecek Tutar</span>
                  <span className="text-3xl font-black text-[#ffc300] leading-none">{getCartTotal()} <span className="text-lg">₺</span></span>
                </div>

                {/* 🚨 YASAL ONAY KUTUCUĞU EKLENDİ */}
                <div className="mb-6 flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <input 
                    type="checkbox" 
                    id="legal-accept"
                    checked={legalAccepted}
                    onChange={(e) => setLegalAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#ffc300] cursor-pointer rounded"
                  />
                  <label htmlFor="legal-accept" className="text-[10px] text-gray-400 leading-relaxed cursor-pointer font-medium select-none">
                    Siparişi onaylayarak; <Link to="/legal/distance-selling" target="_blank" className="text-[#0af2ff] hover:underline">Mesafeli Satış Sözleşmesi</Link>, <Link to="/legal/terms" target="_blank" className="text-[#0af2ff] hover:underline">Kullanım Koşulları</Link>, <Link to="/legal/refund-policy" target="_blank" className="text-[#0af2ff] hover:underline">İptal/İade Politikası</Link> ve <Link to="/legal/privacy" target="_blank" className="text-[#0af2ff] hover:underline">KVKK Metnini</Link> okuduğumu ve kabul ettiğimi onaylıyorum.
                  </label>
                </div>

                {/* 🚨 GÜNCELLENMİŞ BUTON (Checkbox işaretli değilse pasif kalır) */}
                <button 
                  onClick={handleCheckout} 
                  disabled={isProcessing || !legalAccepted}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${(isProcessing || !legalAccepted) ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#ffc300] hover:bg-[#ffea00] text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,195,0,0.4)]'}`}
                >
                  {isProcessing ? 'İŞLEM SAĞLANIYOR...' : 'ÖDEMEYİ TAMAMLA'} <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[9px] text-center text-gray-500 mt-4 uppercase tracking-widest font-bold">
                  İşlem sağlandığında bakiye anında cüzdanınızdan düşülecektir.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}