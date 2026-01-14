import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useCourses } from '../../context/CourseContext';

const CourseDetails = ({ course, onClose }) => {
  const { addCourse, myCourses } = useCourses();
  const isEnrolled = myCourses.some(c => c.code === course.code);

  const handleEnroll = () => {
    const result = addCourse(course);
    if (result.success) {
      onClose();
    } else {
      alert(result.error);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="relative h-48 bg-blue-600 p-8 flex items-end">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/30">
            {course.code}
          </span>
          <h2 className="text-2xl font-black text-white mt-3 tracking-tight leading-tight">
            {course.name}
          </h2>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{course.credits} Credits</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <User size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{course.instructor}</span>
          </div>
        </div>

        <section className="mb-10">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Description</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            {course.description || "No description provided for this course. Please consult the departmental syllabus for full learning objectives and assessment criteria."}
          </p>
        </section>

        <section className="mb-10">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Weekly Schedule</h3>
          <div className="space-y-3">
            {course.slots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-blue-600">
                    {slot.day}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{slot.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{slot.room || 'TBA'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {course.prerequisites && (
          <section className="mb-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Prerequisites</h3>
            <div className="flex flex-wrap gap-2">
              {course.prerequisites.map(pre => (
                <span key={pre} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[10px] font-bold uppercase">
                  {pre}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-8 flex gap-4">
        {isEnrolled ? (
          <div className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs tracking-widest border border-emerald-100">
            <CheckCircle2 size={18} />
            ENROLLED
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
          >
            ADD TO SCHEDULE
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CourseDetails;