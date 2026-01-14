import React from 'react';
import { Download, Calendar as CalendarIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarExport = ({ myCourses, schedule }) => {
  const generateICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CourseMash//Academic Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    const dayMap = { 'M': 'MO', 'T': 'TU', 'W': 'WE', 'Th': 'TH', 'F': 'FR' };

    Object.keys(schedule).forEach(dayKey => {
      schedule[dayKey].forEach(item => {
        const [startStr] = item.time.split('-');
        const startTime = startStr.replace(':', '') + '00';
        const endTime = (parseInt(startTime.substring(0, 2)) + 1).toString() + startTime.substring(2);

        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`SUMMARY:${item.course.code} - ${item.course.name} (${item.type})`);
        icsContent.push(`DESCRIPTION:Instructor: ${item.course.instructors.join(', ')}`);
        icsContent.push(`LOCATION:LHC Room ${item.slot}`);
        icsContent.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[dayKey]};UNTIL=20260530T235959Z`);
        icsContent.push(`DTSTART;TZID=Asia/Kolkata:20260105T${startTime}`);
        icsContent.push(`DTEND;TZID=Asia/Kolkata:20260105T${endTime}`);
        icsContent.push('END:VEVENT');
      });
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'University_Schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generateICS}
      className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group"
    >
      <CalendarIcon size={18} className="text-blue-600 group-hover:rotate-12 transition-transform" />
      Sync to Device
    </motion.button>
  );
};

export default CalendarExport;