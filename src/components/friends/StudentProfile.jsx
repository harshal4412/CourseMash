import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Check, 
  Lock, 
  Users, 
  ChevronLeft, 
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

const CommonCourses = lazy(() => import('./CommonCourses'));
const FriendCourses = lazy(() => import('./FriendCourses'));

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [isFriendRequested, setIsFriendRequested] = useState(false);

  useEffect(() => {
    const data = {
      id: studentId,
      name: "Sarah Chen",
      major: "Computer Science",
      year: "Junior",
      avatar: "Sarah",
      friendCount: 142,
      isFriend: true,
      canSeeSchedule: true, 
      department: "School of Engineering"
    };
    setStudent(data);
  }, [studentId]);

  if (!student) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
      >
        <div className="h-8 w-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
          <ChevronLeft size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">Back to search</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm mb-10 transition-colors">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative">
            <div className="h-40 w-40 rounded-[56px] overflow-hidden border-8 border-slate-50 dark:border-slate-800 shadow-inner">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} 
                alt={student.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-slate-900">
              <ShieldAlert size={20} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{student.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {student.major}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {student.year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center">
                <button 
                  onClick={() => setIsFriendRequested(!isFriendRequested)}
                  className={`h-12 px-8 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all flex items-center gap-2 ${
                    isFriendRequested 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                    : 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-105'
                  }`}
                >
                  {isFriendRequested ? <Check size={16}/> : <UserPlus size={16}/>}
                  {isFriendRequested ? 'REQUESTED' : 'ADD FRIEND'}
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-center md:justify-start gap-12">
              <div className="text-center group">
                <p className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{student.friendCount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Friends</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mutuals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">4</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shared</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="space-y-8">
          <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
            {['courses', 'common'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'courses' ? 'Curriculum' : 'Mutual Schedule'}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'courses' ? (
              <Suspense fallback={<div className="p-12 text-center animate-pulse">Loading modules...</div>}>
                <FriendCourses friendId={studentId} />
              </Suspense>
            ) : (
              <Suspense fallback={<div className="p-12 text-center animate-pulse">Calculating overlap...</div>}>
                {!student.canSeeSchedule ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-16 text-center shadow-sm">
                    <div className="h-20 w-20 bg-rose-50 dark:bg-rose-900/20 rounded-[32px] flex items-center justify-center text-rose-500 mx-auto mb-6">
                      <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Privacy Protected</h3>
                    <p className="max-w-xs mx-auto text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-tighter">
                      This student does not want to share his/her/their timetable with anyone.
                    </p>
                  </div>
                ) : (
                  <CommonCourses friendId={studentId} />
                )}
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;