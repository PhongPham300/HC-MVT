import React, { useMemo } from 'react';
import { AppData } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, Map, DollarSign } from 'lucide-react';

interface DashboardProps {
  data: AppData;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  const stats = useMemo(() => {
    const totalAreas = data.areas.length;
    const totalFarmers = data.farmers.length;
    const totalVolume = data.purchases.reduce((acc, curr) => acc + curr.weight, 0);
    const totalSpent = data.purchases.reduce((acc, curr) => acc + curr.totalAmount, 0);
    return { totalAreas, totalFarmers, totalVolume, totalSpent };
  }, [data]);

  const qualityData = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0 };
    data.purchases.forEach(p => {
      if (counts[p.quality] !== undefined) counts[p.quality]++;
    });
    return [
      { name: 'Loại A', value: counts.A },
      { name: 'Loại B', value: counts.B },
      { name: 'Loại C', value: counts.C },
    ];
  }, [data.purchases]);

  const monthlyData = useMemo(() => {
    // Simplified for demo: Group by date string (YYYY-MM)
    const grouped: Record<string, number> = {};
    data.purchases.forEach(p => {
      const month = p.date.substring(0, 7); // YYYY-MM
      grouped[month] = (grouped[month] || 0) + p.weight;
    });
    return Object.entries(grouped).map(([date, weight]) => ({ date, weight }));
  }, [data.purchases]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Map size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Vùng Trồng</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalAreas}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Hộ Nông Dân</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalFarmers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Sản Lượng (Kg)</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalVolume.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Chi Phí Thu Mua</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalSpent.toLocaleString()} đ</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Biểu đồ thu mua theo tháng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kg`} />
                <Bar dataKey="weight" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Tỷ lệ chất lượng</h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {qualityData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};