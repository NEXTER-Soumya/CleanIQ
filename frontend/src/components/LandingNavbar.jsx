import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function LandingNavbar() {
  const [showDev, setShowDev] = useState(() => {
    return localStorage.getItem('showDevMenu') === 'true';
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl + Shift + I (Windows/Linux) or Cmd + Option + I (Mac)
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        (e.metaKey && e.altKey && e.key.toLowerCase() === 'i')
      ) {
        setShowDev(true);
        localStorage.setItem('showDevMenu', 'true');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        
        <div className="hidden md:flex items-center justify-center gap-6 absolute left-1/2 -translate-x-1/2 w-full max-w-[500px]">
          <Link to="/product" className="text-secondary hover:text-brand transition-colors text-sm font-medium">Product</Link>
          <Link to="/how-it-works" className="text-secondary hover:text-brand transition-colors text-sm font-medium">How it works</Link>
          <Link to="/tech-stack" className="text-secondary hover:text-brand transition-colors text-sm font-medium">Stack</Link>
          {showDev && (
            <Link to="/about-developer" className="text-secondary hover:text-brand transition-colors text-sm font-medium animate-fade-in">Dev</Link>
          )}
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors hidden sm:block">Log In</Link>
          <Link to="/login?mode=signup" className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}
