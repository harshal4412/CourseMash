import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, BookOpen, Clock, MapPin, AlertCircle } from "lucide-react";
import { useCourses } from "../../contexts/CourseContext";

const MyCourses = () => {
  const context = useCourses();
  
  if (!context) {
    return (
      <div className="p-8 bg-white rounded-[32px] border border-slate-100 flex items-center gap-3 text-amber-600">
        <AlertCircle size={20} />
        <p className="font-bold">Course Context not found. Ensure this component is inside CourseProvider.</p>
      </div>
    );
  }

  const { myCourses = [], removeCourse, loading } = context;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Syncing Schedule...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Schedule</h1>
            <p className="text-slate-500 text-sm font-bold">{myCourses.length} Courses Enrolled</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode='popLayout'>
          {myCourses.length > 0 ? (
            myCourses.map((course, index) => {
              const timeSlot = course.schedule?.lecture?.[0]?.raw || "TBA";
              const location = course.schedule?.lecture?.[1]?.raw || "TBA";
              const uniqueKey = `${course.code}-${index}`;

              return (
                <motion.div
                  layout
                  key={uniqueKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                          {course.code}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {course.credits?.C} Credits
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight mb-4">
                        {course.name}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={14} className="text-blue-500" />
                          <span className="text-xs font-bold uppercase tracking-wide">{timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <MapPin size={14} className="text-rose-500" />
                          <span className="text-xs font-bold uppercase tracking-wide truncate">
                            {location.replace(/[()]/g, '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeCourse(course.code)}
                      className="ml-4 p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-4">
                <AlertCircle size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Your schedule is empty</p>
              <p className="text-slate-400 text-sm mt-1">Start adding courses from the search tab.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyCourses;