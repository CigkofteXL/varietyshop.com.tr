import React from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#05060a] pt-32 pb-20 px-4 md:px-8 font-['Space_Grotesk'] text-gray-300">
      <div className="max-w-4xl mx-auto bg-[#0a0c12] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="w-16 h-16 bg-[#fb2e00]/10 rounded-2xl flex items-center justify-center">
            <RefreshCcw className="w-8 h-8 text-[#fb2e00]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest">İptal ve İade Politikası</h1>
            <p className="text-sm font-bold text-gray-500 tracking-widest uppercase mt-1">VarietyShop.com.tr Yasal Bildirimi</p>
          </div>
        </div>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4 items-start">
            <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <p className="text-red-200">
              <strong>ÖNEMLİ UYARI:</strong> VarietyShop.com.tr üzerinden sunulan hizmetler ve yazılımlar dijital içerik sınıfına girmektedir. Satın alım sonrası hizmet anında aktif edildiğinden, yasal mevzuatlar gereği dijital ürünlerde iade yapılmamaktadır.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">1. Cayma Hakkı İstisnası</h2>
            <p>
              27.11.2014 tarihli ve 29188 sayılı Resmi Gazete'de yayımlanan Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin 1. fıkrasının (ğ) bendi uyarınca; <strong>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler"</strong> cayma hakkının istisnaları kapsamındadır.
            </p>
            <p className="mt-2">
              Bu nedenle, sitemiz üzerinden satın aldığınız bot, otomasyon, lisans anahtarı ve dijital bakiyeler (VC) satın alım işlemi tamamlandıktan ve tarafınıza teslim edildikten sonra iptal veya iade edilemez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">2. Altyapı ve Sorumluluklar</h2>
            <p>
              Üçüncü parti sistemlerde (örneğin Wov hesaplarında) yaşanabilecek oyun içi kural ihlalleri, hesap kapanmaları veya üçüncü parti platformların yaptığı güncellemeler nedeniyle yazılımların çalışmaması durumunda sorumluluk kullanıcıya aittir. Sistemlerimizin çalışma garantisi satıldığı anki mevcut durumları kapsar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">3. Hatalı Bakiye Yüklemeleri</h2>
            <p>
              Kullanıcının kendi hatasıyla yanlış hesaba bakiye (VC) yüklemesi durumunda iade yapılmaz. Ancak sistemsel bir hata sebebiyle ödeme alınmasına rağmen hesabınıza bakiye yansımamışsa, durumun tespiti halinde ücret iadesi bankanıza (1-3 iş günü içerisinde) gerçekleştirilir veya bakiye manuel olarak hesabınıza tanımlanır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}