import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Book, 
  Camera, 
  Save, 
  ShieldCheck, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EditProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    major: 'Computer Science',
    year: 'Junior',
    bio: 'Building things with React and dreaming of clean code.'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Profile Settings</h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Manage your academic identity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[40px] p-8 text-center shadow-sm">
            <div className="relative inline-block mb-6">
              <div className="h-32 w-32 rounded-[40px] bg-slate-50 border-4 border-white shadow-xl overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-4 border-white hover:bg-blue-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-black text-slate-900">{formData.name}</h2>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1">{formData.major}</p>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-400" />
              Privacy Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold">Public Schedule</span>
                <div className="h-5 w-10 bg-blue-600 rounded-full flex items-center px-1">
                  <div className="h-3 w-3 bg-white rounded-full ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-2xl border-none text-slate-400 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Major</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold appearance-none"
                    >
                      <option>Computer Science</option>
                      <option>Digital Design</option>
                      <option>Economics</option>
                      <option>Psychology</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Academic Year</label>
                  <div className="relative">
                    <Book className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold appearance-none"
                    >
                      <option>Freshman</option>
                      <option>Sophomore</option>
                      <option>Junior</option>
                      <option>Senior</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Student Bio</label>
                <textarea 
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600"
                />
              </div>

              <button 
                type="button"
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
              >
                <Save size={18} />
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;