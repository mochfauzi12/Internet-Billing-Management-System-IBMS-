const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Terjadi kesalahan pada server' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetchApi<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => fetchApi<{ user: any }>('/auth/me'),

  // Customers
  getCustomers: (params?: { search?: string; status?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    return fetchApi<{ data: any[]; total: number }>(`/customers?${query.toString()}`);
  },
  createCustomer: (data: any) => fetchApi<any>('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: number, data: any) => fetchApi<any>(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCustomer: (id: number) => fetchApi<{ success: boolean }>(`/customers/${id}`, { method: 'DELETE' }),

  // Packages
  getPackages: () => fetchApi<any[]>('/packages'),
  createPackage: (data: any) => fetchApi<any>('/packages', { method: 'POST', body: JSON.stringify(data) }),

  // Invoices
  getInvoices: (params?: { month?: number; year?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.month) query.append('month', String(params.month));
    if (params?.year) query.append('year', String(params.year));
    if (params?.status) query.append('status', params.status);
    return fetchApi<{ data: any[]; total: number }>(`/invoices?${query.toString()}`);
  },
  generateInvoices: (month: number, year: number) =>
    fetchApi<{ generated: number; skipped: number }>('/invoices/generate', {
      method: 'POST',
      body: JSON.stringify({ month, year }),
    }),

  // Payments
  recordPayment: (data: { invoiceId: number; paymentMethod: string; amount: number; note?: string }) =>
    fetchApi<any>('/payments', { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard
  getDashboardSummary: () => fetchApi<any>('/dashboard/summary'),
};
