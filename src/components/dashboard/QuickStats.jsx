import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, Zap } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';

const QuickStats = () => {
  const { myCourses = [] } = useCourses();

  const totalHours = myCourses.reduce((acc, course) => {
    const lecCount = course.schedule?.lecture?.[0]?.raw?.split(',').filter(Boolean).length || 0;
    const labCount = course.schedule?.lab?.[0]?.raw?.split(',').filter(Boolean).length || 0;
    const tutCount = course.schedule?.tutorial?.[0]?.raw?.split(',').filter(Boolean).length || 0;
    
    return acc + ((lecCount + labCount + tutCount) * 1.5);
  }, 0);

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
      value: `${totalHours}h`,
      icon: Clock,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Study Load',
      value: totalHours > 24 ? 'High' : 'Optimal',
      icon: Zap,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Course Friends',
      value: '12',
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
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
          className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5"
        >
          <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {stat.value}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;