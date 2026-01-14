import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Clock } from 'lucide-react';
import { friendService } from '../../services/friendService';
import { useCourses } from '../../contexts/CourseContext';

const CommonCourses = ({ friendId }) => {
  const { myCourses } = useCourses();
  const commonCourses = friendService.getCommonCourses(myCourses, friendId);
  const friend = friendService.getFriendById(friendId);

  if (!friend) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm transition-colors duration-300">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Shared Schedule</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">With {friend.name}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-blue-600 dark:bg-blue-500 rounded-full text-[10px] font-black text-white shadow-lg shadow-blue-500/20">
          {commonCourses.length} MATCHES
        </div>
      </div>

      <div className="p-4 space-y-3">
        {commonCourses.length > 0 ? (
          commonCourses.map((course, index) => (
            <motion.div
              key={course.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                    {course.code}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {course.name}
                  </h4>
                </div>
                <BookOpen size={14} className="text-slate-300 dark:text-slate-600" />
              </div>

              <div className="flex flex-wrap gap-3">
                {course.slots.map((slot, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    <Clock size={12} className="text-blue-500 dark:text-blue-400" />
                    <span className="text-[9px] font-black uppercase tracking-tight">{slot.day} {slot.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-16 text-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-[24px]">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">No overlapping courses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonCourses;