import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;

    // Log the error with full context
    logger.error('React Error Boundary caught error', error, {
      errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: 'GlobalErrorBoundary',
      retryCount: this.retryCount,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to external error tracking service if configured
    this.reportToErrorService(error, errorInfo, errorId);
  }

  private reportToErrorService(error: Error, errorInfo: ErrorInfo, errorId: string) {
    // This would integrate with services like Sentry, Bugsnag, etc.
    // For now, we'll just log it
    try {
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        retryCount: this.retryCount
      };

      // In a real app, send to your error tracking service
      console.warn('Error Report:', errorReport);
    } catch (reportingError) {
      logger.error('Failed to report error to external service', reportingError);
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      logger.info('Retrying after error', { 
        retryCount: this.retryCount,
        errorId: this.state.errorId 
      });
      
      this.setState({ 
        hasError: false, 
        error: undefined,
        errorId: '' 
      });
    }
  };

  private handleReload = () => {
    logger.info('Reloading page after error', { 
      errorId: this.state.errorId 
    });
    window.location.reload();
  };

  private handleGoHome = () => {
    logger.info('Navigating to home after error', { 
      errorId: this.state.errorId 
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="text-xs text-gray-500 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {this.state.error?.stack || this.state.error?.message}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {this.state.errorId}
                  </p>
                </details>
              )}

              <div className="flex flex-col space-y-2">
                {this.retryCount < this.maxRetries && (
                  <Button 
                    onClick={this.handleRetry}
                    className="w-full"
                    variant="default"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again ({this.maxRetries - this.retryCount} left)
                  </Button>
                )}
                
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  Reload Page
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  variant="ghost"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}