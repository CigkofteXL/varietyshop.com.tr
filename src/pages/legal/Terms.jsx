import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#05060a] pt-32 pb-20 px-4 md:px-8 font-['Space_Grotesk'] text-gray-300">
      <div className="max-w-4xl mx-auto bg-[#0a0c12] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="w-16 h-16 bg-[#ffc300]/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-[#ffc300]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest">Kullanım Koşulları</h1>
            <p className="text-sm font-bold text-gray-500 tracking-widest uppercase mt-1">VarietyShop.com.tr Yasal Bildirimi</p>
          </div>
        </div>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">1. Sisteme Erişim ve Hesap Güvenliği</h2>
            <p>
              Sitemize kayıt olan (ajan/kullanıcı) herkes, hesap bilgilerinin (kullanıcı adı, şifre ve erişim jetonları) gizliliğinden kendisi sorumludur. Hesabınız üzerinden yapılan tüm işlemler sizin tarafınızdan yapılmış sayılır. Güvenlik ihlali tespit edildiğinde hesaplar önceden haber verilmeksizin askıya alınabilir veya yasaklanabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">2. Hizmet Kötüye Kullanımı</h2>
            <p>
              VarietyShop.com.tr üzerinden sunulan otomasyon yazılımlarını, API hizmetlerini ve bot bağlantılarını sunucularımıza zarar verecek (DDoS vb.), sistemi yavaşlatacak veya diğer kullanıcıların haklarını ihlal edecek şekilde kullanmak kesinlikle yasaktır. Bu tür girişimler anında engellenir ve kalıcı "Blacklist" (IP ban) uygulaması devreye sokulur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">3. Fikri Mülkiyet</h2>
            <p>
              Sitemizde bulunan tüm yazılımların, kod mimarilerinin, tasarımların ve içeriklerin hakları VarietyShop.com.tr'ye aittir. İzin alınmaksızın kopyalanması, tersine mühendislik (reverse engineering) yapılması veya ticari amaçla başka platformlarda satılması yasaktır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}