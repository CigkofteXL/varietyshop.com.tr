import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, Trophy, ShieldCheck, CreditCard, WifiIcon, 
  User, MessageSquare, RadarIcon, Link as LinkIcon, Earth, 
  ShoppingCart, Bell, Wallet, ChevronRight, Zap, LifeBuoy
} from 'lucide-react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';

import Home from './pages/Home';
import Market from './pages/Market';
import Links from './pages/Linkrouter'; 
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin/Admin';
import BotDashboard from './pages/Dashboard';
import Support from './pages/Support'; 
import NotFound from './pages/tools/NotFound';
import { useCart } from './pages/tools/CartContext';
import Cart from './pages/Cart';
import Notifications from './pages/Notifications';
import Exchange from './pages/Exchange';

import Maintenance from './pages/tools/Maintenance'; 
import ResetPassword from './pages/tools/ResetPassword';
import VerifyEmail from './pages/tools/VerifyEmail'; 

import DistanceSelling from './pages/legal/DistanceSelling';
import Terms from './pages/legal/Terms';
import RefundPolicy from './pages/legal/RefundPolicy';
import Privacy from './pages/legal/Privacy';

function App() {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const location = useLocation();
  
  const [balance, setBalance] = useState(localStorage.getItem('vs_balance') || '0');
  const currentUser = localStorage.getItem('vs_user');
  
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // BAKIM MODU STATE'LERI
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingSettings, setIsCheckingSettings] = useState(true);

  // ================= 🚀 SİBER KAPI KONTROLÜ (BAKIM MODU) =================
  useEffect(() => {
    const token = localStorage.getItem('vs_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role;
        if (role === 'Admin' || role === 'Founder') {
          setIsAdmin(true);
        }
      } catch (e) { console.error("Token kırılamadı."); }
    }

    fetch(`${import.meta.env.VITE_API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.isMaintenanceMode) {
          setIsMaintenance(true);
        } else {
          setIsMaintenance(false);
        }
      })
      .catch(() => console.log("[SİBER KAPI] Ayarlar çekilemedi."))
      .finally(() => setIsCheckingSettings(false));
  }, [location.pathname]); 
  // ========================================================================

  useEffect(() => {
    const handleStorageChange = () => {
      setBalance(localStorage.getItem('vs_balance') || '0');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  // ================= 🚀 SİBER RADAR (BİLDİRİM KONTROLÜ) =================
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem('vs_token');
      if (!token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const unreadCount = data.filter(n => !n.read).length;
          setUnreadNotifications(unreadCount);
        }
      } catch (error) {
        console.error("[SİBER RADAR] Bildirimler çekilemedi:", error);
      }
    };
    fetchUnreadCount();
    const radar = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(radar);
  }, [location]); 
  // ========================================================================

  // ================= 🚀 SİBER DEVRİYE (OTURUM YÖNETİMİ) =================
  useEffect(() => {
    const sessionPatrol = setInterval(async () => {
      const token = localStorage.getItem('vs_token'); 
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeLeft = expTime - currentTime;

        if (timeLeft > 0 && timeLeft < 300000) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('vs_token', data.token);
          }
        } 
        else if (timeLeft <= 0) {
          clearInterval(sessionPatrol);
          alert("Siber Oturumunuz zaman aşımına uğradı! Lütfen güvenliğiniz için tekrar giriş yapın.");
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch (e) {
        console.error("[SİBER DEVRİYE] Token okuma hatası:", e);
      }
    }, 60000); 

    return () => clearInterval(sessionPatrol);
  }, []);
  // ========================================================================

  // ================= 🚀 SİBER PİNG (AKTİFLİK SİNYALİ) =================
  useEffect(() => {
    const token = localStorage.getItem('vs_token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/auth/ping`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => null);

  }, [location.pathname]); 
  // ========================================================================

  const navItems = [
    { path: '/', icon: <HomeIcon className="w-5 h-5" />, label: 'Ana Sayfa', color: 'group-hover:text-[#0af2ff] group-hover:drop-shadow-[0_0_8px_#0af2ff]' },
    { path: '/market', icon: <Zap className="w-5 h-5" />, label: 'Market', color: 'group-hover:text-[#ffc300] group-hover:drop-shadow-[0_0_8px_#ffc300]' },
    { path: '/links', icon: <LinkIcon className="w-5 h-5" />, label: 'Bağlantılar', color: 'group-hover:text-[#ff4181] group-hover:drop-shadow-[0_0_8px_#ff4181]' },
  ];

  if (isCheckingSettings) {
    return <div className="min-h-screen bg-[#030407] flex items-center justify-center text-[#0af2ff] font-mono text-xs font-black animate-pulse uppercase tracking-[0.3em]">Sinyal Hattı Yoklanıyor...</div>;
  }

  if (isMaintenance && !isAdmin && location.pathname !== '/login') {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen bg-[#030407] text-[#e4e1e9] font-sans selection:bg-[#ff4181]/30 overflow-x-hidden relative">
      
      {/* 🚀 ULTRALÜKS GLOBAL NAVBAR (CYBER-OBSIDIAN GLASS) */}
      <nav className="fixed top-0 left-0 w-full h-20 z-[100] px-4 md:px-10 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl h-14 bg-[#090a0f]/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl flex items-center justify-between px-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)] pointer-events-auto relative overflow-hidden group/nav">
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/nav:animate-[shimmer_2.5s_infinite] pointer-events-none"></div>

          {/* SOL: LOGO SEKTÖRÜ */}
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#0af2ff]/10 group-hover:border-[#0af2ff]/30">
                  <HomeIcon className="w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-[#0af2ff]" />
                </div>
              </div>
              <div className="hidden lg:flex flex-col justify-center">
                <span className="font-bold tracking-wider uppercase text-sm text-white leading-none">
                  VarietyShop
                </span>
                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-[0.1em] mt-1 group-hover:text-gray-400 transition-colors">
                  Siber Karargah
                </span>
              </div>
            </div>
          </div>

          {/* SAĞ: OPERASYON ENJEKTÖRLERİ */}
          <div className="flex items-center gap-3 md:gap-5">
            
            {currentUser && (
              <div className="group/wallet relative hidden sm:flex items-center gap-3 bg-black/40 border border-white/[0.04] p-1.5 px-3.5 rounded-xl hover:border-[#10b981]/30 transition-all cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-[#10b981]/5 translate-y-full group-hover/wallet:translate-y-0 transition-transform duration-300"></div>
                <Wallet className="w-3.5 h-3.5 text-[#10b981] relative z-10" />
                <div className="flex flex-col relative z-10">
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Bakiye</span>
                  <span className="text-xs font-black text-white leading-none">{balance} <span className="text-[#10b981]">₺</span></span>
                </div>
              </div>
            )}

            <div 
              onClick={() => navigate('/dashboard')}
              className="relative group/boru cursor-pointer flex items-center justify-center p-1.5 bg-[#0af2ff]/5 border border-[#0af2ff]/20 rounded-xl hover:bg-[#0af2ff]/10 hover:border-[#0af2ff]/40 hover:scale-105 transition-all shadow-[0_0_15px_rgba(10,242,255,0.05)] hover:shadow-[0_0_20px_rgba(10,242,255,0.2)]"
              title="Ürünler Komuta Merkezi"
            >
              <div className="absolute -inset-1 bg-[#0af2ff]/10 rounded-xl blur opacity-0 group-hover/boru:opacity-100 transition-opacity"></div>
              <img src="/logo/gozlukluborucuk.png" alt="Börücük" className="w-6 h-6 object-contain relative z-10 drop-shadow-[0_0_5px_rgba(10,242,255,0.4)]" />
            </div>

            <div className="relative group/cart cursor-pointer" onClick={() => navigate('/cart')} title="Sepetim">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover/cart:bg-[#ffc300]/10 group-hover/cart:border-[#ffc300]/30 transition-all">
                <ShoppingCart className="w-4 h-4 text-gray-400 group-hover/cart:text-[#ffc300] transition-colors" />
              </div>
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-[#ffc300] border-[2px] border-[#030407] rounded-full text-[9px] font-black text-black shadow-[0_0_5px_rgba(255,195,0,0.5)]">
                  {getCartCount()}
                </span>
              )}
            </div>

            <div className="relative group/bell cursor-pointer" onClick={() => navigate('/notifications')} title="Bildirim Merkezi">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover/bell:bg-[#a855f7]/10 group-hover/bell:border-[#a855f7]/30 transition-all">
                <Bell className="w-4 h-4 text-gray-400 group-hover/bell:text-[#a855f7] transition-colors" />
              </div>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-[#a855f7] border-[2px] border-[#030407] rounded-full text-[9px] font-black text-white shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>

            <div className="relative group/support cursor-pointer" onClick={() => navigate('/support')} title="Destek Karargahı">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover/support:bg-[#ff4181]/10 group-hover/support:border-[#ff4181]/30 transition-all">
                <LifeBuoy className="w-4 h-4 text-gray-400 group-hover/support:text-[#ff4181] transition-colors" />
              </div>
            </div>

            <div 
              onClick={() => navigate('/profile')} 
              className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] p-1 pr-4 rounded-xl cursor-pointer hover:bg-white/[0.05] hover:border-[#0af2ff]/20 transition-all group/user"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0af2ff] to-[#ff4181] p-[1px] group-hover/user:rotate-6 transition-transform">
                <div className="w-full h-full bg-[#0d0d12] rounded-[7px] flex items-center justify-center">
                  <span className="text-[11px] font-black text-white uppercase">{currentUser ? currentUser.charAt(0) : '?'}</span>
                </div>
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[9px] font-black text-white uppercase leading-none tracking-wider">{isAdmin ? 'Yönetici' : 'Komutan'}</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 group-hover/user:text-gray-300 transition-colors">@{currentUser || 'Misafir'}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* İÇERİK ALANI SİNYAL DAĞITIMI */}
      <div className="relative z-10 pt-20 pb-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/links" element={<Links />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/dashboard" element={<BotDashboard />} />
          <Route path="/support" element={<Support />} /> 
          <Route path="/legal/distance-selling" element={<DistanceSelling />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/refund-policy" element={<RefundPolicy />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} /> 
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* ⚓ THE BOTTOM DOCK PANEL (CYBER GLASS STIL) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-4 py-3 bg-[#090a0f]/60 backdrop-blur-xl border border-white/[0.06] rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-[#0af2ff]/20">
          
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                location.pathname === item.path ? 'bg-white/[0.06] scale-105 border border-white/[0.04]' : 'hover:bg-white/5 hover:-translate-y-1'
              }`}
            >
              {location.pathname === item.path && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]"></span>
              )}
              <div className={`text-gray-400 transition-colors duration-300 ${location.pathname === item.path ? item.color.split(' ')[0].replace('group-hover:', '') : item.color}`}>
                {item.icon}
              </div>
              <span className="absolute -top-10 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 px-3 py-1 bg-[#090a0f] border border-white/10 text-[10px] font-bold tracking-widest uppercase rounded-full text-white backdrop-blur-md whitespace-nowrap pointer-events-none shadow-2xl">
                {item.label}
              </span>
            </button>
          ))}

          <div className="w-[1px] h-8 mx-1 bg-white/[0.06]"></div>

          <button onClick={() => navigate('/profile')} className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#0af2ff]/10 to-[#ff4181]/10 border border-white/[0.06] hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,65,129,0.25)]">
            <User className="w-5 h-5 text-white" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-[#fb2e00] border-2 border-[#030407] rounded-full shadow-[0_0_8px_#fb2e00]"></span>
          </button>
          
        </div>
      </div>

    </div>
  );
}

export default App;