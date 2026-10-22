import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Application Error Caught by Boundary]:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl border border-slate-200 text-center space-y-5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              An unexpected error occurred while loading this view. You can reload the page or reset the local session cache.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-slate-100 rounded-xl text-xs font-mono text-left text-slate-700 overflow-x-auto border border-slate-200">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md"
              >
                🔄 Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition"
              >
                🧹 Reset Session Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
