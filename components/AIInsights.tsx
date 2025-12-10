import React, { useState } from 'react';
import { AppData } from '../types';
import { generateAgriculturalReport } from '../services/geminiService';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
// A simple markdown renderer component could be added, but for now we'll display text with simple formatting or use dangerousHTML if parsed
// To keep it safe and simple without extra libraries, we will just use whitespace-pre-wrap

interface AIInsightsProps {
  data: AppData;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setReport('');
    try {
      const result = await generateAgriculturalReport(data, query);
      setReport(result);
    } catch (e) {
      setReport("Có lỗi xảy ra khi gọi AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-purple-600" />
            Trợ lý AI Gemini
          </h2>
          <p className="text-slate-500 mt-1">Phân tích dữ liệu vùng trồng và đề xuất chiến lược tối ưu.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full p-4 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-white/80"
            rows={3}
            placeholder="Bạn muốn AI phân tích điều gì? (Ví dụ: Đánh giá chất lượng sầu riêng tháng này, Dự báo sản lượng...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium text-white shadow-md flex items-center gap-2 transition-all
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <BrainCircuit size={20} />
                  Phân tích ngay
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {report && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 animate-fade-in flex-1 overflow-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Kết quả phân tích</h3>
          <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
            {report}
          </div>
        </div>
      )}
      
      {!report && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300 min-h-[300px]">
          <BrainCircuit size={48} className="mb-4 opacity-30" />
          <p>Nhập câu hỏi hoặc nhấn "Phân tích ngay" để bắt đầu</p>
        </div>
      )}
    </div>
  );
};