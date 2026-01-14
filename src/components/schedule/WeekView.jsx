import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

const WeekView = ({ days, dayNames, timeSlotOrder, getClassForTimeSlot, getCourseColor }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar -m-2 p-2">
      <div className="min-w-[1100px]">
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="p-5 bg-slate-50/50 rounded-[24px] border border-slate-100 flex items-center justify-center">
            <Clock size={20} className="text-slate-400" />
          </div>
          {days.map((day, idx) => (
            <div key={day} className="p-5 bg-white rounded-[24px] border border-slate-100 text-center shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
                {dayNames[idx].substring(0, 3)}
              </p>
              <p className="text-sm font-black text-slate-900">{dayNames[idx]}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {timeSlotOrder.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-6 gap-4">
              <div className="p-5 bg-slate-50/30 rounded-[24px] border border-slate-100/50 flex flex-col items-center justify-center backdrop-blur-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Slot</p>
                <p className="text-[11px] font-black text-slate-900 whitespace-nowrap">{timeSlot}</p>
              </div>

              {days.map((day) => {
                const classItem = getClassForTimeSlot(day, timeSlot);
                const colorClasses = classItem ? getCourseColor(classItem.course.code) : '';
                
                return (
                  <motion.div
                    key={`${day}-${timeSlot}`}
                    initial={false}
                    whileHover={classItem ? { y: -5, scale: 1.02, zIndex: 10 } : {}}
                    className={`relative p-5 rounded-[28px] border-2 min-h-[130px] transition-all duration-300 ${
                      classItem
                        ? `${colorClasses} shadow-xl shadow-current/10 cursor-pointer`
                        : 'bg-slate-50/20 border-slate-50 border-dashed'
                    }`}
                  >
                    {classItem ? (
                      <div className="h-full flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2.5 py-1 rounded-xl bg-white/60 backdrop-blur-md text-[9px] font-black tracking-tight border border-white/50">
                            {classItem.course.code}
                          </span>
                          <div className="flex items-center gap-1 opacity-60">
                            <div className="h-1 w-1 rounded-full bg-current animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">{classItem.type}</span>
                          </div>
                        </div>
                        
                        <h4 className="text-[11px] font-black leading-snug line-clamp-2 mb-3">
                          {classItem.course.name}
                        </h4>
                        
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-current/10">
                          <div className="flex items-center gap-1.5 opacity-60">
                            <MapPin size={10} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">
                              LHC-{classItem.slot || 'RM'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center group">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;