
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  useEffect(() => {
    document.title = "Cookie Policy - Creator Chapter";
  }, []);

  return (
    <div className="min-h-screen bg-darkbg text-white pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 mb-6">Last updated: April 22, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="text-white/80 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and allow certain features to work.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="text-white/80 mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-white/80 mb-4">
              <li>Essential cookies: Required for the platform to function properly</li>
              <li>Analytics cookies: Help us understand how visitors interact with our platform</li>
              <li>Preference cookies: Remember your settings and preferences</li>
              <li>Authentication cookies: Manage your login session and security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Managing Cookies</h2>
            <p className="text-white/80 mb-4">
              Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect your experience using our platform.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/60">
              For questions about our cookie practices, please contact us at{' '}
              <a href="mailto:privacy@creatorchapter.com" className="text-neon hover:underline">
                privacy@creatorchapter.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
