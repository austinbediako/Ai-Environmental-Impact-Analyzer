'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, History, User as UserIcon, Menu, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { ConfirmationModal } from './ConfirmationModal';

export function Navbar({ onOpenHistory }: { onOpenHistory: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle background blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthAction = () => {
    if (user) {
      setLogoutModalOpen(true);
    } else {
      router.push('/login');
    }
  };

  const confirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'glass border-white/10 py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-green-400/10 text-green-400 group-hover:bg-green-400/20 transition-colors">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Eco<span className="text-green-400">Analyzer</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="/" className={cn("transition-colors", pathname === '/' ? "text-purple-400" : "hover:text-white")}>Home</Link>
            <Link href="/analyze" className={cn("transition-colors", pathname === '/analyze' ? "text-purple-400" : "hover:text-white")}>Analyze</Link>
            <Link href="/learning" className={cn("transition-colors", pathname === '/learning' || pathname.startsWith('/learning/') ? "text-purple-400" : "hover:text-white")}>Learning</Link>
            <Link href="/leaderboard" className={cn("transition-colors", pathname === '/leaderboard' ? "text-purple-400" : "hover:text-white")}>Leaderboard</Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className={cn("transition-colors", pathname === '/admin' ? "text-purple-400 font-bold" : "text-purple-400/70 hover:text-purple-400")}>Admin</Link>
            )}
            <Link href="/about" className={cn("transition-colors", pathname === '/about' ? "text-purple-400" : "hover:text-white")}>About</Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 relative">
            {user && (
              <div 
                className="hidden sm:flex items-center gap-3 px-1 py-1 pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="p-2 bg-gradient-to-tr from-green-400/20 to-teal-400/20 rounded-full border border-white/5">
                  <UserIcon className="w-4 h-4 text-green-300" />
                </div>
                <div className="flex flex-col max-w-[100px] truncate">
                  <span className="text-sm font-semibold leading-none truncate text-white">{user.name}</span>
                  <span className={cn("text-[10px] uppercase font-bold mt-1 tracking-wider leading-none", user.role === 'admin' ? "text-purple-400" : "text-green-400")}>
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            {user && profileDropdownOpen && (
              <div className="absolute top-14 left-0 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                 <Link href="/settings" onClick={() => setProfileDropdownOpen(false)} className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm font-medium text-gray-300 flex items-center gap-2">
                   <Settings className="w-4 h-4" /> Settings
                 </Link>
                 <button 
                   onClick={() => setLogoutModalOpen(true)}
                   className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm font-medium text-red-400 flex items-center gap-2"
                 >
                   <LogOut className="w-4 h-4" /> Logout
                 </button>
              </div>
            )}

            {user && (
              <button
                onClick={onOpenHistory}
                className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-transparent hover:border-white/10"
                title="Analysis History"
              >
                <History className="w-5 h-5" />
              </button>
            )}
            
            {!user && (
              <button 
                onClick={handleAuthAction}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all bg-green-400 text-black hover:bg-[#00e65c] shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:shadow-[0_0_20px_rgba(74,222,128,0.5)]"
              >
                Login
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-white/10 text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-white/10 shadow-lg px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className={cn("block px-4 py-2 text-base font-medium rounded-md", pathname === '/' ? "text-purple-400 bg-white/5" : "text-gray-300 hover:text-white hover:bg-white/5")}>Home</Link>
          <Link href="/analyze" onClick={() => setMobileMenuOpen(false)} className={cn("block px-4 py-2 text-base font-medium rounded-md", pathname === '/analyze' ? "text-purple-400 bg-white/5" : "text-gray-300 hover:text-white hover:bg-white/5")}>Analyze</Link>
          <Link href="/learning" onClick={() => setMobileMenuOpen(false)} className={cn("block px-4 py-2 text-base font-medium rounded-md", pathname === '/learning' || pathname.startsWith('/learning/') ? "text-purple-400 bg-white/5" : "text-gray-300 hover:text-white hover:bg-white/5")}>Learning</Link>
          <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)} className={cn("block px-4 py-2 text-base font-medium rounded-md", pathname === '/leaderboard' ? "text-purple-400 bg-white/5" : "text-gray-300 hover:text-white hover:bg-white/5")}>Leaderboard</Link>
          {user?.role === 'admin' && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={cn("block px-4 py-2 text-base font-medium rounded-md", pathname === '/admin' ? "text-purple-400 bg-white/5 font-bold" : "text-purple-400/70 hover:text-purple-400 hover:bg-white/5")}>Admin Dashboard</Link>
          )}
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              if (user) setLogoutModalOpen(true);
              else handleAuthAction();
            }}
            className="mt-2 w-full px-4 py-3 rounded-md font-medium text-center bg-zinc-800 border border-white/10 text-white"
          >
            {user ? 'Logout' : 'Login / Sign up'}
          </button>
        </div>
      )}

      <ConfirmationModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to securely log out of your account session? You will need to re-authenticate to analyze new tasks."
        isHardDelete={false}
        confirmText="Sign Out"
        confirmIcon={LogOut}
        variant="primary"
      />
    </motion.nav>
  );
}
