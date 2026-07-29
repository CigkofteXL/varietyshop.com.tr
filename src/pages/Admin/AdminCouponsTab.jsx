import React, { useState } from 'react';
import { Ticket, Copy } from 'lucide-react';

export default function CouponsTab({ coupons, fetchAdminData, showStatus }) {
  const [couponAmount, setCouponAmount] = useState('');
  const [couponMaxUsage, setCouponMaxUsage] = useState('1');

  const handleGenerateCoupon = async (e) => {
    e.preventDefault();
    if(couponAmount && !isNaN(couponAmount) && couponMaxUsage && !isNaN(couponMaxUsage)) {
      const code = `BORU-${Math.random().toString(36).substring(2,6).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
      const token = localStorage.getItem('vs_token');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/economy/coupons/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ code: code, amount: parseFloat(couponAmount), maxUsage: parseInt(couponMaxUsage, 10) })
        });
        if (response.ok) {
          showStatus('success', `Kupon oluşturuldu: ${code}`);
          setCouponAmount(''); setCouponMaxUsage('1'); fetchAdminData();
        } else { showStatus('error', await response.text() || 'Kupon hatası.'); }
      } catch (err) { showStatus('error', 'Bağlantı hatası.'); }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl h-fit">
        <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><Ticket className="w-4 h-4 text-[#10b981]" /> E-Pin Oluştur</h2>
        <form onSubmit={handleGenerateCoupon} className="space-y-4">
          <InputBox label="Bakiye Tutarı (₺)" type="number" value={couponAmount} onChange={e => setCouponAmount(e.target.value)} placeholder="Örn: 100" focusColor="focus:border-[#10b981]/50" />
          <InputBox label="Kullanım Hakkı" type="number" value={couponMaxUsage} onChange={e => setCouponMaxUsage(e.target.value)} placeholder="Örn: 1 (Tek Kullanımlık)" focusColor="focus:border-[#10b981]/50" />
          <button type="submit" className="w-full py-4 mt-2 bg-[#10b981]/10 hover:bg-[#10b981] text-[#10b981] hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all">Kod Üret</button>
        </form>
      </div>
      <div className="lg:col-span-2 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Oluşturulan Kuponlar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
              <tr><th className="p-3">Dijital Kod</th><th className="p-3">Değer</th><th className="p-3">Kullanım</th><th className="p-3 text-right">Durum</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((c, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-mono font-bold text-[#0af2ff] tracking-widest">
                    {c.code}
                    <button onClick={() => { navigator.clipboard.writeText(c.code); showStatus('success', 'Kod kopyalandı!'); }} className="ml-2 text-gray-500 hover:text-white transition-colors" title="Kopyala"><Copy className="w-3 h-3 inline" /></button>
                  </td>
                  <td className="p-3 font-black text-white">{c.rewardAmount} ₺</td>
                  <td className="p-3 text-gray-400 font-mono text-xs">{c.currentUsage} / {c.maxUsage}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${c.isActive ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-gray-500/10 text-gray-500'}`}>
                      {c.isActive ? 'Aktif' : 'Tükendi'}
                    </span>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && <tr><td colSpan="4" className="text-center p-6 text-gray-500 text-xs font-bold uppercase tracking-widest border border-dashed border-white/5 rounded-xl">Kupon geçmişi boş.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const InputBox = ({ label, type, value, onChange, placeholder, focusColor = "focus:border-[#0af2ff]/50" }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">{label}</label>
    <input type={type} required value={value} onChange={onChange} placeholder={placeholder} className={`w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none ${focusColor} font-medium text-xs transition-colors`} />
  </div>
);