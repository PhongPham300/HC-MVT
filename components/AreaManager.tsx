import React, { useState } from 'react';
import { AppData, PlantingArea, Farmer } from '../types';
import { Plus, MapPin, User, Search, Trash2 } from 'lucide-react';

interface AreaManagerProps {
  data: AppData;
  onAddArea: (area: PlantingArea) => void;
  onAddFarmer: (farmer: Farmer) => void;
  onDeleteArea: (id: string) => void;
  onDeleteFarmer: (id: string) => void;
}

export const AreaManager: React.FC<AreaManagerProps> = ({ 
  data, onAddArea, onAddFarmer, onDeleteArea, onDeleteFarmer 
}) => {
  const [activeTab, setActiveTab] = useState<'areas' | 'farmers'>('areas');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Area Form State
  const [newArea, setNewArea] = useState<Partial<PlantingArea>>({ cropType: 'Sầu riêng', status: 'active' });
  const [isAddingArea, setIsAddingArea] = useState(false);

  // New Farmer Form State
  const [newFarmer, setNewFarmer] = useState<Partial<Farmer>>({});
  const [isAddingFarmer, setIsAddingFarmer] = useState(false);

  const handleCreateArea = () => {
    if (newArea.code && newArea.name && newArea.location) {
      onAddArea({
        id: crypto.randomUUID(),
        code: newArea.code,
        name: newArea.name,
        location: newArea.location,
        areaSize: Number(newArea.areaSize) || 0,
        cropType: newArea.cropType || 'Khác',
        status: 'active'
      });
      setIsAddingArea(false);
      setNewArea({ cropType: 'Sầu riêng', status: 'active' });
    }
  };

  const handleCreateFarmer = () => {
    if (newFarmer.name && newFarmer.phone && newFarmer.areaId) {
      onAddFarmer({
        id: crypto.randomUUID(),
        name: newFarmer.name,
        phone: newFarmer.phone,
        areaId: newFarmer.areaId
      });
      setIsAddingFarmer(false);
      setNewFarmer({});
    }
  };

  const filteredAreas = data.areas.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFarmers = data.farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý cơ sở dữ liệu</h2>
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('areas')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'areas' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mã Vùng Trồng
          </button>
          <button 
            onClick={() => setActiveTab('farmers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'farmers' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Hộ Nông Dân
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Tìm kiếm ${activeTab === 'areas' ? 'vùng trồng' : 'nông dân'}...`}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => activeTab === 'areas' ? setIsAddingArea(true) : setIsAddingFarmer(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={18} />
          Thêm mới
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'areas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Mã Vùng</th>
                  <th className="px-6 py-4">Tên Vùng</th>
                  <th className="px-6 py-4">Địa điểm</th>
                  <th className="px-6 py-4">Diện tích (ha)</th>
                  <th className="px-6 py-4">Loại cây</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAreas.map(area => (
                  <tr key={area.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{area.code}</td>
                    <td className="px-6 py-4">{area.name}</td>
                    <td className="px-6 py-4 flex items-center gap-1 text-slate-600">
                      <MapPin size={14} /> {area.location}
                    </td>
                    <td className="px-6 py-4">{area.areaSize}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {area.cropType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteArea(area.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'farmers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Họ và Tên</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Thuộc vùng trồng</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFarmers.map(farmer => {
                  const area = data.areas.find(a => a.id === farmer.areaId);
                  return (
                    <tr key={farmer.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                          <User size={16} />
                        </div>
                        {farmer.name}
                      </td>
                      <td className="px-6 py-4">{farmer.phone}</td>
                      <td className="px-6 py-4">
                        {area ? (
                          <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {area.name} ({area.code})
                          </span>
                        ) : <span className="text-red-500 text-xs">Chưa liên kết</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onDeleteFarmer(farmer.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simple Modal for Adding Area */}
      {isAddingArea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Thêm Vùng Trồng Mới</h3>
            <div className="space-y-4">
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Mã số (VD: VN-DL-001)" 
                value={newArea.code || ''} 
                onChange={e => setNewArea({...newArea, code: e.target.value})} 
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Tên vùng" 
                value={newArea.name || ''} 
                onChange={e => setNewArea({...newArea, name: e.target.value})} 
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Địa điểm" 
                value={newArea.location || ''} 
                onChange={e => setNewArea({...newArea, location: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number"
                  className="w-full border p-2 rounded" 
                  placeholder="Diện tích (ha)" 
                  value={newArea.areaSize || ''} 
                  onChange={e => setNewArea({...newArea, areaSize: Number(e.target.value)})} 
                />
                 <input 
                  className="w-full border p-2 rounded" 
                  placeholder="Loại cây" 
                  value={newArea.cropType || ''} 
                  onChange={e => setNewArea({...newArea, cropType: e.target.value})} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsAddingArea(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Hủy</button>
              <button onClick={handleCreateArea} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Modal for Adding Farmer */}
      {isAddingFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Thêm Hộ Nông Dân</h3>
            <div className="space-y-4">
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Họ và Tên" 
                value={newFarmer.name || ''} 
                onChange={e => setNewFarmer({...newFarmer, name: e.target.value})} 
              />
              <input 
                className="w-full border p-2 rounded" 
                placeholder="Số điện thoại" 
                value={newFarmer.phone || ''} 
                onChange={e => setNewFarmer({...newFarmer, phone: e.target.value})} 
              />
              <select 
                className="w-full border p-2 rounded"
                value={newFarmer.areaId || ''}
                onChange={e => setNewFarmer({...newFarmer, areaId: e.target.value})}
              >
                <option value="">-- Chọn vùng trồng --</option>
                {data.areas.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsAddingFarmer(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Hủy</button>
              <button onClick={handleCreateFarmer} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};