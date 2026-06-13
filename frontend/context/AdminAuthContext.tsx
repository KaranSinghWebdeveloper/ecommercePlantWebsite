"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminToken');
      const storedAdmin = localStorage.getItem('adminUser');
      
      if (stored && storedAdmin) {
        let isExpired = false;
        try {
          const payload = JSON.parse(atob(stored.split('.')[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            isExpired = true;
          }
        } catch (e) {}

        if (isExpired) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        } else {
          setToken(stored);
          setAdmin(JSON.parse(storedAdmin));
        }
      }
    } catch (e) {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    const { token: newToken, admin: adminData } = data.data;
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }, [token]);

  return (
    <AdminAuthContext.Provider value={{
      admin, token, isAuthenticated: !!token, isLoading, login, logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

// Helper to make authenticated admin API calls
export function useAdminApi() {
  const { token, logout } = useAdminAuth();

  const adminFetch = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers as Record<string, string> || {}),
        },
        credentials: 'include',
      });
      const data = await res.json();
      
      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error(data.message || 'Session expired. Please log in again.');
      }
      
      if (!res.ok) throw new Error(data.message || 'API Error');
      return data;
    },
    [token, logout]
  );

  return { adminFetch };
}
