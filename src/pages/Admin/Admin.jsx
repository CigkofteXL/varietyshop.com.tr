import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Megaphone, User, Key, 
  Lock, Zap, Ticket, DownloadCloud, Terminal, X,
  LayoutDashboard, MessageSquare, ArrowLeftRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Bileşenleri güncel isimleriyle import ediyoruz kanka
import AdminSecurityTab from './AdminSecurityTab';
import AdminDeployTab from './AdminDeployTab';
import AdminWebUsersTab from './AdminWebUsersTab';
import AdminLicenseKeysTab from './AdminLicenseKeysTab';
import AdminMarketTab from './AdminMarketTab';
import AdminCouponsTab from './AdminCouponsTab';
import AdminAnnouncementsTab from './AdminAnnouncementsTab';
import AdminLogsTab from './AdminLogsTab';
import AdminDashboardTab from './AdminDashboardTab'; 
import AdminReviewsTab from './AdminReviewsTab'; 
import AdminExchangeTab from './AdminExchangeTab'; // 🚨 MEŞRU TAKAS SİSTEMİ DURUYOR

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- MERKEZİ VERİ STATE'LERİ ---
  const [dashboardStats, setDashboardStats] = useState({ totalWebUsers: 0, totalEconomyVc: 0, totalListings: 0 });
  const [webUsers, setWebUsers] = useState([]); 
  const [productsList, setProductsList] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [keysList, setKeysList] = useState([]);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [pendingExchanges, setPendingExchanges] = useState([]); // Bekleyen Takas Kodları Sinyali

  const showStatus = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 4000);
  };

  // --- MERKEZİ VERİ ÇEKME MOTORU ---
  const fetchAdminData = async () => {
    const token = localStorage.getItem('vs_token'); 
    setIsLoading(true);
    
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/system/dashboard-stats`, { headers }).catch(()=>null);
      if (statsRes && statsRes.ok) setDashboardStats(await statsRes.json());

      const webUsersRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/system/users`, { headers }).catch(()=>null);
      if (webUsersRes && webUsersRes.ok) setWebUsers(await webUsersRes.json());

      const couponsRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/system/coupons`, { headers }).catch(()=>null);
      if (couponsRes && couponsRes.ok) setCoupons(await couponsRes.json());

      const logsRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/system/audit-logs`, { headers }).catch(()=>null);
      if (logsRes && logsRes.ok) setAuditLogs(await logsRes.json());

      const productsRes = await fetch(`${import.meta.env.VITE_API_URL}/market/search`).catch(()=>null);
      if (productsRes && productsRes.ok) setProductsList(await productsRes.json());

      const keysRes = await fetch(`${import.meta.env.VITE_API_URL}/license/keys`, { headers }).catch(()=>null);
      if (keysRes && keysRes.ok) setKeysList(await keysRes.json());

      const downloadRes = await fetch(`${import.meta.env.VITE_API_URL}/BoruDownload/admin/links`, { headers }).catch(()=>null);
      if (downloadRes && downloadRes.ok) setDownloadLinks(await downloadRes.json());

      // 🚨 REFORM: Eski disputed/mahkeme API boru hattı tamamen kazındı kanka. Sadece takas onayları çekiliyor.
      const exchangesRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/economy/exchanges/pending`, { headers }).catch(()=>null);
      if (exchangesRes && exchangesRes.ok) setPendingExchanges(await exchangesRes.json());

    } catch (error) {
      console.error("Veritabanı bağlantı hatası:", error);
      showStatus('error', 'Veritabanı ile bağlantı koptu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [navigate]);

  if (isLoading) return <div className="min-h-screen bg-[#05060a] flex items-center justify-center text-[#fb2e00] font-black animate-pulse uppercase tracking-[0.3em]">ROOT Frekansı Aranıyor...</div>;

  return (
    <div className="min-h-screen bg-[#05060a] pt-32 pb-20 px-4 md:px-8 font-['Space_Grotesk'] text-[#e4e1e9] selection:bg-[#fb2e00]/30 relative overflow-hidden">
      
      {/* Arka Plan Efekti */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,46,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(251,46,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#fb2e00]/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* ÜST BAŞLIK & DİNAMİK İSTATİSTİKLER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#fb2e00]/10 border border-[#fb2e00]/30 rounded-2xl flex items-center justify-center relative">
              <ShieldAlert className="w-8 h-8 text-[#fb2e00]" />
              <div className="absolute inset-0 border border-[#fb2e00] rounded-2xl animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-widest text-white">
                ROOT <span className="text-[#fb2e00]">Yönetim Merkezi</span>
              </h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                <Lock className="w-3 h-3 text-[#fb2e00]" /> En Üst Düzey Veritabanı Erişimi
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Kayıtlı Müşteri</span>
              <span className="text-sm font-black text-white">{dashboardStats.totalWebUsers}</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Sistemdeki Bakiye</span>
              <span className="text-sm font-black text-[#10b981]">{dashboardStats.totalEconomyVc} ₺</span>
            </div>
          </div>
        </div>

        {/* SEKMELER PANELİ */}
        <div className="flex flex-wrap gap-3 mb-8 bg-[#0a0c12]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5 w-fit">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} text="Genel Bakış" color="text-[#0af2ff]" />
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<ShieldAlert />} text="Güvenlik" color="text-[#fb2e00]" />
          
          {/* 🚨 REFORM: Nexus Mahkemesi sekmesi buradan tamamen silindi kanka! */}
          <TabButton active={activeTab === 'exchanges'} onClick={() => setActiveTab('exchanges')} icon={<ArrowLeftRight />} text={`Takas Onayları (${pendingExchanges.length})`} color="text-[#10b981]" />
          
          <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<MessageSquare />} text="Siber Filtre (Yorumlar)" color="text-[#a855f7]" />
          <TabButton active={activeTab === 'deploy'} onClick={() => setActiveTab('deploy')} icon={<DownloadCloud />} text="Dağıtım (Deploy)" color="text-[#3b82f6]" />
          <TabButton active={activeTab === 'webusers'} onClick={() => setActiveTab('webusers')} icon={<User />} text="Müşteriler" color="text-white" />
          <TabButton active={activeTab === 'license_keys'} onClick={() => setActiveTab('license_keys')} icon={<Key />} text="Lisans Anahtarları" color="text-[#f97316]" />
          <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<Zap />} text="Vitrin Yönetimi" color="text-[#ffc300]" />
          <TabButton active={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')} icon={<Ticket />} text="Bakiye Kuponları" color="text-[#10b981]" />
          <TabButton active={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} icon={<Megaphone />} text="Duyurular" color="text-[#ff4181]" />
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Terminal />} text="Sistem Logları" color="text-slate-300" />
        </div>

        {/* Bildirim Alanı */}
        {status && (
          <div className={`mb-6 p-4 rounded-xl text-xs font-black uppercase tracking-widest border animate-fade-in ${status.type === 'success' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : status.type === 'info' ? 'bg-[#0af2ff]/10 text-[#0af2ff] border-[#0af2ff]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
            &gt; {status.text}
          </div>
        )}

        {/* BİLEŞENLERİN (TABS) CONDITIONAL RENDERING ALANI */}
        {activeTab === 'dashboard' && <AdminDashboardTab dashboardStats={dashboardStats} />}
        {activeTab === 'security' && <AdminSecurityTab showStatus={showStatus} />}
        {activeTab === 'reviews' && <AdminReviewsTab showStatus={showStatus} />}
        
        {/* 🚨 REFORM: AdminDisputesTab render satırı tamamen temizlendi kanka! */}
        {activeTab === 'exchanges' && <AdminExchangeTab pendingExchanges={pendingExchanges} fetchAdminData={fetchAdminData} showStatus={showStatus} />}
        
        {activeTab === 'deploy' && <AdminDeployTab downloadLinks={downloadLinks} fetchAdminData={fetchAdminData} showStatus={showStatus} />}
        {activeTab === 'webusers' && <AdminWebUsersTab webUsers={webUsers} fetchAdminData={fetchAdminData} showStatus={showStatus} />}
        {activeTab === 'license_keys' && <AdminLicenseKeysTab keysList={keysList} fetchAdminData={fetchAdminData} showStatus={showStatus} />}
        {activeTab === 'market' && <AdminMarketTab productsList={productsList} fetchAdminData={fetchAdminData} showStatus={showStatus} />}
        {activeTab === 'coupons' && <AdminCouponsTab coupons={coupons} fetchAdminData={fetchAdminData} showStatus={showStatus} />}
        {activeTab === 'announcements' && <AdminAnnouncementsTab fetchAdminData={fetchAdminData} showStatus={showStatus} />}
        {activeTab === 'logs' && <AdminLogsTab auditLogs={auditLogs} />}

      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, text, color }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all ${active ? `bg-white/10 border border-white/20 ${color} shadow-lg` : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
    {React.cloneElement(icon, { className: 'w-4 h-4' })} {text}
  </button>
);

export default Admin;