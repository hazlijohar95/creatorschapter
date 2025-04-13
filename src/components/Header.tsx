
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-darkbg/80 border-b border-glassBorder">
      <div className="container mx-auto flex justify-between items-center py-4 px-5 md:px-8">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img 
              src="/lovable-uploads/15469034-65cd-4df5-83a4-140a47eee54f.png" 
              alt="ChapterCreator Logo" 
              className="h-8"
              loading="eager" 
              decoding="async"
            />
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-white/80 hover:text-neon transition-colors">How It Works</a>
          <a href="#features" className="text-white/80 hover:text-neon transition-colors">Features</a>
          <a href="#testimonials" className="text-white/80 hover:text-neon transition-colors">Testimonials</a>
          <a href="#for-brands" className="text-white/80 hover:text-neon transition-colors">For Brands</a>
        </nav>
        <div className="flex items-center space-x-4">
          <a href="#waitlist" className="btn-neon flex items-center">
            <span>Join Waitlist</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
