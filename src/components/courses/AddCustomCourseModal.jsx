import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Book, Hash, MapPin, CalendarOff, User } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';

const AddCustomCourseModal = ({ isOpen, onClose }) => {
  const { addCourse } = useCourses();
  const [isNoSlot, setIsNoSlot] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    instructor: '',
    credits: '',
    lectureSlots: '',
    labSlots: '',
    tutorialSlots: '',
    location: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const customCourse = {
      id: `custom-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      instructor: formData.instructor,
      credits: formData.credits,
      isCustom: true,
      hasNoSlot: isNoSlot,
      schedule: {
        lecture: [{ raw: isNoSlot ? "" : formData.lectureSlots }, { raw: formData.location }],
        lab: [{ raw: isNoSlot ? "" : formData.labSlots }, { raw: formData.location }],
        tutorial: [{ raw: isNoSlot ? "" : formData.tutorialSlots }, { raw: formData.location }]
      }
    };

    const result = await addCourse(customCourse);
    if (result.success) {
      onClose();
      setFormData({ code: '', name: '', instructor: '', credits: '', lectureSlots: '', labSlots: '', tutorialSlots: '', location: '' });
      setIsNoSlot(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Custom Course</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Projects, Humanities & Specials</p>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Code</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="PRJ 301" className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credits (L-T-P-C)</label>
                  <input required value={formData.credits} onChange={(e) => setFormData({...formData, credits: e.target.value})} placeholder="0-0-0-6" className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Name</label>
                <div className="relative">
                  <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Senior Design Project" className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instructor Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} placeholder="Dr. Smith" className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isNoSlot ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                      <CalendarOff size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">No Fixed Time Slot</p>
                      <p className="text-[10px] font-bold text-slate-400">For projects or self-paced courses</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsNoSlot(!isNoSlot)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isNoSlot ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isNoSlot ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {!isNoSlot && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lectures</label>
                      <input value={formData.lectureSlots} onChange={(e) => setFormData({...formData, lectureSlots: e.target.value})} placeholder="A1" className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Labs</label>
                      <input value={formData.labSlots} onChange={(e) => setFormData({...formData, labSlots: e.target.value})} placeholder="L1" className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tutorials</label>
                      <input value={formData.tutorialSlots} onChange={(e) => setFormData({...formData, tutorialSlots: e.target.value})} placeholder="T1" className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Lab 4" className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 font-bold text-sm text-slate-900 placeholder:text-slate-400" />
                    </div>
                  </div>
                </motion.div>
              )}

              <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                <Plus size={18} />
                Add to Schedule
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCustomCourseModal;