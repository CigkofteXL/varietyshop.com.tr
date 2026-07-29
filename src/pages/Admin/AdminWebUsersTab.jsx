import React, { useState } from 'react';
import { User, Ban, ShieldCheck, CreditCard, UserX, Eye, Terminal, Clock, Smartphone,X } from 'lucide-react';

export default function WebUsersTab({ webUsers, fetchAdminData, showStatus }) {
  const [logs, setLogs] = useState([]);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState('');

  // 🚨 İSTİHBARAT: Logları Çek
  const fetchUserLogs = async (id, username) => {
    const token = localStorage.getItem('vs_token');
    try {
      // 🚨 BURADA undefined OLMAMASI İÇİN u.id KULLANIYORUZ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/system/users/${id}/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
        setSelectedUsername(username);
        setIsLogsOpen(true);
      } else { showStatus('error', 'Loglara ulaşılamadı.'); }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  const handleUpdateBalance = async (username, id) => {
    const amountStr = prompt(`@${username} kullanıcısının YENİ bakiyesi ne olsun?`);
    if (!amountStr) return;
    const newBalance = parseFloat(amountStr);
    if (isNaN(newBalance)) { alert("Geçersiz miktar!"); return; }
    
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}/balance-override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newBalance: newBalance, reason: "Root manuel düzenleme" })
      });
      if (response.ok) { showStatus('success', 'Bakiye güncellendi.'); fetchAdminData(); } 
      else { showStatus('error', await response.text()); }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  // 🚨 GÜVENLİK: BANLA / BAN KALDIR
  const handleToggleBan = async (username, id, isBanned) => {
    const action = isBanned ? "banı kaldırmak" : "banlamak (uzaklaştırmak)";
    if(!window.confirm(`@${username} kullanıcısını ${action} istiyor musun?`)) return;
    
    const token = localStorage.getItem('vs_token');
    const reason = isBanned ? "" : prompt("Ban sebebi girin (Boş bırakabilirsiniz):");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/system/users/${id}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(reason || "Kural İhlali")
      });
      if (response.ok) { 
        showStatus('success', `Ajan durumu güncellendi.`); 
        fetchAdminData(); 
      } else { showStatus('error', await response.text()); }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  return (
    <>
      <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl animate-fade-in">
        <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
          <User className="text-[#0af2ff]" /> İstihbarat & Müşteri Yönetimi
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
              <tr>
                <th className="p-3">Kullanıcı</th>
                <th className="p-3">Bakiye</th>
                <th className="p-3">Son IP</th>
                <th className="p-3">Durum</th>
                <th className="p-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {webUsers.map(u => (
                // 🚨 KEY OLARAK u.id KULLANILIYOR
                <tr key={u.id} className={`hover:bg-white/[0.02] ${u.isBanned ? 'bg-red-500/5' : ''}`}>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    @{u.username}
                    {u.isBanned && <Ban className="w-3 h-3 text-red-500" title={`Banlı: ${u.banReason}`} />}
                    {(u.role === 'Admin' || u.role === 'Founder') && <ShieldCheck className="w-3 h-3 text-[#fb2e00]" title="Yetkili" />}
                  </td>
                  <td className="p-3 font-mono font-black text-[#10b981]">{u.balance} ₺</td>
                  <td className="p-3 font-mono text-gray-400 text-xs">{u.lastLoginIp || 'Kayıt yok'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${u.isBanned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {u.isBanned ? 'BANLI' : 'AKTİF'}
                    </span>
                  </td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    {/* 🚨 BUTONLARDA u.userId YERİNE u.id GÖNDERİLİYOR */}
                    <button onClick={() => fetchUserLogs(u.id, u.username)} className="p-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Logları Gör"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleUpdateBalance(u.username, u.id)} className="p-1.5 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-black rounded-lg transition-colors" title="Bakiye Düzenle"><CreditCard className="w-4 h-4" /></button>
                    
                    {u.role !== 'Founder' && (
                      <button onClick={() => handleToggleBan(u.username, u.id, u.isBanned)} className={`p-1.5 rounded-lg transition-colors ${u.isBanned ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`} title={u.isBanned ? "Banı Kaldır" : "Banla"}>
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {webUsers.length === 0 && (
                <tr><td colSpan="5" className="text-center p-6 text-gray-500 text-xs font-bold uppercase tracking-widest">Kayıtlı müşteri yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚨 LOG MODALI */}
      {isLogsOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="max-w-lg w-full bg-[#0d0d12] border border-blue-500/30 rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setIsLogsOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-black text-blue-500 mb-6 uppercase tracking-widest flex items-center gap-2"><Terminal className="w-5 h-5"/> @{selectedUsername} - Siber İzler</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="p-4 bg-black/50 border border-white/5 rounded-xl flex items-start gap-3 hover:border-blue-500/30 transition-colors">
                  <div className="mt-1"><Smartphone className="w-4 h-4 text-gray-600" /></div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span className="font-mono text-blue-400">{log.ipAddress}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.loginDate).toLocaleString('tr-TR')}</span>
                    </div>
                    <p className="text-xs text-gray-300 font-mono break-all">{log.deviceInfo}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-500 text-xs font-bold tracking-widest uppercase">
                  Bu ajana ait log kaydı bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}