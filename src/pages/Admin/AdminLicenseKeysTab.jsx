import React, { useState } from 'react';
import { Key, Copy } from 'lucide-react';

export default function LicenseKeysTab({ keysList, fetchAdminData, showStatus }) {
  const [newKey, setNewKey] = useState({ amount: 1, keyType: 'Börü', value: 30 });

  const handleGenerateLicenseKey = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/license/generate-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newKey)
      });
      if (response.ok) {
        showStatus('success', `${newKey.amount} adet siber anahtar üretildi!`);
        fetchAdminData();
      } else showStatus('error', 'Anahtar üretilemedi.');
    } catch (err) { showStatus('error', 'Bağlantı hatası.'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl h-fit">
        <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
          <Key className="w-4 h-4 text-[#f97316]" /> Siber Anahtar Üret
        </h2>
        <form onSubmit={handleGenerateLicenseKey} className="space-y-4">
          <InputBox label="Üretilecek Adet" type="number" value={newKey.amount} onChange={e => setNewKey({...newKey, amount: e.target.value})} />
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">Anahtar Türü</label>
            <select value={newKey.keyType} onChange={e => setNewKey({...newKey, keyType: e.target.value})} className="w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#f97316]/50 font-medium text-xs transition-colors">
              <option value="Börü">Börü Lisansı (Süre Ekler)</option>
              <option value="VC">VC Bakiye (Cüzdana Ekler)</option>
            </select>
          </div>
          <InputBox label={newKey.keyType === 'VC' ? "VC Miktarı" : "Eklenecek Gün"} type="number" value={newKey.value} onChange={e => setNewKey({...newKey, value: e.target.value})} />
          <button type="submit" className="w-full py-4 mt-2 bg-[#f97316]/10 hover:bg-[#f97316] text-[#f97316] hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all">Keyleri Bas</button>
        </form>
      </div>
      <div className="lg:col-span-2 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl">
        <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
          <Key className="text-[#f97316]" /> Üretilen Anahtarlar
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
              <tr><th className="p-3">Anahtar (Key)</th><th className="p-3">Tür</th><th className="p-3">Değer</th><th className="p-3">Durum</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keysList.map(k => (
                <tr key={k.id} className={`hover:bg-white/[0.02] ${k.isUsed ? 'opacity-50' : ''}`}>
                  <td className="p-3 font-mono font-bold text-[#f97316] tracking-widest">
                    {k.key}
                    {!k.isUsed && <button onClick={() => { navigator.clipboard.writeText(k.key); showStatus('success', 'Key kopyalandı!'); }} className="ml-2 text-gray-500 hover:text-white transition-colors" title="Kopyala"><Copy className="w-3 h-3 inline" /></button>}
                  </td>
                  <td className="p-3 text-xs uppercase tracking-widest">{k.keyType}</td>
                  <td className="p-3 font-black text-white">{k.value} {k.keyType === 'VC' ? '₺' : 'Gün'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${k.isUsed ? 'bg-red-500/10 text-red-500' : 'bg-[#10b981]/10 text-[#10b981]'}`}>
                      {k.isUsed ? `Kullanıldı (@${k.usedByUsername})` : 'Bekliyor'}
                    </span>
                  </td>
                </tr>
              ))}
              {keysList.length === 0 && <tr><td colSpan="4" className="text-center p-6 text-gray-500 text-xs font-bold uppercase tracking-widest">Key üretilmedi.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const InputBox = ({ label, type, value, onChange, placeholder, focusColor = "focus:border-[#f97316]/50" }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">{label}</label>
    <input type={type} required value={value} onChange={onChange} placeholder={placeholder} className={`w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none ${focusColor} font-medium text-xs transition-colors`} />
  </div>
);