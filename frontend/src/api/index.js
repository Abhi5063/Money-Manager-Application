import api from './axios';

export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    me: () => api.get('/api/auth/me'),
};

export const transactionAPI = {
    getAll: (params) => api.get('/api/transactions', { params }),
    create: (data) => api.post('/api/transactions', data),
    update: (id, data) => api.put(`/api/transactions/${id}`, data),
    delete: (id) => api.delete(`/api/transactions/${id}`),
};

export const categoryAPI = {
    getAll: () => api.get('/api/categories'),
    create: (data) => api.post('/api/categories', data),
    update: (id, data) => api.put(`/api/categories/${id}`, data),
    delete: (id) => api.delete(`/api/categories/${id}`),
};

export const budgetAPI = {
    getAll: (params) => api.get('/api/budgets', { params }),
    create: (data) => api.post('/api/budgets', data),
    update: (id, data) => api.put(`/api/budgets/${id}`, data),
};

export const dashboardAPI = {
    get: () => api.get('/api/dashboard'),
};

export const reportAPI = {
    exportCsv: (params) => api.get('/api/reports/export/csv', {
        params,
        responseType: 'blob',
    }),
};
