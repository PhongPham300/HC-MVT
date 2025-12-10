import React, { useState } from 'react';
import { AppData, PurchaseRecord } from '../types';
import { Plus, Check, AlertCircle } from 'lucide-react';

interface PurchaseManagerProps {
  data: AppData;
  onAddPurchase: (record: PurchaseRecord) => void;
}

export const PurchaseManager: React.FC<PurchaseManagerProps> = ({ data, onAddPurchase }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<PurchaseRecord>>({
    date: new Date().toISOString().split('T')[0],
    quality: 'A',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.farmerId && formData.weight && formData.pricePerKg) {
      onAddPurchase({
        id: crypto.randomUUID(),
        farmerId: formData.farmerId,
        date: formData.date!,
        weight: Number(formData.weight),
        pricePerKg: Number(formData.pricePerKg),
        totalAmount: Number(formData.weight) * Number(formData.pricePerKg),
        quality: formData.quality as 'A'|'B'|'C',
        note: formData.note
      });
      setIsFormOpen(false);
      setFormData({ 
        date: new Date().toISOString().split('T')[0],
        quality: 'A',
      });
    }
  };

  const getFarmerName = (id: string) => data.farmers.find(f => f.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Nhật ký thu mua</h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={18} />
          Ghi nhận thu mua
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-fade-in mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Phiếu Thu Mua Mới</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nông Dân</label>
              <select 
                required
                className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.farmerId || ''}
                onChange={e => setFormData({...formData, farmerId: e.target.value})}
              >
                <option value="">Chọn nông dân</option>
                {data.farmers.map(f => (
                  <option key={f.id} value={f.id}>{f.name} - {f.phone}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày thu mua</label>
              <input 
                type="date" 
                required
                className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Trọng lượng (Kg)</label>
              <input 
                type="number" 
                min="0"
                required
                className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.weight || ''}
                onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Đơn giá (VND/Kg)</label>
              <input 
                type="number" 
                min="0"
                required
                className="w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.pricePerKg || ''}
                onChange={e => setFormData({...formData, pricePerKg: Number(e.target.value)})}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Chất lượng</label>
              <div className="flex gap-4 mt-2">
                {['A', 'B', 'C'].map((q) => (
                  <label key={q} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="quality" 
                      checked={formData.quality === q}
                      onChange={() => setFormData({...formData, quality: q as 'A'|'B'|'C'})}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`px-2 py-1 rounded text-sm font-bold ${q === 'A' ? 'bg-green-100 text-green-700' : q === 'B' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      Loại {q}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                Lưu phiếu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Ngày</th>
                <th className="px-6 py-4">Nông dân</th>
                <th className="px-6 py-4">Khối lượng</th>
                <th className="px-6 py-4">Đơn giá</th>
                <th className="px-6 py-4">Thành tiền</th>
                <th className="px-6 py-4">Chất lượng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 flex flex-col items-center">
                    <AlertCircle size={32} className="mb-2 opacity-50"/>
                    Chưa có dữ liệu thu mua
                  </td>
                </tr>
              ) : (
                data.purchases.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-600">{record.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{getFarmerName(record.farmerId)}</td>
                    <td className="px-6 py-4">{record.weight.toLocaleString()} kg</td>
                    <td className="px-6 py-4">{record.pricePerKg.toLocaleString()} đ</td>
                    <td className="px-6 py-4 font-semibold text-green-600">{record.totalAmount.toLocaleString()} đ</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                        ${record.quality === 'A' ? 'bg-green-100 text-green-800' : 
                          record.quality === 'B' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {record.quality}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};