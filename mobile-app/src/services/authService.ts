import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/api/auth/mobile', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  async getCurrentUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};
