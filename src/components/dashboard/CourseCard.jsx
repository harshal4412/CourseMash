import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Plus, 
  Check, 
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';

const CourseCard = ({ course }) => {
  const { addCourse, myCourses } = useCourses();
  const enrolled = myCourses.some(c => c.code === course.code);

  const getDayDetails = (day) => {
    const config = {
      'M': { label: 'Mon', color: 'bg-blue-50 text-blue-600 border-blue-100' },
      'T': { label: 'Tue', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      'W': { label: 'Wed', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      'Th': { label: 'Thu', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      'F': { label: 'Fri', color: 'bg-rose-50 text-rose-600 border-rose-100' }
    };
    return config[day] || { label: day, color: 'bg-slate-50 text-slate-600 border-slate-100' };
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      className={`group relative flex flex-col h-full rounded-[32px] border transition-all duration-500 overflow-hidden ${
        enrolled 
          ? 'bg-white border-blue-200 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)]' 
          : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100'
      }`}
    >
      <div className="p-6 pb-0 flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase">
              {course.code}
            </span>
            {enrolled && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tight"
              >
                <Check size={12} strokeWidth={3} />
                Enrolled
              </motion.span>
            )}
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {course.name}
          </h3>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => !enrolled && addCourse(course)}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            enrolled 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' 
              : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
          }`}
        >
          <AnimatePresence mode="wait">
            {enrolled ? (
              <motion.div key="check" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                <Check size={24} strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div key="plus" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                <Plus size={24} strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="p-6 space-y-4 flex-grow">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Users size={14} className="text-slate-400" />
            <span className="text-xs font-bold truncate max-w-[180px]">
              {course.instructors?.join(', ') || 'Staff'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <BookOpen size={14} className="text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider">{course.credits || 4} Credits</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {course.slots.map((slot, idx) => {
            const detail = getDayDetails(slot.day);
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border ${detail.color} transition-all duration-300`}
              >
                <span className="w-8 py-0.5 rounded-lg bg-white border border-inherit text-[10px] font-black text-center uppercase tracking-tighter">
                  {detail.label}
                </span>
                <span className="text-[10px] font-black tracking-tight whitespace-nowrap">
                  {slot.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.code + i}`} alt="user" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+12 Friends</span>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
};

export default CourseCard;