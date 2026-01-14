import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, MapPin, BookOpen, Calendar, Edit3, 
  Check, X, Github, Linkedin, Instagram, Globe, Award, 
  ChevronLeft, Camera, Plus, Trash2, Users, Layers, Search,
  Hash, GraduationCap, Building2, Fingerprint, ChevronDown
} from 'lucide-react';
import { useFriends } from '../../hooks/useFriends';
import { useCourses } from '../../hooks/useCourses';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const DEGREES = ["B.Tech", "B.Tech + M.Tech Dual", "B.Tech + MSc Dual", "M.Tech"];
const BRANCHES = [
  "Artificial Intelligence Engineering",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Science Engineering",
  "Integrated Circuit Design and Technology",
  "Materials Engineering",
  "Mechanical Engineering"
];
const SPECIALIZATIONS = ["None", "Major", "Minor", "Honours"];

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { friends, searchUsers } = useFriends();
  const { allCourses } = useCourses();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    let foundUser = null;
    const profileId = id === 'me' ? currentUser?.id : parseInt(id);

    if (profileId === currentUser?.id) {
      foundUser = currentUser;
    } else {
      foundUser = searchUsers('').find(u => u.id === profileId) || 
                 friends.find(f => f.id === profileId);
    }

    if (foundUser) {
      const data = {
        name: foundUser.name || "",
        rollNumber: foundUser.rollNumber || "23BCE000",
        degree: foundUser.degree || "B.Tech",
        branch: foundUser.branch || "Computer Science Engineering",
        specialization: foundUser.specialization || "None",
        year: foundUser.year || "2",
        bio: foundUser.bio || "IIT Gandhinagar Student",
        location: foundUser.location || "Palaj, Gandhinagar",
        socials: {
          github: foundUser.socials?.github || '',
          linkedin: foundUser.socials?.linkedin || '',
          instagram: foundUser.socials?.instagram || ''
        },
        achievements: foundUser.achievements || [],
        joinedDate: foundUser.joinedDate || "August 2023",
        courses: foundUser.courses || []
      };
      setProfileData(data);
      setEditedData(data);
    }
  }, [id, friends, searchUsers, currentUser]);

  const isOwnProfile = id === 'me' || parseInt(id) === currentUser?.id;

  const userCourseList = (allCourses || []).filter(c => 
    (isEditing ? editedData?.courses : profileData?.courses)?.includes(c.code)
  );

  const toggleCourse = (code) => {
    const currentOnes = [...(editedData.courses || [])];
    if (currentOnes.includes(code)) {
      setEditedData({ ...editedData, courses: currentOnes.filter(c => c !== code) });
    } else {
      setEditedData({ ...editedData, courses: [...new Set([...currentOnes, code])] });
    }
    setCourseSearch("");
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    toast.success("Academic profile updated!");
  };

  if (!profileData) return null;

  const AcademicDropdown = ({ label, icon: Icon, field, options }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
        <Icon size={12} /> {label}
      </label>
      {isEditing ? (
        <div className="relative">
          <select 
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 py-2.5 font-bold text-sm outline-none transition-all appearance-none cursor-pointer"
            value={editedData[field] || ""}
            onChange={(e) => setEditedData({ ...editedData, [field]: e.target.value })}
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      ) : (
        <p className="font-bold text-slate-700 dark:text-slate-200 truncate">
          {profileData[field] === "None" ? "N/A" : profileData[field]}
        </p>
      )}
    </div>
  );

  const EditableField = ({ label, icon: Icon, field, type = "text" }) => {
    const getValue = () => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return (isEditing ? editedData[parent]?.[child] : profileData[parent]?.[child]) || "";
      }
      return (isEditing ? editedData[field] : profileData[field]) || "";
    };

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Icon size={12} /> {label}
        </label>
        {isEditing ? (
          <input 
            type={type}
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 py-2.5 font-bold text-sm outline-none transition-all"
            value={getValue()}
            onChange={(e) => {
              if (field.includes('.')) {
                const [parent, child] = field.split('.');
                setEditedData({
                  ...editedData, 
                  [parent]: { ...editedData[parent], [child]: e.target.value }
                });
              } else {
                setEditedData({ ...editedData, [field]: e.target.value });
              }
            }}
          />
        ) : (
          <p className="font-bold text-slate-700 dark:text-slate-200 truncate">
            {getValue() || 'Not Set'}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-20 transition-colors">
      <div className="relative h-80 bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-transparent to-emerald-600/20" />
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all z-10 border border-white/10">
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-40 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-slate-50 dark:border-slate-800/50 pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full">
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[56px] flex items-center justify-center text-7xl font-black text-white shadow-2xl ring-8 ring-white dark:ring-slate-900">
                  {profileData.name?.charAt(0)}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-4 bg-blue-600 rounded-3xl shadow-lg text-white hover:scale-110 transition-transform">
                    <Camera size={22} />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-6 pt-4">
                <div className="space-y-2 text-center md:text-left">
                  {isEditing ? (
                    <input 
                      className="text-4xl font-black bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-2 w-full outline-blue-500 border-none"
                      value={editedData.name || ""}
                      onChange={e => setEditedData({...editedData, name: e.target.value})}
                    />
                  ) : (
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{profileData.name}</h1>
                  )}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {profileData.degree} in {profileData.branch}
                      {profileData.specialization !== "None" && ` (${profileData.specialization})`}
                    </div>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Year {profileData.year}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-sm justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    {isEditing ? (
                      <input className="bg-slate-50 dark:bg-slate-800 rounded-lg px-2 py-1 outline-none" value={editedData.location || ""} onChange={e => setEditedData({...editedData, location: e.target.value})} />
                    ) : profileData.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Fingerprint size={16} className="text-purple-500" />
                    Roll: {isEditing ? (
                      <input className="bg-slate-50 dark:bg-slate-800 rounded-lg px-2 py-1 outline-none w-24" value={editedData.rollNumber || ""} onChange={e => setEditedData({...editedData, rollNumber: e.target.value})} />
                    ) : profileData.rollNumber}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 shrink-0 self-center md:self-start pt-4">
              {isOwnProfile ? (
                isEditing ? (
                  <>
                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                      <Check size={18} /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                    <Edit3 size={18} /> Edit Profile
                  </button>
                )
              ) : (
                <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
                  <Plus size={18} /> Connect
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
            <div className="lg:col-span-8 space-y-12">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[40px] border border-slate-100 dark:border-slate-800">
                <AcademicDropdown label="Degree" icon={GraduationCap} field="degree" options={DEGREES} />
                <AcademicDropdown label="Branch" icon={Building2} field="branch" options={BRANCHES} />
                <AcademicDropdown label="Focus (Optional)" icon={Award} field="specialization" options={SPECIALIZATIONS} />
                <EditableField label="Academic Year" icon={Calendar} field="year" />
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">About Student</h3>
                {isEditing ? (
                  <textarea 
                    className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-800 rounded-[32px] border-2 border-transparent focus:border-blue-500 outline-none font-bold text-slate-600 dark:text-slate-300 transition-all"
                    value={editedData.bio || ""}
                    onChange={e => setEditedData({...editedData, bio: e.target.value})}
                  />
                ) : (
                  <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{profileData.bio}</p>
                )}
              </section>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <BookOpen className="text-slate-400" size={20} />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Courses & Curriculum</h3>
                </div>
                
                {isEditing && (
                  <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 font-bold text-sm border-none"
                      placeholder="Search and add courses..."
                      value={courseSearch || ""}
                      onChange={(e) => setCourseSearch(e.target.value)}
                    />
                    {courseSearch && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-2 shadow-2xl">
                        {(allCourses || [])
                          .filter(c => c.name.toLowerCase().includes(courseSearch.toLowerCase()) || c.code.toLowerCase().includes(courseSearch.toLowerCase()))
                          .map(c => (
                            <button 
                              key={`search-${c.code}`}
                              onClick={() => toggleCourse(c.code)}
                              className={`w-full text-left p-3 rounded-xl flex justify-between items-center transition-colors ${editedData.courses?.includes(c.code) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                              <span className="text-xs font-bold">{c.code} - {c.name}</span>
                              {editedData.courses?.includes(c.code) ? <Check size={14} /> : <Plus size={14} />}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userCourseList.map((course, idx) => (
                    <div key={`${course.code}-${idx}`} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] hover:border-blue-500 transition-all group relative">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.code}</span>
                      <p className="font-black text-slate-900 dark:text-white text-sm uppercase mt-1">{course.name}</p>
                      {isEditing && (
                        <button onClick={() => toggleCourse(course.code)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border border-slate-100 dark:border-slate-800">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Digital Presence</h3>
                <div className="space-y-6">
                  <EditableField label="GitHub" icon={Github} field="socials.github" />
                  <EditableField label="LinkedIn" icon={Linkedin} field="socials.linkedin" />
                  <EditableField label="Instagram" icon={Instagram} field="socials.instagram" />
                </div>
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Achievements</h3>
                  {isEditing && (
                    <button onClick={() => setEditedData({...editedData, achievements: [...(editedData.achievements || []), "New Recognition"]})} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Plus size={16} /></button>
                  )}
                </div>
                <div className="space-y-4">
                  {(isEditing ? (editedData.achievements || []) : (profileData.achievements || [])).map((ach, i) => (
                    <div key={`ach-${i}`} className="flex items-start gap-3">
                      <Award size={16} className="text-amber-500 mt-0.5 shrink-0" />
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input className="bg-slate-50 dark:bg-slate-800 text-xs font-bold p-2 rounded-xl w-full outline-none" value={ach || ""} onChange={(e) => {
                            const newAch = [...editedData.achievements];
                            newAch[i] = e.target.value;
                            setEditedData({...editedData, achievements: newAch});
                          }} />
                          <button onClick={() => setEditedData({...editedData, achievements: editedData.achievements.filter((_, idx) => idx !== i)})} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-slate-500 uppercase leading-tight">{ach}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;