import {
  IProduct,
  IOrder,
  ILicense,
  IUser,
  IAdminOverviewStats,
  IApiResponse,
  PaymentMethod,
} from '@tudongnro/shared-types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<IApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Sends & receives HttpOnly Cookies automatically
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại');
  }

  return data;
}

// 1. Auth API
export const authApi = {
  register: (data: { email: string; password: string; fullName: string }) =>
    request<{ user: IUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ user: IUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<IUser>('/auth/me'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// 2. Products API
export const productsApi = {
  getAll: (query?: { search?: string; category?: string; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (query?.search) searchParams.set('search', query.search);
    if (query?.category && query.category !== 'ALL')
      searchParams.set('category', query.category);
    if (query?.sort) searchParams.set('sort', query.sort);
    const qs = searchParams.toString();
    return request<IProduct[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  getBySlug: (slug: string) => request<IProduct>(`/products/${slug}`),
};

// 3. Orders API
export const ordersApi = {
  create: (data: { productId: string; planId: string; paymentMethod: PaymentMethod }) =>
    request<IOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyOrders: () => request<IOrder[]>('/orders/me'),

  getById: (id: string) => request<IOrder>(`/orders/${id}`),

  cancel: (id: string) =>
    request<{ message: string }>(`/orders/${id}/cancel`, {
      method: 'POST',
    }),
};

// 4. Licenses API
export const licensesApi = {
  getMyLicenses: () => request<ILicense[]>('/licenses/me'),

  getById: (id: string) => request<ILicense>(`/licenses/${id}`),

  resetHwid: (id: string) =>
    request<{ message: string }>(`/licenses/${id}/reset-hwid`, {
      method: 'POST',
    }),

  verify: (data: { licenseKey: string; hwid: string; deviceName?: string }) =>
    request<any>('/licenses/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 5. Payments API
export const paymentsApi = {
  createQr: (orderId: string) =>
    request<{
      orderId: string;
      orderCode: string;
      amount: number;
      qrUrl: string;
      bankInfo: any;
      memo: string;
    }>(`/payments/create-qr/${orderId}`, {
      method: 'POST',
    }),

  checkStatus: (orderCode: string) =>
    request<{ orderCode: string; status: string; paidAt?: string }>(
      `/payments/check-status/${orderCode}`,
    ),
};

// 6. Admin API
export const adminApi = {
  getOverview: () => request<IAdminOverviewStats>('/admin/stats/overview'),

  getUsers: () => request<IUser[]>('/admin/users'),

  toggleUserStatus: (id: string) =>
    request<any>(`/admin/users/${id}/toggle-status`, {
      method: 'POST',
    }),

  getAuditLogs: () => request<any[]>('/admin/audit-logs'),

  getAllOrders: () => request<IOrder[]>('/orders/admin/all'),

  approveOrder: (id: string) =>
    request<any>(`/orders/admin/${id}/approve`, {
      method: 'POST',
    }),

  getAllLicenses: () => request<ILicense[]>('/licenses/admin/all'),

  revokeLicense: (id: string, reason: string) =>
    request<any>(`/licenses/admin/${id}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};
