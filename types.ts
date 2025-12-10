export interface PlantingArea {
  id: string;
  code: string;
  name: string;
  location: string;
  areaSize: number; // in hectares
  cropType: string;
  status: 'active' | 'inactive';
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  areaId: string; // Links to PlantingArea
}

export interface PurchaseRecord {
  id: string;
  farmerId: string;
  date: string;
  weight: number; // in kg
  pricePerKg: number; // in VND
  totalAmount: number;
  quality: 'A' | 'B' | 'C';
  note?: string;
}

export interface AppData {
  areas: PlantingArea[];
  farmers: Farmer[];
  purchases: PurchaseRecord[];
}

export type ViewState = 'dashboard' | 'areas' | 'farmers' | 'purchasing' | 'ai-report';