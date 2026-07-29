import React, { useState } from 'react';
import { Lock, Key, ArrowRight, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL'den ?token= kısmını otomatik yakalıyoruz
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🚨 KİLİT KONTROLLERİ
    if (!token) {
      setStatus({ type: 'error', message: 'Güvenlik jetonu bulunamadı. Link geçersiz veya eksik.' });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Şifreler birbiriyle eşleşmiyor komutanım!' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Siber güvenlik için şifre en az 6 karakter olmalıdır.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Token: token, 
          NewPassword: formData.newPassword 
        })
      });

      const text = await response.text();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Şifren başarıyla yenilendi! Karargaha yönlendiriliyorsun...' });
        // Başarılı olursa 2.5 saniye sonra Login ekranına fırlat
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setStatus({ type: 'error', message: text || 'Sıfırlama işlemi reddedildi.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Sunucuya ulaşılamıyor. Sinyal koptu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050508] pt-32 pb-20 flex items-center justify-center overflow-hidden font-['Space_Grotesk',sans-serif]">
      {/* Arka Plan Efekti */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffc300]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 relative z-10 animate-fade-in">
        <div className="bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(255,195,0,0.05)]">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ffc300]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#ffc300]/20">
              <ShieldCheck className="w-8 h-8 text-[#ffc300]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Yeni Şifre <span className="text-[#ffc300]">Belirle</span></h1>
            <p className="text-gray-400 text-xs mt-2 font-medium">Siber kalkanları yeniden aktif et.</p>
          </div>

          {status.message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-bold border ${status.type === 'success' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 'bg-[#fb2e00]/10 text-[#fb2e00] border-[#fb2e00]/30'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
              <p>{status.message}</p>
            </div>
          )}

          {!token ? (
            <div className="text-center p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-bold">Geçersiz Bağlantı. Lütfen mailinize gelen linke tekrar tıklayın.</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#ffc300] transition-colors" />
                </div>
                <input 
                  type="password" 
                  value={formData.newPassword} 
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
                  required 
                  placeholder="Yeni Şifre" 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ffc300]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-500 group-focus-within:text-[#ffc300] transition-colors" />
                </div>
                <input 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                  required 
                  placeholder="Yeni Şifre (Tekrar)" 
                  className="w-full bg-black/40 border border-white/10 focus:border-[#ffc300]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
                />
              </div>

              <button disabled={loading || status.type === 'success'} className="w-full mt-2 bg-[#ffc300] hover:bg-[#ffea00] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                {loading ? 'SİFRE KAYDEDİLİYOR...' : 'ŞİFREYİ GÜNCELLE'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}