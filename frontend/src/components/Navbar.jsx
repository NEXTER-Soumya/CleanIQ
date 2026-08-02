import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, LogOut, CreditCard, User, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md border-b w-full transition-colors" style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-brand text-white p-1.5 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight" style={{ color: 'var(--color-text-primary)' }}>CleanIQ</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated && (
            <>
              <Link to="/about-developer" className="text-sm font-medium hover:text-brand transition-colors text-secondary hidden sm:block">
                Dev
              </Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-brand transition-colors text-secondary hidden sm:block">
                Dashboard
              </Link>
              <div className="w-px h-6 bg-divider mx-2 hidden sm:block" />
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-surface border border-divider text-brand flex items-center justify-center hover:border-brand/50 transition-colors overflow-hidden"
                >
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.username?.charAt(0)?.toUpperCase() || <User size={20} />
                  )}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-surface border border-divider shadow-xl py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-divider mb-2">
                        <p className="text-sm font-medium text-primary truncate">{user?.username || user?.phoneNumber}</p>
                        <p className="text-xs text-secondary truncate">{user?.profession || (user?.activePlan === 'pro' ? 'Pro Plan' : 'Free Plan')}</p>
                      </div>
                      
                      <Link to="/about-developer" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-elevated transition-colors">
                        <User size={16} /> Dev
                      </Link>
                      <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-elevated transition-colors">
                        <Settings size={16} /> Profile Settings
                      </Link>
                      <Link to="/pricing" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-elevated transition-colors">
                        <CreditCard size={16} /> Subscription
                      </Link>
                      <div className="h-px bg-divider my-2"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={16} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
