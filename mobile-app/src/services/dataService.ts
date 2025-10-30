import api from './api';
import {
  Worker,
  Service,
  Job,
  Income,
  Expense,
  Payment,
  DashboardStats,
} from '../types';

export const dataService = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },

  // Trabajadores
  async getWorkers(): Promise<Worker[]> {
    const response = await api.get('/api/workers');
    return response.data;
  },

  async createWorker(data: Partial<Worker>): Promise<Worker> {
    const response = await api.post('/api/workers', data);
    return response.data;
  },

  async updateWorker(id: string, data: Partial<Worker>): Promise<Worker> {
    const response = await api.put(`/api/workers/${id}`, data);
    return response.data;
  },

  async deleteWorker(id: string): Promise<void> {
    await api.delete(`/api/workers/${id}`);
  },

  // Servicios
  async getServices(): Promise<Service[]> {
    const response = await api.get('/api/services');
    return response.data;
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const response = await api.post('/api/services', data);
    return response.data;
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const response = await api.put(`/api/services/${id}`, data);
    return response.data;
  },

  async deleteService(id: string): Promise<void> {
    await api.delete(`/api/services/${id}`);
  },

  // Trabajos
  async getJobs(params?: any): Promise<Job[]> {
    const response = await api.get('/api/jobs', { params });
    return response.data;
  },

  async createJob(data: Partial<Job>): Promise<Job> {
    const response = await api.post('/api/jobs', data);
    return response.data;
  },

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    const response = await api.put(`/api/jobs/${id}`, data);
    return response.data;
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/api/jobs/${id}`);
  },

  // Ingresos
  async getIncomes(params?: any): Promise<Income[]> {
    const response = await api.get('/api/income', { params });
    return response.data;
  },

  async createIncome(data: Partial<Income>): Promise<Income> {
    const response = await api.post('/api/income', data);
    return response.data;
  },

  async updateIncome(id: string, data: Partial<Income>): Promise<Income> {
    const response = await api.put(`/api/income/${id}`, data);
    return response.data;
  },

  async deleteIncome(id: string): Promise<void> {
    await api.delete(`/api/income/${id}`);
  },

  // Gastos
  async getExpenses(params?: any): Promise<Expense[]> {
    const response = await api.get('/api/expenses', { params });
    return response.data;
  },

  async createExpense(data: Partial<Expense>): Promise<Expense> {
    const response = await api.post('/api/expenses', data);
    return response.data;
  },

  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    const response = await api.put(`/api/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/api/expenses/${id}`);
  },
};
