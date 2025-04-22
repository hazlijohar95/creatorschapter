
import React from 'react';
import { Instagram, Twitter, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkbg/95 border-t border-glassBorder py-12">
      <div className="container mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0">
            <div className="text-neon font-space text-2xl font-bold mb-1">creator chapter</div>
            <p className="text-white/70 max-w-sm">Empowering creators to write their success story.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-white/70 hover:text-neon">How It Works</a></li>
                <li><a href="#features" className="text-white/70 hover:text-neon">Features</a></li>
                <li><a href="#testimonials" className="text-white/70 hover:text-neon">Testimonials</a></li>
                <li><a href="#for-brands" className="text-white/70 hover:text-neon">For Brands</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-white/70 hover:text-neon">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-white/70 hover:text-neon">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-white/70 hover:text-neon">Cookie Policy</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-neon">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/70 hover:text-neon">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/70 hover:text-neon">
                  <TrendingUp className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-glassBorder flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm flex flex-col md:flex-row items-center gap-2">
            <span>© {new Date().getFullYear()} Creator Chapter Sdn.Bhd.</span>
            <span className="hidden md:inline">•</span>
            <span>Kuala Lumpur, Malaysia</span>
          </div>
          <p className="text-white/50 text-sm mt-2 md:mt-0">Made for creators, by creators.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
