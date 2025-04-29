
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthButton } from './AuthButton';
import { useAuthStore } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { renderWithProviders } from '@/test/utils/test-utils';

// Mock the auth store
vi.mock('@/lib/auth', () => ({
  useAuthStore: vi.fn()
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signOut: vi.fn()
    }
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('AuthButton Component', () => {
  it('should render "Sign In" button when user is not authenticated', () => {
    (useAuthStore as any).mockImplementation(() => ({
      user: null
    }));

    renderWithProviders(<AuthButton />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should render "Sign Out" button when user is authenticated', () => {
    (useAuthStore as any).mockImplementation(() => ({
      user: { id: 'test-user-id' }
    }));

    renderWithProviders(<AuthButton />);
    
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('should call signOut when clicking the "Sign Out" button', async () => {
    (useAuthStore as any).mockImplementation(() => ({
      user: { id: 'test-user-id' }
    }));

    renderWithProviders(<AuthButton />);
    
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);
    
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
