import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, MessageSquare, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FriendSearch = () => {
  const [query, setQuery] = useState('');
  const [requestedIds, setRequestedIds] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const mockUsers = [
    { id: 1, name: 'Sarah Chen', major: 'Computer Science', overlap: 3, avatar: 'Sarah' },
    { id: 2, name: 'Marcus Wright', major: 'Economics', overlap: 1, avatar: 'Marcus' },
    { id: 3, name: 'Elena Rodriguez', major: 'Digital Design', overlap: 4, avatar: 'Elena' },
    { id: 4, name: 'Jordan Smith', major: 'Computer Science', overlap: 2, avatar: 'Jordan' },
  ];

  const handleAddFriend = (e, id) => {
    e.stopPropagation();
    if (!requestedIds.includes(id)) {
      setRequestedIds([...requestedIds, id]);
    }
  };

  const filtered = mockUsers.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.major.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Social Network</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Find Classmates</h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search name or major..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 dark:text-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((friend) => (
            <motion.div
              layout
              key={friend.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => navigate(`/student/${friend.id}`)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[35px] p-8 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-blue-900/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.avatar}`} 
                    className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    alt={friend.name}
                  />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center text-white border-4 border-white dark:border-slate-900">
                    <Zap size={10} fill="currentColor" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">{friend.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{friend.major}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Schedule Match</span>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">{friend.overlap * 25}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${friend.overlap * 25}%` }}
                    className="h-full bg-blue-600"
                  />
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                  {friend.overlap} Shared courses this semester
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => handleAddFriend(e, friend.id)}
                  className={`flex-grow py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    requestedIds.includes(friend.id) 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50' 
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white shadow-lg shadow-slate-200 dark:shadow-none'
                  }`}
                >
                  {requestedIds.includes(friend.id) ? (
                    <>
                      <Check size={14} />
                      Requested
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Add Friend
                    </>
                  )}
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 transition-all"
                >
                  <MessageSquare size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FriendSearch;