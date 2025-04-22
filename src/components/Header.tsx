import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-darkbg/80 border-b border-glassBorder">
      <div className="container mx-auto flex justify-between items-center py-4 px-5 md:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="font-space text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent hover:from-neon hover:to-neon/80 transition-all duration-300">
              creator chapter
            </h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-white/80 hover:text-neon transition-colors">How It Works</a>
          <a href="#features" className="text-white/80 hover:text-neon transition-colors">Features</a>
          <a href="#testimonials" className="text-white/80 hover:text-neon transition-colors">Testimonials</a>
          <a href="#for-brands" className="text-white/80 hover:text-neon transition-colors">For Brands</a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-white hover:text-neon transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#waitlist" className="btn-neon flex items-center">
            <span>Join Waitlist</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-darkbg/95 backdrop-blur-lg z-40">
          <nav className="flex flex-col items-center py-8 space-y-6">
            <a href="#how-it-works" onClick={closeMenu} className="text-xl text-white/80 hover:text-neon transition-colors">
              How It Works
            </a>
            <a href="#features" onClick={closeMenu} className="text-xl text-white/80 hover:text-neon transition-colors">
              Features
            </a>
            <a href="#testimonials" onClick={closeMenu} className="text-xl text-white/80 hover:text-neon transition-colors">
              Testimonials
            </a>
            <a href="#for-brands" onClick={closeMenu} className="text-xl text-white/80 hover:text-neon transition-colors">
              For Brands
            </a>
            <a href="#waitlist" onClick={closeMenu} className="btn-neon flex items-center mt-4">
              <span>Join Waitlist</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
