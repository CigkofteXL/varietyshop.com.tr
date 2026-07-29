import React from 'react';
import { FileText } from 'lucide-react';

export default function DistanceSelling() {
  return (
    <div className="min-h-screen bg-[#05060a] pt-32 pb-20 px-4 md:px-8 font-['Space_Grotesk'] text-gray-300">
      <div className="max-w-4xl mx-auto bg-[#0a0c12] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="w-16 h-16 bg-[#0af2ff]/10 rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#0af2ff]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-sm font-bold text-gray-500 tracking-widest uppercase mt-1">VarietyShop.com.tr Yasal Bildirimi</p>
          </div>
        </div>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Madde 1 - Taraflar</h2>
            <p><strong>Satıcı:</strong> VarietyShop Siber Yazılım ve Otomasyon Hizmetleri (Bundan böyle "Satıcı" olarak anılacaktır.)</p>
            <p><strong>Web Sitesi:</strong> varietyshop.com.tr</p>
            <p><strong>Alıcı:</strong> Siteye üye olan ve dijital ürün/hizmet satın alan son kullanıcı (Bundan böyle "Alıcı" olarak anılacaktır.)</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Madde 2 - Sözleşmenin Konusu</h2>
            <p>
              İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait elektronik ortamda faaliyet gösteren web sitesi üzerinden elektronik ortamda siparişini verdiği dijital içerik, yazılım, lisans ve sanal bakiyenin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Madde 3 - Teslimat Şekli</h2>
            <p>
              Alıcı tarafından satın alınan dijital ürün, yazılım veya sanal bakiye (VC), ödemenin başarıyla tamamlanmasının ardından anında otomatik olarak Alıcı'nın hesabına aktarılır veya paneli üzerinden erişime açılır. Fiziki bir teslimat yapılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Madde 4 - Cayma Hakkı</h2>
            <p>
              Alıcı, satın aldığı ürünün dijital nitelikte olması ve anında ifa edilen hizmetler kapsamında bulunması sebebiyle Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin (ğ) bendi uyarınca cayma hakkına sahip değildir. Satın alınan dijital varlıkların iadesi talep edilemez.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}