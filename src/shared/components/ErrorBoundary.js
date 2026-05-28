import React from 'react';

import ErrorState from './ScreenStates/ErrorState';

/**
 * Error Boundary — kelas komponen wajib untuk menangkap render errors.
 *
 * Props:
 *   children   ReactNode
 *   fallback?  (error: Error, resetError: () => void) => ReactNode
 *   onError?   (error: Error, info: { componentStack: string }) => void
 *
 * Sentry integration (uncomment saat ready):
 *   import * as Sentry from '@sentry/react-native';
 *   Sentry.captureException(error, { extra: info });
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);

    // Sentry.captureException(error, { extra: info });

    this.props.onError?.(error, info);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      return (
        <ErrorState
          title="Terjadi Kesalahan"
          message={this.state.error?.message}
          onRetry={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
