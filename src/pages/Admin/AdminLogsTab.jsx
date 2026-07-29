import React from 'react';
import { Terminal } from 'lucide-react';

export default function LogsTab({ auditLogs }) {
  return (
    <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl animate-fade-in">
      <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
        <Terminal className="text-slate-400" /> Sistem İşlem Kayıtları (Audit Logs)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
            <tr>
              <th className="p-3">Tarih</th>
              <th className="p-3">Admin</th>
              <th className="p-3">İşlem Türü</th>
              <th className="p-3">Hedef</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-white/[0.02] font-mono">
                <td className="p-3 text-[10px] text-gray-500">
                  {new Date(log.createdAt || log.date).toLocaleString('tr-TR')}
                </td>
                <td className="p-3 font-bold text-white">@{log.adminName || log.user || 'Root'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase bg-[#0af2ff]/10 text-[#0af2ff]`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-xs text-gray-400">{log.target}</td>
              </tr>
            ))}
            {auditLogs.length === 0 && (
              <tr><td colSpan="4" className="text-center p-10 text-gray-500 text-xs font-bold uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">Log kaydı bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}