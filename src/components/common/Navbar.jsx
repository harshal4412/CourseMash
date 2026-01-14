import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Clock, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCourses } from '../../contexts/CourseContext';

const Navbar = ({ onMenuClick }) => {
  const { myCourses = [] } = useCourses();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const notifications = myCourses.map((course, index) => ({
    id: `added-${course.code}-${index}`,
    text: `${course.code} added to schedule`,
    time: "Just now",
    type: "success"
  })).reverse().slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="relative flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-[100]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100 dark:shadow-none group-hover:scale-110 transition-transform">
            <span className="font-black text-sm">C</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
            CourseMash
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-3 rounded-2xl transition-all relative ${
              showNotifications 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[32px] z-[110] overflow-hidden"
              >
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-black text-slate-900 dark:text-white tracking-tight">Activity</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>

                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <div className="flex gap-4">
                          <div className={`mt-1 p-2 rounded-xl h-fit ${n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'}`}>
                            {n.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Clock size={10} className="text-slate-300 dark:text-slate-600" />
                              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest">No recent activity</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800">
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;