import React from 'react';
import { Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#05060a] pt-32 pb-20 px-4 md:px-8 font-['Space_Grotesk'] text-gray-300">
      <div className="max-w-4xl mx-auto bg-[#0a0c12] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="w-16 h-16 bg-[#ff4181]/10 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#ff4181]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest">Gizlilik ve Veri Güvenliği (KVKK)</h1>
            <p className="text-sm font-bold text-gray-500 tracking-widest uppercase mt-1">VarietyShop.com.tr Yasal Bildirimi</p>
          </div>
        </div>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">1. Toplanan Veriler ve Siber İstihbarat</h2>
            <p>
              Sistemlerimize bağlandığınızda, hesap güvenliğinizi sağlamak ve yetkisiz erişimleri tespit etmek amacıyla; sisteme giriş yaptığınız cihaz bilgileri (User-Agent), erişim sağladığınız IP adresiniz ve işlem zaman damgalarınız loglanmaktadır. Bu veriler sadece siber güvenlik ihlallerinin tespiti için kullanılır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">2. Yerel Depolama ve Oturum Yönetimi</h2>
            <p>
              <strong>Sistemimizde modası geçmiş ve güvensiz takip dosyaları barındırılmaz ve kullanılmaz.</strong> Oturumunuz, yüksek güvenlikli JWT (JSON Web Token) altyapısı ile yönetilir. Oturum bilgileriniz sadece tarayıcınızın izole edilmiş yerel depolama (Local Storage) biriminde şifreli olarak tutulur. Tarayıcınızı veya sekmenizi kapattığınızda kritik yetkilendirmeler belirli süre sonunda otomatik olarak imha edilir. Sizi internet üzerinde takip eden hiçbir izleyici (tracker) eklentisine sitemizde yer verilmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">3. Verilerin Üçüncü Şahıslarla Paylaşımı</h2>
            <p>
              VarietyShop.com.tr, veri güvenliğini en üst düzeyde tutar. Adınız, e-posta adresiniz, sistem bakiye verileriniz ve bağlantı IP bilgileriniz hiçbir şekilde reklam şirketleriyle, üçüncü parti veri analiz firmalarıyla veya şahıslarla paylaşılmaz. Sadece resmi hukuki merciler tarafından yasal mevzuatlara uygun bir şekilde talep edilmesi halinde paylaşım yapılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">4. Ödeme Verileri Güvenliği</h2>
            <p>
              Kredi kartı ve ödeme işlemleriniz doğrudan lisanslı ödeme kuruluşlarının (BDDK onaylı) altyapısı üzerinden şifrelenmiş kanallar aracılığıyla (256-bit SSL) gerçekleşir. Kredi kartı numaralarınız veya finansal verileriniz bizim sunucularımızda kesinlikle saklanmaz veya görüntülenemez.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}