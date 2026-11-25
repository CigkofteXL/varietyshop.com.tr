# 🛍️ Varietyshop (varietyshop.com.tr) — Web Application

> **Canlı ApplyBAU YBS Portföyü (Harun Durmuş — VarietyShop & Haduva):** [https://varietyshop.com.tr](https://varietyshop.com.tr)
> **Status:** ⚠️ ARCHIVED / INACTIVE  
> *This project is no longer active in production and is shared on GitHub for archive, showcase, and educational purposes.*

**VarietyShop**, kullanıcılar için dijital ürün satışı, lisans anahtarı dağıtımı, borsa/exchange modülleri ve kapsamlı bir kullanıcı paneli sunan; yöneticiler için ise gelişmiş sistem kontrolü sağlayan modern bir React tabanlı web uygulamasıdır.

---

## 🚀 Ana Özellikler ve Modüller

Proje, hem son kullanıcı hem de sistem yöneticisi tarafında zengin modüller içermektedir:

### 🛍️ Kullanıcı ve Mağaza Mimarisi
- **Pazar Yeri & Sepet Yönetimi:** Dynamic `Market.jsx`, `Cart.jsx` ve `CartContext.jsx` ile ürün listeleme ve sepet mantığı.
- **Dijital Lisans & Değişim (Exchange):** Kullanıcıların dijital varlıkları/ürünleri takas edebileceği veya satın alabileceği `Exchange.jsx` altyapısı.
- **Kullanıcı Hesabı & Profil:** Giriş/Kayıt (`Login.jsx`, `Register.jsx`), E-posta Doğrulama (`VerifyEmail.jsx`), Şifre Sıfırlama (`ResetPassword.jsx`) ve Bildirim Paneli (`Notifications.jsx`).
- **Destek ve İnceleme:** Müşteri destek sistemi (`Support.jsx`) ve ürün değerlendirme modülü (`ReviewModal.jsx`).
- **Yasal Metinler (Legal):** Mesafeli Satış Sözleşmesi, Gizlilik Politikası, İade Koşulları ve Kullanım Şartları modülleri.

### 🛡️ Gelişmiş Yönetici (Admin) Paneli
- **Dashboard & Analiz:** Genel sistem metrikleri ve sunucu/deploy kontrolü (`AdminDeployTab.jsx`).
- **Lisans & Kupon Yönetimi:** Otomatik lisans anahtarı üretimi/dağıtımı (`AdminLicenseKeysTab.jsx`) ve indirim kuponu yönetimi (`AdminCouponsTab.jsx`).
- **Kullanıcı & Güvenlik Kontrolü:** Web kullanıcıları yönetimi (`AdminWebUsersTab.jsx`), güvenlik ayarları (`AdminSecurityTab.jsx`) ve sistem log takibi (`AdminLogsTab.jsx`).
- **Duyuru & Borsa Yönetimi:** Platform geneli duyurular ve exchange modül yönetimi.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

- **Frontend Framework:** React.js (JSX)
- **Build Tool:** Vite
- **State & Context Management:** React Context API (`CartContext`, `NotificationContext`)
- **Styling:** CSS3 / Modern Web Standartları
- **Routing:** React Router (`Linkrouter.jsx`)

---

## 💻 Kurulum ve Çalıştırma

Geliştirme ortamında projeyi yerel olarak çalıştırmak için:

1. Depoyu klonlayın:
   ```
   git clone https://github.com/CigkofteXL/varietyshop.com.tr.git



2. Proje dizinine gidin:
```
cd varietyshop

```


3. Bağımlılıkları yükleyin:
```bash
npm install

```


4. Geliştirici sunucusunu başlatın:
```bash
npm run dev

```



---

## 🎨 Marka ve Logo Telif Uyarısı (Trademarks & Logos)

> ⚠️ **ÖNEMLİ UYARI / IMPORTANT NOTE:**
> Bu depo GPLv3 açık kaynak lisansı altında paylaşılmış olsa da, proje içerisinde yer alan **VarietyShop logosu, görselleri, marka isimleri ve kurumsal kimlik unsurları Bu Lisansın Dışındadır**.
> Proje kodlarını özgürce kullanabilir, inceleyebilir ve türetebilirsiniz; ancak **VarietyShop logosunu, markasını ve görsellerini hiçbir ticari veya kişisel projede izinsiz olarak KULLANAMAZSINIZ**. Projeyi kendi amacınız için kullanırken lütfen marka görsellerini kendi logonuzla değiştirin.

---

## 📜 Lisans (License)

Bu proje **GNU General Public License v3.0 (GPLv3)** altında lisanslanmıştır.

Açık kaynak kod ilkelerine uygun olarak kaynak kodları özgürce inceleyebilir, değiştirebilir ve dağıtabilirsiniz. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

