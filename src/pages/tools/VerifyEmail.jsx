import React, { useState } from 'react';
import { ShieldCheck, Key, Zap, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Login ekranından gelen e-postayı otomatik yakala, yoksa boş bırak
  const [email, setEmail] = useState(location.state?.email || '');
  const [token, setToken] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });


const handleVerify = async (e) => {
  e.preventDefault();
  if (token.length !== 6) {
    setStatus({ type: 'error', msg: 'Siber kod tam 6 haneli olmalıdır komutanım.' });
    return;
  }

  setIsProcessing(true);
  setStatus({ type: '', msg: '' });

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, token: token })
    });

    // 🚨 ARTIK DATA PAKETİNİ JSON OLARAK OKUYORUZ
    const data = await response.json();

    if (response.ok) {
      setStatus({ type: 'success', msg: 'Kilit açıldı! Otomatik giriş yapılıyor...' });
      
      // 🚨 DİREKT LOCALSTORAGE MÜHÜRLERİNİ ÇAKIYORUZ
      localStorage.setItem('vs_token', data.token);
      localStorage.setItem('vs_user', data.username);
      localStorage.setItem('vs_role', data.role);
      localStorage.setItem('vs_balance', data.balance || '0');

      setTimeout(() => {
        // Bir daha logine gitmek yok, direkt ana karargaha uçuş!
        navigate('/dashboard'); 
        window.location.reload(); // Navbar'daki bakiye ve profil anlık güncellensin kanka
      }, 1500);
    } else {
      setStatus({ type: 'error', msg: data.message || 'Doğrulama kodu geçersiz veya sahte!' });
    }
  } catch (err) {
    setStatus({ type: 'error', msg: 'Merkez üssüyle bağlantı koptu.' });
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="min-h-screen bg-[#05060a] font-['Space_Grotesk',sans-serif] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arka Plan Neon Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0af2ff]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#0a0c12]/90 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl relative z-10">
        
        {/* Geri Dön Butonu */}
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#0af2ff] transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Geri Dön
        </button>

        {/* Başlık Alanı */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0af2ff]/10 border border-[#0af2ff]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(10,242,255,0.1)]">
            <ShieldCheck className="w-8 h-8 text-[#0af2ff]" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">SİBER <span className="text-[#0af2ff]">ONAY</span></h2>
          <p className="text-gray-500 text-xs font-mono mt-1 uppercase tracking-wider">Aktivasyon Kodu Doğrulama Duvarı</p>
        </div>

        {/* Durum Bildirimleri */}
        {status.msg && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs font-bold border ${status.type === 'success' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0"/> : <AlertTriangle className="w-4 h-4 shrink-0"/>}
            <span>{status.msg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">E-Posta Adresiniz</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-[#0af2ff]/50 transition-all font-mono"
              placeholder="ajan@varietyshop.com.tr"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#0af2ff] font-black uppercase tracking-widest mb-1.5 block">6 Haneli Siber Kod</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required maxLength="6"
                value={token} onChange={e => setToken(e.target.value.replace(/\D/g, ''))} // Sadece sayı girişine izin ver kanka
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-center text-white outline-none focus:border-[#0af2ff]/50 tracking-[0.4em] font-black font-mono transition-all placeholder-gray-700"
                placeholder="123456"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isProcessing}
            className="w-full mt-2 py-4 bg-[#0af2ff]/10 hover:bg-[#0af2ff] text-[#0af2ff] hover:text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(10,242,255,0.1)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Zap className="w-4 h-4 animate-spin"/> : 'Siber Kilidi Aç'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default VerifyEmail;