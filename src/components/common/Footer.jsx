import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full shadow-inner" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic">CourseMash</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
              The ultimate academic companion for students. Visualize your semester, 
              sync with friends, and master your time with our intelligent scheduling engine.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Platform</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  My Schedule
                </Link>
              </li>
              <li>
                <Link to="/explorer" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  Course Explorer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/harshal4412" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://www.instagram.com/harshal.4412" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://harshalrana.framer.website/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © {currentYear} COURSEMASH. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peace ☮, by Harshal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;