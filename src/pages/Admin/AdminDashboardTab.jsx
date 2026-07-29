import React from 'react';
// 🚨 YENİ: LineChart yerine AreaChart ve Area kullanıyoruz!
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Wallet, TrendingUp, LifeBuoy, Box, RadioReceiver } from 'lucide-react';

export default function AdminDashboardTab({ dashboardStats }) {
  if (!dashboardStats) return <div className="text-[#0af2ff] font-black tracking-widest animate-pulse">SİBER İSTİHBARAT TOPLANIYOR...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 🚀 ÜST KARTLAR (6'LI SİBER İSTİHBARAT AĞI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#0af2ff]/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0af2ff]/5 rounded-full blur-3xl group-hover:bg-[#0af2ff]/10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Toplam Ajan</span>
            <Users className="w-5 h-5 text-[#0af2ff]" />
          </div>
          <div className="text-3xl font-black text-white relative z-10">{dashboardStats.totalWebUsers || 0}</div>
        </div>

        <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#10b981]/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full blur-3xl group-hover:bg-[#10b981]/10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Piyasa Hacmi (VC)</span>
            <Wallet className="w-5 h-5 text-[#10b981]" />
          </div>
          <div className="text-3xl font-black text-[#10b981] relative z-10">{dashboardStats.totalEconomyVc || 0} ₺</div>
        </div>

        <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#ffc300]/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc300]/5 rounded-full blur-3xl group-hover:bg-[#ffc300]/10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Haftalık Satış</span>
            <Activity className="w-5 h-5 text-[#ffc300]" />
          </div>
          <div className="text-3xl font-black text-[#ffc300] relative z-10">
            {dashboardStats.weeklySales ? dashboardStats.weeklySales.reduce((acc, curr) => acc + curr.totalSales, 0) : 0} Adet
          </div>
        </div>

        <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#a855f7]/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7]/5 rounded-full blur-3xl group-hover:bg-[#a855f7]/10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Bugün Aktif Ajanlar</span>
            <RadioReceiver className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div className="text-3xl font-black text-[#a855f7] relative z-10">{dashboardStats.activeUsersToday || 0}</div>
        </div>

        <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-[#f97316]/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/5 rounded-full blur-3xl group-hover:bg-[#f97316]/10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Satışa Hazır Stok</span>
            <Box className="w-5 h-5 text-[#f97316]" />
          </div>
          <div className="text-3xl font-black text-[#f97316] relative z-10">{dashboardStats.totalStock || 0}</div>
        </div>

        <div className={`bg-[#0a0c12]/80 backdrop-blur-md border ${dashboardStats.openTickets > 0 ? 'border-[#fb2e00]/50 shadow-[0_0_15px_rgba(251,46,0,0.2)]' : 'border-white/5'} p-6 rounded-2xl relative overflow-hidden group transition-all`}>
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${dashboardStats.openTickets > 0 ? 'bg-[#fb2e00]/10' : 'bg-gray-500/5'}`}></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className={`font-bold uppercase tracking-widest text-xs ${dashboardStats.openTickets > 0 ? 'text-[#fb2e00]' : 'text-gray-400'}`}>
              Bekleyen Destek (S.O.S)
            </span>
            <LifeBuoy className={`w-5 h-5 ${dashboardStats.openTickets > 0 ? 'text-[#fb2e00] animate-pulse' : 'text-gray-500'}`} />
          </div>
          <div className={`text-3xl font-black relative z-10 ${dashboardStats.openTickets > 0 ? 'text-[#fb2e00]' : 'text-gray-500'}`}>
            {dashboardStats.openTickets || 0}
          </div>
        </div>
      </div>

      {/* 📈 NEON GRAFİK ALANI */}
      <div className="bg-[#0a0c12]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden">
        {/* Arka plan siber ışıltı */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#10b981]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <TrendingUp className="w-5 h-5 text-[#10b981]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Siber Karargah Ciro Akışı</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Son 7 Günlük Operasyonel Gelir</p>
          </div>
        </div>

        <div className="h-[320px] w-full relative z-10">
          {dashboardStats.weeklySales && dashboardStats.weeklySales.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardStats.weeklySales} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                {/* 🚨 YENİ: Neon gölge dolgusu için defs ekledik */}
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                
                <XAxis 
                  dataKey="date" 
                  stroke="#444" 
                  tick={{ fill: '#666', fontSize: 11, fontWeight: 'bold' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickMargin={12} 
                />
                
                <YAxis 
                  stroke="#444" 
                  tick={{ fill: '#666', fontSize: 11, fontWeight: 'bold' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `${value} ₺`}
                />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0c12', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
                  itemStyle={{ color: '#10b981', fontWeight: '900', fontSize: '16px' }}
                  labelStyle={{ color: '#888', fontSize: '12px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}
                  cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                
                {/* 🚨 YENİ: Line yerine Area kullanıp içini neon yeşili gradient ile doldurduk */}
                <Area 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  name="Günlük Ciro" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 7, fill: '#10b981', stroke: '#0a0c12', strokeWidth: 3, shadow: '0 0 10px #10b981' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-xs border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
              <Activity className="w-8 h-8 mb-3 opacity-20" />
              Son 7 güne ait ciro sinyali alınamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}