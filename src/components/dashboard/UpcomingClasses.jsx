import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';

const UpcomingClasses = () => {
  const { myCourses } = useCourses();

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = days[now.getDay()];

  const daySlotMap = {
    'Monday': ['A1', 'C1', 'F1', 'I1', 'K1', 'H1'],
    'Tuesday': ['B1', 'D1', 'G1', 'J1', 'L1', 'N1'],
    'Wednesday': ['A2', 'E1', 'H2', 'I2', 'M1', 'P1'],
    'Thursday': ['C2', 'D2', 'F2', 'K2', 'L2', 'N2'],
    'Friday': ['B2', 'E2', 'G2', 'J2', 'M2', 'P2']
  };

  const slotTimes = {
    'A1': '08:30 AM - 09:50 AM', 'B1': '08:30 AM - 09:50 AM', 'A2': '08:30 AM - 09:50 AM', 'C2': '08:30 AM - 09:50 AM', 'B2': '08:30 AM - 09:50 AM',
    'C1': '10:00 AM - 11:20 AM', 'D1': '10:00 AM - 11:20 AM', 'E1': '10:00 AM - 11:20 AM', 'D2': '10:00 AM - 11:20 AM', 'E2': '10:00 AM - 11:20 AM',
    'F1': '11:30 AM - 12:50 PM', 'G1': '11:30 AM - 12:50 PM', 'H2': '11:30 AM - 12:50 PM', 'F2': '11:30 AM - 12:50 PM', 'G2': '11:30 AM - 12:50 PM',
    'I1': '02:00 PM - 03:20 PM', 'J1': '02:00 PM - 03:20 PM', 'I2': '02:00 PM - 03:20 PM', 'K2': '02:00 PM - 03:20 PM', 'J2': '02:00 PM - 03:20 PM',
    'K1': '03:30 PM - 04:50 PM', 'L1': '03:30 PM - 04:50 PM', 'M1': '03:30 PM - 04:50 PM', 'L2': '03:30 PM - 04:50 PM', 'M2': '03:30 PM - 04:50 PM',
    'H1': '05:00 PM - 06:20 PM', 'N1': '05:00 PM - 06:20 PM', 'P1': '05:00 PM - 06:20 PM', 'N2': '05:00 PM - 06:20 PM', 'P2': '05:00 PM - 06:20 PM'
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr || timeStr === 'Flexible') return 9999;
    try {
      const parts = timeStr.split(' - ')[0].split(' ');
      const [time, modifier] = parts;
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    } catch (e) { return 9999; }
  };

  const getTodayClasses = () => {
    const todaySlots = daySlotMap[currentDayName] || [];
    const todayClasses = [];

    myCourses.forEach(course => {
      ['lecture', 'lab', 'tutorial'].forEach(type => {
        const sched = course.schedule?.[type];
        if (!sched || !sched[0]?.raw) return;
        
        const slotsRaw = sched[0].raw;
        const location = sched[1]?.raw || "TBA";
        const courseSlots = slotsRaw.split(',').map(s => s.trim().toUpperCase());

        const instructorName = 
          sched[2]?.raw || 
          course.instructor || 
          course.details?.instructor || 
          "Staff";

        courseSlots.forEach(slot => {
          if (todaySlots.includes(slot)) {
            todayClasses.push({
              code: course.code,
              name: course.name,
              type: type.toUpperCase(),
              slot: slot,
              time: slotTimes[slot] || 'Flexible',
              location: location,
              instructor: instructorName
            });
          }
        });
      });
    });

    return todayClasses.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  };

  const classes = getTodayClasses();

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Today's Schedule</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
            <Calendar size={12} /> {currentDayName}
          </p>
        </div>
        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
          <Clock size={18} className="text-slate-400" />
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {classes.length > 0 ? (
          classes.map((item, index) => (
            <motion.div 
              key={`${item.code}-${item.slot}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-slate-50/50 hover:bg-white rounded-3xl border border-transparent hover:border-slate-100 transition-all shadow-sm group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    item.type === 'LECTURE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {item.type}
                  </span>
                  <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest">{item.slot}</span>
                </div>
                <span className="text-[11px] font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm whitespace-nowrap">{item.time}</span>
              </div>
              
              <div className="flex justify-between items-end gap-4 w-full">
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 truncate text-base leading-tight mb-0.5">{item.code}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase truncate leading-tight">{item.name}</p>
                </div>
                
                <div className="flex flex-col items-end shrink-0 text-right">
                  <div className="flex items-center gap-1.5 text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100 text-[10px] font-bold mb-1.5 shadow-sm group-hover:border-blue-100 transition-colors">
                    <MapPin size={12} />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight truncate max-w-[130px]">
                    {item.instructor}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No classes today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingClasses;