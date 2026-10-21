'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isHardDelete?: boolean;
  confirmText?: string;
  confirmIcon?: any;
  variant?: 'danger' | 'primary';
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isHardDelete = false,
  confirmText = "Confirm Delete",
  confirmIcon: Icon = Trash2,
  variant = 'danger'
}: ConfirmationModalProps) {
  const isDanger = variant === 'danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className={cn(
              "absolute top-0 left-0 w-full h-1",
              isDanger ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-green-500 to-emerald-500"
            )} />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-full", isDanger ? "bg-red-500/10" : "bg-green-500/10")}>
                    <AlertTriangle className={cn("w-6 h-6", isDanger ? "text-red-500" : "text-green-500")} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed">
                {message}
                {isHardDelete && (
                  <span className="block mt-2 text-red-400 text-sm font-medium">
                    Warning: This action is permanent and will completely remove this record from the system.
                  </span>
                )}
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={cn(
                    "flex-1 py-3 px-4 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 group",
                    isDanger ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                  )}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
