import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Bell, 
  Lock, 
  Camera,
  ChevronRight,
  User
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: theme === 'dark' ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />,
      settings: [
        { 
          label: 'Dark Mode', 
          description: 'Reduce eye strain in low-light environments', 
          type: 'toggle',
          value: theme === 'dark',
          action: toggleTheme
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell size={18} className="text-blue-500" />,
      settings: [
        { label: 'Class Reminders', description: 'Get notified 10 minutes before lectures', type: 'toggle', value: true },
        { label: 'Friend Requests', description: 'When someone adds you to their circle', type: 'toggle', value: true }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Lock size={18} className="text-rose-500" />,
      settings: [
        { label: 'Public Profile', description: 'Allow others to find you in search', type: 'toggle', value: true },
        { label: 'Show Schedule', description: 'Let friends see your weekly timetable', type: 'toggle', value: false }
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Preferences</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Customize your CourseMash experience</p>
      </div>

      <div className="mb-12 flex flex-col items-center">
        <div className="relative group">
          <div className="h-24 w-24 rounded-[32px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-slate-300 dark:text-slate-600" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform"
          >
            <Camera size={18} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*"
          />
        </div>
        <div className="text-center mt-4">
          <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Profile Picture</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1">PNG, JPG or GIF up to 5MB</p>
        </div>
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                {section.icon}
              </div>
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">{section.title}</h2>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
              {section.settings.map((setting, index) => (
                <div 
                  key={setting.label}
                  className={`p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    index !== section.settings.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''
                  }`}
                >
                  <div className="max-w-[70%]">
                    <p className="font-black text-slate-900 dark:text-white text-sm mb-1">{setting.label}</p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed">{setting.description}</p>
                  </div>

                  {setting.type === 'toggle' ? (
                    <button 
                      onClick={setting.action}
                      className={`h-6 w-11 rounded-full transition-all relative ${
                        setting.value ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: setting.value ? 22 : 2 }}
                        className="absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  ) : (
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-10">
          <button className="w-full py-5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-900/50">
            DEACTIVATE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;