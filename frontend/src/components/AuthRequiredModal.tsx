'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function AuthRequiredModal({ 
  isOpen, 
  onClose, 
  title = "Authentication Required", 
  message = "You need to be signed in to access our educational articles and interactive quizzes. Join our community to start earning Eco Points!"
}: AuthRequiredModalProps) {
  const router = useRouter();

  const handleAction = (path: string) => {
    router.push(path);
    onClose();
  };

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
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500" />
            
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleAction('/login')}
                  className="w-full py-3.5 px-4 bg-green-400 text-black rounded-xl font-bold transition-all hover:bg-[#00e65c] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Log In Now
                </button>
                
                <button
                  onClick={() => handleAction('/signup')}
                  className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Create an Account
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
