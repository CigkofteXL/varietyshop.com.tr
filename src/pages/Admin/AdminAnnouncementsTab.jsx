import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';

export default function AnnouncementsTab({ fetchAdminData, showStatus }) {
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'Info' });

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/system/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newAnnouncement)
      });
      if (response.ok) {
        showStatus('success', 'Duyuru siber ağa fırlatıldı!');
        setNewAnnouncement({ title: '', content: '', type: 'Info' });
        fetchAdminData();
      } else { showStatus('error', await response.text()); }
    } catch (err) { showStatus('error', 'Bağlantı hatası.'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl h-fit">
        <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><Megaphone className="w-4 h-4 text-[#ff4181]" /> Sinyal Gönder (Duyuru)</h2>
        <form onSubmit={handleAddAnnouncement} className="space-y-4">
          <InputBox label="Başlık" type="text" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} placeholder="Örn: Börü V1.15 Çıktı!" focusColor="focus:border-[#ff4181]/50" />
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">Mesaj İçeriği</label>
            <textarea 
              required 
              value={newAnnouncement.content} 
              onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} 
              className="w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#ff4181]/50 font-medium text-xs transition-colors h-24 resize-none"
            ></textarea>
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">Etiket Türü</label>
            <select 
              value={newAnnouncement.type} 
              onChange={e => setNewAnnouncement({...newAnnouncement, type: e.target.value})} 
              className="w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#ff4181]/50 font-medium text-xs transition-colors"
            >
              <option value="Info">Bilgilendirme</option>
              <option value="Warning">Uyarı</option>
              <option value="Update">Güncelleme</option>
            </select>
          </div>
          <button type="submit" className="w-full py-4 mt-2 bg-[#ff4181]/10 hover:bg-[#ff4181] text-[#ff4181] hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Ağa Fırlat</button>
        </form>
      </div>
      <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl flex items-center justify-center">
         <div className="text-center text-gray-500">
            <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">Siber ağa fırlatılan duyurular Market sekmesinde yayınlanır.</p>
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