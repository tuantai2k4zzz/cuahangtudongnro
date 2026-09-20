import {
  IProduct,
  IOrder,
  ILicense,
  IUser,
  IAdminOverviewStats,
  IUserDetails,
  IReview,
  ISupportTicket,
  IApiResponse,
  PaymentMethod,
  IDepositTransaction,
} from '@tudongnro/shared-types';

function getBaseUrl() {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'https://cuahangtudongnro-server.vercel.app/api/v1').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
}

const API_BASE_URL = getBaseUrl();

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<IApiResponse<T>> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const authHeader: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tudongnro_access_token');
    if (token) {
      authHeader['Authorization'] = `Bearer ${token}`;
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...authHeader,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Sends & receives HttpOnly Cookies automatically
  });

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.message || 'Lỗi xử lý yêu cầu máy chủ');
    error.statusCode = data.statusCode || response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

// 1. Auth API
export const authApi = {
  register: (data: any) =>
    request<{ user: IUser; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: any) =>
    request<{ user: IUser; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<IUser>('/auth/me'),

  changePassword: (data: any) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProfile: (data: any) =>
    request<IUser>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// 2. Products API
export const productsApi = {
  getAll: (params?: { category?: string; search?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    const qs = searchParams.toString();
    return request<IProduct[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  getAllAdmin: (query?: { search?: string; status?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (query?.search) searchParams.set('search', query.search);
    if (query?.status && query.status !== 'ALL') searchParams.set('status', query.status);
    if (query?.category && query.category !== 'ALL')
      searchParams.set('category', query.category);
    const qs = searchParams.toString();
    return request<IProduct[]>(`/products/admin/all${qs ? `?${qs}` : ''}`);
  },

  getBySlug: (slug: string) => request<IProduct>(`/products/${slug}`),

  create: (data: any) =>
    request<IProduct>('/products/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request<IProduct>(`/products/admin/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/products/admin/${id}`, {
      method: 'DELETE',
    }),
};

// 3. Orders API
export const ordersApi = {
  create: (data: { productId: string; planId: string; paymentMethod: PaymentMethod }) =>
    request<IOrder & { license?: ILicense }>('/orders', {
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

// 5b. Deposit API (Nạp Tiền Vào Ví Coin)
export const depositApi = {
  create: (amount: number) =>
    request<{
      depositId: string;
      depositCode: string;
      amount: number;
      coins: number;
      bankInfo: {
        bankCode: string;
        accountNumber: string;
        accountHolder: string;
      };
      memo: string;
      qrUrl: string;
      expiresAt: string;
    }>('/payments/deposit/create', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  checkStatus: (depositCode: string) =>
    request<{
      depositCode: string;
      amount: number;
      coins: number;
      status: string;
      paidAt?: string;
    }>(`/payments/deposit/status/${depositCode}`),

  getMyDeposits: () =>
    request<IDepositTransaction[]>('/payments/deposit/me'),
};

// 6. Admin API
export const adminApi = {
  getOverview: (range?: string) => {
    const qs = range ? `?range=${range}` : '';
    return request<IAdminOverviewStats>(`/admin/stats/overview${qs}`);
  },

  getUsers: (query?: { search?: string; status?: string; role?: string }) => {
    const searchParams = new URLSearchParams();
    if (query?.search) searchParams.set('search', query.search);
    if (query?.status && query.status !== 'ALL') searchParams.set('status', query.status);
    if (query?.role && query.role !== 'ALL') searchParams.set('role', query.role);
    const qs = searchParams.toString();
    return request<IUser[]>(`/admin/users${qs ? `?${qs}` : ''}`);
  },

  getUserDetails: (id: string) => request<IUserDetails>(`/admin/users/${id}/details`),

  toggleUserStatus: (id: string) =>
    request<any>(`/admin/users/${id}/toggle-status`, {
      method: 'POST',
    }),

  getAuditLogs: () => request<any[]>('/admin/audit-logs'),

  getAllOrders: () => request<IOrder[]>('/orders/admin/all'),

  approveOrder: (id: string) =>
    request<any>(`/admin/orders/${id}/approve`, {
      method: 'POST',
    }),

  cancelOrder: (id: string, reason?: string) =>
    request<any>(`/admin/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  getAllLicenses: () => request<ILicense[]>('/licenses/admin/all'),

  revokeLicense: (id: string, reason: string) =>
    request<any>(`/licenses/admin/${id}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// 7. Reviews API
export const reviewsApi = {
  getByProduct: (productId: string) =>
    request<{
      reviews: IReview[];
      count: number;
      averageRating: number;
      ratingBreakdown: Record<number, number>;
    }>(`/reviews/product/${productId}`),

  create: (data: { productId: string; rating: number; comment: string; orderId?: string }) =>
    request<IReview>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAllAdmin: () => request<IReview[]>('/reviews/admin/all'),

  updateStatus: (id: string, status: string) =>
    request<IReview>(`/reviews/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// 8. Tickets API
export const ticketsApi = {
  create: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    category: string;
    orderCode?: string;
    subject: string;
    message: string;
  }) =>
    request<ISupportTicket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyTickets: () => request<ISupportTicket[]>('/tickets/me'),

  getById: (id: string) => request<ISupportTicket>(`/tickets/${id}`),

  addMessage: (id: string, message: string) =>
    request<ISupportTicket>(`/tickets/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  adminReply: (id: string, message: string) =>
    request<ISupportTicket>(`/tickets/admin/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getAllAdmin: (query?: { status?: string; category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (query?.status && query.status !== 'ALL') searchParams.set('status', query.status);
    if (query?.category && query.category !== 'ALL')
      searchParams.set('category', query.category);
    if (query?.search) searchParams.set('search', query.search);
    const qs = searchParams.toString();
    return request<ISupportTicket[]>(`/tickets/admin/all${qs ? `?${qs}` : ''}`);
  },

  updateStatus: (id: string, status: string) =>
    request<ISupportTicket>(`/tickets/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
