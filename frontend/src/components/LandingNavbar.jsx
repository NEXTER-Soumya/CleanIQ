import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function LandingNavbar() {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 80%, transparent)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-brand text-white p-1.5 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight" style={{ color: 'var(--color-text-primary)' }}>CleanIQ</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/product" className="text-secondary hover:text-brand transition-colors text-sm font-medium">Product</Link>
          <Link to="/how-it-works" className="text-secondary hover:text-brand transition-colors text-sm font-medium">How it works</Link>
          <Link to="/tech-stack" className="text-secondary hover:text-brand transition-colors text-sm font-medium">Tech Stack</Link>
          <Link to="/about-developer" className="text-secondary hover:text-brand transition-colors text-sm font-medium">About Developer</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors hidden sm:block">Log In</Link>
          <Link to="/login?mode=signup" className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}
