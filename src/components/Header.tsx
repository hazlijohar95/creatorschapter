
import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Navigation items for reusability
  const navItems = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#for-brands", label: "For Brands" }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 backdrop-blur-md transition-all duration-300",
        isScrolled ? "bg-darkbg/90 shadow-md" : "bg-darkbg/80",
        "border-b border-glassBorder"
      )}
    >
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
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="text-white/80 hover:text-neon transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#waitlist" className="btn-neon flex items-center">
            <span>Join Waitlist</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* Mobile Menu - Using Shadcn Sheet for better UX */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button 
                className="md:hidden flex items-center text-white" 
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-darkbg/95 border-l border-glassBorder pt-16">
              <nav className="flex flex-col space-y-6 items-center text-center">
                {navItems.map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className="text-xl text-white hover:text-neon transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <a 
                  href="#waitlist" 
                  className="btn-neon flex items-center mt-4 px-8 py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Join Waitlist</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
