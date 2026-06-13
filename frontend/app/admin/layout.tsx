"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p));

    if (!isAuthenticated && !isPublic) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const isPublic = PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p));
  if (!isAuthenticated && !isPublic) {
    return null; // Block rendering while redirecting
  }

  return <>{children}</>;
}
