
import React from 'react';
import { Instagram, Twitter, TrendingUp } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkbg/95 border-t border-glassBorder py-12">
      <div className="container mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0">
            <div className="text-neon font-space text-2xl font-bold mb-3">DEALFLOW</div>
            <p className="text-white/70 max-w-sm">Built for creators who want real partnerships.</p>
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
                <li><a href="#" className="text-white/70 hover:text-neon">Terms & Conditions</a></li>
                <li><a href="#" className="text-white/70 hover:text-neon">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-neon">Cookie Policy</a></li>
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
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} DEALFLOW. All rights reserved.</p>
          <p className="text-white/50 text-sm mt-2 md:mt-0">Made for creators, by creators.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
