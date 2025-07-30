import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ComplianceRequest {
  aircraftId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  company?: string;
  proofOfFunds: boolean;
  letterOfIntent: boolean;
  nda: boolean;
  brokerLicense?: string;
  experience?: string;
  previousDeals?: string;
  timeline?: string;
  budget: string;
}

export interface ComplianceResponse {
  success: boolean;
  message: string;
  requestId?: string;
  status: 'pending' | 'approved' | 'rejected';
  estimatedReviewTime?: string;
}

export interface ComplianceStatus {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  sellerContacts?: {
    name: string;
    email: string;
    phone: string;
  };
}

class ComplianceService {
  // Отправить заявку на комплаенс-проверку
  async submitComplianceRequest(data: ComplianceRequest): Promise<ComplianceResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/compliance/submit`, data);
      return response.data;
    } catch (error) {
      console.error('Error submitting compliance request:', error);
      throw new Error('Не удалось отправить заявку на комплаенс-проверку');
    }
  }

  // Получить статус комплаенс-проверки
  async getComplianceStatus(requestId: string): Promise<ComplianceStatus> {
    try {
      const response = await axios.get(`${API_BASE_URL}/compliance/status/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance status:', error);
      throw new Error('Не удалось получить статус комплаенс-проверки');
    }
  }

  // Получить историю комплаенс-заявок пользователя
  async getComplianceHistory(): Promise<ComplianceStatus[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/compliance/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance history:', error);
      throw new Error('Не удалось загрузить историю комплаенс-заявок');
    }
  }

  // Получить активные комплаенс-заявки
  async getActiveComplianceRequests(): Promise<ComplianceStatus[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/compliance/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active compliance requests:', error);
      throw new Error('Не удалось загрузить активные заявки');
    }
  }

  // Отменить комплаенс-заявку
  async cancelComplianceRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/compliance/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling compliance request:', error);
      throw new Error('Не удалось отменить заявку');
    }
  }

  // Получить статистику комплаенс-проверок
  async getComplianceStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    averageReviewTime: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/compliance/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance stats:', error);
      throw new Error('Не удалось загрузить статистику');
    }
  }

  // Проверить, есть ли у пользователя доступ к контактам продавца
  async checkSellerAccess(aircraftId: string): Promise<{
    hasAccess: boolean;
    complianceRequestId?: string;
    sellerContacts?: {
      name: string;
      email: string;
      phone: string;
    };
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/compliance/access/${aircraftId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking seller access:', error);
      throw new Error('Не удалось проверить доступ к контактам продавца');
    }
  }

  // Загрузить документы для комплаенс-проверки
  async uploadComplianceDocuments(
    requestId: string, 
    documents: { 
      proofOfFunds?: File; 
      letterOfIntent?: File; 
      nda?: File; 
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      formData.append('requestId', requestId);
      
      if (documents.proofOfFunds) {
        formData.append('proofOfFunds', documents.proofOfFunds);
      }
      if (documents.letterOfIntent) {
        formData.append('letterOfIntent', documents.letterOfIntent);
      }
      if (documents.nda) {
        formData.append('nda', documents.nda);
      }

      const response = await axios.post(`${API_BASE_URL}/compliance/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading compliance documents:', error);
      throw new Error('Не удалось загрузить документы');
    }
  }
}

export const complianceService = new ComplianceService(); 