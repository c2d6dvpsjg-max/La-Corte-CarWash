// Tipos compartidos con el backend
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Worker {
  id: string;
  name: string;
  phone?: string;
  salary: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  serviceId: string;
  service?: Service;
  workerId?: string;
  worker?: Worker;
  vehicleType?: string;
  vehiclePlate?: string;
  customerName?: string;
  customerPhone?: string;
  price: number;
  status: string;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  workerId: string;
  worker?: Worker;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalIngresos: number;
  totalGastos: number;
  ganancia: number;
  trabajosHoy: number;
  trabajadoresActivos: number;
  ingresosMes: number;
  gastosMes: number;
}
