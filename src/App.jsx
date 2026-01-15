import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const CourseSearch = lazy(() => import('./components/courses/CourseSearch'));
const MyCourses = lazy(() => import('./components/courses/MyCourses'));
const TimeTable = lazy(() => import("./components/schedule/TimeTable"));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const Settings = lazy(() => import('./components/profile/Settings'));

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageWrapper><Dashboard /></PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/schedule" element={
          <ProtectedRoute>
            <PageWrapper><TimeTable /></PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/explorer" element={
          <ProtectedRoute>
            <PageWrapper><CourseSearch /></PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/my-courses" element={
          <ProtectedRoute>
            <PageWrapper><MyCourses /></PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/profile/:id" element={
          <ProtectedRoute>
            <PageWrapper><ProfilePage /></PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <PageWrapper><Settings /></PageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        
        <Route path="*" element={
          <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center px-4">
            <h1 className="text-8xl font-black text-slate-200 dark:text-slate-800 uppercase tracking-tighter">404</h1>
            <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">Route Not Found</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
            >
              BACK TO DASHBOARD
            </button>
          </div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 text-slate-900 dark:text-slate-100 relative">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex flex-col min-h-screen">
        <Navbar onMenuClick={toggleSidebar} />
        
        <main className="flex-grow pb-12">
          <Suspense fallback={
            <div className="h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-10 w-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Assembling Session...</p>
              </div>
            </div>
          }>
            <AnimatedRoutes />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CourseProvider>
          <ThemeProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppContent />
            </Router>
          </ThemeProvider>
        </CourseProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;