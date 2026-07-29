import React, { useState } from 'react';
import { UploadCloud, Link2, DownloadCloud, Copy } from 'lucide-react';

export default function DeployTab({ downloadLinks, fetchAdminData, showStatus }) {
  const [uploadFile, setUploadFile] = useState(null);
  const [newDownloadLink, setNewDownloadLink] = useState({ maxUses: 1 });

  const handleUploadBot = async (e) => {
    e.preventDefault();
    if(!uploadFile) return showStatus('error', 'Lütfen bir dosya seçin!');
    
    const token = localStorage.getItem('vs_token');
    const formData = new FormData();
    formData.append("file", uploadFile);

    showStatus('info', 'Eklenti sunucuya yükleniyor...');
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/BoruDownload/admin/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if(res.ok) {
            showStatus('success', 'Börü eklentisi başarıyla yüklendi!');
            setUploadFile(null);
        } else {
            showStatus('error', 'Yükleme başarısız.');
        }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  const handleCreateDownloadLink = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vs_token');
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/BoruDownload/admin/create-link?maxUses=${newDownloadLink.maxUses}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) {
            showStatus('success', 'Tek kullanımlık link üretildi!');
            setNewDownloadLink({ maxUses: 1 });
            fetchAdminData();
        } else showStatus('error', 'Link üretilemedi.');
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl h-fit">
            <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
              <UploadCloud className="w-4 h-4 text-[#3b82f6]" /> Sunucuya Eklenti Yükle
            </h2>
            <form onSubmit={handleUploadBot} className="space-y-4">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">Börü Eklentisi (.ZIP Dosyası)</label>
                    <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} accept=".zip,application/zip" className="w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#3b82f6]/50 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#3b82f6]/20 file:text-[#3b82f6] hover:file:bg-[#3b82f6]/30 cursor-pointer" />
                </div>
                <button type="submit" className="w-full py-4 mt-2 bg-[#3b82f6]/10 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Zip Dosyasını Değiştir</button>
            </form>
        </div>

        <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl h-fit">
            <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><Link2 className="w-4 h-4 text-[#10b981]" /> İndirme Linki Üret</h2>
            <form onSubmit={handleCreateDownloadLink} className="space-y-4">
                <InputBox label="Maksimum Kullanım Sınırı" type="number" value={newDownloadLink.maxUses} onChange={e => setNewDownloadLink({...newDownloadLink, maxUses: e.target.value})} placeholder="Örn: 1" focusColor="focus:border-[#10b981]/50" />
                <button type="submit" className="w-full py-4 mt-2 bg-[#10b981]/10 hover:bg-[#10b981] text-[#10b981] hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all">Link Oluştur</button>
            </form>
        </div>
      </div>

      <div className="lg:col-span-2 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col">
        <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2"><DownloadCloud className="text-[#3b82f6]" /> Tek Kullanımlık Linkler & Takipler</h2>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
              <tr><th className="p-3">İndirme Linki</th><th className="p-3">Kullanım</th><th className="p-3">Durum</th><th className="p-3">Son Log (IP / Cihaz)</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {downloadLinks.map((link, i) => {
                const lastLog = link.logs && link.logs.length > 0 ? link.logs[0] : null;
                return (
                <tr key={i} className={`hover:bg-white/[0.02] ${!link.isActive ? 'opacity-50' : ''}`}>
                  <td className="p-3 font-mono text-white text-xs">
                    {link.token}
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/BoruDownload/download/${link.token}`); showStatus('success', 'Bağlantı kopyalandı!'); }} className="ml-2 text-gray-500 hover:text-white transition-colors" title="Linki Kopyala"><Copy className="w-3 h-3 inline" /></button>
                  </td>
                  <td className="p-3 font-mono text-gray-400 text-xs">{link.usedCount} / {link.maxUses}</td>
                  <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${link.isActive ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-red-500/10 text-red-500'}`}>
                          {link.isActive ? 'Aktif' : 'Tükendi'}
                      </span>
                  </td>
                  <td className="p-3 text-[10px] text-gray-400 truncate max-w-[200px]" title={lastLog?.userAgent}>
                      {lastLog ? <span className="font-bold text-red-400">{lastLog.ipAddress}</span> : 'Henüz İndirilmedi'}
                  </td>
                </tr>
              )})}
              {downloadLinks.length === 0 && <tr><td colSpan="4" className="text-center p-6 text-gray-500 text-xs font-bold uppercase tracking-widest">Hiç link üretilmemiş.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const InputBox = ({ label, type, value, onChange, placeholder, focusColor = "focus:border-[#3b82f6]/50" }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">{label}</label>
    <input type={type} required value={value} onChange={onChange} placeholder={placeholder} className={`w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none ${focusColor} font-medium text-xs transition-colors`} />
  </div>
);