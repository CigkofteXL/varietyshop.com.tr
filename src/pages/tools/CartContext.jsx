import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // İlk açılışta LocalStorage'dan sepeti çek, yoksa boş array [] dön
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('vs_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sepet her değiştiğinde LocalStorage'a kaydet (Sayfa yenilense de silinmez)
  useEffect(() => {
    localStorage.setItem('vs_cart', JSON.stringify(cart));
  }, [cart]);

  // Sepete Ürün Ekle (Eğer varsa miktarını artır)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Sepetten Tamamen Çıkar
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item.id !== productId));
  };

  // Sepeti Komple Boşalt (Ödeme sonrası C# bunu tetikleyecek)
  const clearCart = () => setCart([]);

  // Toplam Tutar Hesaplayıcı
  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Sepetteki Toplam Ürün Sayısı (Bildirimdeki kırmızı nokta için)
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// Diğer dosyalarda kolayca kullanmak için özel Hook
export const useCart = () => useContext(CartContext);