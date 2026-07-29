import React, { useState, useEffect } from 'react';
import { Power, AlertOctagon, Shield, Trash2, Wrench } from 'lucide-react';

export default function SecurityTab({ showStatus }) {
  const [securityOpts, setSecurityOpts] = useState({ underAttackMode: false });
  const [newBan, setNewBan] = useState({ ip: '', reason: '' });
  const [blacklist, setBlacklist] = useState([]);
  
  // 🚨 BAKIM MODU STATE'İ
  const [isMaintenance, setIsMaintenance] = useState(false);

  // 🚨 SİSTEM BAŞLARKEN ŞALTER DURUMUNU KONTROL ET
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if(data) setIsMaintenance(data.isMaintenanceMode);
      })
      .catch(() => console.error("Siber ayarlar okunamadı."));
  }, []);

  const handleGlobalPause = async () => {
    if(window.confirm("KRİTİK UYARI: Tüm botlar durdurulacak. Onaylıyor musunuz?")) {
      const token = localStorage.getItem('vs_token');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/wov-accounts/global-pause`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) showStatus('success', await response.text());
        else showStatus('error', 'Komut iletilemedi.');
      } catch(err) { showStatus('error', 'Bağlantı hatası.'); }
    }
  };

  const handleBanIp = (e) => {
    e.preventDefault();
    setBlacklist([...blacklist, { id: Date.now(), ip: newBan.ip, reason: newBan.reason, date: new Date().toLocaleDateString() }]);
    showStatus('error', `IP Adresi kara listeye eklendi: ${newBan.ip}`);
    setNewBan({ ip: '', reason: '' });
  };

  // 🚨 BAKIM MODUNU (ŞALTERİ) AÇIP KAPATAN FONKSİYON
  const handleMaintenanceToggle = async () => {
    if(!window.confirm("Sistemi bakım moduna almak/çıkarmak istediğinize emin misiniz?")) return;
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/settings/maintenance/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsMaintenance(data.isMaintenanceMode);
        showStatus('success', data.message);
      } else {
        showStatus('error', 'Şalter yanıt vermedi.');
      }
    } catch(err) {
      showStatus('error', 'Bağlantı hatası.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1 space-y-4">
        
        {/* KİLL SWITCH */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>
          <h2 className="text-sm font-black text-red-500 mb-2 flex items-center gap-2 uppercase tracking-widest relative z-10"><Power className="w-5 h-5" /> GLOBAL KILL SWITCH</h2>
          <p className="text-[10px] text-red-400/80 mb-6 font-bold uppercase tracking-widest leading-relaxed relative z-10">Acil durumda sistemdeki tüm WovAccount (Bot) işlemlerini durdurur.</p>
          <button onClick={handleGlobalPause} className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] relative z-10">TÜM BOTLARI DURDUR</button>
        </div>

        {/* SALDIRI MODU */}
        <div className={`bg-[#0a0c12] border rounded-3xl p-6 shadow-xl transition-all ${securityOpts.underAttackMode ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-white/5'}`}>
          <h2 className="text-sm font-black text-white mb-2 flex items-center gap-2 uppercase tracking-widest"><AlertOctagon className={securityOpts.underAttackMode ? 'text-red-500 animate-pulse' : 'text-gray-500'} /> Saldırı Altında Modu</h2>
          <button onClick={() => { const newVal = !securityOpts.underAttackMode; setSecurityOpts({...securityOpts, underAttackMode: newVal}); showStatus(newVal ? 'error' : 'success', newVal ? 'SALDIRI MODU AKTİF!' : 'Saldırı modu kapatıldı.'); }} className={`w-full mt-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${securityOpts.underAttackMode ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>{securityOpts.underAttackMode ? 'Saldırı Modunu Kapat' : 'Saldırı Modunu Aç'}</button>
        </div>

        {/* 🚨 YENİ: BAKIM MODU (ŞALTER) */}
        <div className={`bg-[#0a0c12] border rounded-3xl p-6 shadow-xl transition-all ${isMaintenance ? 'border-[#0af2ff]/50 shadow-[0_0_30px_rgba(10,242,255,0.15)]' : 'border-white/5'}`}>
          <h2 className="text-sm font-black text-white mb-2 flex items-center gap-2 uppercase tracking-widest">
            <Wrench className={isMaintenance ? 'text-[#0af2ff] animate-spin-slow' : 'text-gray-500'} /> Siber Bakım Modu
          </h2>
          <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-widest leading-relaxed">
            Aktif edildiğinde site müşterilere kapanır, sadece yöneticiler içeride kalır.
          </p>
          <button 
            onClick={handleMaintenanceToggle} 
            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isMaintenance ? 'bg-[#0af2ff] text-black shadow-[0_0_15px_rgba(10,242,255,0.5)]' : 'bg-[#0af2ff]/10 text-[#0af2ff] border border-[#0af2ff]/30 hover:bg-[#0af2ff] hover:text-black'}`}
          >
            {isMaintenance ? 'BAKIM MODUNU KAPAT' : 'SİTEYİ BAKIMA AL'}
          </button>
        </div>

      </div>

      <div className="lg:col-span-2 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col">
        <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2"><Shield className="text-red-500" /> IP Kara Liste</h2>
        <form onSubmit={handleBanIp} className="flex gap-4 mb-6 bg-black/40 p-4 rounded-2xl border border-white/5">
          <input type="text" required value={newBan.ip} onChange={e => setNewBan({...newBan, ip: e.target.value})} placeholder="Engellenecek IP (Örn: 192.168.1.1)" className="flex-1 bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-red-500/50 font-mono text-xs transition-colors" />
          <input type="text" required value={newBan.reason} onChange={e => setNewBan({...newBan, reason: e.target.value})} placeholder="Neden" className="flex-1 bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-red-500/50 font-medium text-xs transition-colors" />
          <button type="submit" className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-red-500/30">Banla</button>
        </form>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
              <tr><th className="p-3">IP Adresi</th><th className="p-3">Neden</th><th className="p-3">Tarih</th><th className="p-3 text-right">İşlem</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blacklist.map(b => (
                <tr key={b.id} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-bold font-mono text-red-400">{b.ip}</td><td className="p-3 text-gray-300 text-xs">{b.reason}</td><td className="p-3 text-gray-500 text-[10px] uppercase font-bold tracking-widest">{b.date}</td>
                  <td className="p-3 text-right"><button onClick={() => setBlacklist(blacklist.filter(item => item.id !== b.id))} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4 text-gray-400 hover:text-white"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}