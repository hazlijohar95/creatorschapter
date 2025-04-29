
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    // Check for the loader icon
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('h-5 w-5'); // Default md size
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-6 w-6'); // lg size
  });

  it('renders with custom text', () => {
    const testText = 'Loading data...';
    render(<LoadingSpinner text={testText} />);
    
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<LoadingSpinner variant="overlay" />);
    
    let spinnerContainer = screen.getByRole('status').parentElement;
    expect(spinnerContainer).toHaveClass('absolute inset-0');
    
    rerender(<LoadingSpinner variant="inline" />);
    spinnerContainer = screen.getByRole('status').parentElement;
    expect(spinnerContainer).toHaveClass('inline-flex');
  });

  it('renders text correctly based on variant', () => {
    const testText = 'Please wait';
    
    // In minimal variant, text should not appear
    const { rerender } = render(<LoadingSpinner variant="minimal" text={testText} />);
    expect(screen.queryByText(testText)).not.toBeInTheDocument();
    
    // With other variants, text should appear
    rerender(<LoadingSpinner variant="centered" text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});
