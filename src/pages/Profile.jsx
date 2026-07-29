import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Shield, Calendar, Activity, Zap, 
  Settings, Key, CreditCard, X, Box, 
  MessageCircle, LogOut, ChevronRight,
  Users, Copy, CheckCircle2 
} from 'lucide-react';

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  // -- Temel State'ler --
  const [isMe, setIsMe] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // -- İşlem State'ler --
  const [redeemCode, setRedeemCode] = useState('');

  // -- SİBER AYARLAR (SIDE PANEL) STATE'LERİ --
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); 
  
  // Ayar Form State'leri
  const [editData, setEditData] = useState({ bio: '', avatarUrl: '' });
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

  // REFERANS SİSTEMİ STATE'LERİ
  const [referralStats, setReferralStats] = useState({ code: 'YÜKLENİYOR...', count: 0 });
  const [copied, setCopied] = useState(false);

  const userRole = localStorage.getItem('vs_role') || 'User';
  const token = localStorage.getItem('vs_token');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('vs_user');
    const targetUser = username || loggedInUser;
    const viewingSelf = targetUser === loggedInUser;
    setIsMe(viewingSelf);

    if (!token && viewingSelf) { navigate('/login'); return; }

    fetchData(targetUser, viewingSelf);
  }, [username, navigate]);

  // REFERANS BİLGİLERİNİ ÇEKME MOTORU
  useEffect(() => {
    if (isMe && token) {
      fetch(`${import.meta.env.VITE_API_URL}/auth/referral-stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setReferralStats({ 
          code: data.referralCode, 
          count: data.invitedCount,
          invitedList: data.invitedList 
      }))
      .catch(() => console.log("Referans verisi çekilemedi."));
    }
  }, [isMe, token]);

  // TÜM VERİLERİ MERKEZİNDEN ÇEK
  const fetchData = async (targetUser, viewingSelf) => {
    setIsLoading(true);
    try {
      const profileRes = await fetch(viewingSelf 
        ? `${import.meta.env.VITE_API_URL}/profile/me/info` 
        : `${import.meta.env.VITE_API_URL}/profile/nick/${targetUser}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfileData(pData);
        if(viewingSelf) localStorage.setItem('vs_balance', pData.balance);
      }
    } catch (err) {
      console.error("Veri sızıntısı engellendi veya hata oluştu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- KUPON / E-PIN BOZDURMA MOTORU ---
  const handleRedeemCode = async (e) => {
    e.preventDefault();
    if (!redeemCode.trim()) {
        alert("Geçerli bir kod giriniz!");
        return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/economy/coupons/redeem`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(redeemCode)
      });

      if (response.ok) {
        alert("E-Pin başarıyla bozduruldu! Bakiye güncelleniyor...");
        setRedeemCode('');
        fetchData(profileData.username, true); 
        window.dispatchEvent(new Event('storage')); 
      } else {
        const errorText = await response.text();
        alert(errorText || "Kod geçersiz veya daha önce kullanılmış.");
      }
    } catch (err) {
      alert("Merkez bankasına ulaşılamadı. İnternet bağlantınızı kontrol edin.");
    }
  };

  // --- KİMLİK GÜNCELLEME MOTORU ---
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/me/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          bio: editData.bio || profileData.bio, 
          avatarUrl: editData.avatarUrl || profileData.avatarUrl 
        })
      });
      if (res.ok) {
          alert("Profil başarıyla güncellendi.");
          fetchData(profileData.username, true);
      }
    } catch (err) { alert("Güncelleme başarısız."); }
  };

  // --- ŞİFRE DEĞİŞTİRME MOTORU ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/me/security/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(passData)
      });

      if (response.ok) {
        alert("Şifreniz başarıyla güncellendi! Güvenliğiniz için lütfen yeni şifrenizle tekrar giriş yapın.");
        handleLogout(); 
      } else {
        const errorText = await response.text();
        alert(`Hata: ${errorText}`);
      }
    } catch (err) {
      alert("Ağ hatası.");
    }
  };

  // ÇIKIŞ YAP
  const handleLogout = () => {
    localStorage.removeItem('vs_token');
    localStorage.removeItem('vs_user');
    localStorage.removeItem('vs_role');
    localStorage.removeItem('vs_balance');
    navigate('/login');
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/register?ref=${referralStats.code}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !profileData) return <div className="min-h-screen bg-[#0a0b10] flex items-center justify-center text-[#0af2ff] font-black animate-pulse uppercase tracking-[0.3em]">Siber Veriler Ayıklanıyor...</div>;

  return (
    <div className="min-h-screen bg-[#0a0b10] font-['Space_Grotesk',sans-serif] relative pb-32 selection:bg-[#0af2ff]/30 overflow-x-hidden text-gray-200">
      
      {/* GLOBAL ARKA PLAN YUMUŞAK IŞIKLARI (HOME.JSX İLE AYNI) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#0af2ff]/5 blur-[150px] rounded-full mix-blend-screen animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ff4181]/5 blur-[150px] rounded-full mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
      </div>

      {/* 🚀 SİBER AYARLAR YAN PANELİ */}
      <div className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
        
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-[#0d0d14]/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transform transition-transform duration-300 ease-out flex flex-col ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0af2ff]/10 rounded-xl border border-[#0af2ff]/20">
                <Settings className="w-5 h-5 text-[#0af2ff]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest leading-tight">Kontrol Paneli</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Siber ayarlar merkezi</p>
              </div>
            </div>
            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-[#fb2e00] hover:rotate-90 bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-white/5 bg-transparent">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'general' ? 'border-[#0af2ff] text-[#0af2ff] bg-[#0af2ff]/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Kişisel Kimlik
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'security' ? 'border-[#ff4181] text-[#ff4181] bg-[#ff4181]/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Güvenlik
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
            {activeTab === 'general' && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-[#0af2ff]/5 border border-[#0af2ff]/20 rounded-2xl p-4 flex items-start gap-4">
                  <User className="w-6 h-6 text-[#0af2ff] shrink-0 mt-1" />
                  <div className="w-full">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Avatar URL</h4>
                    <p className="text-xs text-gray-500 mb-3 mt-1">Görselin tam bağlantısını girin (https://...)</p>
                    <input 
                      type="text" 
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#0af2ff]/50 transition-all text-sm font-mono"
                      defaultValue={profileData.avatarUrl}
                      onChange={e => setEditData({...editData, avatarUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="bg-[#0af2ff]/5 border border-[#0af2ff]/20 rounded-2xl p-4 flex items-start gap-4">
                  <MessageCircle className="w-6 h-6 text-[#0af2ff] shrink-0 mt-1" />
                  <div className="w-full">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Sinyal Mesajı (Bio)</h4>
                    <p className="text-xs text-gray-500 mb-3 mt-1">Ağdaki diğer ajanlara görünen mesajınız.</p>
                    <textarea 
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl p-3 text-white outline-none h-28 resize-none focus:border-[#0af2ff]/50 transition-all text-sm"
                      defaultValue={profileData.bio}
                      onChange={e => setEditData({...editData, bio: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <button onClick={handleUpdate} className="w-full py-4 bg-[#0af2ff] text-black font-black uppercase tracking-widest rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(10,242,255,0.2)]">
                  Kimliği Mühürle
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in space-y-6">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="bg-[#ff4181]/5 border border-[#ff4181]/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="w-5 h-5 text-[#ff4181]" />
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">Şifre Protokolü</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Eski Şifre</label>
                        <input 
                          type="password" required
                          className="w-full bg-[#0a0b10] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#ff4181]/50 transition-all text-sm font-mono"
                          value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Yeni Şifre</label>
                        <input 
                          type="password" required
                          className="w-full bg-[#0a0b10] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#ff4181]/50 transition-all text-sm font-mono"
                          value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-[#ff4181] text-white font-black uppercase tracking-widest rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,65,129,0.3)]">
                    Şifreyi Değiştir
                  </button>
                </form>

                <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-2xl mt-8">
                  <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Shield className="w-4 h-4"/> Uyarı</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Şifrenizi değiştirdiğiniz anda sistem sizi güvenlik amacıyla dışarı atacaktır. Yeni şifrenizle tekrar bağlantı kurmanız gerekecek.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HEADER GLOW */}
      <div className="h-48 md:h-64 w-full relative overflow-hidden bg-[#0d0d14]/30 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0af2ff]/10 to-transparent"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff4181]/5 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10 -mt-32">
        
        {/* --- ÜST KİMLİK BLOĞU --- */}
        <div className="bg-[#0d0d14]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-[#0af2ff] to-[#ff4181] p-1.5 shadow-[0_0_50px_rgba(10,242,255,0.2)] flex-shrink-0 -mt-20 md:-mt-24">
               <div className="w-full h-full bg-[#0a0b10] rounded-[22px] flex items-center justify-center overflow-hidden">
                  {profileData.avatarUrl ? <img src={profileData.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-20 h-20 text-white/5" />}
               </div>
            </div>

            <div className="flex-1 text-center lg:text-left w-full">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">{profileData.username}</h1>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${userRole === 'Admin' || userRole === 'Founder' ? 'bg-[#fb2e00]/10 border-[#fb2e00]/30 text-[#fb2e00]' : 'bg-[#0af2ff]/10 border-[#0af2ff]/30 text-[#0af2ff]'}`}>
                      {userRole}
                    </span>
                  </div>
                  <p className="text-gray-400 text-base md:text-lg font-medium max-w-2xl">"{profileData.bio || "VarietyShop bünyesinde gizli operasyon yürüten kıdemli ajan."}"</p>
                </div>
                <div className="flex flex-col lg:items-end gap-2">
                  <span className="flex items-center gap-2 text-gray-500 text-[11px] font-black uppercase tracking-[0.2em]"><Calendar className="w-4 h-4 text-[#0af2ff]" /> Kayıt: {new Date(profileData.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              {isMe && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8 border-t border-white/5">
                  <div className="bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center border border-[#10b981]/20"><CreditCard className="w-6 h-6 text-[#10b981]" /></div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Mevcut Bakiye</div>
                      <div className="text-[#10b981] text-3xl font-black">{profileData.balance} <span className="text-sm font-bold uppercase">₺</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* SOL TARAF (İÇERİK ALANI) */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-8 animate-fade-in">
              
              {isMe && (
                <>
                  {/* 🚀 DAVET SİSTEMİ MÜHÜRÜ */}
                  <div className="bg-[#0d0d14]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4181]/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-[#ff4181]/10 flex items-center justify-center border border-[#ff4181]/30">
                        <Users className="w-6 h-6 text-[#ff4181]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-widest">Siber Ağı Büyüt</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ajan davet et, komisyon kazan!</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                      <div className="flex-1 w-full bg-[#0a0b10] border border-white/10 rounded-2xl flex items-center justify-between p-3 pl-6">
                        <span className="font-mono text-[#0af2ff] font-bold text-lg tracking-widest">{referralStats.code}</span>
                        <button 
                          onClick={handleCopy}
                          className="bg-[#ff4181]/10 hover:bg-[#ff4181] hover:text-white p-3 px-6 rounded-xl border border-[#ff4181]/30 transition-all text-[#ff4181] flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                        >
                          {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Kopyalandı' : 'Kopyala'}
                        </button>
                      </div>

                      <div className="bg-[#0a0b10] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px] w-full md:w-auto">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Davet Edilen</span>
                        <span className="text-2xl font-black text-[#ffc300]">{referralStats.count}</span>
                      </div>
                    </div>

                    {referralStats.invitedList && referralStats.invitedList.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/10 relative z-10 animate-fade-in w-full">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Activity className="w-3 h-3 text-[#10b981]" /> Ağa Katılan Ajanlar
                        </p>
                        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {referralStats.invitedList.map((agent, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors w-full">
                              <span className="text-xs font-black text-gray-200 flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                  <User className="w-3 h-3 text-[#ff4181]" />
                                </div>
                                {agent.maskedName}
                              </span>
                              <span className="text-[10px] font-bold text-gray-500 tracking-widest">{agent.joinDate}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* E-Pin Bozdur */}
                  <div className="bg-[#0d0d14]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group shadow-xl mt-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 blur-3xl rounded-full pointer-events-none"></div>
                    <h3 className="text-white font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-widest"><Key className="text-[#10b981] w-4 h-4" /> Dijital Sinyal (E-Pin) Bozdur</h3>
                    
                    <form onSubmit={handleRedeemCode} className="flex flex-col md:flex-row gap-4 relative z-10">
                      <input 
                        type="text" 
                        value={redeemCode}
                        onChange={(e) => setRedeemCode(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX-XXXX" 
                        className="flex-1 bg-[#0a0b10] border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono text-white outline-none focus:border-[#10b981]/50 transition-all tracking-widest uppercase" 
                      />
                      <button type="submit" className="px-10 py-4 bg-[#10b981]/10 hover:bg-[#10b981] text-[#10b981] hover:text-black rounded-2xl text-xs font-black uppercase transition-all border border-[#10b981]/30">Doğrula</button>
                    </form>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* SAĞ TARAF (OPERASYON PANELİ) */}
          <div className="space-y-6 lg:sticky lg:top-28">
             <div className="bg-[#0d0d14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                <h3 className="text-gray-500 font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-center border-b border-white/5 pb-4">Ajan Paneli</h3>
                <div className="space-y-4">
                  {isMe ? (
                    <>
                      <button onClick={() => setIsSettingsOpen(true)} className="w-full py-4 bg-white/[0.02] hover:bg-white/[0.05] text-gray-300 rounded-2xl text-[11px] font-black uppercase transition-all border border-white/5 hover:border-white/20 flex items-center justify-between px-6 group">
                        <div className="flex items-center gap-3">
                           <Settings className="w-5 h-5 text-gray-400 group-hover:rotate-180 transition-transform duration-700" /> Profil Ayarları
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-white/[0.02] hover:bg-[#10b981]/10 text-gray-300 hover:text-[#10b981] rounded-2xl text-[11px] font-black uppercase transition-all border border-white/5 hover:border-[#10b981]/30 flex items-center justify-center gap-3 group">
                        <Box className="w-5 h-5 group-hover:scale-110 transition-transform" /> Kontrol Merkezi
                      </button>

                      <button onClick={() => window.open('https://discord.gg/eTAXD554Ab', '_blank')} className="w-full py-4 bg-[#5865F2]/5 hover:bg-[#5865F2]/20 text-[#5865F2] hover:text-white rounded-2xl text-[11px] font-black uppercase transition-all border border-[#5865F2]/20 flex items-center justify-center gap-3 group">
                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> Discord Destek
                      </button>

                      {(userRole === 'Admin' || userRole === 'Founder') && (
                        <button onClick={() => navigate('/admin')} className="w-full py-4 bg-[#fb2e00]/5 hover:bg-[#fb2e00] text-[#fb2e00] hover:text-black rounded-2xl text-[11px] font-black uppercase transition-all border border-[#fb2e00]/20 flex items-center justify-center gap-3 group">
                          <Shield className="w-5 h-5 group-hover:scale-125 transition-transform" /> ROOT Kontrolü
                        </button>
                      )}

                      <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                        <button onClick={handleLogout} className="w-full py-4 bg-red-500/5 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-2xl text-[11px] font-black uppercase transition-all border border-red-500/10 hover:border-red-500/30 flex items-center justify-center gap-3 group">
                          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Ajan Bağlantısını Kes
                        </button>

                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-500 tracking-widest px-2">
                           <span>Operasyonel Durum</span>
                           <span className="text-[#10b981] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>Aktif</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="w-3/4 h-full bg-gradient-to-r from-[#0af2ff] to-[#ff4181]"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                       <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Sadece Görüntüleme Modu</p>
                    </div>
                  )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;