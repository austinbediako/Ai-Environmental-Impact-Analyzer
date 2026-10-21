'use client';

import { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { HistorySidebar } from "@/components/HistorySidebar";
import { AuthProvider } from "@/context/AuthContext";

// Layout wrapper component to handle client-side state
export function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <AuthProvider>
      <Navbar onOpenHistory={() => setIsHistoryOpen(true)} />
      <HistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <main className="flex-1 pt-24 pb-16">
        {children}
      </main>
    </AuthProvider>
  );
}
