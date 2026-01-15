import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, BarChart3, Zap, Edit2, Check } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';

const QuickStats = () => {
  const { myCourses = [], allCourses = [], manualCredits, updateManualCredits } = useCourses();
  const [isEditing, setIsEditing] = useState(false);
  const [localVal, setLocalVal] = useState('');

  useEffect(() => {
    setLocalVal(manualCredits || '0');
  }, [manualCredits]);

  const handleSave = () => {
    updateManualCredits(localVal);
    setIsEditing(false);
  };

  const calculatedStats = useMemo(() => {
    return myCourses.reduce((acc, current) => {
      let courseData = null;

      if (typeof current === 'string') {
        courseData = allCourses.find(c => 
          c.code?.trim().toLowerCase() === current.trim().toLowerCase()
        );
      } else {
        courseData = current;
      }

      if (!courseData) return acc;

      const lecCount = courseData.schedule?.lecture?.[0]?.raw?.split(',').filter(Boolean).length || 0;
      const labCount = courseData.schedule?.lab?.[0]?.raw?.split(',').filter(Boolean).length || 0;
      const tutCount = courseData.schedule?.tutorial?.[0]?.raw?.split(',').filter(Boolean).length || 0;
      
      acc.hours += ((lecCount + labCount + tutCount) * 1.5);
      return acc;
    }, { hours: 0 });
  }, [myCourses, allCourses]);

  const stats = [
    { 
      label: 'Total Courses', 
      value: myCourses.length, 
      icon: BookOpen, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Weekly Hours', 
      value: `${calculatedStats.hours}h`, 
      icon: Clock, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Study Load', 
      value: calculatedStats.hours > 24 ? 'High' : 'Optimal', 
      icon: Zap, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Total Credits', 
      value: manualCredits || 0, 
      icon: BarChart3, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50',
      isEditable: true 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 relative transition-colors"
        >
          <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10`}>
            <stat.icon size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              {stat.label}
            </p>
            
            {stat.isEditable && isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="number"
                  value={localVal}
                  onChange={(e) => setLocalVal(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="w-20 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-xl font-black text-slate-900 dark:text-white outline-none"
                />
                <Check size={16} className="text-emerald-500" />
              </div>
            ) : (
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {stat.value}
                {stat.isEditable && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all"
                  >
                    <Edit2 size={14} className="text-slate-400" />
                  </button>
                )}
              </h3>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;