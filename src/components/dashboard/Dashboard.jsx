import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  ArrowRight,
  LayoutGrid,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import QuickStats from './QuickStats';
import UpcomingClasses from './UpcomingClasses';
import AddCustomCourseModal from '../courses/AddCustomCourseModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { myCourses = [], loading } = useCourses();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const calculateTotalHours = () => {
    return myCourses.reduce((acc, course) => {
      const lecCount = course.schedule?.lecture?.[0]?.raw?.split(',').filter(Boolean).length || 0;
      const labCount = course.schedule?.lab?.[0]?.raw?.split(',').filter(Boolean).length || 0;
      const tutCount = course.schedule?.tutorial?.[0]?.raw?.split(',').filter(Boolean).length || 0;
      return acc + ((lecCount + labCount + tutCount) * 1.5);
    }, 0);
  };

  const totalWeeklyHours = calculateTotalHours();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Student';
  const firstName = userDisplayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-slate-900 relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="absolute top-0 right-0 p-20 opacity-20">
          <LayoutGrid size={300} className="text-blue-500 rotate-12" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 pt-24 pb-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Academic Control Center
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">v2.0 Beta</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
              Hey, {firstName}!
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
              Your semester is looking <span className="text-white">productive</span>. 
              You've tracked {myCourses.length} {myCourses.length === 1 ? 'course' : 'courses'} with <span className="text-white">{totalWeeklyHours} weekly hours</span>.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-16 relative z-20">
        <QuickStats totalHours={totalWeeklyHours} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div 
            variants={itemVariants} 
            initial="hidden" 
            animate="show" 
            className="lg:col-span-2"
          >
            <UpcomingClasses />
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            initial="hidden" 
            animate="show" 
            className="space-y-8"
          >
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Courses</h3>
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                  {myCourses.length} Total
                </span>
              </div>

              {myCourses.length > 0 ? (
                <div className="space-y-4 mb-8 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {myCourses.map((course) => (
                    <div key={course.code} className="group flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 font-black text-xs text-slate-900 group-hover:text-blue-600">
                          {course.code.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{course.code}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                            {course.name?.substring(0, 25)}...
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mb-8">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No courses tracked</p>
                </div>
              )}

              <div className="space-y-3">
                <Link to="/explorer" className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-900/10">
                  <Plus size={16} />
                  Add New Course
                </Link>

                <button 
                  onClick={() => setIsCustomModalOpen(true)}
                  className="w-full py-4 bg-white border-2 border-dashed border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-400 rounded-[20px] font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all"
                >
                  <Zap size={16} />
                  Add Custom/Project
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AddCustomCourseModal 
        isOpen={isCustomModalOpen} 
        onClose={() => setIsCustomModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;