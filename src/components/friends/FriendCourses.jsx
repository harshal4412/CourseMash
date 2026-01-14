import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, GraduationCap, ArrowRight, Users } from 'lucide-react';
import { friendService } from '../../services/friendService';

const FriendCourses = ({ friendId }) => {
  const friend = friendService.getFriendById(friendId);
  const mutualFriends = friendService.getMutualFriends(friendId);
  
  if (!friend) return (
    <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Select a friend to view their curriculum</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{friend.name}'s Modules</h2>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{friend.department}</p>
        </div>
        <div className="h-10 w-10 bg-slate-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors">
          <GraduationCap size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 px-2">
          <Users size={18} className="text-blue-600" />
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Mutual Connections</h3>
        </div>
        
        <div className="flex items-center -space-x-3 overflow-hidden mb-4 px-2">
          {mutualFriends.slice(0, 5).map((mutual, i) => (
            <img
              key={mutual.id}
              className="inline-block h-10 w-10 rounded-full ring-4 ring-white dark:ring-slate-900 object-cover bg-slate-100"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mutual.name}`}
              alt={mutual.name}
            />
          ))}
          {mutualFriends.length > 5 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 text-[10px] font-black text-slate-500">
              +{mutualFriends.length - 5}
            </div>
          )}
        </div>
        <p className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
          {mutualFriends.length > 0 
            ? `You and ${friend.name.split(' ')[0]} share ${mutualFriends.length} mutual friends`
            : "No mutual connections yet"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {friend.courses.map((courseCode, index) => (
          <motion.div
            key={courseCode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-md dark:hover:shadow-blue-900/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-[10px] text-slate-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {courseCode.substring(0, 2)}
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{courseCode}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Active Enrollment</span>
                </div>
              </div>
            </div>
            
            <button className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white dark:group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-blue-600 dark:bg-blue-700 rounded-[24px] text-white shadow-xl shadow-blue-600/20 group cursor-pointer overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <Calendar size={24} className="opacity-50" />
            <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="font-black text-sm mb-1">Full Timetable</h4>
          <p className="text-[10px] font-bold text-blue-100 dark:text-blue-200 uppercase tracking-widest leading-relaxed">
            Click here to view {friend.name.split(' ')[0]}'s full weekly visualization and find gaps for coffee breaks.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
      </div>
    </div>
  );
};

export default FriendCourses;