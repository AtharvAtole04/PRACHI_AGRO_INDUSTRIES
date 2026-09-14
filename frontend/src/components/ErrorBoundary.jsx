import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React ErrorBoundary caught an unhandled exception]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-lg flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 mb-2">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Something went wrong
            </h2>

            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              We couldn't load this page right now. An unexpected error occurred while rendering the content.
            </p>

            {this.state.error?.message && (
              <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 text-left font-mono text-xs text-rose-600 overflow-x-auto my-1 shadow-inner">
                <strong>Error details:</strong> {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
              <button
                onClick={this.handleReset}
                className="bg-brand-green-dark hover:bg-brand-green-light text-white font-extrabold text-sm px-5 py-3 rounded-xl cursor-pointer transition-all inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                <RefreshCw size={16} />
                <span>Try Again (पुन्हा प्रयत्न करा)</span>
              </button>

              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('prachi_site_content');
                  } catch (e) {}
                  window.location.reload();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm px-5 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto cursor-pointer"
              >
                <RefreshCw size={16} />
                <span>Clear Cache & Repair (कॅशे रीसेट करा)</span>
              </button>

              <a
                href="/"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm px-5 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Home size={16} />
                <span>Go to Homepage</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
