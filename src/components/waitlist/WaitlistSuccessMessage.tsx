
import React from 'react';
import { Check } from 'lucide-react';
import { WaitlistSuccessMessageProps } from '@/types/components/ui';

export const WaitlistSuccessMessage: React.FC<WaitlistSuccessMessageProps> = ({ hasEmailError }) => {
  return (
    <div className="text-center py-8">
      <div className="rounded-full bg-neon/20 p-4 inline-flex mb-6">
        <Check className="w-12 h-12 text-neon" />
      </div>
      <h3 className="text-2xl font-bold mb-4">Thanks! You're on the waitlist.</h3>
      <p className="text-white/70 mb-6">
        We've saved your information and will reach out soon with early access details.
        {hasEmailError ? ' (Note: There was an issue sending confirmation emails)' : ''}
      </p>
    </div>
  );
};
