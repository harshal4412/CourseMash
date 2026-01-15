import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import courseData from '../data/courses.json';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [manualCredits, setManualCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const uniqueCourses = courseData.filter((course, index, self) =>
      index === self.findIndex((c) => c.code === course.code)
    );
    setAllCourses(uniqueCourses);
  }, []);

  useEffect(() => {
    if (!user) {
      setMyCourses([]);
      setManualCredits(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, "user_schedules", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMyCourses(data.courses || []);
        setManualCredits(data.manualCredits || null);
      } else {
        setMyCourses([]);
        setManualCredits(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateManualCredits = async (val) => {
    if (!user) return;
    const docRef = doc(db, "user_schedules", user.uid);
    try {
      await setDoc(docRef, { manualCredits: Number(val) }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const addCourse = async (courseInput) => {
    if (!user) return { success: false, error: "Please login first" };
    let courseToSave;
    if (typeof courseInput === 'string') {
      const found = allCourses.find(c => c.code === courseInput);
      if (!found) return { success: false, error: "Course details not found" };
      courseToSave = found;
    } else {
      if (!courseInput.isCustom) {
        const found = allCourses.find(c => c.code === courseInput.code);
        courseToSave = found || courseInput;
      } else {
        courseToSave = courseInput;
      }
    }
    const isDuplicate = myCourses.some(c => c.code === courseToSave.code);
    if (isDuplicate) return { success: false, error: "Course already in schedule" };
    const updatedCourses = [...myCourses, courseToSave];
    const docRef = doc(db, "user_schedules", user.uid);
    try {
      await setDoc(docRef, { courses: updatedCourses }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to save" };
    }
  };

  const removeCourse = async (courseCode) => {
    const updatedCourses = myCourses.filter(c => c.code !== courseCode);
    const docRef = doc(db, "user_schedules", user.uid);
    try {
      await setDoc(docRef, { courses: updatedCourses }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  return (
    <CourseContext.Provider value={{ 
      allCourses, myCourses, manualCredits, updateManualCredits, addCourse, removeCourse, loading 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);