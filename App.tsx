import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  ShoppingCart, 
  BrainCircuit, 
  Menu, 
  X,
  Sprout
} from 'lucide-react';
import { AppData, ViewState, PlantingArea, Farmer, PurchaseRecord } from './types';
import { Dashboard } from './components/Dashboard';
import { AreaManager } from './components/AreaManager';
import { PurchaseManager } from './components/PurchaseManager';
import { AIInsights } from './components/AIInsights';

// Mock Data Initialization
const INITIAL_DATA: AppData = {
  areas: [
    { id: '1', code: 'VN-DL-001', name: 'Vùng Đạ Huoai A', location: 'Đạ Huoai, Lâm Đồng', areaSize: 15.5, cropType: 'Sầu riêng', status: 'active' },
    { id: '2', code: 'VN-DL-002', name: 'Vùng Bảo Lộc B', location: 'Bảo Lộc, Lâm Đồng', areaSize: 8.2, cropType: 'Cà phê', status: 'active' },
    { id: '3', code: 'VN-DL-003', name: 'Vùng Di Linh C', location: 'Di Linh, Lâm Đồng', areaSize: 12.0, cropType: 'Sầu riêng', status: 'active' },
  ],
  farmers: [
    { id: 'f1', name: 'Nguyễn Văn A', phone: '0912345678', areaId: '1' },
    { id: 'f2', name: 'Trần Thị B', phone: '0987654321', areaId: '1' },
    { id: 'f3', name: 'Lê Văn C', phone: '0909090909', areaId: '2' },
  ],
  purchases: [
    { id: 'p1', farmerId: 'f1', date: '2023-10-15', weight: 500, pricePerKg: 80000, totalAmount: 40000000, quality: 'A' },
    { id: 'p2', farmerId: 'f2', date: '2023-10-16', weight: 300, pricePerKg: 75000, totalAmount: 22500000, quality: 'B' },
    { id: 'p3', farmerId: 'f1', date: '2023-10-20', weight: 600, pricePerKg: 82000, totalAmount: 49200000, quality: 'A' },
    { id: 'p4', farmerId: 'f3', date: '2023-11-05', weight: 1000, pricePerKg: 45000, totalAmount: 45000000, quality: 'A', note: 'Cà phê tươi' },
  ]
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [view, setView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data Handlers
  const addArea = (area: PlantingArea) => setData(prev => ({ ...prev, areas: [...prev.areas, area] }));
  const addFarmer = (farmer: Farmer) => setData(prev => ({ ...prev, farmers: [...prev.farmers, farmer] }));
  const addPurchase = (purchase: PurchaseRecord) => setData(prev => ({ ...prev, purchases: [...prev.purchases, purchase] }));
  
  const deleteArea = (id: string) => setData(prev => ({ ...prev, areas: prev.areas.filter(a => a.id !== id) }));
  const deleteFarmer = (id: string) => setData(prev => ({ ...prev, farmers: prev.farmers.filter(f => f.id !== id) }));

  // Navigation Logic
  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'areas', label: 'Vùng trồng & Hộ dân', icon: Map },
    { id: 'purchasing', label: 'Thu mua nông sản', icon: ShoppingCart },
    { id: 'ai-report', label: 'Phân tích AI', icon: BrainCircuit },
  ];

  const handleNavClick = (viewId: string) => {
    setView(viewId as ViewState);
    setIsSidebarOpen(false); // Close mobile sidebar on click
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-green-700 text-white p-4 flex justify-between items-center z-50 shadow-md">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Sprout /> Hoa Cương
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-green-800 text-white transform transition-transform duration-300 ease-in-out shadow-xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 font-bold text-2xl border-b border-green-700">
          <Sprout className="text-yellow-400" size={32} />
          <span>Hoa Cương</span>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${view === item.id ? 'bg-white text-green-800 font-bold shadow-md' : 'text-green-100 hover:bg-green-700 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 text-xs text-green-300 border-t border-green-700">
          <p>© 2024 Hoa Cương Agri</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-full">
          {view === 'dashboard' && <Dashboard data={data} />}
          {view === 'areas' && (
            <AreaManager 
              data={data} 
              onAddArea={addArea} 
              onAddFarmer={addFarmer} 
              onDeleteArea={deleteArea}
              onDeleteFarmer={deleteFarmer}
            />
          )}
          {view === 'purchasing' && <PurchaseManager data={data} onAddPurchase={addPurchase} />}
          {view === 'ai-report' && <AIInsights data={data} />}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;