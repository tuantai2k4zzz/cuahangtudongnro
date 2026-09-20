'use client';

import * as React from 'react';
import { IUser, UserRole, UserStatus } from '@tudongnro/shared-types';
import { authApi } from '@/lib/api-client';
import { MOCK_ADMIN } from '@/lib/mock-data';

interface AuthContextType {
  user: IUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setDemoUser: (role: 'CUSTOMER' | 'ADMIN' | 'GUEST') => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'tudongnro_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<IUser | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const refreshUser = React.useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.data) {
        setUser(res.data);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data));
      }
    } catch {}
  }, []);

  // Initialize session from localStorage or API
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as IUser;
          // If stored user was the old mock user 'usr_customer_1' or 'Trần Văn Kiên', clear it
          if (parsed.fullName === 'Trần Văn Kiên' || parsed.id === 'usr_customer_1') {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setUser(null);
          } else {
            setUser(parsed);
            // Sync latest balance and profile in background
            authApi.getMe().then((res) => {
              if (res.data) {
                setUser(res.data);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data));
              }
            }).catch(() => {});
          }
        } else {
          // Attempt to check session cookie from backend
          try {
            const res = await authApi.getMe();
            if (res.data) {
              setUser(res.data);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data));
            }
          } catch {
            // Not logged in, defaults to guest
            setUser(null);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Đăng nhập không thành công' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Email hoặc mật khẩu không chính xác' };
    }
  };

  const register = async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authApi.register({ fullName, email, password });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Đăng ký không thành công' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Đăng ký thất bại' };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout().catch(() => {});
    } finally {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // Helper function for admin quick testing during development if needed
  const setDemoUser = (role: 'CUSTOMER' | 'ADMIN' | 'GUEST') => {
    if (role === 'GUEST' || role === 'CUSTOMER') {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else if (role === 'ADMIN') {
      setUser(MOCK_ADMIN);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(MOCK_ADMIN));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? (user.role as UserRole) : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
