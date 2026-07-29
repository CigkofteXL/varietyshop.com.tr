import React, { useState } from 'react';
import { PlusCircle, UploadCloud, Trash2, Edit3, Eye, Key, X, Zap, Percent } from 'lucide-react';

export default function MarketTab({ productsList, fetchAdminData, showStatus }) {
  // YENİ: Pazarlama state'leri eklendi
  const [product, setProduct] = useState({ 
    name: '', description: '', price: '', stock: '', category: '', imageUrl: '',
    flashSalePrice: '', flashSaleEndDate: '', cashbackPercentage: ''
  });
  
  // --- MODAL STATE'LERİ ---
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Stok Ekleme
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockKeys, setStockKeys] = useState(''); 

  // Ürün Düzenleme
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Stok Görüntüleme
  const [isViewStockModalOpen, setIsViewStockModalOpen] = useState(false);
  const [currentStockList, setCurrentStockList] = useState([]);

  // ==========================================
  // 1. ÜRÜN EKLEME
  // ==========================================
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vs_token');
    const payload = {
      name: product.name, 
      description: product.description, 
      category: product.category, 
      imageUrl: product.imageUrl,
      price: parseFloat(product.price) || 0, 
      stock: product.stock.trim() === '' ? -1 : parseInt(product.stock, 10),
      // 🚨 YENİ: PAZARLAMA VERİLERİ
      flashSalePrice: product.flashSalePrice ? parseFloat(product.flashSalePrice) : null,
      flashSaleEndDate: product.flashSaleEndDate ? new Date(product.flashSaleEndDate).toISOString() : null,
      cashbackPercentage: parseFloat(product.cashbackPercentage) || 0
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        showStatus('success', 'Ürün vitrine eklendi.');
        setProduct({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '', flashSalePrice: '', flashSaleEndDate: '', cashbackPercentage: '' });
        fetchAdminData();
      } else { showStatus('error', await response.text()); }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  // ==========================================
  // 2. ÜRÜN SİLME
  // ==========================================
  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Bu ilanı ve içindeki tüm stokları kalıcı olarak silmek istiyor musunuz?")) return;
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/product/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) { showStatus('success', 'İlan imha edildi.'); fetchAdminData(); }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  // ==========================================
  // 3. ÜRÜN DÜZENLEME
  // ==========================================
  const openEditModal = (p) => {
    setEditingProduct({ ...p });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/product/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description,
          price: parseFloat(editingProduct.price) || 0,
          category: editingProduct.category,
          imageUrl: editingProduct.imageUrl,
          // 🚨 YENİ: PAZARLAMA VERİLERİ
          flashSalePrice: editingProduct.flashSalePrice ? parseFloat(editingProduct.flashSalePrice) : null,
          flashSaleEndDate: editingProduct.flashSaleEndDate ? new Date(editingProduct.flashSaleEndDate).toISOString() : null,
          cashbackPercentage: parseFloat(editingProduct.cashbackPercentage) || 0
        })
      });
      if (response.ok) {
        showStatus('success', 'İlan bilgileri güncellendi.');
        setIsEditModalOpen(false);
        fetchAdminData();
      } else { showStatus('error', 'Güncelleme başarısız.'); }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  // ==========================================
  // 4. STOK EKLEME
  // ==========================================
  const handleAddStock = async () => {
    if (!stockKeys.trim()) { alert("Boş stok eklenemez!"); return; }
    const keyArray = stockKeys.split('\n').map(k => k.trim()).filter(k => k !== '');
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/product/stock?productId=${selectedProductId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(keyArray)
      });
      if (response.ok) {
        showStatus('success', 'Mühimmat depoya indirildi.');
        setIsStockModalOpen(false); setStockKeys(''); setSelectedProductId(null); fetchAdminData();
      } else { showStatus('error', 'Stok eklenemedi.'); }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  // ==========================================
  // 5. STOKLARI GÖRÜNTÜLEME VE SİLME
  // ==========================================
  const fetchProductStock = async (id) => {
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/product/${id}/stock`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentStockList(data);
        setSelectedProductId(id);
        setIsViewStockModalOpen(true);
      }
    } catch(err) { showStatus('error', 'Stoklar çekilemedi.'); }
  };

  const handleDeleteSingleStock = async (keyId) => {
    if(!window.confirm("Bu şifreyi/lisansı silmek istediğinize emin misiniz?")) return;
    const token = localStorage.getItem('vs_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/market/stock/${keyId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showStatus('success', 'Hatalı lisans silindi.');
        setCurrentStockList(currentStockList.filter(k => k.id !== keyId));
        fetchAdminData();
      } else {
        showStatus('error', 'Lisans silinemedi (Satılmış olabilir).');
      }
    } catch(err) { showStatus('error', 'Ağ hatası.'); }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        
        {/* SOL PANEL - YENİ İLAN EKLE */}
        <div className="lg:col-span-1 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl h-fit">
          <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><PlusCircle className="w-4 h-4 text-[#ffc300]" /> Yeni İlan Ekle</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <InputBox label="Ürün Adı" type="text" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} focusColor="focus:border-[#ffc300]/50" required={true} />
            <InputBox label="Açıklama" type="text" value={product.description} onChange={e => setProduct({...product, description: e.target.value})} focusColor="focus:border-[#ffc300]/50" required={true} />
            <div className="grid grid-cols-2 gap-4">
              <InputBox label="Fiyat (₺)" type="number" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} focusColor="focus:border-[#ffc300]/50" required={true} />
              <InputBox label="Kategori" type="text" value={product.category} onChange={e => setProduct({...product, category: e.target.value})} placeholder="VIP, Oyun..." focusColor="focus:border-[#ffc300]/50" required={true} />
            </div>
            <InputBox label="Görsel URL" type="text" value={product.imageUrl} onChange={e => setProduct({...product, imageUrl: e.target.value})} focusColor="focus:border-[#ffc300]/50" required={false} />
            
            {/* 🚀 YENİ: PAZARLAMA VE DÖNÜŞÜM ALANI */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 mt-2">
              <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Zap className="w-3 h-3 text-[#0af2ff]" /> Pazarlama Modülleri</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <InputBox label="İndirimli Fiyat" type="number" placeholder="Boş = İndirim Yok" value={product.flashSalePrice} onChange={e => setProduct({...product, flashSalePrice: e.target.value})} focusColor="focus:border-[#0af2ff]/50" required={false} />
                <InputBox label="İade Yüzdesi (%)" type="number" placeholder="Örn: 5" value={product.cashbackPercentage} onChange={e => setProduct({...product, cashbackPercentage: e.target.value})} focusColor="focus:border-[#10b981]/50" required={false} />
              </div>
              <InputBox label="İndirim Bitiş Tarihi" type="datetime-local" value={product.flashSaleEndDate} onChange={e => setProduct({...product, flashSaleEndDate: e.target.value})} focusColor="focus:border-[#0af2ff]/50" required={false} />
            </div>

            <button type="submit" className="w-full py-4 mt-2 bg-[#ffc300]/10 hover:bg-[#ffc300] text-[#ffc300] hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all">Vitrine Ekle</button>
          </form>
        </div>

        {/* SAĞ PANEL - MARKET VERİTABANI */}
        <div className="lg:col-span-2 bg-[#0a0c12] border border-white/5 rounded-3xl p-6 shadow-xl">
          <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest">Market Veritabanı</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5">
                <tr><th className="p-3">Ürün</th><th className="p-3">Pazarlama</th><th className="p-3">Stok</th><th className="p-3">Fiyat</th><th className="p-3 text-right">İşlem</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {productsList.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">{p.name} <span className="text-gray-500 text-[10px] ml-2">({p.category})</span></td>
                    
                    {/* YENİ: Pazarlama Rozetleri */}
                    <td className="p-3">
                      <div className="flex gap-2">
                        {p.flashSalePrice && new Date(p.flashSaleEndDate) > new Date() && (
                          <span className="px-2 py-1 bg-[#0af2ff]/10 text-[#0af2ff] border border-[#0af2ff]/20 rounded-md text-[9px] font-black uppercase flex items-center gap-1" title={`İndirimli: ${p.flashSalePrice}₺`}><Zap className="w-3 h-3"/> İndirim</span>
                        )}
                        {p.cashbackPercentage > 0 && (
                          <span className="px-2 py-1 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-md text-[9px] font-black uppercase flex items-center gap-1" title={`%${p.cashbackPercentage} Cashback`}><Percent className="w-3 h-3"/> İade</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 font-mono text-[#ffc300] font-bold">{p.stock} Adet</td>
                    <td className="p-3 font-mono text-[#10b981]">{p.price} ₺</td>
                    <td className="p-3 text-right flex justify-end gap-2">
                      <button onClick={() => openEditModal(p)} className="p-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="İlanı Düzenle"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => fetchProductStock(p.id)} className="p-1.5 bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white rounded-lg transition-colors" title="Şifreleri/Stokları Gör"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setSelectedProductId(p.id); setIsStockModalOpen(true); }} className="p-1.5 bg-[#ffc300]/10 text-[#ffc300] hover:bg-[#ffc300] hover:text-black rounded-lg transition-colors" title="Lisans/Key Yükle"><UploadCloud className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded-lg transition-all text-red-500 hover:bg-red-500 hover:text-white" title="İlanı Sil"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
                {productsList.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">Vitrin Boş.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==========================================
          MODALLAR
      ========================================== */}

      {/* --- 1. STOK EKLEME MODALI --- */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="max-w-xl w-full bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-10 relative shadow-2xl">
            <button onClick={() => { setIsStockModalOpen(false); setStockKeys(''); }} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-black text-[#ffc300] mb-2 uppercase tracking-tighter italic">Stok Yükle</h2>
            <p className="text-gray-500 text-sm mb-8 font-medium">Her satıra bir adet lisans anahtarı / kod gelecek şekilde yapıştırın.</p>
            <div className="space-y-6">
              <textarea 
                value={stockKeys} 
                onChange={e => setStockKeys(e.target.value)} 
                placeholder="AAAA-BBBB-CCCC-DDDD&#10;user:pass&#10;link..." 
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white outline-none h-48 resize-none focus:border-[#ffc300]/50 text-sm font-mono whitespace-pre"
              ></textarea>
              <div className="flex gap-4 pt-4">
                <button onClick={() => { setIsStockModalOpen(false); setStockKeys(''); }} className="flex-1 py-4 bg-white/5 text-gray-500 font-black uppercase rounded-2xl text-xs hover:bg-white/10">İptal</button>
                <button onClick={handleAddStock} className="flex-[2] py-4 bg-[#ffc300] text-black font-black uppercase rounded-2xl text-xs shadow-[0_0_30px_rgba(255,195,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all">Stokları Mühürle</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. ÜRÜN DÜZENLEME MODALI --- */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="max-w-md w-full bg-[#0d0d12] border border-blue-500/30 rounded-[2.5rem] p-8 relative shadow-[0_0_40px_rgba(59,130,246,0.1)] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black text-blue-500 mb-6 uppercase tracking-widest flex items-center gap-2"><Edit3 className="w-6 h-6"/> İlanı Düzenle</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <InputBox label="Ürün Adı" type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} focusColor="focus:border-blue-500/50" required={true} />
              <InputBox label="Açıklama" type="text" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} focusColor="focus:border-blue-500/50" required={true} />
              <div className="grid grid-cols-2 gap-4">
                <InputBox label="Fiyat (₺)" type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} focusColor="focus:border-blue-500/50" required={true} />
                <InputBox label="Kategori" type="text" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} focusColor="focus:border-blue-500/50" required={true} />
              </div>
              <InputBox label="Görsel URL" type="text" value={editingProduct.imageUrl || ''} onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})} focusColor="focus:border-blue-500/50" required={false} />
              
              {/* 🚀 YENİ: DÜZENLEME MODALINDA PAZARLAMA */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 mt-4">
                <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2 mb-2"><Zap className="w-3 h-3 text-[#0af2ff]" /> Pazarlama Modülleri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputBox label="İndirimli Fiyat" type="number" placeholder="Boş = İndirim Yok" value={editingProduct.flashSalePrice || ''} onChange={e => setEditingProduct({...editingProduct, flashSalePrice: e.target.value})} focusColor="focus:border-[#0af2ff]/50" required={false} />
                  <InputBox label="İade Yüzdesi (%)" type="number" placeholder="Örn: 5" value={editingProduct.cashbackPercentage || ''} onChange={e => setEditingProduct({...editingProduct, cashbackPercentage: e.target.value})} focusColor="focus:border-[#10b981]/50" required={false} />
                </div>
                <InputBox label="İndirim Bitiş Tarihi" type="datetime-local" value={editingProduct.flashSaleEndDate ? editingProduct.flashSaleEndDate.substring(0, 16) : ''} onChange={e => setEditingProduct({...editingProduct, flashSaleEndDate: e.target.value})} focusColor="focus:border-[#0af2ff]/50" required={false} />
              </div>

              <button type="submit" className="w-full py-4 mt-4 bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Değişiklikleri Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {/* --- 3. STOK GÖRÜNTÜLEME MODALI --- */}
      {isViewStockModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="max-w-lg w-full bg-[#0d0d12] border border-purple-500/30 rounded-[2.5rem] p-8 relative shadow-[0_0_40px_rgba(168,85,247,0.1)] flex flex-col max-h-[80vh]">
            <button onClick={() => setIsViewStockModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-black text-purple-500 mb-6 uppercase tracking-widest flex items-center gap-2"><Key className="w-5 h-5"/> Mevcut Stoklar ({currentStockList.length})</h2>
            
            <div className="overflow-y-auto pr-2 space-y-2 flex-1 min-h-[200px]">
              {currentStockList.length > 0 ? (
                currentStockList.map(stock => (
                  <div key={stock.id} className="flex justify-between items-center p-3 bg-black border border-white/5 rounded-xl group hover:border-purple-500/30 transition-colors">
                    <span className="font-mono text-gray-300 text-xs truncate pr-4">{stock.keyData}</span>
                    <button 
                      onClick={() => handleDeleteSingleStock(stock.id)}
                      className="text-gray-600 hover:text-red-500 transition-colors p-1"
                      title="Bu şifreyi sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-600 text-xs font-bold uppercase tracking-widest">
                  Bu ürüne ait kullanılabilir stok bulunmuyor.
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

    </>
  );
}

const InputBox = ({ label, type, value, onChange, placeholder, required = false, focusColor = "focus:border-[#ffc300]/50" }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block pl-1">{label}</label>
    <input type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} className={`w-full bg-[#12121a] border border-white/10 text-white rounded-xl p-3 outline-none ${focusColor} font-medium text-xs transition-colors`} />
  </div>
);