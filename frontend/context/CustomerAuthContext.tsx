"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface CustomerUser {
  id: number;
  name: string;
  email: string | null;
  phone: string;
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateCustomer: (data: Partial<CustomerUser>) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('customerToken');
      const storedCustomer = localStorage.getItem('customerUser');
      
      if (storedToken && storedCustomer) {
        let isExpired = false;
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            isExpired = true;
          }
        } catch (e) {}

        if (isExpired) {
          localStorage.removeItem('customerToken');
          localStorage.removeItem('customerUser');
        } else {
          setToken(storedToken);
          setCustomer(JSON.parse(storedCustomer));
        }
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const sendOtp = useCallback(async (email: string) => {
    const res = await fetch(`${API}/customer/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const res = await fetch(`${API}/customer/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Verification failed');

    const { token: newToken, customer: customerData } = data.data;
    setToken(newToken);
    setCustomer(customerData);
    localStorage.setItem('customerToken', newToken);
    localStorage.setItem('customerUser', JSON.stringify(customerData));
  }, []);

  const logout = useCallback(() => {
    fetch(`${API}/customer/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
    setToken(null);
    setCustomer(null);
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
  }, []);

  const updateCustomer = useCallback((data: Partial<CustomerUser>) => {
    setCustomer((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem('customerUser', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <CustomerAuthContext.Provider value={{
      customer, token, isAuthenticated: !!token, isLoading,
      sendOtp, verifyOtp, logout, updateCustomer,
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}

// Helper hook for authenticated customer API calls
export function useCustomerApi() {
  const { token, logout } = useCustomerAuth();

  const customerFetch = useCallback(
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

      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    },
    [token, logout]
  );

  return { customerFetch };
}
