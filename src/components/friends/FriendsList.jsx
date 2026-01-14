import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  UserPlus, 
  UserMinus, 
  BookOpen,
  X,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Info,
  ExternalLink
} from 'lucide-react';
import { useFriends } from '../../hooks/useFriends';
import { useCourses } from '../../hooks/useCourses';
import toast from 'react-hot-toast';

const FriendsList = () => {
  const navigate = useNavigate();
  const { friends, addFriend, removeFriend, searchUsers, getCommonCourses } = useFriends();
  const { allCourses } = useCourses();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = (friendId) => {
    const result = addFriend(friendId);
    if (result.success) {
      toast.success(result.message);
      setSearchQuery('');
      setSearchResults([]);
      setShowAddModal(false);
    } else {
      toast.error(result.error);
    }
  };

  const handleRemoveFriend = (friendId) => {
    const result = removeFriend(friendId);
    if (result.success) {
      toast.success(result.message);
      if (selectedFriend?.id === friendId) {
        setSelectedFriend(null);
      }
    }
  };

  const getFriendCourses = (friend) => {
    return allCourses.filter(course => 
      friend.courses && friend.courses.includes(course.code)
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Users size={18} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Network v2.0</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Study <span className="text-slate-400 dark:text-slate-600 font-light">Circle</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">
              {friends.length} active connections
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 dark:shadow-blue-900/20 group"
          >
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
            Find Classmates
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {friends.length > 0 ? (
              friends.map((friend) => {
                const commonCourses = getCommonCourses(friend.id);
                const friendCourses = getFriendCourses(friend);
                const isSelected = selectedFriend?.id === friend.id;
                
                return (
                  <motion.div
                    key={friend.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className={`group relative p-6 bg-white dark:bg-slate-900 rounded-[32px] border transition-all cursor-pointer ${
                      isSelected ? 'border-blue-500 dark:border-blue-400 shadow-xl shadow-blue-500/5' : 'border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-200 dark:hover:border-blue-900'
                    }`}
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5 flex-1">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-tr from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800 rounded-[22px] flex items-center justify-center text-slate-900 dark:text-white text-2xl font-black border border-slate-200 dark:border-slate-700">
                            {friend.name.charAt(0)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {friend.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700">
                              {friend.branch}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5">
                              <BookOpen size={12} className="text-slate-300 dark:text-slate-600" />
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{friendCourses.length} Courses</span>
                            </div>
                            {commonCourses.length > 0 && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Sparkles size={12} className="text-blue-500 dark:text-blue-400" />
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                                  {commonCourses.length} Common
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${friend.id}`);
                          }}
                          className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 transition-all"
                        >
                          <Info size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFriend(friend.id);
                          }}
                          className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                        >
                          <UserMinus size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-20 text-center">
                <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-slate-200 dark:text-slate-700" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Build your circle</h2>
                <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">
                  Connect with classmates to compare schedules.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Start Searching
                </button>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-12 h-fit">
            <AnimatePresence mode="wait">
              {selectedFriend ? (
                <motion.div
                  key={selectedFriend.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-900 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[40px] p-8 text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/10 flex items-center justify-center text-4xl font-black mb-6">
                        {selectedFriend.name.charAt(0)}
                      </div>
                      <h3 className="text-2xl font-black mb-1">{selectedFriend.name}</h3>
                      <p className="text-blue-400 dark:text-blue-300 text-[10px] font-black uppercase tracking-[0.2em]">{selectedFriend.branch}</p>
                      
                      <button
                        onClick={() => navigate(`/profile/${selectedFriend.id}`)}
                        className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg shadow-white/5"
                      >
                        <ExternalLink size={14} /> View Full Profile
                      </button>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xs font-bold">Active Student</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Academic Year</p>
                        <p className="text-xs font-bold">Year {selectedFriend.year}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest">Shared Trajectory</h4>
                    </div>

                    <div className="space-y-3">
                      {getCommonCourses(selectedFriend.id).length > 0 ? (
                        getCommonCourses(selectedFriend.id).map((courseCode) => {
                          const course = allCourses.find(c => c.code === courseCode);
                          return course && (
                            <div key={courseCode} className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">{course.code}</p>
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{course.name}</p>
                              </div>
                              <Sparkles size={14} className="text-blue-400 dark:text-blue-500" />
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center py-4 text-slate-400 dark:text-slate-600 text-xs font-medium italic">No mutual classes found</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-6 flex items-center justify-between">
                      Complete Enrollment
                      <span className="text-[10px] text-slate-400 dark:text-slate-600">{getFriendCourses(selectedFriend).length}</span>
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {getFriendCourses(selectedFriend).map((course) => {
                        const isCommon = getCommonCourses(selectedFriend.id).includes(course.code);
                        return (
                          <div key={course.code} className={`p-4 rounded-2xl border transition-all ${isCommon ? 'border-blue-100 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30'}`}>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{course.code}</p>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase tracking-tighter">{course.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] text-center">
                  <GraduationCap size={40} className="text-slate-200 dark:text-slate-700 mb-4" />
                  <p className="text-slate-400 dark:text-slate-600 text-xs font-black uppercase tracking-widest">Select a profile</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Expand Circle</h2>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Global Student Search</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <X size={20} className="text-slate-400 dark:text-slate-500" />
                </button>
              </div>

              <div className="p-8">
                <div className="relative mb-8">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 rounded-[24px] text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                    autoFocus
                  />
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => {
                      const isFriend = friends.some(f => f.id === user.id);
                      return (
                        <div key={user.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-sm">{user.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{user.email}</p>
                            </div>
                          </div>
                          
                          {isFriend ? (
                            <button
                              onClick={() => {
                                setShowAddModal(false);
                                navigate(`/profile/${user.id}`);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            >
                              <Info size={14} /> Profile
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddFriend(user.id)}
                              className="px-6 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : searchQuery.length >= 2 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-400 dark:text-slate-600 text-xs font-black uppercase tracking-[0.2em]">No results found</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-400 dark:text-slate-600 text-xs font-black uppercase tracking-[0.2em]">Enter 2+ characters to search</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsList;