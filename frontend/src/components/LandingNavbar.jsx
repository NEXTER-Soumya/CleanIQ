import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="bg-brand text-white p-1.5 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight" style={{ color: 'var(--color-text-primary)' }}>CleanIQ</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center gap-6 absolute left-1/2 -translate-x-1/2 w-full max-w-[500px]">
          <Link to="/product" className="text-secondary hover:text-brand transition-colors text-sm font-medium">Product</Link>
          <Link to="/how-it-works" className="text-secondary hover:text-brand transition-colors text-sm font-medium">How it works</Link>
          <Link to="/tech-stack" className="text-secondary hover:text-brand transition-colors text-sm font-medium">Stack</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 relative z-10">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Log In</Link>
          <Link to="/login?mode=signup" className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors">Sign Up</Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-4 relative z-10">
          <ThemeToggle />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-secondary hover:text-primary p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-divider bg-surface overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link to="/product" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-medium p-2 hover:bg-surface-elevated rounded-lg">Product</Link>
              <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-medium p-2 hover:bg-surface-elevated rounded-lg">How it works</Link>
              <Link to="/tech-stack" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-medium p-2 hover:bg-surface-elevated rounded-lg">Stack</Link>
              
              <div className="h-px w-full bg-divider my-2" />
              
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-medium p-2 hover:bg-surface-elevated rounded-lg text-center border border-divider">Log In</Link>
              <Link to="/login?mode=signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-brand text-white font-medium p-2 rounded-lg text-center">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
