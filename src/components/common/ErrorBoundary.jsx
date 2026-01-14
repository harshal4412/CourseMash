import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CourseMash Error Boundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="h-24 w-24 bg-rose-50 rounded-[32px] border border-rose-100 flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} className="text-rose-500" />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Something went wrong</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-10 leading-relaxed">
              We encountered an unexpected error while rendering this view.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
              >
                <RefreshCcw size={16} />
                RELOAD INTERFACE
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-50 transition-all"
              >
                <Home size={16} />
                BACK TO DASHBOARD
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-12 p-6 bg-slate-100 rounded-[24px] text-left overflow-auto max-h-40 border border-slate-200">
                <p className="text-[10px] font-mono font-bold text-rose-600 uppercase mb-2">Debug Info:</p>
                <code className="text-[10px] font-mono text-slate-600 break-all">
                  {this.state.error && this.state.error.toString()}
                </code>
              </div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;