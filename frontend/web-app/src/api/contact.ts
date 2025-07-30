import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ContactSellerRequest {
  aircraftId: string;
  sellerId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  budget?: string;
  timeline?: string;
  financing: boolean;
  inspection: boolean;
}

export interface ReserveClientRequest {
  aircraftId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  company?: string;
  brokerLicense?: string;
  experience?: string;
  commission?: string;
  exclusivityPeriod: number;
  terms: boolean;
  marketing: boolean;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

export interface ReserveResponse {
  success: boolean;
  message: string;
  reservationId?: string;
  exclusivityEndDate?: string;
}

class ContactService {
  // Отправить запрос продавцу
  async contactSeller(data: ContactSellerRequest): Promise<ContactResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/contact/seller`, data);
      return response.data;
    } catch (error) {
      console.error('Error contacting seller:', error);
      throw new Error('Не удалось отправить запрос продавцу');
    }
  }

  // Забронировать клиента
  async reserveClient(data: ReserveClientRequest): Promise<ReserveResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/reserve/client`, data);
      return response.data;
    } catch (error) {
      console.error('Error reserving client:', error);
      throw new Error('Не удалось забронировать клиента');
    }
  }

  // Получить историю запросов пользователя
  async getContactHistory(): Promise<ContactSellerRequest[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact history:', error);
      throw new Error('Не удалось загрузить историю запросов');
    }
  }

  // Получить активные бронирования
  async getActiveReservations(): Promise<ReserveClientRequest[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reserve/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active reservations:', error);
      throw new Error('Не удалось загрузить активные бронирования');
    }
  }

  // Отменить бронирование
  async cancelReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/reserve/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw new Error('Не удалось отменить бронирование');
    }
  }

  // Получить статистику по запросам
  async getContactStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    respondedRequests: number;
    averageResponseTime: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      throw new Error('Не удалось загрузить статистику');
    }
  }
}

export const contactService = new ContactService(); 