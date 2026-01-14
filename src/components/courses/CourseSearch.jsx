import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Check, Clock, MapPin, AlertCircle, BookOpen, X } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import toast from 'react-hot-toast';

const CourseSearch = () => {
  const { allCourses, myCourses, addCourse } = useCourses();
  const [query, setQuery] = useState('');

  const coursesToFilter = allCourses || [];
  const searchTerm = query.toLowerCase().trim();

  const filteredCourses = searchTerm === '' 
    ? coursesToFilter 
    : coursesToFilter.filter(course => {
        const name = (course.name || '').toLowerCase();
        const code = (course.code || '').toLowerCase();
        const searchClean = searchTerm.replace(/\s+/g, '');
        const codeClean = code.replace(/\s+/g, '');
        return name.includes(searchTerm) || codeClean.includes(searchClean);
      });

  const handleAdd = async (course) => {
    const result = await addCourse(course);
    if (result && result.success) {
      toast.success(`${course.code} added`);
    } else {
      toast.error(result?.error || "Error adding course");
    }
  };

  return (
    <div className="relative z-10 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen size={18} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Search Courses</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search code or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-5 bg-white border border-slate-200 rounded-2xl text-base font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={18} className="text-slate-400" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? (
              filteredCourses.slice(0, 40).map((course, index) => {
                const isAdded = myCourses?.some(c => c.code === course.code);
                
                const uniqueKey = `${course.code}-${index}`;

                return (
                  <motion.div
                    layout
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`group p-5 rounded-[24px] border transition-all ${
                      isAdded ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                          {course.code}
                        </p>
                        <h3 className="font-bold text-slate-900 leading-tight">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-3 text-slate-500">
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                            <Clock size={12} className="text-slate-400" />
                            {course.schedule?.lecture?.[0]?.raw || "TBA"}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => !isAdded && handleAdd(course)}
                        disabled={isAdded}
                        className={`ml-6 p-4 rounded-2xl transition-all ${
                          isAdded 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg'
                        }`}
                      >
                        {isAdded ? <Check size={20} /> : <Plus size={20} />}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No matching courses found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;