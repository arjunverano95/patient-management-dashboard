import React, {Component, ErrorInfo, ReactNode} from 'react';
import {Alert, Button} from 'antd';
import {ExclamationCircleOutlined, ReloadOutlined} from '@ant-design/icons';

interface Props {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback UI to show on error */
  fallback?: ReactNode;
  /** Error handler callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error?: Error;
  /** Additional error information */
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    this.setState({hasError: false, error: undefined, errorInfo: undefined});
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <Alert
              message="Something went wrong"
              description={
                <div className="space-y-4">
                  <p className="text-gray-600">
                    An unexpected error occurred. Please try refreshing the
                    page.
                  </p>
                  {process.env.NODE_ENV === 'development' &&
                    this.state.error && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700">
                          Error Details (Development)
                        </summary>
                        <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                          {this.state.error.toString()}
                          {this.state.errorInfo?.componentStack}
                        </pre>
                      </details>
                    )}
                </div>
              }
              type="error"
              icon={<ExclamationCircleOutlined />}
              action={
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  className="mt-2"
                >
                  Try Again
                </Button>
              }
              showIcon
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
