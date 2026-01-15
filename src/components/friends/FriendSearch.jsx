import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, MessageSquare, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFriends } from '../../hooks/useFriends';

const FriendSearch = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { searchUsers, addFriend, getCommonCourses, loading, friends } = useFriends();

  const results = searchUsers(query);
  const friendIds = friends.map(f => f.id);

  const handleAddFriend = async (e, id) => {
    e.stopPropagation();
    await addFriend(id);
  };

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
            placeholder="Search name, email, or major..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-slate-900 dark:text-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && query && (
          <div className="col-span-full flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {results.map((student) => {
            const common = getCommonCourses(student.id);
            const isFriend = friendIds.includes(student.id);

            return (
              <motion.div
                layout
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => navigate(`/student/${student.id}`)}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[35px] p-8 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-blue-900/10 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <img 
                      src={student.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                      className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 object-cover"
                      alt={student.name}
                    />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center text-white border-4 border-white dark:border-slate-900">
                      <Zap size={10} fill="currentColor" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                      {student.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest line-clamp-1">
                      {student.branch || student.major || 'Student'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Schedule Match</span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                      {common.length > 0 ? Math.min(common.length * 20, 100) : 0}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(common.length * 20, 100)}%` }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                    {common.length} Shared courses this semester
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleAddFriend(e, student.id)}
                    disabled={isFriend}
                    className={`flex-grow py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isFriend 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50' 
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white shadow-lg shadow-slate-200 dark:shadow-none'
                    }`}
                  >
                    {isFriend ? (
                      <>
                        <Check size={14} />
                        Friend
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Add Friend
                      </>
                    )}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/messages/${student.id}`);
                    }}
                    className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 transition-all"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!loading && query && results.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-slate-400 dark:text-slate-500 font-bold">No students found matching "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendSearch;