import { ApiClient } from '@longvhv/api-client';

// Create API client instance with framework package
export const api = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API client is auto-configured with:
// - JWT token interceptors (via @longvhv/auth)
// - Request/Response transformers
// - Error handling
// - 401 redirect to login

// Export typed API methods
export const apiClient = {
  get: <T>(url: string, config?: any) => api.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: any) => api.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) => api.put<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: any) => api.patch<T>(url, data, config),
  delete: <T>(url: string, config?: any) => api.delete<T>(url, config),
};

export default api;
