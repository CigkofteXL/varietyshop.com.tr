import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, ArrowRight, AlertTriangle, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🚨 ŞİFREMİ UNUTTUM STATE'LERİ
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ type: '', message: '' });

  // =======================================================
  // 🎮 DISCORD OAUTH YAKALAYICI
  // =======================================================
  useEffect(() => {
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
    setError('');
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
        navigate('/dashboard');
      } else {
        setError(data.message || 'Discord girişi başarısız.');
      }
    } catch (err) {
      setError('Sunucuya ulaşılamıyor.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithDiscord = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/login');
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=identify%20email`;
  };

  // =======================================================
  // 🚀 GOOGLE LOGIN İŞLEYİCİ
  // =======================================================
  const handleGoogleLogin = async (credential) => {
    setLoading(true);
    setError('');

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
        navigate('/dashboard');
      } else {
        setError(data.message || 'Google girişi başarısız.');
      }
    } catch (err) {
      setError('Sunucuya ulaşılamıyor.');
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // ✉️ NORMAL GİRİŞ İŞLEYİCİ (GÜNCELLENDİ 🔐)
  // =======================================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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
        localStorage.setItem('vs_token', data.token); 
        localStorage.setItem('vs_user', data.username); 
        localStorage.setItem('vs_role', data.role);
        navigate('/dashboard'); 
      } else {
        // 🚨 YENİ SİBER KÖPRÜ: Onaysız Mail Yakalama Aşaması
        // .NET varsayılan olarak JSON çıktılarını camelCase yaptığı için data.requiresVerification olarak sorguluyoruz.
        if (response.status === 403 && data && (data.requiresVerification || data.RequiresVerification)) {
          const userEmail = data.email || data.Email || formData.email;
          // Kullanıcıyı e-posta bilgisini de yanına vererek onay sayfasına fırlatıyoruz kanka!
          navigate('/verify-email', { state: { email: userEmail } });
          return;
        }

        if (typeof data === 'string') setError(data);
        else if (data.message) setError(data.message);
        else if (data.errors) {
          const firstError = Object.values(data.errors)[0][0]; 
          setError(firstError);
        }
        else if (data.title) setError(data.title); 
        else setError('Erişim reddedildi. Bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setError('Sunucuya ulaşılamıyor. Ana çekirdek kapalı olabilir.');
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // 🔑 ŞİFREMİ UNUTTUM İŞLEYİCİ
  // =======================================================
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if(!forgotEmail) return;
    
    setLoading(true);
    setForgotStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const text = await response.text();
      
      if (response.ok) {
        setForgotStatus({ type: 'success', message: text });
      } else {
        setForgotStatus({ type: 'error', message: text });
      }
    } catch (err) {
      setForgotStatus({ type: 'error', message: 'Sunucuya ulaşılamıyor. Sinyal koptu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050508] pt-32 pb-20 flex items-center justify-center overflow-hidden font-['Space_Grotesk',sans-serif]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0af2ff]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(10,242,255,0.05)] overflow-hidden">
          
          {/* ŞİFREMİ UNUTTUM */}
          {isForgotPassword ? (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#ffc300]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#ffc300]/20">
                  <Key className="w-8 h-8 text-[#ffc300]" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Şifre <span className="text-[#ffc300]">Sıfırlama</span></h1>
                <p className="text-gray-400 text-xs mt-2 font-medium">Hesabına bağlı e-posta adresini gir.</p>
              </div>

              {forgotStatus.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-bold border ${forgotStatus.type === 'success' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 'bg-[#fb2e00]/10 text-[#fb2e00] border-[#fb2e00]/30'}`}>
                  {forgotStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
                  <p>{forgotStatus.message}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleForgotPasswordSubmit}>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#ffc300] transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)} 
                    required 
                    placeholder="E-Posta Adresi" 
                    className="w-full bg-black/40 border border-white/10 focus:border-[#ffc300]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
                  />
                </div>

                <button disabled={loading} className="w-full bg-[#ffc300] hover:bg-[#ffea00] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                  {loading ? 'FÜZE ATEŞLENİYOR...' : 'SIFIRLAMA MAİLİ GÖNDER'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <button 
                onClick={() => { setIsForgotPassword(false); setForgotStatus({ type: '', message: '' }); }}
                className="w-full mt-4 py-4 text-xs text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Giriş Ekranına Dön
              </button>
            </div>
          ) : (
            
          /* NORMAL GİRİŞ */
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#0af2ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#0af2ff]/20">
                  <LogIn className="w-8 h-8 text-[#0af2ff]" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter">Ağa <span className="text-[#0af2ff]">Bağlan</span></h1>
                <p className="text-gray-400 text-sm mt-2">VarietyShop siber ekosistemine giriş yap.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border bg-[#fb2e00]/10 text-[#fb2e00] border-[#fb2e00]/30 animate-pulse">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* OAUTH */}
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
                  Discord ile Bağlan
                </button>

                <div className="relative w-full group cursor-pointer overflow-hidden rounded-xl">
                  <div className="w-full py-3.5 bg-white/5 group-hover:bg-white/10 text-white border border-white/10 group-hover:border-white/30 flex items-center justify-center gap-3 transition-all font-black uppercase text-xs tracking-widest">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google ile Bağlan
                  </div>
                  <div className="absolute inset-0 opacity-0 z-10 w-full h-full">
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "bos_id"}>
                      <div className="w-full h-full transform scale-[2] origin-center opacity-0 cursor-pointer">
                        <GoogleLogin
                          onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential)}
                          onError={() => setError('Google ile bağlantı kurulamadı.')}
                        />
                      </div>
                    </GoogleOAuthProvider>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">veya manuel bağlan</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#0af2ff] transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="E-Posta Adresi" 
                    className="w-full bg-black/40 border border-white/10 focus:border-[#0af2ff]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#0af2ff] transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    placeholder="Şifre" 
                    className="w-full bg-black/40 border border-white/10 focus:border-[#0af2ff]/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder-gray-600 text-sm" 
                  />
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs font-bold text-gray-400 hover:text-[#ffc300] transition-colors">Şifreni mi unuttun?</button>
                </div>

                <button disabled={loading} className="w-full bg-[#0af2ff] hover:bg-[#08c5d1] disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(10,242,255,0.4)]">
                  {loading ? 'Sorgulanıyor...' : 'Giriş Yap'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                Sistemde kaydın yok mu?{' '}
                <Link to="/register" className="text-white font-bold hover:text-[#0af2ff] transition-colors">Ağa Katıl</Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;