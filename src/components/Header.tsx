
import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-darkbg/80 border-b border-glassBorder">
      <div className="container mx-auto flex justify-between items-center py-4 px-5 md:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/15469034-65cd-4df5-83a4-140a47eee54f.png" 
              alt="DEALFLOW Logo" 
              className="h-8"
              loading="eager" 
              decoding="async"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-white/80 hover:text-neon transition-colors">How It Works</a>
          <a href="#features" className="text-white/80 hover:text-neon transition-colors">Features</a>
          <a href="#testimonials" className="text-white/80 hover:text-neon transition-colors">Testimonials</a>
          <a href="#for-brands" className="text-white/80 hover:text-neon transition-colors">For Brands</a>
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#waitlist" className="btn-neon flex items-center">
            <span>Join Waitlist</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center text-white" 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-darkbg/95 z-40 flex flex-col pt-20 px-6 transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <nav className="flex flex-col space-y-6 items-center text-center">
          <a 
            href="#how-it-works" 
            className="text-xl text-white hover:text-neon transition-colors" 
            onClick={closeMobileMenu}
          >
            How It Works
          </a>
          <a 
            href="#features" 
            className="text-xl text-white hover:text-neon transition-colors" 
            onClick={closeMobileMenu}
          >
            Features
          </a>
          <a 
            href="#testimonials" 
            className="text-xl text-white hover:text-neon transition-colors" 
            onClick={closeMobileMenu}
          >
            Testimonials
          </a>
          <a 
            href="#for-brands" 
            className="text-xl text-white hover:text-neon transition-colors" 
            onClick={closeMobileMenu}
          >
            For Brands
          </a>
          <a 
            href="#waitlist" 
            className="btn-neon flex items-center mt-4 px-8 py-3"
            onClick={closeMobileMenu}
          >
            <span>Join Waitlist</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
