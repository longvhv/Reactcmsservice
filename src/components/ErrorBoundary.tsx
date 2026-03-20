import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { translations } from '../contexts/LanguageContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to monitoring service (mock)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Mock error logging - in production, send to Sentry, LogRocket, etc.
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
    };

    console.log('📊 Error logged:', errorLog);
    
    // Simulate API call
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorLog) });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/page/cms/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background gradient-mesh">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="glass-strong rounded-2xl border border-border/40 overflow-hidden">
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-red-500/10 to-orange-500/10 p-8 border-b border-border/40">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 animate-pulse" />
                
                <div className="relative flex items-start gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-2xl">
                      <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl text-foreground mb-2">
                      Oops! Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                      An unexpected error occurred. Don't worry, our team has been notified and we're working on it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              <div className="p-8 space-y-6">
                {/* Error Message */}
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                    Error Message
                  </label>
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <code className="text-sm text-red-600 dark:text-red-400 font-mono">
                      {this.state.error?.message || 'Unknown error'}
                    </code>
                  </div>
                </div>

                {/* Stack Trace (collapsible) */}
                {this.state.error?.stack && (
                  <details className="group">
                    <summary className="text-xs text-muted-foreground uppercase tracking-wider mb-2 cursor-pointer hover:text-foreground transition-colors">
                      Stack Trace ▼
                    </summary>
                    <div className="mt-2 p-4 rounded-xl bg-muted/30 border border-border/40 overflow-x-auto">
                      <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-muted/60 hover:bg-muted transition-all duration-200 border border-border/40"
                  >
                    <Home className="w-4 h-4" />
                    Go to Dashboard
                  </button>
                </div>

                {/* Help Text */}
                <div className="pt-4 border-t border-border/40">
                  <p className="text-xs text-muted-foreground text-center">
                    If this problem persists, please contact support with the error details above.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Status: Operational
              </div>
              <div>
                Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}