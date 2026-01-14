import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Beaker, BookOpen, MessageSquare, AlertCircle, CalendarDays, ExternalLink } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';

const TimeTable = () => {
  const { myCourses = [] } = useCourses();
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const slotData = [
    { time: "08:30 – 09:50", M: "A1", T: "B1", W: "A2", Th: "C2", F: "B2" },
    { time: "10:00 - 11:20", M: "C1", T: "D1", W: "E1", Th: "D2", F: "E2" },
    { time: "11:30 - 12:50", M: "F1", T: "G1", W: "H2", Th: "F2", F: "G2" },
    { time: "14:00 - 15:20", M: "I1", T: "J1", W: "I2", Th: "K2", F: "J2" },
    { time: "15:30 - 16:50", M: "K1", T: "L1", W: "M1", Th: "L2", F: "M2" },
    { time: "17:00 - 18:20", M: "H1", T: "N1", W: "P1", Th: "N2", F: "P2" }
  ];

  const days = [
    { full: 'Monday', short: 'M' },
    { full: 'Tuesday', short: 'T' },
    { full: 'Wednesday', short: 'W' },
    { full: 'Thursday', short: 'Th' },
    { full: 'Friday', short: 'F' }
  ];

  const getCourseColor = (code) => {
    const colors = [
      'bg-blue-600 shadow-blue-100',
      'bg-violet-600 shadow-violet-100',
      'bg-rose-600 shadow-rose-100',
      'bg-amber-600 shadow-amber-100',
      'bg-indigo-600 shadow-indigo-100',
      'bg-cyan-600 shadow-cyan-100',
      'bg-emerald-600 shadow-emerald-100',
      'bg-orange-600 shadow-orange-100'
    ];
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getCoursesForSlot = (slotCode) => {
    const matches = [];
    myCourses.forEach(course => {
      if (course.hasNoSlot) return; 

      const lec = course.schedule?.lecture?.[0]?.raw?.split(',') || [];
      const lab = course.schedule?.lab?.[0]?.raw?.split(',') || [];
      const tut = course.schedule?.tutorial?.[0]?.raw?.split(',') || [];

      let type = '';
      if (lec.some(s => s.trim() === slotCode)) type = 'Lecture';
      else if (lab.some(s => s.trim() === slotCode)) type = 'Lab';
      else if (tut.some(s => s.trim() === slotCode)) type = 'Tutorial';

      if (type) {
        const rawLoc = type === 'Lecture' ? course.schedule.lecture[1]?.raw :
                       type === 'Lab' ? course.schedule.lab[1]?.raw :
                       course.schedule.tutorial[1]?.raw;

        matches.push({
          ...course,
          sessionType: type,
          displayLocation: rawLoc?.replace(/[()]/g, '') || "TBA",
          colorClass: getCourseColor(course.code)
        });
      }
    });
    return matches;
  };

  const flexibleCourses = myCourses.filter(course => course.hasNoSlot);

  const totalHours = myCourses.reduce((acc, course) => {
    const lecCount = course.schedule?.lecture?.[0]?.raw?.split(',').filter(Boolean).length || 0;
    const labCount = course.schedule?.lab?.[0]?.raw?.split(',').filter(Boolean).length || 0;
    const tutCount = course.schedule?.tutorial?.[0]?.raw?.split(',').filter(Boolean).length || 0;
    return acc + ((lecCount + labCount + tutCount) * 1.5);
  }, 0);

  return (
    <div className="p-8 max-w-[1400px] mx-auto relative pb-32">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Weekly Schedule</h1>
          <p className="text-slate-500 font-bold mt-1">Personalized academic timeline</p>
        </div>
        
        <div className="bg-white border border-slate-100 px-6 py-4 rounded-[28px] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Workload</p>
            <p className="text-xl font-black text-slate-900">{totalHours} hrs</p>
          </div>
        </div>
      </header>

      <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-6 border-b border-slate-100 bg-slate-50/50">
            <div className="p-6 border-r border-slate-100"></div>
            {days.map(day => (
              <div key={day.full} className="p-6 text-center border-r border-slate-100 last:border-0">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{day.full}</span>
              </div>
            ))}
          </div>

          {slotData.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-6 border-b border-slate-50 last:border-0">
              <div className="p-6 bg-slate-50/20 border-r border-slate-100 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-slate-400 text-center leading-relaxed">{row.time}</span>
              </div>
              
              {days.map(day => {
                const currentSlotCode = row[day.short];
                const matches = getCoursesForSlot(currentSlotCode);
                const hasConflict = matches.length > 1;

                return (
                  <div 
                    key={`${day.short}-${rowIndex}`} 
                    className="p-2 border-r border-slate-100 last:border-0 min-h-[140px] relative"
                    onMouseEnter={() => hasConflict && setHoveredSlot({ code: currentSlotCode, courses: matches })}
                    onMouseLeave={() => setHoveredSlot(null)}
                  >
                    {matches.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`h-full w-full p-4 rounded-[24px] text-white shadow-lg flex flex-col justify-between relative transition-all cursor-default ${
                          hasConflict ? 'bg-rose-600 shadow-rose-200 ring-4 ring-rose-100' : matches[0].colorClass
                        }`}
                      >
                        {hasConflict && (
                          <div className="absolute -top-2 -right-2 bg-white text-rose-600 p-1 rounded-full shadow-md z-10">
                            <AlertCircle size={16} fill="currentColor" className="text-white" />
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-[9px] font-black opacity-80 uppercase tracking-widest">
                              {hasConflict ? 'Conflict' : matches[0].code}
                            </p>
                            <div className="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-full">
                              {matches[0].sessionType === 'Lab' && <Beaker size={8} />}
                              {matches[0].sessionType === 'Lecture' && <BookOpen size={8} />}
                              {matches[0].sessionType === 'Tutorial' && <MessageSquare size={8} />}
                              <span className="text-[8px] font-black uppercase">{matches[0].sessionType}</span>
                            </div>
                          </div>
                          <h4 className="text-[11px] font-black leading-tight line-clamp-2">
                            {hasConflict ? `${matches.length} Classes Overlap` : matches[0].name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 opacity-80 mt-2">
                          <MapPin size={10} />
                          <span className="text-[9px] font-bold truncate">
                            {hasConflict ? 'Hover to see details' : matches[0].displayLocation}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full w-full rounded-[24px] border border-slate-50/50 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-slate-200 uppercase tracking-tighter opacity-50">{currentSlotCode}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {flexibleCourses.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <CalendarDays size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Flexible Schedule</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project & Research courses without fixed slots</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flexibleCourses.map((course) => (
              <motion.div
                key={course.code}
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase tracking-widest">
                      {course.code}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 uppercase">
                      {course.credits?.split('-').pop()} Credits
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">
                    {course.name}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={14} />
                      <span className="text-xs font-bold uppercase tracking-tight">{course.schedule.lecture[1]?.raw || 'Self-Paced'}</span>
                   </div>
                   <div className="flex items-center gap-1 text-slate-300">
                      <ExternalLink size={14} />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {hoveredSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-[400px] bg-slate-900 text-white rounded-[32px] p-6 shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <div className="p-2 bg-rose-500 rounded-xl">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm">Slot Conflict: {hoveredSlot.code}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Multiple courses assigned</p>
              </div>
            </div>
            <div className="space-y-3">
              {hoveredSlot.courses.map((course, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl">
                  <div className={`w-1 h-8 rounded-full ${course.colorClass.split(' ')[0]}`} />
                  <div>
                    <p className="text-[10px] font-black text-blue-400">{course.code} • {course.sessionType}</p>
                    <p className="text-xs font-bold leading-tight">{course.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin size={8} /> {course.displayLocation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeTable;