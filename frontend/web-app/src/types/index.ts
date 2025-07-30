export interface AircraftFormData {
  manufacturer: string;
  model: string;
  series: string;
  registration: string;
  year: number;
  ttaf: number;
  landings: number;
  price: string;
  currency: string;
  location: string;
  mtow: string;
  engines: number;
  engineType: string;
  maintenancePlan: string;
  interior: string;
  passengers: number;
  color: string;
  description: string;
  images: string[];
  documents: string[];
}

export interface ComplianceRequest {
  id: string;
  aircraftId: string;
  aircraftTitle: string;
  aircraftPrice: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  createdAt: string;
  updatedAt: string;
  
  // Информация о покупателе
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCompany: string;
  buyerPosition: string;
  
  // Информация о брокере
  brokerName: string;
  brokerEmail: string;
  brokerPhone: string;
  brokerCompany: string;
  brokerLicense: string;
  brokerExperience: string;
  
  // Финансовая информация
  budget: string;
  financing: boolean;
  cashAvailable: boolean;
  letterOfIntent: boolean;
  proofOfFunds: boolean;
  
  // Дополнительная информация
  timeline: string;
  inspection: boolean;
  nda: boolean;
  terms: boolean;
  
  // Документы
  documents: {
    name: string;
    type: string;
    uploadedAt: string;
  }[];
  
  // Комментарии
  comments: {
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }[];
} 