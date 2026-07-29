import React, { useState, useEffect } from 'react';
import { User, Lock, UserPlus, ArrowRight, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ username: '', email: '', password: '', referralCode: '' });
  const [status, setStatus] = useState({ type: '', message: '' }); 
  const [loading, setLoading] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);

  // =======================================================
  // 🎮 DISCORD OAUTH YAKALAYICI
  // =======================================================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        handleDiscordLogin(accessToken);
      }
    }
  }, []);

  const handleDiscordLogin = async (accessToken) => {
    setLoading(true);
    setStatus({ type: 'success', message: 'Discord kimliği doğrulanıyor...' });
    
    window.history.replaceState(null, null, window.location.pathname);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/discord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AccessToken: accessToken })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('vs_token', data.token);
        localStorage.setItem('vs_user', data.username);
        localStorage.setItem('vs_role', data.role);
        setStatus({ type: 'success', message: 'Discord ile siber ağa bağlanıldı!' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setStatus({ type: 'error', message: data.message || 'Discord girişi başarısız.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Sunucuya ulaşılamıyor.' });
    } finally {
      setLoading(false);
    }
  };

  const loginWithDiscord = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/register');
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=identify%20email`;
  };

  // =======================================================
  // 🚀 GOOGLE LOGIN İŞLEYİCİ
  // =======================================================
  const handleGoogleLogin = async (credential) => {
    setLoading(true);
    setStatus({ type: 'success', message: 'Google kimliği doğrulanıyor...' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ IdToken: credential })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('vs_token', data.token);
        localStorage.setItem('vs_user', data.username);
        localStorage.setItem('vs_role', data.role);
        setStatus({ type: 'success', message: 'Google ile siber ağa bağlanıldı!' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setStatus({ type: 'error', message: data.message || 'Google girişi başarısız.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Sunucuya ulaşılamıyor.' });
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // ✉️ NORMAL KAYIT İŞLEYİCİ
  // =======================================================
  const handleChange = (e) => {
    const val = e.target.name === 'referralCode' ? e.target.value.toUpperCase() : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!legalAccepted) {
      setStatus({ type: 'error', message: 'Sözleşmeleri onaymalısınız' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) 
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        // 🚨 GÜNCELLEME: Kullanıcıyı direkt kod onay ekranına, yazdığı mailli state ile fırlatıyoruz!
        setStatus({ type: 'success', message: 'Ajan kaydı başarıyla tamamlandı! Kod e-posta adresinize fırlatıldı. Doğrulamaya yönlendiriliyorsunuz...' });
        setTimeout(() => { 
          navigate('/verify-email', { state: { email: formData.email } }); 
        }, 2000);
      } else {
        if (typeof data === 'string') setStatus({ type: 'error', message: data });
        else if (data.message) setStatus({ type: 'error', message: data.message });
        else if (data.errors) {
          const firstError = Object.values(data.errors)[0][0]; 
          setStatus({ type: 'error', message: firstError });
        }
        else if (data.title) setStatus({ type: 'error', message: data.title }); 
        else setStatus({ type: 'error', message: 'Kayıt reddedildi.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Sunucuya ulaşılamıyor. Börü ağında sorun var.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050508] pt-32 pb-20 flex items-center justify-center overflow-hidden font-['Space_Grotesk',sans-serif]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff4181]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(255,65,129,0.05)]">
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#ff4181]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#ff4181]/20">
              <UserPlus className="w-8 h-8 text-[#ff4181]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Ağa <span className="text-[#ff4181]">Katıl</span></h1>
            <p className="text-gray-400 text-sm mt-2">Siber ekosistemin bir parçası ol.</p>
          </div>

          {status.message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border ${status.type === 'success' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 'bg-[#fb2e00]/10 text-[#fb2e00] border-[#fb2e00]/30'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
              {status.message}
            </div>
          )}

          {/* OAUTH BUTONLARI */}
          <div className="space-y-3 mb-6">
            <button 
              type="button"
              onClick={loginWithDiscord}
              disabled={loading}
              className="w-full py-3.5 bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white rounded-xl border border-[#5865F2]/30 flex items-center justify-center gap-3 transition-all font-black uppercase text-xs tracking-widest disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 127.14 96.36">
                 <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              Discord ile Katıl
            </button>

            <div className="relative w-full group cursor-pointer overflow-hidden rounded-xl">
              <div className="w-full py-3.5 bg-white/5 group-hover:bg-white/10 text-white border border-white/10 group-hover:border-white/30 flex items-center justify-center gap-3 transition-all font-black uppercase text-xs tracking-widest">
                <svg xmlns="http://www.w3.org/2000/xl" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile Katıl
              </div>
              
              <div className="absolute inset-0 opacity-0 z-10 w-full h-full">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "bos_id"}>
                  <div className="w-full h-full transform scale-[2] origin-center opacity-0 cursor-pointer">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential)}
                      onError={() => setStatus({ type: 'error', message: 'Google ile bağlantı kurulamadı.' })}
                    />
                  </div>
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">veya manuel kayıt ol</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500 group-focus-within:text-[#ff4181] transition-colors" />
              </div>
              <input 
                type="text" name="username" value={formData.username} onChange={handleChange} required 
                placeholder="Kullanıcı Adı (Kod Adı)" 
                className="w-full bg-black/40 border border-white/10 focus:border-[#ff4181]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#ff4181] transition-colors" />
              </div>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} required 
                placeholder="E-Posta Adresi" 
                className="w-full bg-black/40 border border-white/10 focus:border-[#ff4181]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#ff4181] transition-colors" />
              </div>
              <input 
                type="password" name="password" minLength="6" value={formData.password} onChange={handleChange} required 
                placeholder="Şifre (Min 6 Karakter)" 
                className="w-full bg-black/40 border border-white/10 focus:border-[#ff4181]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
              />
            </div>

            {/* DAVET KODU ALANI */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 group-focus-within:text-[#ff4181] transition-colors font-bold uppercase tracking-widest text-[10px]">
                  DAVET
                </span>
              </div>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 focus:border-[#ff4181]/50 text-white rounded-xl py-4 pl-[72px] pr-4 outline-none transition-all uppercase placeholder-gray-600 text-sm"
                placeholder="DAVET KODUNUZ VARSA GİRİN (OPSİYONEL)"
                maxLength={10}
              />
            </div>

            <div className="flex items-start gap-3 mt-4 mb-2">
              <div className="flex items-center h-5">
                <input
                  id="legal-checkbox"
                  type="checkbox"
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border border-white/10 bg-black/40 text-[#ff4181] focus:ring-[#ff4181]/50 cursor-pointer accent-[#ff4181]"
                />
              </div>
              <label htmlFor="legal-checkbox" className="text-xs text-gray-400 leading-tight">
                Sisteme kayıt olarak;{' '}
                <Link to="/legal/terms" target="_blank" className="text-[#ff4181] hover:text-white transition-colors underline decoration-[#ff4181]/30">
                  Kullanım Koşulları
                </Link>
                ,{' '}
                <Link to="/legal/privacy" target="_blank" className="text-[#ff4181] hover:text-white transition-colors underline decoration-[#ff4181]/30">
                  KVKK / Gizlilik Politikası
                </Link>
                {' '}metinlerini okuduğumu ve kabul ettiğimi onaylıyorum.
              </label>
            </div>

            <button 
              disabled={loading || !legalAccepted} 
              className="w-full bg-[#ff4181] hover:bg-[#e03a72] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all mt-2 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,65,129,0.4)]"
            >
              {loading ? 'Bağlanılıyor...' : 'Kayıt Ol'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Zaten bir hesabın var mı?{' '}
            <Link to="/login" className="text-white font-bold hover:text-[#ff4181] transition-colors">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;