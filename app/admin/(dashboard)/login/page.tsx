'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redundant Admin Login page.
 * Redirecting to the unified /login page to ensure a single entry point.
 */
export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center font-display">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#A0A0A0] text-[10px] font-bold tracking-[0.3em] uppercase">
          Redirecting to Unified Login
        </p>
      </div>
    </div>
  );
}
