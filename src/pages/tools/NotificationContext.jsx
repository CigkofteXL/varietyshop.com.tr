import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import ReviewModal from './ReviewModal'; 

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // 🚨 NOT: Orijinal kodundaki 'notifications' state'i sadece ekranda 5 saniye durup silinen Toast'lar için kullanılıyordu.
  // Projedeki mevcut UI yapısını bozmamak adına bu state ismini aynen koruyoruz kanka.
  const [notifications, setNotifications] = useState([]);
  
  // Modal Global State'leri
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);

  const currentUser = localStorage.getItem('vs_user');
  const token = localStorage.getItem('vs_token');

  // Siber Hafıza: Ekrana mükerrer veya eski toast'ların basılmasını engelleyen radar listesi
  const seenIdsRef = useRef(new Set());
  const isInitialLoad = useRef(true);

  // 🛰️ BİLDİRİM ÇEKME VE TOAST TETİKLEME MOTORU
  const fetchNotifications = async () => {
    if (!token || !currentUser) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();

        if (isInitialLoad.current) {
          // İlk bağlantıda veri tabanındaki geçmiş bildirimleri hafızaya alıyoruz kanka.
          // Böylece sayfa her yenilendiğinde ekrana eski bildirim yağmuru yağmıyor.
          data.forEach(n => seenIdsRef.current.add(n.id));
          isInitialLoad.current = false;
        } else {
          // Sonraki polling döngülerinde radara yakalanan YENİ ve OKUNMAMIŞ sinyalleri toast olarak fırlat kanka
          data.forEach(n => {
            if (!seenIdsRef.current.has(n.id)) {
              seenIdsRef.current.add(n.id);
              if (!n.read) {
                showToast(n.title, n.message, n.productId);
              }
            }
          });
        }
      }
    } catch (err) {
      console.error("Bildirim istihbaratı sorgulanamadı kanka:", err);
    }
  };

  useEffect(() => {
    // Sayfa ilk yüklendiğinde hemen bir kez yokla
    fetchNotifications();

    // 🚨 POLLING DÖNGÜSÜ: Her 15 saniyede bir arkadan sessizce yeni bir bildirim var mı diye API'yi yoklar
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [token, currentUser]);

  // Ekranda beliren ve 5 saniye sonra imha olan siber toast fonksiyonu
  const showToast = (title, message, productId = null) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, title, message, productId }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000); 
  };

  const openReview = (productId) => {
     setReviewProductId(productId);
     setIsReviewModalOpen(true);
  };

  // İhtiyaç halinde sitenin herhangi bir yerinden çağırabileceğin tümünü okundu işaretleme tüneli
  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Radarı temizleme sinyali başarısız kanka:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, openReview, markAllAsRead, fetchNotifications }}>
      {children}
      
      {/* GLOBAL TOAST UI */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3">
        {notifications.map(n => (
          <div key={n.id} className="bg-[#0a0a0f] border border-[#0af2ff]/30 backdrop-blur-xl p-4 rounded-2xl shadow-[0_0_20px_rgba(10,242,255,0.1)] animate-slide-in flex flex-col gap-1 min-w-[250px]">
            <div className="flex items-center gap-2 text-[#0af2ff] text-xs font-black uppercase">
               <div className="w-1.5 h-1.5 bg-[#0af2ff] rounded-full animate-pulse"></div>
               {n.title}
            </div>
            <div className="text-gray-200 text-sm font-medium whitespace-pre-wrap">{n.message}</div>
            
            {n.productId && (
               <button 
                 onClick={() => openReview(n.productId)}
                 className="mt-2 py-2 bg-[#ffc300]/10 text-[#ffc300] hover:bg-[#ffc300] hover:text-black font-black uppercase tracking-widest text-[10px] rounded-lg border border-[#ffc300]/30 transition-all flex items-center justify-center gap-2"
               >
                 <Star className="w-3 h-3" /> İstihbarat Bırak
               </button>
            )}
          </div>
        ))}
      </div>

      {/* GLOBAL YORUM MODALI */}
      <ReviewModal 
          isOpen={isReviewModalOpen} 
          onClose={() => setIsReviewModalOpen(false)} 
          productId={reviewProductId} 
      />

    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);