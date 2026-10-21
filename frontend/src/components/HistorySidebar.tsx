'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, X, History as HistoryIcon, CalendarDays, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { ConfirmationModal } from './ConfirmationModal';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryEntry {
  _id: string;
  footprintScore: number;
  travelMode?: string;
  dietType?: string;
  createdAt: string;
}

export function HistorySidebar({ isOpen, onClose }: HistorySidebarProps) {
  const { user, token } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Deletion Modal State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchHistory = useCallback(() => {
    if (token) {
      setLoading(true);
      api.get('/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setHistoryItems(res.data.data);
      })
      .catch(err => console.error("Failed to fetch history:", err))
      .finally(() => setLoading(false));
    }
  }, [token]);

  useEffect(() => {
    // Fetch immediately if opened
    if (isOpen) {
      fetchHistory();
    }

    // Subscribe to global real-time synchronization updates
    window.addEventListener('history-updated', fetchHistory);
    return () => window.removeEventListener('history-updated', fetchHistory);
  }, [isOpen, fetchHistory]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !token) return;

    try {
      await api.delete(`/api/history/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI without reloading
      setHistoryItems(prev => prev.filter(item => item._id !== itemToDelete));
    } catch (error) {
      console.error("Failed to delete history entry:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-zinc-950/95 border-l border-white/10 z-[60] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400">
                  <HistoryIcon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Analysis History</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchHistory}
                  disabled={loading}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  title="Refresh history"
                >
                  <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto w-full relative">
              <div className="p-6 space-y-4">
                {!user ? (
                   <div className="text-center py-10">
                     <p className="text-gray-400 mb-4">Please log in to view your history.</p>
                     <Link href="/login" onClick={onClose} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm border border-green-500/30 font-medium">Log In</Link>
                   </div>
                ) : loading ? (
                   <div className="text-center py-10 text-gray-500">Loading history...</div>
                ) : historyItems.length === 0 ? (
                   <div className="text-center py-10 text-gray-500">No analysis history found.</div>
                ) : (
                  historyItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group relative p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer"
                    >
                      <button 
                        onClick={() => setItemToDelete(item._id)}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 bg-red-400/0 hover:bg-red-400/10 rounded-full transition-all"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <h3 className="font-semibold text-lg text-gray-200 mb-1 pe-10 truncate">
                        {item.travelMode && item.dietType ? `${item.travelMode} & ${item.dietType}` : 'Behavior Log'}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
  
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">Impact Score</span>
                          <span className={cn("text-2xl font-bold leading-none", item.footprintScore < 30 ? 'text-green-400' : item.footprintScore < 70 ? 'text-yellow-400' : 'text-red-500')}>
                            {item.footprintScore}
                          </span>
                        </div>
                        
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2">
                          <RefreshCw className="w-3 h-3" />
                          Re-analyze
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {historyItems.length > 0 && (
                  <div className="text-center pt-8 pb-4">
                    <p className="text-sm text-gray-500">End of history</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer action */}
            <div className="p-6 border-t border-white/10 shrink-0 bg-zinc-950/50">
              <Link 
                href="/analyze" 
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-400 text-black font-bold hover:bg-[#00e65c] transition-colors"
               >
                 Start New Analysis
               </Link>
            </div>
          </motion.div>

          <ConfirmationModal
            isOpen={itemToDelete !== null}
            onClose={() => setItemToDelete(null)}
            onConfirm={handleDeleteConfirm}
            title="Remove from History?"
            message="Are you sure you want to hide this analysis from your history sidebar? It will no longer be visible here."
            isHardDelete={false}
          />
        </>
      )}
    </AnimatePresence>
  );
}
