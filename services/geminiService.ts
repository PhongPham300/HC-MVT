import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

const initializeGenAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateAgriculturalReport = async (data: AppData, query?: string): Promise<string> => {
  const ai = initializeGenAI();
  if (!ai) return "Lỗi: Chưa cấu hình API Key.";

  const prompt = `
    Bạn là một chuyên gia nông nghiệp AI hỗ trợ công ty "Hoa Cương".
    
    Dữ liệu hiện tại của hệ thống (JSON):
    ${JSON.stringify(data, null, 2)}
    
    Yêu cầu:
    ${query || "Hãy phân tích hiệu suất của các vùng trồng, xu hướng thu mua, và đưa ra các đề xuất cải thiện năng suất và lợi nhuận. Đánh giá chất lượng nông sản dựa trên lịch sử thu mua."}

    Hãy trả lời bằng định dạng Markdown đẹp mắt, sử dụng các gạch đầu dòng và tiêu đề rõ ràng. Ngôn ngữ: Tiếng Việt.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Standard analysis, minimal thinking overhead needed
      }
    });
    
    return response.text || "Không thể tạo báo cáo vào lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
  }
};