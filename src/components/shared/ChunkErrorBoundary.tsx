import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  chunkName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
  retryCount: number;
}

/**
 * Specialized error boundary for handling chunk loading errors
 * Common in lazy-loaded components and code splitting scenarios
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  private maxRetries = 2;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isChunkError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if it's a chunk loading error
    const isChunkError = error.message.includes('Loading chunk') || 
                        error.message.includes('ChunkLoadError') ||
                        error.name === 'ChunkLoadError';

    return { 
      hasError: true,
      isChunkError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { chunkName } = this.props;
    const { isChunkError } = this.state;

    logger.error('Chunk Error Boundary caught error', error, {
      chunkName: chunkName || 'unknown',
      isChunkError,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount
    });

    // If it's a chunk error, we might want to handle it differently
    if (isChunkError) {
      logger.warn('Chunk loading failed, user may need to refresh', {
        chunkName,
        retryCount: this.state.retryCount
      });
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      logger.info('Retrying chunk load', { 
        chunkName: this.props.chunkName,
        retryCount: this.state.retryCount + 1
      });

      this.setState(prevState => ({ 
        hasError: false, 
        isChunkError: false,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  private handleRefresh = () => {
    logger.info('Refreshing page due to chunk error', { 
      chunkName: this.props.chunkName 
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Specialized UI for chunk errors
      if (this.state.isChunkError) {
        return (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <div className="space-y-3">
                  <p>Failed to load application resources. This usually happens when the app has been updated.</p>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={this.handleRefresh}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh Page
                    </Button>
                    
                    {this.state.retryCount < this.maxRetries && (
                      <Button 
                        onClick={this.handleRetry}
                        size="sm"
                        variant="ghost"
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        );
      }

      // Generic error UI for non-chunk errors
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <div className="space-y-3">
                <p>
                  Something went wrong loading{' '}
                  {this.props.chunkName ? `the ${this.props.chunkName} component` : 'this section'}.
                </p>
                
                <div className="flex space-x-2">
                  {this.state.retryCount < this.maxRetries && (
                    <Button 
                      onClick={this.handleRetry}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Try Again
                    </Button>
                  )}
                  
                  <Button 
                    onClick={this.handleRefresh}
                    size="sm"
                    variant="ghost"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}