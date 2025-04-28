
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { waitlistSchema, WaitlistFormData } from './waitlist-schema';

interface WaitlistFormProps {
  onSubmit: (data: WaitlistFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
            Full Name
          </label>
          <input
            id="name"
            {...register('name')}
            className={`w-full bg-darkbg/50 border ${errors.name ? 'border-red-500' : 'border-glassBorder'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full bg-darkbg/50 border ${errors.email ? 'border-red-500' : 'border-glassBorder'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="socialHandle" className="block text-sm font-medium text-white/90 mb-2">
            Social Media Handle
          </label>
          <input
            id="socialHandle"
            {...register('socialHandle')}
            className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
            placeholder="@yourusername"
          />
        </div>
        <div>
          <label htmlFor="followerCount" className="block text-sm font-medium text-white/90 mb-2">
            Follower Count
          </label>
          <input
            id="followerCount"
            {...register('followerCount')}
            className="w-full bg-darkbg/50 border border-glassBorder rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50"
            placeholder="e.g., 10K"
          />
        </div>
      </div>

      <div>
        <label htmlFor="niche" className="block text-sm font-medium text-white/90 mb-2">
          Content Niche
        </label>
        <select
          id="niche"
          {...register('niche')}
          className={`w-full bg-darkbg/50 border ${errors.niche ? 'border-red-500' : 'border-glassBorder'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon/50`}
        >
          <option value="">Select your primary niche</option>
          <option value="fashion">Fashion</option>
          <option value="beauty">Beauty</option>
          <option value="fitness">Fitness</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="tech">Technology</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="gaming">Gaming</option>
          <option value="other">Other</option>
        </select>
        {errors.niche && (
          <p className="mt-1 text-sm text-red-500">{errors.niche.message}</p>
        )}
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-neon text-lg px-12 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Apply Now'}
        </button>
      </div>
    </form>
  );
};
