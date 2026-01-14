import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Toast = () => {
  const { notification } = useAuth();

  return (
    <div className="fixed bottom-8 right-8 z-[100] pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
              notification.type === 'error' 
                ? 'bg-red-50 border-red-100 text-red-600' 
                : 'bg-white border-slate-100 text-slate-800'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : (
              <CheckCircle size={20} className="text-emerald-500" />
            )}
            <p className="text-sm font-bold tracking-tight">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;