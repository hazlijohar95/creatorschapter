
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  useEffect(() => {
    document.title = "Terms & Conditions - Creator Chapter";
  }, []);

  return (
    <div className="min-h-screen bg-darkbg text-white pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms & Conditions</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 mb-6">Last updated: April 22, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-white/80 mb-4">
              By accessing or using Creator Chapter's platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Platform Usage</h2>
            <p className="text-white/80 mb-4">
              Our platform connects creators with brands for collaboration opportunities. Users must be at least 18 years old to use our services. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="text-white/80 mb-4">
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users must immediately notify Creator Chapter of any unauthorized use of their account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="text-white/80 mb-4">
              All content present on Creator Chapter, including text, graphics, logos, and software, is the property of Creator Chapter or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/60">
              For any questions about these Terms & Conditions, please contact us at{' '}
              <a href="mailto:legal@creatorchapter.com" className="text-neon hover:underline">
                legal@creatorchapter.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
