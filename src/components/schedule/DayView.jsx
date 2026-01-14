import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Clock, User, Coffee } from 'lucide-react';

const DayView = ({ days, dayNames, currentDayIndex, setCurrentDayIndex, schedule, getCourseColor }) => {
  const currentDay = days[currentDayIndex];
  const currentDayName = dayNames[currentDayIndex];
  const daySchedule = schedule[currentDay] || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-12 bg-slate-50/50 p-3 rounded-[32px] border border-slate-100">
        <button
          onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
          disabled={currentDayIndex === 0}
          className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-20 transition-all text-slate-400"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        
        <div className="text-center px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">
            Day {currentDayIndex + 1} of 5
          </p>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentDayName}</h2>
        </div>

        <button
          onClick={() => setCurrentDayIndex(Math.min(4, currentDayIndex + 1))}
          disabled={currentDayIndex === 4}
          className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-20 transition-all text-slate-400"
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="relative space-y-8 before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-blue-100 before:via-slate-100 before:to-transparent">
        {daySchedule.length > 0 ? (
          daySchedule.map((item, index) => {
            const colorClass = getCourseColor(item.course.code);
            const dotColor = colorClass.split(' ').find(c => c.startsWith('dot-'))?.replace('dot-', 'bg-');
            
            return (
              <motion.div
                key={`${item.course.code}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border-4 border-[#F8FAFC] shadow-md flex items-center justify-center z-10 group">
                  <div className={`w-3 h-3 rounded-full transition-transform group-hover:scale-125 ${dotColor || 'bg-slate-400'}`} />
                </div>
                
                <div className={`group p-8 rounded-[40px] border-2 transition-all hover:shadow-2xl hover:shadow-current/5 ${colorClass}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2 opacity-70">
                        <Clock size={14} strokeWidth={3} />
                        <span className="text-xs font-black uppercase tracking-widest">{item.time}</span>
                      </div>
                      <h3 className="text-xl font-black leading-tight tracking-tight">
                        {item.course.code}
                      </h3>
                      <p className="text-sm font-bold opacity-80 mt-1">{item.course.name}</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-2xl bg-white/40 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.15em] border border-white/20">
                      {item.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-current/10">
                    <div className="flex items-center gap-3 opacity-70">
                      <div className="p-2 rounded-xl bg-white/30">
                        <MapPin size={14} strokeWidth={3} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Room {item.slot || 'TBA'}
                      </span>
                    </div>
                    {item.course.instructors?.[0] && (
                      <div className="flex items-center gap-3 opacity-70">
                        <div className="p-2 rounded-xl bg-white/30">
                          <User size={14} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">
                          {item.course.instructors[0].split(' ').pop()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-24 text-center bg-white rounded-[48px] border border-dashed border-slate-200">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-50 text-slate-200 mb-6">
              <Coffee size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-slate-900 font-black text-lg mb-2">No Lectures</h3>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your schedule is clear</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;